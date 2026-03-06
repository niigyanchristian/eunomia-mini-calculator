import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders without crashing', () => {
    const mockOnClick = vi.fn()
    render(<Button label="5" onClick={mockOnClick} />)
    const buttonElement = screen.getByRole('button', { name: '5' })
    expect(buttonElement).toBeInTheDocument()
  })

  it('renders with the correct label', () => {
    const mockOnClick = vi.fn()
    render(<Button label="7" onClick={mockOnClick} />)
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('displays the correct CSS class', () => {
    const mockOnClick = vi.fn()
    const { container } = render(<Button label="+" onClick={mockOnClick} />)
    const buttonElement = container.querySelector('.calculator-button')
    expect(buttonElement).toBeInTheDocument()
  })

  describe('onClick handler', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup()
      const mockOnClick = vi.fn()
      render(<Button label="1" onClick={mockOnClick} />)

      const button = screen.getByRole('button', { name: '1' })
      await user.click(button)

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick handler multiple times on multiple clicks', async () => {
      const user = userEvent.setup()
      const mockOnClick = vi.fn()
      render(<Button label="9" onClick={mockOnClick} />)

      const button = screen.getByRole('button', { name: '9' })
      await user.click(button)
      await user.click(button)
      await user.click(button)

      expect(mockOnClick).toHaveBeenCalledTimes(3)
    })

    it('calls onClick when activated with Enter key', async () => {
      const user = userEvent.setup()
      const mockOnClick = vi.fn()
      render(<Button label="5" onClick={mockOnClick} />)

      const button = screen.getByRole('button', { name: '5' })
      button.focus()
      await user.keyboard('{Enter}')

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick when activated with Space key', async () => {
      const user = userEvent.setup()
      const mockOnClick = vi.fn()
      render(<Button label="3" onClick={mockOnClick} />)

      const button = screen.getByRole('button', { name: '3' })
      button.focus()
      await user.keyboard(' ')

      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('different button types', () => {
    describe('digit buttons', () => {
      it('renders digit 0 correctly', () => {
        const mockOnClick = vi.fn()
        render(<Button label="0" onClick={mockOnClick} />)
        expect(screen.getByRole('button', { name: '0' })).toBeInTheDocument()
      })

      it('renders digit 9 correctly', () => {
        const mockOnClick = vi.fn()
        render(<Button label="9" onClick={mockOnClick} />)
        expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument()
      })

      it('renders all digits correctly', () => {
        const mockOnClick = vi.fn()
        const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

        digits.forEach(digit => {
          const { unmount } = render(<Button label={digit} onClick={mockOnClick} />)
          expect(screen.getByRole('button', { name: digit })).toBeInTheDocument()
          unmount()
        })
      })
    })

    describe('operation buttons', () => {
      it('renders addition button correctly', () => {
        const mockOnClick = vi.fn()
        render(<Button label="+" onClick={mockOnClick} />)
        expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
      })

      it('renders subtraction button correctly', () => {
        const mockOnClick = vi.fn()
        render(<Button label="-" onClick={mockOnClick} />)
        expect(screen.getByRole('button', { name: '-' })).toBeInTheDocument()
      })

      it('renders multiplication button correctly', () => {
        const mockOnClick = vi.fn()
        render(<Button label="×" onClick={mockOnClick} />)
        expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument()
      })

      it('renders division button correctly', () => {
        const mockOnClick = vi.fn()
        render(<Button label="÷" onClick={mockOnClick} />)
        expect(screen.getByRole('button', { name: '÷' })).toBeInTheDocument()
      })
    })

    describe('special buttons', () => {
      it('renders clear button correctly', () => {
        const mockOnClick = vi.fn()
        render(<Button label="C" onClick={mockOnClick} />)
        expect(screen.getByRole('button', { name: 'C' })).toBeInTheDocument()
      })

      it('renders equals button correctly', () => {
        const mockOnClick = vi.fn()
        render(<Button label="=" onClick={mockOnClick} />)
        expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument()
      })

      it('renders decimal button correctly', () => {
        const mockOnClick = vi.fn()
        render(<Button label="." onClick={mockOnClick} />)
        expect(screen.getByRole('button', { name: '.' })).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('has button role', () => {
      const mockOnClick = vi.fn()
      render(<Button label="5" onClick={mockOnClick} />)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('has accessible name from label', () => {
      const mockOnClick = vi.fn()
      render(<Button label="8" onClick={mockOnClick} />)
      expect(screen.getByRole('button', { name: '8' })).toBeInTheDocument()
    })

    it('can receive keyboard focus', () => {
      const mockOnClick = vi.fn()
      render(<Button label="4" onClick={mockOnClick} />)
      const button = screen.getByRole('button', { name: '4' })
      button.focus()
      expect(button).toHaveFocus()
    })

    it('is keyboard navigable', async () => {
      const user = userEvent.setup()
      const mockOnClick1 = vi.fn()
      const mockOnClick2 = vi.fn()

      render(
        <div>
          <Button label="1" onClick={mockOnClick1} />
          <Button label="2" onClick={mockOnClick2} />
        </div>
      )

      await user.tab()
      expect(screen.getByRole('button', { name: '1' })).toHaveFocus()

      await user.tab()
      expect(screen.getByRole('button', { name: '2' })).toHaveFocus()
    })
  })

  describe('edge cases', () => {
    it('handles empty string label', () => {
      const mockOnClick = vi.fn()
      const { container } = render(<Button label="" onClick={mockOnClick} />)
      const button = container.querySelector('.calculator-button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveTextContent('')
    })

    it('handles long label text', () => {
      const mockOnClick = vi.fn()
      const longLabel = 'Very Long Button Label'
      render(<Button label={longLabel} onClick={mockOnClick} />)
      expect(screen.getByText(longLabel)).toBeInTheDocument()
    })

    it('handles special characters in label', () => {
      const mockOnClick = vi.fn()
      render(<Button label="√" onClick={mockOnClick} />)
      expect(screen.getByRole('button', { name: '√' })).toBeInTheDocument()
    })
  })
})
