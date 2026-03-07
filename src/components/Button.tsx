import './Button.css'

interface ButtonProps {
  label: string
  onClick: () => void
  className?: string
}

export function Button({ label, onClick, className = '' }: ButtonProps) {
  const buttonClass = `calculator-button${className ? ' ' + className : ''}`
  return (
    <button className={buttonClass} onClick={onClick}>
      {label}
    </button>
  )
}
