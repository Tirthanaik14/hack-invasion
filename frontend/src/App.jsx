import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Home from './pages/Home'
import Alerts from './pages/Alerts'
import IncidentDetail from './pages/IncidentDetail'
import Report from './pages/Report'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/incidents/:id" element={<IncidentDetail />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App