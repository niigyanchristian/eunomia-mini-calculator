import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Calculator } from './Calculator'

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
  })
})
