import './Button.css'

interface ButtonProps {
  label: string
  onClick: () => void
}

export function Button({ label, onClick }: ButtonProps) {
  return (
    <button className="calculator-button" onClick={onClick}>
      {label}
    </button>
  )
}
