import { useState, useEffect } from 'react'
import './App.css'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { api, saveToken } from './api'

type View = 'home' | 'register' | 'login' | 'dashboard'

function App() {
  const [view, setView] = useState<View>('home')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(()=>{
    // on mount, check token by calling /auth/me
    const check = async () => {
      try {
        const res = await api.getMe();
        if (res?.data) setIsAuthenticated(true)
      } catch (e) {
        setIsAuthenticated(false)
      }
    }
    check()
  }, [])

  return (
    <div className="container">
      <header>
        <h1>Auth & Tasks Demo</h1>
        <nav>
          <button onClick={()=>setView('home')}>Home</button>
          {!isAuthenticated && <button onClick={()=>setView('register')}>Register</button>}
          {!isAuthenticated && <button onClick={()=>setView('login')}>Login</button>}
          {isAuthenticated && <button onClick={()=>setView('dashboard')}>Dashboard</button>}
        </nav>
      </header>

      <main>
        {view === 'home' && (
          <div className="panel">
            <h2>Welcome</h2>
            <p className="muted">A lightweight UI to test the Auth & Tasks REST API.</p>

            <div className="features">
              <div>
                <h3>Frontend features</h3>
                <ul>
                  <li>Register & log in users</li>
                  <li>Access a protected dashboard (JWT required)</li>
                  <li>Perform CRUD actions on Tasks</li>
                </ul>
              </div>
              <div>
                <h3>Server features</h3>
                <ul>
                  <li>JWT authentication with role-based access (user/admin)</li>
                  <li>Input validation & centralized error handling</li>
                  <li>Postman collection included for API testing</li>
                </ul>
              </div>
            </div>

            <p className="muted">Use the Register / Login buttons above to get started. After login, open the Dashboard to manage tasks.</p>
          </div>
        )}

        {view === 'register' && <Register onRegistered={(token)=>{ if(token){ saveToken(token); setIsAuthenticated(true); setView('dashboard') } }} />}
        {view === 'login' && <Login onLogin={()=>{ setIsAuthenticated(true); setView('dashboard') }} />}
        {view === 'dashboard' && <Dashboard onLogout={()=>{ setIsAuthenticated(false); setView('home') }} />}
      </main>
    </div>
  )
}

export default App
