/**
 * seed.js — Seeds all RAG chatbot businesses into MongoDB
 * Run: node seed.js
 *
 * Businesses seeded (all share same WABA + phoneNumberId for single-WABA testing):
 *  1. Trio Fitness  (trigger: gym)
 *  2. Trio Cafe     (trigger: cafe)
 *  3. Trio Restaurant (trigger: restaurant)
 *  4. Trio Clinic   (trigger: clinic)
 *  5. Trio Salon    (trigger: salon)
 */
require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;
if (!URI) { console.error("❌ Set MONGODB_URI in .env"); process.exit(1); }

const WABA_ID       = "1360387522681431";
const PHONE_NUM_ID  = "1191697664027410";

const BusinessSchema = new mongoose.Schema({
  phoneNumberId: String, wabaId: String, triggerKeyword: String, adminPassword: String,
  businessName: String, businessType: String, tagline: String, areaInfo: String,
  knowledge: String, systemPrompt: String, greetingMessage: String,
  mediaAssets: Array, buttons: Object, active: Boolean,
}, { collection: "rag_businesses" });

const Business = mongoose.model("Business", BusinessSchema);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const img = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

// ─── Business Data ────────────────────────────────────────────────────────────

const BUSINESSES = [

  // ── 1. Trio Fitness (GYM) ─────────────────────────────────────────────────
  {
    phoneNumberId: PHONE_NUM_ID, wabaId: WABA_ID, triggerKeyword: "gym",
    adminPassword: "gym@123", businessName: "Trio Fitness", businessType: "gym",
    active: true,
    tagline:  "Train Hard. Live Strong. Be Trio. 💪",
    areaInfo: "📍 Shop 12, Fitness Plaza, Kandivali West • Near Kandivali Station",
    greetingMessage: "Welcome to *Trio Fitness* — where champions are made! 🏆\n\nWorld-class equipment • Certified trainers • Flexible plans\n\nWhat would you like to explore?",
    buttons: { pricing: "💰 Pricing Plans", info: "💪 Our Trainers", media: "🎥 Gym Tour" },
    knowledge: `ABOUT TRIO FITNESS
Trio Fitness is Kandivali's premium gym with 5,000 sq ft spread across 3 floors.
Established 2020, trained 2,000+ members.
Address: Shop 12, Fitness Plaza, Kandivali West, Mumbai 400067. 2 min walk from Kandivali Station (West Exit).
Contact: WhatsApp +91 98765 43210 | Email: hello@triofitness.in

MEMBERSHIP PLANS
Monthly Basic: ₹999/month — Gym access 6AM-10PM
Monthly Premium: ₹1499/month — Gym + all Group Classes
Annual Plan: ₹9999/year — Full access + 2 personal training sessions FREE
Student Discount: 20% off with valid student ID

PERSONAL TRAINING FEES
Per Session (60 min, 1-on-1): ₹800/session
Monthly Package 3 days/week (12 sessions): ₹7,500/month
Monthly Package 2 days/week (8 sessions): ₹5,500/month
Annual Package 3 days/week (144 sessions): ₹60,000/year (save ₹30,000)
FREE trial session for new members — no commitment!

TRAINERS
Priya Sharma — Yoga & Flexibility Specialist, 8 years experience, RYT-500 certified
Rahul Verma — Strength & Conditioning Coach, 10 years, NSCA certified
Anjali Desai — Pilates & Core Training, 6 years, PMA certified
Karan Singh — Head Trainer & Bodybuilding, 12 years, Mr. Maharashtra 2019

GROUP CLASSES
Yoga: Mon, Wed, Fri — 7:00 AM (Priya) — FREE with Premium/Annual
Zumba: Tue, Thu — 6:30 PM (Rahul) — FREE with Premium/Annual
Pilates: Sat — 9:00 AM (Anjali) — FREE with Premium/Annual
Drop-in for Basic members: ₹150/class

TIMINGS
Monday–Saturday: 6:00 AM – 10:00 PM | Sunday: 8:00 AM – 6:00 PM

POLICIES
Joining Fee: ₹500 (waived on Annual Plan)
Cancellation: 24-hour notice for PT sessions
Freeze: Up to 30 days/year | Guest Pass: ₹200/visit`,
    mediaAssets: [
      { key: "promo_video",    label: "Gym Promo Video",       type: "video", url: "https://res.cloudinary.com/dyuslttji/video/upload/v1786300834/zcysiakq6igxqcj2vvsx.mp4",  caption: "Welcome to Trio Fitness! 🏋️‍♂️" },
      { key: "gym_tour_video", label: "Gym Tour Video",         type: "video", url: "https://res.cloudinary.com/dyuslttji/video/upload/v1786300833/fs2fyuuzhpf8leiij4ez.mp4",  caption: "Full tour of our facility 🎥" },
      { key: "equipment_tour", label: "Equipment Tour Video",   type: "video", url: "https://res.cloudinary.com/dyuslttji/video/upload/v1786300833/mmpqvlo0lfdk0kcusq2e.mp4",  caption: "World-class equipment 🔥" },
      { key: "trainer_session",label: "Personal Training Photo",type: "image", url: "https://res.cloudinary.com/dyuslttji/image/upload/v1786300808/sxacmpb1vqicf7qlrfc8.jpg", caption: "1-on-1 personal training 💪" },
      { key: "team_photo",     label: "Trainer Team Photo",     type: "image", url: "https://res.cloudinary.com/dyuslttji/image/upload/v1786300807/ybahyucackbmmdxepygz.jpg", caption: "Meet the Trio Fitness trainers! 👥" },
      { key: "pt_poster_1",   label: "Personal Trainer Poster", type: "image", url: "https://res.cloudinary.com/dyuslttji/image/upload/v1786300808/p28l5x6pe4k6ltxfxmpk.jpg", caption: "Certified personal trainers 🏆" },
      { key: "gym_workout",    label: "Gym Workout Photo",       type: "image", url: "https://res.cloudinary.com/dyuslttji/image/upload/v1786300807/l2ujs7lusu2zoxicm0yk.jpg", caption: "Every rep counts 💯" },
    ],
  },

  // ── 2. Trio Cafe ──────────────────────────────────────────────────────────
  {
    phoneNumberId: PHONE_NUM_ID, wabaId: WABA_ID, triggerKeyword: "cafe",
    adminPassword: "cafe@123", businessName: "Trio Cafe", businessType: "cafe",
    active: true,
    tagline:  "Where Every Cup Tells a Story ☕",
    areaInfo: "📍 Ground Floor, The Hub Mall, Andheri West, Mumbai",
    greetingMessage: "Welcome to *Trio Cafe*! ☕\n\nYour cozy corner for great coffee, fresh food & good vibes.\n\nHow can we make your day better?",
    buttons: { pricing: "☕ Menu & Prices", info: "🏠 About Us", media: "📸 See Our Cafe" },
    knowledge: `ABOUT TRIO CAFE
Trio Cafe is a premium artisan cafe in Andheri West, Mumbai. Established 2021.
Capacity: 45 seats indoors + 12 outdoor seats. Free WiFi available.
Address: GF, The Hub Mall, Andheri West, Mumbai 400058. Near Andheri Metro Station.
Contact: WhatsApp +91 93456 78901 | Email: hello@triocafe.in
Instagram: @trio.cafe

MENU & PRICING — BEVERAGES
Espresso: ₹120 | Americano: ₹140 | Cappuccino: ₹160
Flat White: ₹170 | Latte: ₹180 | Cold Brew: ₹200
Mocha: ₹190 | Macchiato: ₹175 | Pour Over: ₹220
Matcha Latte: ₹210 | Turmeric Latte: ₹190 | Hot Chocolate: ₹200
Iced Coffees: +₹20 extra | Non-dairy milk (oat/almond): +₹30

MENU & PRICING — FOOD
Croissant: ₹120 | Banana Bread: ₹130 | Blueberry Muffin: ₹110
Avocado Toast: ₹280 | Eggs Benedict: ₹320 | Full English Breakfast: ₹380
Grilled Sandwich (Veg): ₹240 | Grilled Sandwich (Chicken): ₹290
Pasta Arrabbiata: ₹320 | Pesto Penne: ₹340 | Caesar Salad: ₹280
Brownie: ₹130 | Cheesecake slice: ₹180 | Tiramisu: ₹200

SPECIAL OFFERS
Happy Hours: 3PM–5PM — Buy 1 Get 1 on all coffees
Loyalty Card: 10th coffee FREE
Student Discount: 10% off Mon–Fri on valid ID

TIMINGS
Monday–Friday: 8:00 AM – 10:00 PM
Saturday–Sunday: 9:00 AM – 11:00 PM

SERVICES
Dine-in | Takeaway | Pre-order via WhatsApp
Private bookings for events (min 20 guests, advance booking required)
Corporate orders: bulk coffee packages available

POLICIES
Reservations: Accepted for groups of 6+. Walk-ins welcome.
Pet-friendly outdoor seating area
No outside food/beverages allowed`,
    mediaAssets: [
      { key: "cafe_interior",  label: "Cafe Interior",     type: "image", url: img("1501339847302-ac426a4a7cbb"), caption: "Welcome to Trio Cafe! ☕" },
      { key: "coffee_art",     label: "Coffee Latte Art",  type: "image", url: img("1495474472287-4d71bcdd2085"), caption: "Our signature latte art 🎨" },
      { key: "cafe_food",      label: "Cafe Food Spread",  type: "image", url: img("1565299624946-b28f40a0ae38"), caption: "Fresh food made daily 🥐" },
      { key: "cafe_ambience",  label: "Cafe Ambience",     type: "image", url: img("1509042239860-f550ce710b93"), caption: "Cozy vibes all day ✨" },
      { key: "avocado_toast",  label: "Avocado Toast",     type: "image", url: img("1541519281-b0c5c9d10e7a"), caption: "Our famous avocado toast 🥑" },
    ],
  },

  // ── 3. Trio Restaurant ────────────────────────────────────────────────────
  {
    phoneNumberId: PHONE_NUM_ID, wabaId: WABA_ID, triggerKeyword: "restaurant",
    adminPassword: "resto@123", businessName: "Trio Restaurant", businessType: "restaurant",
    active: true,
    tagline:  "Authentic Flavours, Modern Dining 🍽️",
    areaInfo: "📍 1st Floor, Sunshine Tower, Dadar West, Mumbai",
    greetingMessage: "Welcome to *Trio Restaurant*! 🍽️\n\nAuthentic Indian flavours with a modern twist.\n\nReservations, delivery & more — we're here to help!",
    buttons: { pricing: "🍛 Menu & Prices", info: "👨‍🍳 Our Chefs", media: "📸 Food Gallery" },
    knowledge: `ABOUT TRIO RESTAURANT
Premium Indian restaurant in Dadar West, Mumbai. 80-seat fine dining + private dining room (20 seats).
Cuisine: North Indian, Mughlai, Coastal & Fusion. Established 2019.
Address: 1st Floor, Sunshine Tower, Dadar West, Mumbai 400028.
Near Dadar Station (West Exit), 3 min walk.
Contact: WhatsApp +91 97890 12345 | Email: book@triorestaurant.in

MENU — STARTERS
Paneer Tikka: ₹320 | Seekh Kebab: ₹360 | Chicken 65: ₹340
Dahi Ke Sholay: ₹280 | Prawn Koliwada: ₹420 | Veg Platter: ₹480

MENU — MAIN COURSE (VEG)
Dal Makhani: ₹320 | Paneer Butter Masala: ₹360 | Kadai Paneer: ₹340
Palak Paneer: ₹320 | Shahi Paneer: ₹360 | Malai Kofta: ₹340
Mix Veg: ₹300 | Baingan Bharta: ₹280 | Aloo Gobhi: ₹260

MENU — MAIN COURSE (NON-VEG)
Butter Chicken: ₹420 | Chicken Biryani: ₹440 | Mutton Rogan Josh: ₹520
Chicken Kolhapuri: ₹440 | Fish Curry: ₹460 | Prawn Masala: ₹520
Lamb Biryani: ₹500 | Chicken Handi: ₹420

MENU — BREADS & RICE
Butter Naan: ₹60 | Garlic Naan: ₹80 | Tandoori Roti: ₹40 | Laccha Paratha: ₹80
Steamed Rice: ₹80 | Jeera Rice: ₹120 | Biryani Base: ₹140

MENU — DESSERTS
Gulab Jamun: ₹120 | Ras Malai: ₹150 | Kulfi: ₹130 | Gajar Halwa: ₹160

DRINKS
Lassi: ₹120 | Mocktails: ₹160–220 | Fresh Juices: ₹140 | Mineral Water: ₹40

TIMINGS
Lunch: 12:00 PM – 3:30 PM | Dinner: 7:00 PM – 11:00 PM
Closed Tuesday | Sunday lunch buffet: ₹699/person (12PM–3PM)

RESERVATIONS
Advance booking recommended for weekends. Call or WhatsApp to reserve.
Group bookings (10+): Special menu packages available

HOME DELIVERY
Via Swiggy & Zomato | Min order ₹300 | Delivery in 45-60 min
WhatsApp order accepted for 5km radius

POLICIES
Service charge: 10% | GST: 5% | No outside food/cake (cake cutting charge ₹200)
Parking available in building basement`,
    mediaAssets: [
      { key: "restaurant_interior", label: "Restaurant Interior", type: "image", url: img("1414235077428-338989a2e8c0"), caption: "Elegant dining at Trio Restaurant 🍽️" },
      { key: "butter_chicken",      label: "Butter Chicken",      type: "image", url: img("1603894584373-5ac82b2ae398"), caption: "Our signature butter chicken 😍" },
      { key: "biryani",             label: "Biryani",             type: "image", url: img("1574071987742-14673039f29e"), caption: "Fragrant biryani, made fresh daily 🍚" },
      { key: "food_spread",         label: "Food Spread",         type: "image", url: img("1540189549336-e6e99c3679fe"), caption: "Feast your eyes 🎉" },
      { key: "chef_team",           label: "Our Chef Team",       type: "image", url: img("1556909114-f6e7ad7d3136"), caption: "Our experienced culinary team 👨‍🍳" },
    ],
  },

  // ── 4. Trio Clinic ────────────────────────────────────────────────────────
  {
    phoneNumberId: PHONE_NUM_ID, wabaId: WABA_ID, triggerKeyword: "clinic",
    adminPassword: "clinic@123", businessName: "Trio Clinic", businessType: "clinic",
    active: true,
    tagline:  "Your Health, Our Priority 🏥",
    areaInfo: "📍 2nd Floor, Medicare Plaza, Borivali West, Mumbai",
    greetingMessage: "Welcome to *Trio Clinic*! 🏥\n\nExpert doctors • Modern diagnostics • Compassionate care.\n\nHow can we help you today?",
    buttons: { pricing: "💊 Services & Fees", info: "👨‍⚕️ Our Doctors", media: "🏥 Our Clinic" },
    knowledge: `ABOUT TRIO CLINIC
Trio Clinic is a multi-specialty outpatient clinic in Borivali West, Mumbai.
Established 2018. 8 consultation rooms. Accredited by NABH.
Address: 2nd Floor, Medicare Plaza, Borivali West, Mumbai 400092. Near Borivali Station (West Exit).
Contact: WhatsApp +91 99876 54321 | Email: appt@trioclinic.in
Emergency: +91 99876 54322

DOCTORS & SPECIALTIES
Dr. Anita Sharma, MD — General Physician & Internal Medicine (15 years experience)
Dr. Rajesh Patel, BDS, MDS — Dental & Oral Surgery (12 years experience)
Dr. Priya Menon, MBBS, MD — Dermatology & Cosmetology (10 years experience)
Dr. Suresh Kumar, MS — Orthopaedics & Joint Care (14 years experience)
Dr. Kavya Nair, MBBS, DGO — Gynaecology & Women's Health (11 years experience)
Dr. Arjun Singh, MBBS, MD — Paediatrics & Child Care (9 years experience)

CONSULTATION FEES
General Physician: ₹500/consultation
Dental Consultation: ₹400 (cleaning/scaling: ₹1,000–1,500)
Dermatology: ₹800/consultation
Orthopaedics: ₹700/consultation
Gynaecology: ₹700/consultation
Paediatrics: ₹500/consultation
Follow-up (within 15 days): ₹200 off all departments

DIAGNOSTIC SERVICES
Blood tests: CBC ₹300 | LFT ₹450 | KFT ₹400 | Thyroid ₹350 | HbA1c ₹300
X-Ray: ₹400–700 | ECG: ₹300 | Ultrasound: ₹800–1,500
Reports delivered within 24 hours. Home sample collection available (+₹200).

TIMINGS
Monday–Saturday: 9:00 AM – 8:00 PM
Sunday: 10:00 AM – 2:00 PM (Emergency only)
Closed on public holidays (emergency services available)

APPOINTMENT BOOKING
WhatsApp booking accepted. Walk-in available subject to availability.
Online video consultation: Available for follow-ups (₹300 extra)
Average waiting time: 15–20 minutes with appointment.

FACILITIES
Pharmacy on premises | Wheelchair accessible | Separate children's waiting area
Cashless insurance accepted: Star Health, Niva Bupa, HDFC Ergo, United India

POLICIES
Cancellation: 2 hours notice required. No-show charged ₹200.
Reports & prescriptions: Available on WhatsApp after consultation.
Second opinion available.`,
    mediaAssets: [
      { key: "clinic_reception",  label: "Clinic Reception",   type: "image", url: img("1519494026892-80bbd2d6fd0d"), caption: "Modern, hygienic environment 🏥" },
      { key: "doctor_consult",    label: "Doctor Consultation", type: "image", url: img("1559839734-2b71ea197ec2"), caption: "Compassionate care you can trust 👨‍⚕️" },
      { key: "medical_team",      label: "Medical Team",        type: "image", url: img("1582750433449-648ed127bb54"), caption: "Our experienced medical team 🩺" },
      { key: "clinic_equipment",  label: "Medical Equipment",   type: "image", url: img("1576091160550-2173dba999ef"), caption: "State-of-the-art diagnostics 🔬" },
    ],
  },

  // ── 5. Trio Salon ─────────────────────────────────────────────────────────
  {
    phoneNumberId: PHONE_NUM_ID, wabaId: WABA_ID, triggerKeyword: "salon",
    adminPassword: "salon@123", businessName: "Trio Salon", businessType: "salon",
    active: true,
    tagline:  "Look Good. Feel Great. Be You. ✨",
    areaInfo: "📍 Shop 5, Solitaire Building, Malad West, Mumbai",
    greetingMessage: "Welcome to *Trio Salon*! ✨\n\nPremium hair, skin & beauty services by expert stylists.\n\nBook your transformation today!",
    buttons: { pricing: "✂️ Services & Prices", info: "💇 Our Stylists", media: "📸 Our Work" },
    knowledge: `ABOUT TRIO SALON
Trio Salon is a premium unisex salon in Malad West, Mumbai. Established 2020.
10 styling stations | 4 treatment rooms | Luxury experience.
Address: Shop 5, Solitaire Building, Malad West, Mumbai 400064. Near Malad Station (West Exit).
Contact: WhatsApp +91 91234 56789 | Email: book@triosalonmumbai.in
Instagram: @trio.salon.mumbai

STYLISTS
Neha Kapoor — Senior Hair Stylist, 12 years. Specialist: Balayage, Korean Blowout, Keratin
Aman Shaikh — Barber & Grooming Expert, 8 years. Specialist: Fades, Beard design
Divya Rao — Skin & Beauty Expert, 10 years. Specialist: Facials, Threading, Makeup
Rohit Mehta — Color Specialist, 9 years. Specialist: Highlights, Ombre, Global Color

HAIR SERVICES — WOMEN
Wash & Blowdry: ₹500 | Basic Haircut: ₹600 | Expert Cut (Neha): ₹1,000
Straightening (Keratin): ₹3,500–6,000 | Rebonding: ₹4,000–7,000
Balayage: ₹4,500–8,000 | Highlights (Full): ₹3,000–5,000 | Global Color: ₹2,500–4,500
Deep Conditioning: ₹800 | Hair Spa: ₹1,200 | Scalp Treatment: ₹1,500

HAIR SERVICES — MEN
Basic Haircut: ₹300 | Style Cut: ₹500 | Expert Cut (Aman): ₹700
Beard Trim: ₹200 | Beard Design: ₹350 | Clean Shave: ₹250
Hair Color (Men): ₹800–2,000 | Hair Spa: ₹800

SKIN & BEAUTY SERVICES
Basic Facial: ₹800 | Gold Facial: ₹1,500 | Diamond Facial: ₹2,000
Cleanup: ₹500 | Bleach: ₹600 | Waxing (Full Legs): ₹500 | Waxing (Full Body): ₹2,500
Threading (Eyebrows): ₹80 | Threading (Upper Lip): ₹50
Manicure: ₹500 | Pedicure: ₹700 | Gel Nails: ₹1,200 | Nail Art: ₹100–500/nail

MAKEUP SERVICES
Bridal Makeup: ₹8,000–15,000 | Party Makeup: ₹2,500 | Natural Makeup: ₹1,500
Saree draping: ₹500 (with makeup booking)

PACKAGES
Bridal Package: Hair + Makeup + Facial + Waxing = ₹18,000 (save ₹5,000)
Glow Package (Women): Facial + Manicure + Pedicure + Eyebrows = ₹2,200 (save ₹680)
Men's Grooming: Haircut + Beard + Facial = ₹1,300 (save ₹300)

TIMINGS
Monday–Saturday: 10:00 AM – 8:30 PM | Sunday: 11:00 AM – 7:00 PM

BOOKING POLICY
Advance booking recommended, especially weekends.
Bridal bookings: 1 month advance required. 50% advance to confirm.
Cancellation: 24-hour notice required. No-show charged ₹200.`,
    mediaAssets: [
      { key: "salon_interior", label: "Salon Interior",       type: "image", url: img("1562322140-8baeececf3df"), caption: "Welcome to Trio Salon! ✨" },
      { key: "hair_styling",   label: "Hair Styling",         type: "image", url: img("1527799820374-dcf8d9d4a388"), caption: "Expert hair styling 💇‍♀️" },
      { key: "hair_color",     label: "Hair Coloring Work",   type: "image", url: img("1522337360788-8b13dee7a37e"), caption: "Beautiful colour transformations 🎨" },
      { key: "manicure",       label: "Nail Art & Manicure",  type: "image", url: img("1604654894610-df63bc536371"), caption: "Perfect nails every time 💅" },
      { key: "salon_team",     label: "Our Stylist Team",     type: "image", url: img("1521590832167-7bcbfaa6381f"), caption: "Expert stylists at your service 👩‍🎨" },
    ],
  },

];

