import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './context'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Knowledge from './pages/Knowledge'
import Media from './pages/Media'
import Members from './pages/Members'
import Schedules from './pages/Schedules'
import Sessions from './pages/Sessions'
import Chatbots from './pages/Chatbots'
import FlownwareChatbot from './pages/FlownwareChatbot'
import RealEstateChatbot from './pages/RealEstateChatbot'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <Layout>{children}</Layout>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/knowledge" element={<ProtectedRoute><Knowledge /></ProtectedRoute>} />
      <Route path="/media" element={<ProtectedRoute><Media /></ProtectedRoute>} />
      <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
      <Route path="/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />
      <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
      <Route path="/chatbots" element={<ProtectedRoute><Chatbots /></ProtectedRoute>} />
      <Route path="/flownware-chatbot" element={<ProtectedRoute><FlownwareChatbot /></ProtectedRoute>} />
      <Route path="/realestate-chatbot" element={<ProtectedRoute><RealEstateChatbot /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
