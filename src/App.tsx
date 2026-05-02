import { useState, useEffect, createContext } from 'react'
import './App.css'
import { Calculator } from './components/Calculator'
import { About } from './components/About'
import { Login } from './components/Login'
import { Signup } from './components/Signup'

export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [view, setView] = useState<'login' | 'signup'>(() =>
    window.location.pathname === '/signup' ? 'signup' : 'login'
  )
  const [page, setPage] = useState<'calculator' | 'about'>('calculator')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('calculator-theme')
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light'
  })

  useEffect(() => {
    localStorage.setItem('calculator-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  if (!isAuthenticated) {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="app" data-theme={theme}>
          {view === 'login' ? (
            <Login onLogin={handleLogin} onGoToSignup={() => { setView('signup'); window.history.pushState(null, '', '/signup') }} />
          ) : (
            <Signup onSignup={handleLogin} onGoToLogin={() => { setView('login'); window.history.pushState(null, '', '/') }} />
          )}
        </div>
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app" data-theme={theme}>
        <h1>Crunchy Number Muncher</h1>
        <nav className="app-nav">
          <button
            className={`app-nav-link${page === 'calculator' ? ' active' : ''}`}
            onClick={() => setPage('calculator')}
          >
            Calculator
          </button>
          <button
            className={`app-nav-link${page === 'about' ? ' active' : ''}`}
            onClick={() => setPage('about')}
          >
            About
          </button>
        </nav>
        {page === 'calculator' ? <Calculator /> : <About />}
      </div>
    </ThemeContext.Provider>
  )
}
