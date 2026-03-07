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

  const calculate = (left: number, right: number, op: string): string => {
    switch (op) {
      case '+':
        return String(left + right)
      case '-':
        return String(left - right)
      case '\u00d7':
        return String(left * right)
      case '\u00f7':
        if (right === 0) return 'Error'
        return String(left / right)
      default:
        return String(right)
    }
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
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <Display value={currentValue} />
      <div className="button-grid">
        {buttons.map((label) => (
          <Button
            key={label}
            label={label}
            onClick={() => handleButtonClick(label)}
          />
        ))}
      </div>
    </div>
  )
}
