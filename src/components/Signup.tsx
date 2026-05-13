import React, { useState } from 'react'
import './Login.css'
import { addCredential, emailExists } from '../auth/credentialStore'

interface SignupProps {
  onSignup: () => void
  onGoToLogin: () => void
}

export function Signup({ onSignup, onGoToLogin }: SignupProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (emailExists(email)) {
      setError('An account with this email already exists.')
      return
    }
    addCredential(email, password)
    setError('')
    onSignup()
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Sign Up</h2>
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
          <div className="login-field">
            <label htmlFor="confirm-password" className="login-label">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              className="login-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit">Sign Up</button>
          <button type="button" className="login-link" onClick={onGoToLogin}>Back to login</button>
        </form>
      </div>
    </div>
  )
}
