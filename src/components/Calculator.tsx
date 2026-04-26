import { useState, useContext } from 'react'
import { Display } from './Display'
import { Button } from './Button'
import { ThemeContext } from '../App'
import './Calculator.css'

export function Calculator() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [currentValue, setCurrentValue] = useState('0')
  const [previousValue, setPreviousValue] = useState('')
  const [operation, setOperation] = useState('')
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false)

  const handleDigit = (digit: string) => {
    if (currentValue === 'Error') {
      setCurrentValue(digit)
      return
    }
    if (shouldResetDisplay) {
      setCurrentValue(digit)
      setShouldResetDisplay(false)
      return
    }
    if (currentValue === '0' && digit !== '.') {
      setCurrentValue(digit)
    } else {
      setCurrentValue(currentValue + digit)
    }
  }

  const handleDecimal = () => {
    if (currentValue === 'Error') {
      setCurrentValue('0.')
      return
    }
    if (shouldResetDisplay) {
      setCurrentValue('0.')
      setShouldResetDisplay(false)
      return
    }
    if (!currentValue.includes('.')) {
      setCurrentValue(currentValue + '.')
    }
  }

  // Round to specified significant digits to handle IEEE 754 precision
  const roundToPrecision = (num: number, significantDigits: number = 14): number => {
    if (num === 0) return 0
    const magnitude = Math.floor(Math.log10(Math.abs(num))) + 1
    const scale = Math.pow(10, significantDigits - magnitude)
    return Math.round(num * scale) / scale
  }

  // Validate number is within calculator range
  const isInRange = (num: number): boolean => {
    const MAX_VALUE = 9999999999
    return Math.abs(num) <= MAX_VALUE
  }

  // Format number for display, removing unnecessary trailing zeros
  const formatNumber = (num: number): string => {
    // Handle special cases
    if (num === 0) return '0'
    if (!isFinite(num)) return 'Error'

    // Convert to string, avoiding scientific notation for numbers within our range
    const str = num.toString()

    // If toString used scientific notation, avoid it for display
    if (str.includes('e')) {
      // For numbers we can represent normally, convert back
      if (Math.abs(num) >= 0.000001 && Math.abs(num) <= 9999999999) {
        // Use toFixed with appropriate decimal places
        const decimalPlaces = Math.max(0, Math.min(10, 14 - Math.floor(Math.log10(Math.abs(num))) - 1))
        return parseFloat(num.toFixed(decimalPlaces)).toString()
      }
    }

    return str
  }

  const calculate = (left: number, right: number, op: string): string => {
    let result: number

    switch (op) {
      case '+':
        result = left + right
        break
      case '-':
        result = left - right
        break
      case '\u00d7':
        result = left * right
        break
      case '\u00f7':
        if (right === 0) return 'Error'
        result = left / right
        break
      default:
        return String(right)
    }

    // Round to 14 significant digits (IEEE 754 double precision)
    result = roundToPrecision(result, 14)

    // Validate range
    if (!isInRange(result)) {
      return 'Error'
    }

    return formatNumber(result)
  }

  const handleOperation = (nextOp: string) => {
    if (currentValue === 'Error') return

    if (previousValue && operation && !shouldResetDisplay) {
      const result = calculate(parseFloat(previousValue), parseFloat(currentValue), operation)
      setPreviousValue(result)
      setCurrentValue(result)
    } else {
      setPreviousValue(currentValue)
    }

    setOperation(nextOp)
    setShouldResetDisplay(true)
  }

  const handleEquals = () => {
    if (!previousValue || !operation || currentValue === 'Error') return

    const result = calculate(parseFloat(previousValue), parseFloat(currentValue), operation)
    setCurrentValue(result)
    setPreviousValue('')
    setOperation('')
    setShouldResetDisplay(true)
  }

  const handleClear = () => {
    setCurrentValue('0')
    setPreviousValue('')
    setOperation('')
    setShouldResetDisplay(false)
  }

  const buttons = [
    'C', '\u00f7', '\u00d7', '-',
    '7', '8', '9', '+',
    '4', '5', '6', '=',
    '1', '2', '3', '.',
    '0',
  ]

  const getButtonClass = (label: string): string => {
    if (label === '\u00f7' || label === '\u00d7' || label === '-' || label === '+') {
      return 'operator-button'
    }
    if (label === 'C') {
      return 'clear-button'
    }
    if (label === '=') {
      return 'equals-button'
    }
    return ''
  }

  const handleButtonClick = (label: string) => {
    if (label >= '0' && label <= '9') {
      handleDigit(label)
    } else if (label === '.') {
      handleDecimal()
    } else if (label === '=') {
      handleEquals()
    } else if (label === 'C') {
      handleClear()
    } else {
      handleOperation(label)
    }
  }

  return (
    <div className="calculator">
      <button
        className="theme-toggle"
        aria-label="Toggle theme"
        onClick={toggleTheme}
      >
        {theme === 'light' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="lucide-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="lucide-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </button>
      <Display value={currentValue} />
      <div className="button-grid">
        {buttons.map((label) => (
          <Button
            key={label}
            label={label}
            onClick={() => handleButtonClick(label)}
            className={[label === '0' ? 'wide' : '', getButtonClass(label)].filter(Boolean).join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
