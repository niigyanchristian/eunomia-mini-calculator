import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import App from './App'

async function renderAndLogin() {
  const user = userEvent.setup()
  render(<App />)
  await user.type(screen.getByLabelText(/email/i), 'test@gmail.com')
  await user.type(screen.getByLabelText(/password/i), 'test123')
  await user.click(screen.getByRole('button', { name: /login/i }))
  return user
}

describe('App Theme Functionality', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders login page by default', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
    expect(screen.queryByText('Crunchy Number Muncher')).not.toBeInTheDocument()
  })

  it('shows calculator after successful login', async () => {
    await renderAndLogin()
    expect(screen.getByText('Crunchy Number Muncher')).toBeInTheDocument()
  })

  it('shows error message on invalid credentials', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByLabelText(/email/i), 'bad@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /login/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.queryByText('Crunchy Number Muncher')).not.toBeInTheDocument()
  })

  it('renders with light theme by default', async () => {
    await renderAndLogin()
    const appElement = screen.getByText('Crunchy Number Muncher').closest('.app')
    expect(appElement).toHaveAttribute('data-theme', 'light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('renders theme toggle button', async () => {
    await renderAndLogin()
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    expect(toggleButton).toBeInTheDocument()
  })

  it('theme toggle button shows correct icon for light mode', async () => {
    await renderAndLogin()
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    expect(toggleButton.textContent).toBe('🌙')
  })

  it('switches to dark theme when toggle button is clicked', async () => {
    const user = await renderAndLogin()

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    const appElement = screen.getByText('Crunchy Number Muncher').closest('.app')
    expect(appElement).toHaveAttribute('data-theme', 'dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(toggleButton.textContent).toBe('☀️')
  })

  it('switches back to light theme when toggle button is clicked again', async () => {
    const user = await renderAndLogin()

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)
    await user.click(toggleButton)

    const appElement = screen.getByText('Crunchy Number Muncher').closest('.app')
    expect(appElement).toHaveAttribute('data-theme', 'light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(toggleButton.textContent).toBe('🌙')
  })

  it('persists theme preference in localStorage', async () => {
    const user = await renderAndLogin()

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    expect(localStorage.getItem('calculator-theme')).toBe('dark')
  })

  it('loads saved theme from localStorage on mount', async () => {
    localStorage.setItem('calculator-theme', 'dark')
    await renderAndLogin()

    const appElement = screen.getByText('Crunchy Number Muncher').closest('.app')
    expect(appElement).toHaveAttribute('data-theme', 'dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('persists light theme in localStorage when switched back', async () => {
    localStorage.setItem('calculator-theme', 'dark')
    const user = await renderAndLogin()

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    expect(localStorage.getItem('calculator-theme')).toBe('light')
  })

  it('handles invalid localStorage value and defaults to light theme', async () => {
    localStorage.setItem('calculator-theme', 'invalid')
    await renderAndLogin()

    const appElement = screen.getByText('Crunchy Number Muncher').closest('.app')
    expect(appElement).toHaveAttribute('data-theme', 'light')
  })

  it('applies data-theme attribute to document root', async () => {
    const user = await renderAndLogin()

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})

describe('App Navigation', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('shows About navigation link after login', async () => {
    await renderAndLogin()
    expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument()
  })

  it('shows Calculator navigation link after login', async () => {
    await renderAndLogin()
    expect(screen.getByRole('button', { name: /^calculator$/i })).toBeInTheDocument()
  })

  it('clicking About nav link displays About heading', async () => {
    const user = await renderAndLogin()
    await user.click(screen.getByRole('button', { name: /about/i }))
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })

  it('clicking About nav link hides the calculator', async () => {
    const user = await renderAndLogin()
    await user.click(screen.getByRole('button', { name: /about/i }))
    expect(screen.queryByRole('button', { name: /toggle theme/i })).not.toBeInTheDocument()
  })

  it('clicking Calculator nav link from About page shows the calculator', async () => {
    const user = await renderAndLogin()
    await user.click(screen.getByRole('button', { name: /about/i }))
    await user.click(screen.getByRole('button', { name: /^calculator$/i }))
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('clicking Calculator nav link from About page hides the About heading', async () => {
    const user = await renderAndLogin()
    await user.click(screen.getByRole('button', { name: /about/i }))
    await user.click(screen.getByRole('button', { name: /^calculator$/i }))
    expect(screen.queryByRole('heading', { name: /about/i })).not.toBeInTheDocument()
  })
})
