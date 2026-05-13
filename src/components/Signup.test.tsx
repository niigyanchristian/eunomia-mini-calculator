import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Signup } from './Signup'

vi.mock('../auth/credentialStore', () => ({
  addCredential: vi.fn(),
  emailExists: vi.fn(() => false),
}))

import { addCredential, emailExists } from '../auth/credentialStore'

describe('Signup', () => {
  beforeEach(() => {
    vi.mocked(emailExists).mockReturnValue(false)
    vi.mocked(addCredential).mockReset()
  })

  it('renders the branded header', () => {
    const mockOnSignup = vi.fn()
    const mockOnGoToLogin = vi.fn()
    render(<Signup onSignup={mockOnSignup} onGoToLogin={mockOnGoToLogin} />)

    expect(screen.getByText(/crunchy number muncher/i)).toBeInTheDocument()
    expect(screen.getByText(/create an account/i)).toBeInTheDocument()
  })

  it('renders email, password, confirm-password fields and a submit button', () => {
    const mockOnSignup = vi.fn()
    const mockOnGoToLogin = vi.fn()
    render(<Signup onSignup={mockOnSignup} onGoToLogin={mockOnGoToLogin} />)

    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('shows inline error and does not call onSignup when passwords do not match', async () => {
    const user = userEvent.setup()
    const mockOnSignup = vi.fn()
    const mockOnGoToLogin = vi.fn()
    render(<Signup onSignup={mockOnSignup} onGoToLogin={mockOnGoToLogin} />)

    await user.type(screen.getByLabelText(/^email$/i), 'new@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'password1')
    await user.type(screen.getByLabelText(/confirm password/i), 'password2')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(/passwords do not match/i)
    expect(mockOnSignup).not.toHaveBeenCalled()
  })

  it('shows inline error and does not call onSignup when email already exists', async () => {
    vi.mocked(emailExists).mockReturnValue(true)
    const user = userEvent.setup()
    const mockOnSignup = vi.fn()
    const mockOnGoToLogin = vi.fn()
    render(<Signup onSignup={mockOnSignup} onGoToLogin={mockOnGoToLogin} />)

    await user.type(screen.getByLabelText(/^email$/i), 'test@gmail.com')
    await user.type(screen.getByLabelText(/^password$/i), 'test123')
    await user.type(screen.getByLabelText(/confirm password/i), 'test123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i)
    expect(mockOnSignup).not.toHaveBeenCalled()
  })

  it('calls onSignup once when valid unique email and matching passwords are submitted', async () => {
    const user = userEvent.setup()
    const mockOnSignup = vi.fn()
    const mockOnGoToLogin = vi.fn()
    render(<Signup onSignup={mockOnSignup} onGoToLogin={mockOnGoToLogin} />)

    await user.type(screen.getByLabelText(/^email$/i), 'newuser@example.com')
    await user.type(screen.getByLabelText(/^password$/i), 'securepass')
    await user.type(screen.getByLabelText(/confirm password/i), 'securepass')
    await user.click(screen.getByRole('button', { name: /sign up/i }))

    expect(mockOnSignup).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('calls onGoToLogin when Back to login button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnSignup = vi.fn()
    const mockOnGoToLogin = vi.fn()
    render(<Signup onSignup={mockOnSignup} onGoToLogin={mockOnGoToLogin} />)

    await user.click(screen.getByRole('button', { name: /back to login/i }))

    expect(mockOnGoToLogin).toHaveBeenCalledTimes(1)
  })
})
