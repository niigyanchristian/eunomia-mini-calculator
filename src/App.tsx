import { useState, useEffect, createContext } from 'react'
import './App.css'
import { Calculator } from './components/Calculator'
import { Login } from './components/Login'

export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
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
          <Login onLogin={handleLogin} />
        </div>
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app" data-theme={theme}>
        <h1>Chris Min Calc</h1>
        <Calculator />
      </div>
    </ThemeContext.Provider>
  )
}
