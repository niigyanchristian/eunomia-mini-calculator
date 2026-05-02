import './About.css'

interface AboutProps {
  onBack: () => void
}

export function About({ onBack }: AboutProps) {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1 className="about-title">About</h1>
        <p className="about-text">
          Crunchy Number Muncher is a lightweight calculator app built with React and TypeScript. It supports basic arithmetic operations with a clean, accessible interface.
        </p>
        <button className="about-back" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  )
}
