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

  describe('button variant classes', () => {
    it('does not assign variant class to digit buttons', () => {
      const mockOnClick = vi.fn()
      const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      digits.forEach(digit => {
        const { container, unmount } = render(<Button label={digit} onClick={mockOnClick} />)
        const button = container.querySelector('.calculator-button')
        expect(button).not.toHaveClass('operator-button')
        expect(button).not.toHaveClass('clear-button')
        expect(button).not.toHaveClass('equals-button')
        unmount()
      })
    })

    it('does not assign variant class to decimal button', () => {
      const mockOnClick = vi.fn()
      const { container } = render(<Button label="." onClick={mockOnClick} />)
      const button = container.querySelector('.calculator-button')
      expect(button).not.toHaveClass('operator-button')
      expect(button).not.toHaveClass('clear-button')
      expect(button).not.toHaveClass('equals-button')
    })

    it('applies operator-button class when className contains operator-button', () => {
      const mockOnClick = vi.fn()
      const { container } = render(<Button label="+" onClick={mockOnClick} className="operator-button" />)
      const button = container.querySelector('.calculator-button')
      expect(button).toHaveClass('operator-button')
    })

    it('applies clear-button class when className contains clear-button', () => {
      const mockOnClick = vi.fn()
      const { container } = render(<Button label="C" onClick={mockOnClick} className="clear-button" />)
      const button = container.querySelector('.calculator-button')
      expect(button).toHaveClass('clear-button')
    })

    it('applies equals-button class when className contains equals-button', () => {
      const mockOnClick = vi.fn()
      const { container } = render(<Button label="=" onClick={mockOnClick} className="equals-button" />)
      const button = container.querySelector('.calculator-button')
      expect(button).toHaveClass('equals-button')
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

  describe('responsive design', () => {
    it('renders correctly on mobile viewport (375px)', () => {
      global.innerWidth = 375
      global.innerHeight = 667
      global.dispatchEvent(new Event('resize'))

      const mockOnClick = vi.fn()
      const { container } = render(<Button label="5" onClick={mockOnClick} />)
      const button = container.querySelector('.calculator-button')

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('calculator-button')
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument()
    })

    it('renders correctly on tablet viewport (768px)', () => {
      global.innerWidth = 768
      global.innerHeight = 1024
      global.dispatchEvent(new Event('resize'))

      const mockOnClick = vi.fn()
      const { container } = render(<Button label="9" onClick={mockOnClick} />)
      const button = container.querySelector('.calculator-button')

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('calculator-button')
      expect(screen.getByRole('button', { name: '9' })).toBeInTheDocument()
    })

    it('renders correctly on desktop viewport (1920px)', () => {
      global.innerWidth = 1920
      global.innerHeight = 1080
      global.dispatchEvent(new Event('resize'))

      const mockOnClick = vi.fn()
      const { container } = render(<Button label="+" onClick={mockOnClick} />)
      const button = container.querySelector('.calculator-button')

      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('calculator-button')
      expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument()
    })

    it('ensures touch-friendly button sizing with CSS class', () => {
      const mockOnClick = vi.fn()
      const { container } = render(<Button label="7" onClick={mockOnClick} />)
      const button = container.querySelector('.calculator-button')

      expect(button).toHaveClass('calculator-button')
      expect(button).toBeInTheDocument()
    })

    it('remains interactive across different viewport sizes', async () => {
      const viewports = [
        { width: 320, height: 568 },
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1920, height: 1080 }
      ]

      for (const { width, height } of viewports) {
        global.innerWidth = width
        global.innerHeight = height
        global.dispatchEvent(new Event('resize'))

        const user = userEvent.setup()
        const mockOnClick = vi.fn()
        const { unmount } = render(<Button label="8" onClick={mockOnClick} />)

        const button = screen.getByRole('button', { name: '8' })
        await user.click(button)

        expect(mockOnClick).toHaveBeenCalledTimes(1)
        expect(button).toHaveClass('calculator-button')

        unmount()
      }
    })

    it('maintains proper CSS class for touch target sizing on small screens', () => {
      global.innerWidth = 320
      global.innerHeight = 568
      global.dispatchEvent(new Event('resize'))

      const mockOnClick = vi.fn()
      const { container } = render(<Button label="3" onClick={mockOnClick} />)
      const button = container.querySelector('.calculator-button')

      expect(button).toHaveClass('calculator-button')
      expect(button).toBeInTheDocument()
    })
  })
})
