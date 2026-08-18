require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express    = require("express");
const cors       = require("cors");
const mongoose   = require("mongoose");
const path       = require("path");
const multer     = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 100 * 1024 * 1024 } });

const app  = express();
const PORT = process.env.PORT || 3500;

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "admin", "dist")));

// ─── MongoDB Schemas (mirrors rag-chatbot.js) ─────────────────────────────────

const BusinessSchema = new mongoose.Schema({
  phoneNumberId:  String,
  wabaId:         String,
  triggerKeyword: String,
  adminPassword:  String,
  businessName:   String,
  businessType:   String,
  tagline:        String,
  areaInfo:       String,
  knowledge:      { type: String, default: "" },
  systemPrompt:   String,
  greetingMessage: String,
  mediaAssets: [{
    key: String, label: String,
    type: { type: String, enum: ["image", "video"] },
    url: String, caption: String,
  }],
  buttons: { pricing: String, info: String, media: String },
  active: { type: Boolean, default: true },
}, { collection: "rag_businesses" });

const MemberSchema = new mongoose.Schema({
  phone:           String,
  businessId:      String,
  name:            String,
  email:           String,
  plan:            String,
  startDate:       Date,
  expiryDate:      Date,
  paymentStatus:   { type: String, enum: ["paid", "due", "overdue"], default: "paid" },
  nextPaymentDate: Date,
  notes:           String,
  createdAt:       { type: Date, default: Date.now },
}, { collection: "rag_members" });

