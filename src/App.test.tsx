import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App Theme Functionality', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders with light theme by default', () => {
    render(<App />)
    const appElement = screen.getByText('Mini Calculator').closest('.app')
    expect(appElement).toHaveAttribute('data-theme', 'light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
  })

  it('renders theme toggle button', () => {
    render(<App />)
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    expect(toggleButton).toBeInTheDocument()
  })

  it('theme toggle button shows correct icon for light mode', () => {
    render(<App />)
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    expect(toggleButton.textContent).toBe('🌙')
  })

  it('switches to dark theme when toggle button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    const appElement = screen.getByText('Mini Calculator').closest('.app')
    expect(appElement).toHaveAttribute('data-theme', 'dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(toggleButton.textContent).toBe('☀️')
  })

  it('switches back to light theme when toggle button is clicked again', async () => {
    const user = userEvent.setup()
    render(<App />)

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)
    await user.click(toggleButton)

    const appElement = screen.getByText('Mini Calculator').closest('.app')
    expect(appElement).toHaveAttribute('data-theme', 'light')
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(toggleButton.textContent).toBe('🌙')
  })

  it('persists theme preference in localStorage', async () => {
    const user = userEvent.setup()
    render(<App />)

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    expect(localStorage.getItem('calculator-theme')).toBe('dark')
  })

  it('loads saved theme from localStorage on mount', () => {
    localStorage.setItem('calculator-theme', 'dark')
    render(<App />)

    const appElement = screen.getByText('Mini Calculator').closest('.app')
    expect(appElement).toHaveAttribute('data-theme', 'dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('persists light theme in localStorage when switched back', async () => {
    const user = userEvent.setup()
    localStorage.setItem('calculator-theme', 'dark')
    render(<App />)

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    expect(localStorage.getItem('calculator-theme')).toBe('light')
  })

  it('handles invalid localStorage value and defaults to light theme', () => {
    localStorage.setItem('calculator-theme', 'invalid')
    render(<App />)

    const appElement = screen.getByText('Mini Calculator').closest('.app')
    expect(appElement).toHaveAttribute('data-theme', 'light')
  })

  it('applies data-theme attribute to document root', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })
})

describe('App Particle Background', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders particles container', () => {
    render(<App />)
    const particlesContainer = screen.getByTestId('particles-container')
    expect(particlesContainer).toBeInTheDocument()
    expect(particlesContainer).toHaveClass('particles')
  })

  it('renders 20 particle elements', () => {
    render(<App />)
    for (let i = 0; i < 20; i++) {
      const particle = screen.getByTestId(`particle-${i}`)
      expect(particle).toBeInTheDocument()
      expect(particle).toHaveClass('particle')
    }
  })

  it('particles have unique animation properties', () => {
    render(<App />)
    const particle0 = screen.getByTestId('particle-0')
    const particle1 = screen.getByTestId('particle-1')

    const style0 = particle0.getAttribute('style')
    const style1 = particle1.getAttribute('style')

    expect(style0).toBeTruthy()
    expect(style1).toBeTruthy()
    expect(style0).not.toBe(style1)
  })

  it('particles render in both light and dark themes', async () => {
    const user = userEvent.setup()
    render(<App />)

    const particlesContainer = screen.getByTestId('particles-container')
    expect(particlesContainer).toBeInTheDocument()

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i })
    await user.click(toggleButton)

    expect(particlesContainer).toBeInTheDocument()
    for (let i = 0; i < 20; i++) {
      const particle = screen.getByTestId(`particle-${i}`)
      expect(particle).toBeInTheDocument()
    }
  })
})
