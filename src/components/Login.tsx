import React, { useState } from 'react'
import './Login.css'
import { validateCredentials } from '../auth/credentialStore'

interface LoginProps {
  onLogin: () => void
  onGoToSignup?: () => void
}

export function Login({ onLogin, onGoToSignup }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateCredentials(email, password)) {
      setError('')
      onLogin()
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email" className="login-label">Email</label>
            <input
              id="email"
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password" className="login-label">Password</label>
            <input
              id="password"
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit">Login</button>
          <button type="button" className="login-link" onClick={onGoToSignup ?? (() => {})}>Sign up</button>
        </form>
      </div>
    </div>
  )
}
