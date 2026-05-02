import { useState, useEffect, createContext } from 'react'
import './App.css'
import { Calculator } from './components/Calculator'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { About } from './components/About'

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
  const [appView, setAppView] = useState<'calculator' | 'about'>('calculator')
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

  if (appView === 'about') {
    return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <div className="app" data-theme={theme}>
          <About onBack={() => setAppView('calculator')} />
        </div>
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app" data-theme={theme}>
        <h1>Crunchy Number Muncher</h1>
        <button
          className="about-nav-link"
          onClick={() => setAppView('about')}
        >
          About
        </button>
        <Calculator />
      </div>
    </ThemeContext.Provider>
  )
}
