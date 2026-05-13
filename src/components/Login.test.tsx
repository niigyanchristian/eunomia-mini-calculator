import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Login } from './Login'

describe('Login', () => {
  it('renders email and password fields and a submit button', () => {
    const mockOnLogin = vi.fn()
    const mockOnGoToSignup = vi.fn()
    render(<Login onLogin={mockOnLogin} onGoToSignup={mockOnGoToSignup} />)

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('renders the welcome subtitle', () => {
    const mockOnLogin = vi.fn()
    const mockOnGoToSignup = vi.fn()
    render(<Login onLogin={mockOnLogin} onGoToSignup={mockOnGoToSignup} />)

    expect(screen.getByText(/welcome back! sign in to continue\./i)).toBeInTheDocument()
  })

  it('toggles password field visibility', async () => {
    const user = userEvent.setup()
    const mockOnLogin = vi.fn()
    const mockOnGoToSignup = vi.fn()
    render(<Login onLogin={mockOnLogin} onGoToSignup={mockOnGoToSignup} />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    const toggleButton = screen.getByRole('button', { name: /show password/i })

    expect(passwordInput).toHaveAttribute('type', 'password')

    await user.click(toggleButton)

    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /hide password/i }))

    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('shows an error message on invalid credentials', async () => {
    const user = userEvent.setup()
    const mockOnLogin = vi.fn()
    const mockOnGoToSignup = vi.fn()
    render(<Login onLogin={mockOnLogin} onGoToSignup={mockOnGoToSignup} />)

    await user.type(screen.getByLabelText(/^email$/i), 'wrong@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(/invalid email or password/i)
    expect(mockOnLogin).not.toHaveBeenCalled()
  })

  it('calls onLogin when valid credentials are submitted', async () => {
    const user = userEvent.setup()
    const mockOnLogin = vi.fn()
    const mockOnGoToSignup = vi.fn()
    render(<Login onLogin={mockOnLogin} onGoToSignup={mockOnGoToSignup} />)

    await user.type(screen.getByLabelText(/^email$/i), 'test@gmail.com')
    await user.type(screen.getByLabelText(/^password$/i), 'test123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(mockOnLogin).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('does not call onLogin when only the email is correct', async () => {
    const user = userEvent.setup()
    const mockOnLogin = vi.fn()
    const mockOnGoToSignup = vi.fn()
    render(<Login onLogin={mockOnLogin} onGoToSignup={mockOnGoToSignup} />)

    await user.type(screen.getByLabelText(/^email$/i), 'test@gmail.com')
    await user.type(screen.getByLabelText(/^password$/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(mockOnLogin).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('does not call onLogin when only the password is correct', async () => {
    const user = userEvent.setup()
    const mockOnLogin = vi.fn()
    const mockOnGoToSignup = vi.fn()
    render(<Login onLogin={mockOnLogin} onGoToSignup={mockOnGoToSignup} />)

    await user.type(screen.getByLabelText(/^email$/i), 'wrong@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'test123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(mockOnLogin).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('clears error message on successful login after a failed attempt', async () => {
    const user = userEvent.setup()
    const mockOnLogin = vi.fn()
    const mockOnGoToSignup = vi.fn()
    render(<Login onLogin={mockOnLogin} onGoToSignup={mockOnGoToSignup} />)

    await user.type(screen.getByLabelText(/^email$/i), 'wrong@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByRole('alert')).toBeInTheDocument()

    await user.clear(screen.getByLabelText(/^email$/i))
    await user.clear(screen.getByLabelText(/^password$/i))
    await user.type(screen.getByLabelText(/^email$/i), 'test@gmail.com')
    await user.type(screen.getByLabelText(/^password$/i), 'test123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(mockOnLogin).toHaveBeenCalledTimes(1)
  })
})