const ScheduleSchema = new mongoose.Schema({
  businessId:  String,
  title:       String,
  type:        String,
  date:        Date,
  time:        String,
  instructor:  String,
  capacity:    { type: Number, default: 20 },
  bookedCount: { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
}, { collection: "rag_schedules" });

const SessionSchema = new mongoose.Schema({
  phone:         String,
  businessId:    String,
  phoneNumberId: String,
  messages:      Array,
  lastActivity:  Date,
  botPaused:     { type: Boolean, default: false },
  pausedAt:      Date,
}, { collection: "rag_sessions" });

const Business = mongoose.model("AdminBusiness", BusinessSchema);
const Member   = mongoose.model("AdminMember",   MemberSchema);
const Schedule = mongoose.model("AdminSchedule", ScheduleSchema);
const Session  = mongoose.model("AdminSession",  SessionSchema);

// ─── Async wrapper — Express 4 doesn't auto-catch async errors ────────────────
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// ─── Auth ─────────────────────────────────────────────────────────────────────

const GLOBAL_PASS = process.env.ADMIN_PASSWORD || "admin123";

// POST /api/login — { wabaId, password } → returns businesses under wabaId
app.post("/api/login", wrap(async (req, res) => {
  const { wabaId, password } = req.body || {};
  if (!wabaId || !password) return res.status(400).json({ error: "wabaId and password required" });

  // Accept global admin password or any business-level password under this WABA
  const isGlobalPass = password === GLOBAL_PASS;
  const bizWithPass  = isGlobalPass ? null : await Business.findOne({ wabaId, adminPassword: password }).lean();

  if (!isGlobalPass && !bizWithPass) {
    return res.status(401).json({ error: "Invalid WABA ID or password" });
  }

  const businesses = await Business.find({ wabaId }).select("-knowledge -systemPrompt -messages").lean();
  if (businesses.length === 0) {
    return res.status(404).json({ error: "No businesses found for this WABA ID" });
  }

  // Return businesses + token (password acts as bearer token for subsequent requests)
  res.json({ ok: true, wabaId, token: password, businesses });
}));

// Middleware — validate x-admin-token or x-admin-password header
function auth(req, res, next) {
  const token = req.headers["x-admin-token"] || req.headers["x-admin-password"] || req.query.password;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  // Accept global password
  if (token === GLOBAL_PASS) return next();

  // Accept any per-business password — do async check
  Business.findOne({ adminPassword: token }).lean()
    .then(found => found ? next() : res.status(401).json({ error: "Unauthorized" }))
    .catch(() => res.status(401).json({ error: "Unauthorized" }));
}

// ─── Business Routes ──────────────────────────────────────────────────────────

// List businesses — filter by wabaId
app.get("/api/businesses", auth, wrap(async (req, res) => {
  const q = req.query.wabaId ? { wabaId: req.query.wabaId } : {};
  const docs = await Business.find(q).lean();
  res.json(docs);
}));

app.get("/api/business/:id", auth, wrap(async (req, res) => {
  const doc = await Business.findById(req.params.id).lean();
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
}));

app.put("/api/business/:id", auth, wrap(async (req, res) => {
  const { _id, __v, ...data } = req.body;
  const doc = await Business.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json(doc);
}));

app.post("/api/business", auth, wrap(async (req, res) => {
  const doc = await Business.create(req.body);
  res.json(doc);
}));

// Media asset CRUD within a business
app.post("/api/business/:id/media", auth, wrap(async (req, res) => {
  const doc = await Business.findByIdAndUpdate(
    req.params.id,
    { $push: { mediaAssets: req.body } },
    { new: true }
  );
  res.json(doc);
}));

app.delete("/api/business/:id/media/:key", auth, wrap(async (req, res) => {
  const doc = await Business.findByIdAndUpdate(
    req.params.id,
    { $pull: { mediaAssets: { key: req.params.key } } },
    { new: true }
  );
  res.json(doc);
}));

// ─── Member Routes ────────────────────────────────────────────────────────────

app.get("/api/members", auth, wrap(async (req, res) => {
  const q = req.query.businessId ? { businessId: req.query.businessId } : {};
  const members = await Member.find(q).sort({ createdAt: -1 }).lean();
  res.json(members);
}));

app.post("/api/members", auth, wrap(async (req, res) => {
  const member = await Member.create(req.body);
  res.json(member);
}));

app.put("/api/members/:id", auth, wrap(async (req, res) => {
  const { _id, __v, ...data } = req.body;
  const member = await Member.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json(member);
}));

app.delete("/api/members/:id", auth, wrap(async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

// ─── Schedule Routes ──────────────────────────────────────────────────────────

app.get("/api/schedules", auth, wrap(async (req, res) => {
  const q = req.query.businessId ? { businessId: req.query.businessId } : {};
  const items = await Schedule.find(q).sort({ date: 1 }).lean();
  res.json(items);
}));

app.post("/api/schedules", auth, wrap(async (req, res) => {
  const item = await Schedule.create(req.body);
  res.json(item);
}));

app.put("/api/schedules/:id", auth, wrap(async (req, res) => {
  const { _id, __v, ...data } = req.body;
  const item = await Schedule.findByIdAndUpdate(req.params.id, data, { new: true });
  res.json(item);
}));

app.delete("/api/schedules/:id", auth, wrap(async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

// ─── Session Routes ───────────────────────────────────────────────────────────

app.get("/api/sessions", auth, wrap(async (req, res) => {
  const q = req.query.businessId ? { businessId: req.query.businessId } : {};
  const sessions = await Session.find(q).sort({ lastActivity: -1 }).lean();
  res.json(sessions);
}));

app.delete("/api/sessions/:id", auth, wrap(async (req, res) => {
  await Session.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
}));

// Pause bot for a contact — admin takes over manually
app.patch("/api/sessions/:id/pause", auth, wrap(async (req, res) => {
  const session = await Session.findByIdAndUpdate(
    req.params.id,
    { botPaused: true, pausedAt: new Date() },
    { new: true }
  ).lean();
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json(session);
}));

// Resume bot for a contact
app.patch("/api/sessions/:id/resume", auth, wrap(async (req, res) => {
  const session = await Session.findByIdAndUpdate(
    req.params.id,
    { botPaused: false, pausedAt: null },
    { new: true }
  ).lean();
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json(session);
}));

app.delete("/api/sessions", auth, wrap(async (req, res) => {
  const q = req.query.businessId ? { businessId: req.query.businessId } : {};
  const { deletedCount } = await Session.deleteMany(q);
  res.json({ deleted: deletedCount });
}));

// ─── Stats Route ──────────────────────────────────────────────────────────────

app.get("/api/stats", auth, wrap(async (req, res) => {
  const bq = req.query.businessId ? { businessId: req.query.businessId } : {};
  const [totalMembers, activeMembers, dueMembers, activeSessions, upcomingClasses] = await Promise.all([
    Member.countDocuments(bq),
    Member.countDocuments({ ...bq, paymentStatus: "paid" }),
    Member.countDocuments({ ...bq, paymentStatus: { $in: ["due", "overdue"] } }),
    Session.countDocuments(bq),
    Schedule.countDocuments({ ...bq, isActive: true, date: { $gte: new Date() } }),
  ]);
  res.json({ totalMembers, activeMembers, dueMembers, activeSessions, upcomingClasses });
}));

// Activate one business, deactivate all others under same WABA (exclusive)
app.post("/api/business/:id/activate", auth, wrap(async (req, res) => {
  const biz = await Business.findById(req.params.id).lean();
  if (!biz) return res.status(404).json({ error: "Not found" });

  await Business.updateMany({ wabaId: biz.wabaId }, { active: false });
  await Business.findByIdAndUpdate(req.params.id, { active: true });

  const businesses = await Business.find({ wabaId: biz.wabaId }).lean();
  res.json({ activated: req.params.id, businesses });
}));

// Deactivate a single business (no effect on others)
app.post("/api/business/:id/deactivate", auth, wrap(async (req, res) => {
  const biz = await Business.findByIdAndUpdate(req.params.id, { active: false }, { new: true }).lean();
  if (!biz) return res.status(404).json({ error: "Not found" });

  const businesses = await Business.find({ wabaId: biz.wabaId }).lean();
  res.json({ deactivated: req.params.id, businesses });
}));

// ─── Cloudinary Upload ────────────────────────────────────────────────────────
// POST /api/upload — multipart/form-data, field name: "file"
app.post("/api/upload", auth, upload.single("file"), wrap(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file provided" });

  const isVideo    = req.file.mimetype.startsWith("video/");
  const resourceType = isVideo ? "video" : "image";

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "trio-admin" },
      (err, data) => err ? reject(err) : resolve(data)
    );
    stream.end(req.file.buffer);
  });

  res.json({ url: result.secure_url, public_id: result.public_id, type: resourceType });
}));

// ─── SPA catch-all — must come after all API routes ──────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "admin", "dist", "index.html"));
});

// ─── Global Error Handler (catches errors forwarded by wrap()) ────────────────
app.use((err, req, res, _next) => {
  console.error("[server] Error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// ─── Start ────────────────────────────────────────────────────────────────────

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🏢 Multi-Business Admin running at http://localhost:${PORT}`));
}).catch(err => console.error("❌ MongoDB error:", err.message));