// ─── Seed Function ────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(URI);
  console.log("✅ Connected to MongoDB\n");

  for (const biz of BUSINESSES) {
    const existing = await Business.findOne({
      phoneNumberId: biz.phoneNumberId,
      triggerKeyword: biz.triggerKeyword,
    });

    if (existing) {
      // Update — preserve _id so sessions aren't broken
      await Business.updateOne({ _id: existing._id }, {
        ...biz,
        // Don't overwrite mediaAssets for gym (keep Cloudinary URLs)
        ...(biz.triggerKeyword === "gym" ? { mediaAssets: existing.mediaAssets } : {}),
      });
      console.log(`✅ Updated: ${biz.businessName} (trigger: ${biz.triggerKeyword})`);
    } else {
      await Business.create(biz);
      console.log(`✅ Created: ${biz.businessName} (trigger: ${biz.triggerKeyword})`);
    }
  }

  // Clear all sessions so everyone gets fresh welcome cards
  const SessionModel = mongoose.model("SeedSession",
    new mongoose.Schema({ phone: String, businessId: String, phoneNumberId: String, messages: Array, lastActivity: Date },
    { collection: "rag_sessions" })
  );
  const { deletedCount } = await SessionModel.deleteMany({
    phoneNumberId: PHONE_NUM_ID,
  });
  console.log(`\n✅ Cleared ${deletedCount} session(s)`);

  const total = await Business.countDocuments({ wabaId: WABA_ID });
  console.log(`\n🎉 Done! ${total} businesses active under WABA ${WABA_ID}`);
  console.log(`\nTrigger words to test:`);
  BUSINESSES.forEach(b => console.log(`  • Send "${b.triggerKeyword}" → ${b.businessName}`));

  await mongoose.disconnect();
}

seed().catch(err => { console.error("❌ Seed failed:", err.message); process.exit(1); });
