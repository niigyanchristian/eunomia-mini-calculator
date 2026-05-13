import React, { useState } from 'react'
import './Login.css'
import { validateCredentials } from '../auth/credentialStore'

interface LoginProps {
  onLogin: () => void
  onGoToSignup: () => void
}

export function Login({ onLogin, onGoToSignup }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
        <div className="login-header">
          <h2 className="login-title">Sign In</h2>
          <p className="login-subtitle">Welcome back! Sign in to continue.</p>
        </div>
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
            <div className="password-input-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-input login-input-with-toggle"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit">Login</button>
          <button type="button" className="login-link" onClick={onGoToSignup}>Sign up</button>
        </form>
      </div>
    </div>
  )
}
