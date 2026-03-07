import { render, screen } from '@testing-library/react'
import { Display } from './Display'

describe('Display', () => {
  it('renders without crashing', () => {
    render(<Display value="0" />)
    const displayElement = screen.getByText('0')
    expect(displayElement).toBeInTheDocument()
  })

  it('displays the correct CSS class', () => {
    const { container } = render(<Display value="123" />)
    const displayElement = container.querySelector('.display')
    expect(displayElement).toBeInTheDocument()
  })

  describe('value prop rendering', () => {
    it('displays a string value correctly', () => {
      render(<Display value="42" />)
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('displays a number value correctly', () => {
      render(<Display value={123} />)
      expect(screen.getByText('123')).toBeInTheDocument()
    })

    it('displays zero correctly', () => {
      render(<Display value={0} />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('displays negative numbers correctly', () => {
      render(<Display value={-42} />)
      expect(screen.getByText('-42')).toBeInTheDocument()
    })

    it('displays decimal numbers correctly', () => {
      render(<Display value={3.14159} />)
      expect(screen.getByText('3.14159')).toBeInTheDocument()
    })

    it('displays Error state correctly', () => {
      render(<Display value="Error" />)
      expect(screen.getByText('Error')).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles empty string value', () => {
      const { container } = render(<Display value="" />)
      const displayElement = container.querySelector('.display')
      expect(displayElement).toBeInTheDocument()
      expect(displayElement).toHaveTextContent('')
    })

    it('displays long numbers correctly', () => {
      const longNumber = '123456789012345'
      render(<Display value={longNumber} />)
      expect(screen.getByText(longNumber)).toBeInTheDocument()
    })

    it('displays very long decimal numbers', () => {
      const longDecimal = 1.23456789012345
      render(<Display value={longDecimal} />)
      expect(screen.getByText(longDecimal.toString())).toBeInTheDocument()
    })

    it('handles scientific notation', () => {
      const scientificNumber = 1e10
      render(<Display value={scientificNumber} />)
      expect(screen.getByText(scientificNumber.toString())).toBeInTheDocument()
    })

    it('displays operations/expressions as strings', () => {
      render(<Display value="5 + 3" />)
      expect(screen.getByText('5 + 3')).toBeInTheDocument()
    })
  })

  describe('responsive design', () => {
    it('renders correctly on mobile viewport (375px)', () => {
      global.innerWidth = 375
      global.innerHeight = 667
      global.dispatchEvent(new Event('resize'))

      const { container } = render(<Display value="12345" />)
      const displayElement = container.querySelector('.display')

      expect(displayElement).toBeInTheDocument()
      expect(displayElement).toHaveClass('display')
      expect(screen.getByText('12345')).toBeInTheDocument()
    })

    it('renders correctly on tablet viewport (768px)', () => {
      global.innerWidth = 768
      global.innerHeight = 1024
      global.dispatchEvent(new Event('resize'))

      const { container } = render(<Display value="98765" />)
      const displayElement = container.querySelector('.display')

      expect(displayElement).toBeInTheDocument()
      expect(displayElement).toHaveClass('display')
      expect(screen.getByText('98765')).toBeInTheDocument()
    })

    it('renders correctly on desktop viewport (1920px)', () => {
      global.innerWidth = 1920
      global.innerHeight = 1080
      global.dispatchEvent(new Event('resize'))

      const { container } = render(<Display value="54321" />)
      const displayElement = container.querySelector('.display')

      expect(displayElement).toBeInTheDocument()
      expect(displayElement).toHaveClass('display')
      expect(screen.getByText('54321')).toBeInTheDocument()
    })

    it('handles text overflow on small screens', () => {
      global.innerWidth = 320
      global.innerHeight = 568
      global.dispatchEvent(new Event('resize'))

      const { container } = render(<Display value="999999999999999" />)
      const displayElement = container.querySelector('.display')

      expect(displayElement).toBeInTheDocument()
      expect(displayElement).toHaveTextContent('999999999999999')
    })

    it('maintains proper styling across different viewports', () => {
      const viewports = [
        { width: 320, height: 568 },
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1920, height: 1080 }
      ]

      viewports.forEach(({ width, height }) => {
        global.innerWidth = width
        global.innerHeight = height
        global.dispatchEvent(new Event('resize'))

        const { container, unmount } = render(<Display value="123" />)
        const displayElement = container.querySelector('.display')

        expect(displayElement).toBeInTheDocument()
        expect(displayElement).toHaveClass('display')

        unmount()
      })
    })
  })
})
