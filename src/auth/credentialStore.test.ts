import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('credentialStore', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('validateCredentials returns true for seed credentials', async () => {
    const { validateCredentials } = await import('./credentialStore')
    expect(validateCredentials('test@gmail.com', 'test123')).toBe(true)
  })

  it('validateCredentials returns false for unknown email', async () => {
    const { validateCredentials } = await import('./credentialStore')
    expect(validateCredentials('unknown@example.com', 'test123')).toBe(false)
  })

  it('validateCredentials returns false for wrong password', async () => {
    const { validateCredentials } = await import('./credentialStore')
    expect(validateCredentials('test@gmail.com', 'wrongpassword')).toBe(false)
  })

  it('addCredential adds a new user that then validates successfully', async () => {
    const { addCredential, validateCredentials } = await import('./credentialStore')
    addCredential('newuser@example.com', 'newpass')
    expect(validateCredentials('newuser@example.com', 'newpass')).toBe(true)
  })

  it('emailExists returns true for existing email', async () => {
    const { emailExists } = await import('./credentialStore')
    expect(emailExists('test@gmail.com')).toBe(true)
  })

  it('emailExists returns false for a new email', async () => {
    const { emailExists } = await import('./credentialStore')
    expect(emailExists('nobody@example.com')).toBe(false)
  })
})
