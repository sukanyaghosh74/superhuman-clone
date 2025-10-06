import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Inbox from './pages/Inbox'
import Thread from './pages/Thread'
import Compose from './pages/Compose'

async function startLogin() {
  const res = await fetch('/auth/login')
  const data = await res.json()
  if (data.auth_url) window.location.href = data.auth_url
}

export default function App() {
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ width: 260, borderRight: '1px solid #222', padding: 16 }}>
        <h3>Superhuman</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link to="/">Inbox</Link>
          <Link to="/sent">Sent</Link>
          <Link to="/drafts">Drafts</Link>
          <button onClick={() => navigate('/compose')}>Compose (c)</button>
          <button onClick={startLogin}>Login with Google</button>
        </div>
      </nav>
      <div style={{ flex: 1, padding: 16 }}>
        <Routes>
          <Route path="/" element={<Inbox />} />
          <Route path="/thread/:id" element={<Thread />} />
          <Route path="/compose" element={<Compose />} />
        </Routes>
      </div>
    </div>
  )
}
