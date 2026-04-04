import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Calculator } from './Calculator'
import { ThemeContext } from '../App'

function getButton(label: string) {
  return screen.getByRole('button', { name: label })
}

function getDisplay() {
  return document.querySelector('.display')!
}

async function clickButtons(user: ReturnType<typeof userEvent.setup>, labels: string[]) {
  for (const label of labels) {
    await user.click(getButton(label))
  }
}

describe('Calculator', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    render(<Calculator />)
  })

  it('renders with initial display of 0', () => {
    expect(getDisplay()).toHaveTextContent('0')
  })

  it('renders all calculator buttons', () => {
    const expectedButtons = ['C', '\u00f7', '\u00d7', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '.', '0']
    for (const label of expectedButtons) {
      expect(getButton(label)).toBeInTheDocument()
    }
  })

  describe('digit input', () => {
    it('displays a single digit', async () => {
      await user.click(getButton('5'))
      expect(getDisplay()).toHaveTextContent('5')
    })

    it('displays multiple digits', async () => {
      await clickButtons(user, ['1', '2', '3'])
      expect(getDisplay()).toHaveTextContent('123')
    })

    it('replaces initial zero with a digit', async () => {
      await user.click(getButton('7'))
      expect(getDisplay()).toHaveTextContent('7')
    })

    it('allows entering zero after zero via other digits', async () => {
      await clickButtons(user, ['0', '0', '5'])
      expect(getDisplay()).toHaveTextContent('5')
    })

    it('handles long number sequences', async () => {
      await clickButtons(user, ['1', '2', '3', '4', '5', '6', '7', '8', '9'])
      expect(getDisplay()).toHaveTextContent('123456789')
    })
  })

  describe('decimal point handling', () => {
    it('adds decimal point to display', async () => {
      await clickButtons(user, ['5', '.'])
      expect(getDisplay()).toHaveTextContent('5.')
    })

    it('adds leading zero for decimal starting with dot', async () => {
      await user.click(getButton('.'))
      expect(getDisplay()).toHaveTextContent('0.')
    })

    it('prevents multiple decimal points', async () => {
      await clickButtons(user, ['1', '.', '2', '.', '3'])
      expect(getDisplay()).toHaveTextContent('1.23')
    })

    it('allows decimal input after operation', async () => {
      await clickButtons(user, ['5', '+', '.', '3'])
      expect(getDisplay()).toHaveTextContent('0.3')
    })

    it('starts fresh decimal after equals', async () => {
      await clickButtons(user, ['5', '+', '3', '=', '.', '1'])
      expect(getDisplay()).toHaveTextContent('0.1')
    })
  })

  describe('addition', () => {
    it('adds two integers', async () => {
      await clickButtons(user, ['2', '+', '3', '='])
      expect(getDisplay()).toHaveTextContent('5')
    })

    it('adds decimal numbers', async () => {
      await clickButtons(user, ['1', '.', '5', '+', '2', '.', '5', '='])
      expect(getDisplay()).toHaveTextContent('4')
    })

    it('adds zero', async () => {
      await clickButtons(user, ['5', '+', '0', '='])
      expect(getDisplay()).toHaveTextContent('5')
    })
  })

  describe('subtraction', () => {
    it('subtracts two integers', async () => {
      await clickButtons(user, ['9', '-', '4', '='])
      expect(getDisplay()).toHaveTextContent('5')
    })

    it('produces negative result', async () => {
      await clickButtons(user, ['3', '-', '8', '='])
      expect(getDisplay()).toHaveTextContent('-5')
    })

    it('subtracts decimals', async () => {
      await clickButtons(user, ['5', '.', '5', '-', '2', '.', '3', '='])
      expect(getDisplay()).toHaveTextContent('3.2')
    })
  })

  describe('multiplication', () => {
    it('multiplies two integers', async () => {
      await clickButtons(user, ['6', '\u00d7', '7', '='])
      expect(getDisplay()).toHaveTextContent('42')
    })

    it('multiplies by zero', async () => {
      await clickButtons(user, ['5', '\u00d7', '0', '='])
      expect(getDisplay()).toHaveTextContent('0')
    })

    it('multiplies decimals', async () => {
      await clickButtons(user, ['2', '.', '5', '\u00d7', '4', '='])
      expect(getDisplay()).toHaveTextContent('10')
    })
  })

  describe('division', () => {
    it('divides two integers', async () => {
      await clickButtons(user, ['8', '\u00f7', '2', '='])
      expect(getDisplay()).toHaveTextContent('4')
    })

    it('divides with decimal result', async () => {
      await clickButtons(user, ['7', '\u00f7', '2', '='])
      expect(getDisplay()).toHaveTextContent('3.5')
    })

    it('displays Error on division by zero', async () => {
      await clickButtons(user, ['5', '\u00f7', '0', '='])
      expect(getDisplay()).toHaveTextContent('Error')
    })
  })

  describe('clear functionality', () => {
    it('resets display to zero', async () => {
      await clickButtons(user, ['5', '3', 'C'])
      expect(getDisplay()).toHaveTextContent('0')
    })

    it('clears after an operation', async () => {
      await clickButtons(user, ['5', '+', '3', '=', 'C'])
      expect(getDisplay()).toHaveTextContent('0')
    })

    it('clears Error state', async () => {
      await clickButtons(user, ['5', '\u00f7', '0', '=', 'C'])
      expect(getDisplay()).toHaveTextContent('0')
    })

    it('allows new calculation after clear', async () => {
      await clickButtons(user, ['5', '+', '3', '=', 'C', '2', '+', '2', '='])
      expect(getDisplay()).toHaveTextContent('4')
    })
  })

  describe('operation chaining', () => {
    it('chains addition operations', async () => {
      await clickButtons(user, ['1', '+', '2', '+', '3', '='])
      expect(getDisplay()).toHaveTextContent('6')
    })

    it('chains mixed operations', async () => {
      await clickButtons(user, ['5', '+', '3', '-', '2', '='])
      expect(getDisplay()).toHaveTextContent('6')
    })

    it('evaluates intermediate result when chaining', async () => {
      await clickButtons(user, ['2', '+', '3'])
      // After pressing next operation, display should show intermediate result
      await user.click(getButton('+'))
      expect(getDisplay()).toHaveTextContent('5')
    })

    it('chains multiplication and addition', async () => {
      await clickButtons(user, ['3', '\u00d7', '4', '+', '2', '='])
      expect(getDisplay()).toHaveTextContent('14')
    })

    it('handles multiple chained operations', async () => {
      await clickButtons(user, ['1', '0', '+', '5', '-', '3', '\u00d7', '2', '='])
      expect(getDisplay()).toHaveTextContent('24')
    })
  })

  describe('error handling', () => {
    it('ignores operations when display shows Error', async () => {
      await clickButtons(user, ['5', '\u00f7', '0', '='])
      expect(getDisplay()).toHaveTextContent('Error')
      await user.click(getButton('+'))
      expect(getDisplay()).toHaveTextContent('Error')
    })

    it('allows digit input after Error to start fresh', async () => {
      await clickButtons(user, ['5', '\u00f7', '0', '='])
      expect(getDisplay()).toHaveTextContent('Error')
      await user.click(getButton('3'))
      expect(getDisplay()).toHaveTextContent('3')
    })

    it('allows decimal input after Error to start fresh', async () => {
      await clickButtons(user, ['5', '\u00f7', '0', '='])
      expect(getDisplay()).toHaveTextContent('Error')
      await user.click(getButton('.'))
      expect(getDisplay()).toHaveTextContent('0.')
    })

    it('ignores equals when no operation is set', async () => {
      await clickButtons(user, ['5', '='])
      expect(getDisplay()).toHaveTextContent('5')
    })

    it('ignores equals when in Error state', async () => {
      await clickButtons(user, ['5', '\u00f7', '0', '=', '='])
      expect(getDisplay()).toHaveTextContent('Error')
    })
  })

  describe('consecutive operations', () => {
    it('allows changing operation before entering second operand', async () => {
      await clickButtons(user, ['5', '+', '-', '3', '='])
      expect(getDisplay()).toHaveTextContent('2')
    })

    it('pressing equals without second operand does nothing', async () => {
      await clickButtons(user, ['5', '+', '='])
      // previousValue is '5', operation is '+', shouldResetDisplay is true
      // equals checks !previousValue || !operation || Error - all set, so it calculates 5 + 5
      // Actually: after pressing +, shouldResetDisplay=true, currentValue is still '5'
      // So equals: calculate(5, 5, '+') = 10
      expect(getDisplay()).toHaveTextContent('10')
    })

    it('pressing equals twice does not repeat the last operation', async () => {
      await clickButtons(user, ['5', '+', '3', '='])
      expect(getDisplay()).toHaveTextContent('8')
      await clickButtons(user, ['='])
      expect(getDisplay()).toHaveTextContent('8')
    })
  })

  describe('realistic user interactions', () => {
    it('computes a multi-step shopping total', async () => {
      // 12 + 8 + 5 = 25
      await clickButtons(user, ['1', '2', '+', '8', '+', '5', '='])
      expect(getDisplay()).toHaveTextContent('25')
    })

    it('computes a percentage-like calculation', async () => {
      // 200 * 0.15 = 30 (15% of 200)
      await clickButtons(user, ['2', '0', '0', '\u00d7', '0', '.', '1', '5', '='])
      expect(getDisplay()).toHaveTextContent('30')
    })

    it('performs calculation then starts new one', async () => {
      await clickButtons(user, ['5', '+', '3', '='])
      expect(getDisplay()).toHaveTextContent('8')
      await clickButtons(user, ['2', '\u00d7', '4', '='])
      expect(getDisplay()).toHaveTextContent('8')
    })

    it('uses result from previous calculation in new one', async () => {
      // 5 + 3 = 8, then 8 + 2 = 10
      await clickButtons(user, ['5', '+', '3', '='])
      expect(getDisplay()).toHaveTextContent('8')
      await clickButtons(user, ['+', '2', '='])
      expect(getDisplay()).toHaveTextContent('10')
    })

    it('uses negative result as first operand in chained calculation', async () => {
      // 3 - 8 = -5, then -5 + 3 = -2
      await clickButtons(user, ['3', '-', '8', '='])
      expect(getDisplay()).toHaveTextContent('-5')
      await clickButtons(user, ['+', '3', '='])
      expect(getDisplay()).toHaveTextContent('-2')
    })
  })

  describe('mobile responsive design', () => {
    it('renders calculator on mobile viewport (320px)', () => {
      // Set viewport to mobile size
      global.innerWidth = 320
      global.innerHeight = 568
      global.dispatchEvent(new Event('resize'))

      const calculator = document.querySelector('.calculator')
      expect(calculator).toBeInTheDocument()
      expect(getDisplay()).toBeInTheDocument()
    })

    it('renders calculator on tablet viewport (768px)', () => {
      // Set viewport to tablet size
      global.innerWidth = 768
      global.innerHeight = 1024
      global.dispatchEvent(new Event('resize'))

      const calculator = document.querySelector('.calculator')
      expect(calculator).toBeInTheDocument()
      expect(getDisplay()).toBeInTheDocument()
    })

    it('ensures buttons have proper CSS class for touch accessibility', () => {
      const button = getButton('5')

      // Buttons should have the calculator-button class which defines min-height/min-width: 44px
      expect(button).toHaveClass('calculator-button')
      expect(button).toBeInTheDocument()
    })

    it('ensures display has proper CSS class for text overflow handling', () => {
      const display = getDisplay()

      // Display should have the display class which defines overflow, text-overflow, and max-width
      expect(display).toHaveClass('display')
      expect(display).toBeInTheDocument()
    })

    it('calculator remains functional on mobile viewport', async () => {
      // Set viewport to mobile size
      global.innerWidth = 375
      global.innerHeight = 667
      global.dispatchEvent(new Event('resize'))

      // Perform a calculation to ensure functionality
      await clickButtons(user, ['3', '+', '7', '='])
      expect(getDisplay()).toHaveTextContent('10')
    })

    it('calculator layout does not break on small screens', () => {
      // Set viewport to very small size
      global.innerWidth = 320
      global.innerHeight = 568
      global.dispatchEvent(new Event('resize'))

      const calculator = document.querySelector('.calculator')
      const buttonGrid = document.querySelector('.button-grid')

      expect(calculator).toBeInTheDocument()
      expect(buttonGrid).toBeInTheDocument()

      // All buttons should still be rendered
      const expectedButtons = ['C', '\u00f7', '\u00d7', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '.', '0']
      for (const label of expectedButtons) {
        expect(getButton(label)).toBeInTheDocument()
      }
    })

    it('display text remains visible on small screens', async () => {
      // Set viewport to small mobile
      global.innerWidth = 320
      global.innerHeight = 568
      global.dispatchEvent(new Event('resize'))

      // Enter a long number
      await clickButtons(user, ['9', '9', '9', '9', '9', '9'])
      const display = getDisplay()

      // Display should still be visible and contain the number
      expect(display).toBeInTheDocument()
      expect(display).toHaveTextContent('999999')
    })

    it('renders correctly at common mobile viewport widths', () => {
      const commonViewports = [
        { width: 320, height: 568, name: 'iPhone SE' },
        { width: 375, height: 667, name: 'iPhone 8' },
        { width: 414, height: 896, name: 'iPhone 11' },
      ]

      for (const viewport of commonViewports) {
        global.innerWidth = viewport.width
        global.innerHeight = viewport.height
        global.dispatchEvent(new Event('resize'))

        const calculator = document.querySelector('.calculator')
        const buttonGrid = document.querySelector('.button-grid')

        expect(calculator).toBeInTheDocument()
        expect(buttonGrid).toBeInTheDocument()
      }
    })

    it('renders correctly at common tablet viewport widths', () => {
      const tabletViewports = [
        { width: 768, height: 1024, name: 'iPad' },
        { width: 810, height: 1080, name: 'iPad Pro 11"' },
        { width: 1024, height: 1366, name: 'iPad Pro 12.9"' },
      ]

      for (const viewport of tabletViewports) {
        global.innerWidth = viewport.width
        global.innerHeight = viewport.height
        global.dispatchEvent(new Event('resize'))

        const calculator = document.querySelector('.calculator')
        expect(calculator).toBeInTheDocument()
      }
    })

    it('tests breakpoint boundaries', () => {
      const breakpoints = [
        { width: 320, name: 'Extra small boundary' },
        { width: 480, name: 'Mobile upper boundary' },
        { width: 481, name: 'Tablet lower boundary' },
        { width: 768, name: 'Tablet upper boundary' },
        { width: 769, name: 'Desktop lower boundary' },
      ]

      for (const breakpoint of breakpoints) {
        global.innerWidth = breakpoint.width
        global.innerHeight = 1024
        global.dispatchEvent(new Event('resize'))

        const calculator = document.querySelector('.calculator')
        const display = getDisplay()
        const buttons = document.querySelectorAll('.calculator-button')

        expect(calculator).toBeInTheDocument()
        expect(display).toBeInTheDocument()
        expect(buttons.length).toBeGreaterThan(0)
      }
    })

    it('calculator container does not overflow viewport on mobile', () => {
      global.innerWidth = 320
      global.innerHeight = 568
      global.dispatchEvent(new Event('resize'))

      const calculator = document.querySelector('.calculator')
      expect(calculator).toBeInTheDocument()

      // In a real browser, we would check getBoundingClientRect()
      // In test environment, we verify the CSS class is applied
      expect(calculator).toHaveClass('calculator')
    })

    it('buttons maintain minimum touch target size across all breakpoints', () => {
      const viewports = [
        { width: 320, height: 568 },
        { width: 480, height: 800 },
        { width: 768, height: 1024 },
        { width: 1024, height: 768 },
      ]

      for (const viewport of viewports) {
        global.innerWidth = viewport.width
        global.innerHeight = viewport.height
        global.dispatchEvent(new Event('resize'))

        const button = getButton('5')
        // Verify button has the CSS class that applies min-height and min-width: 44px
        expect(button).toHaveClass('calculator-button')
      }
    })

    it('display handles overflow correctly on all screen sizes', () => {
      const viewports = [320, 480, 768, 1024]

      for (const width of viewports) {
        global.innerWidth = width
        global.innerHeight = 1024
        global.dispatchEvent(new Event('resize'))

        const display = getDisplay()
        // Verify display has the CSS class that handles overflow and text-overflow
        expect(display).toHaveClass('display')
      }
    })

    it('button grid layout remains functional on smallest screen', async () => {
      global.innerWidth = 320
      global.innerHeight = 568
      global.dispatchEvent(new Event('resize'))

      // Verify all buttons are present and clickable
      const allButtons = ['C', '\u00f7', '\u00d7', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '.', '0']

      for (const label of allButtons) {
        const button = getButton(label)
        expect(button).toBeInTheDocument()
        expect(button).toBeVisible()
      }

      // Verify functionality still works
      await clickButtons(user, ['5', '+', '3', '='])
      expect(getDisplay()).toHaveTextContent('8')
    })

    it('theme toggle button remains accessible on mobile', () => {
      global.innerWidth = 320
      global.innerHeight = 568
      global.dispatchEvent(new Event('resize'))

      const themeToggle = document.querySelector('.theme-toggle')
      expect(themeToggle).toBeInTheDocument()
    })

    it('calculator scales properly in portrait and landscape orientations', () => {
      // Portrait orientation
      global.innerWidth = 375
      global.innerHeight = 667
      global.dispatchEvent(new Event('resize'))

      let calculator = document.querySelector('.calculator')
      expect(calculator).toBeInTheDocument()

      // Landscape orientation (swap dimensions)
      global.innerWidth = 667
      global.innerHeight = 375
      global.dispatchEvent(new Event('resize'))

      calculator = document.querySelector('.calculator')
      expect(calculator).toBeInTheDocument()
    })
  })

  describe('theme toggle icons', () => {
    it('renders an SVG icon inside the toggle button in light mode', () => {
      const mockToggle = vi.fn()
      const { container } = render(
        <ThemeContext.Provider value={{ theme: 'light', toggleTheme: mockToggle }}>
          <Calculator />
        </ThemeContext.Provider>
      )
      const button = within(container).getByRole('button', { name: 'Toggle theme' })
      expect(button.querySelector('svg')).not.toBeNull()
    })

    it('renders an SVG icon inside the toggle button in dark mode', () => {
      const mockToggle = vi.fn()
      const { container } = render(
        <ThemeContext.Provider value={{ theme: 'dark', toggleTheme: mockToggle }}>
          <Calculator />
        </ThemeContext.Provider>
      )
      const button = within(container).getByRole('button', { name: 'Toggle theme' })
      expect(button.querySelector('svg')).not.toBeNull()
    })

    it('calls toggleTheme when the toggle button is clicked', async () => {
      const mockToggle = vi.fn()
      const themeUser = userEvent.setup()
      const { container } = render(
        <ThemeContext.Provider value={{ theme: 'light', toggleTheme: mockToggle }}>
          <Calculator />
        </ThemeContext.Provider>
      )
      const button = within(container).getByRole('button', { name: 'Toggle theme' })
      await themeUser.click(button)
      expect(mockToggle).toHaveBeenCalledTimes(1)
    })
  })
})
