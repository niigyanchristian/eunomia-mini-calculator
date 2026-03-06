import './Display.css'

interface DisplayProps {
  value: string | number
}

export function Display({ value }: DisplayProps) {
  return (
    <div className="display">
      {value}
    </div>
  )
}
