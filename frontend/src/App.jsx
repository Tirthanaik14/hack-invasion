import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Alerts from './pages/Alerts'
import IncidentDetail from './pages/IncidentDetail'
import Report from './pages/Report'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [token, setToken] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/incidents/:id" element={<IncidentDetail />} />
        <Route path="/report" element={<Report />} />
        <Route path="/admin/login" element={<AdminLogin onLoginSuccess={(t) => setToken(t)} />} />
        <Route path="/admin" element={
          token
            ? <AdminDashboard token={token} onLogout={() => setToken(null)} />
            : <AdminLogin onLoginSuccess={(t) => setToken(t)} />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App