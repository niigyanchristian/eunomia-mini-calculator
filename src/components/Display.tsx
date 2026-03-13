import { useMemo } from 'react'
import './Display.css'

interface DisplayProps {
  value: string | number
}

export function Display({ value }: DisplayProps) {
  const displayValue = String(value)

  const dynamicFontSize = useMemo(() => {
    const length = displayValue.length
    if (length <= 8) return undefined
    if (length <= 12) return '1.5rem'
    if (length <= 16) return '1.2rem'
    return '1rem'
  }, [displayValue])

  return (
    <div
      className="display"
      style={dynamicFontSize ? { fontSize: dynamicFontSize } : undefined}
    >
      {displayValue}
    </div>
  )
}
