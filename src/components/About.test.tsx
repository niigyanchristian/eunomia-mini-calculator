import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { About } from './About'

describe('About', () => {
  it('renders the About heading', () => {
    const mockOnBack = vi.fn()
    render(<About onBack={mockOnBack} />)
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })

  it('renders the descriptive paragraph text', () => {
    const mockOnBack = vi.fn()
    render(<About onBack={mockOnBack} />)
    expect(screen.getByText(/crunchy number muncher/i)).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnBack = vi.fn()
    render(<About onBack={mockOnBack} />)
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(mockOnBack).toHaveBeenCalledTimes(1)
  })
})
