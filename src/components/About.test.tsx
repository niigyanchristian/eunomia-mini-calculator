import { render, screen } from '@testing-library/react'
import { About } from './About'

describe('About', () => {
  it('renders the About heading', () => {
    render(<About />)
    expect(screen.getByRole('heading', { name: /about/i })).toBeInTheDocument()
  })

  it('renders a descriptive paragraph about the calculator', () => {
    render(<About />)
    expect(screen.getByText(/crunchy number muncher/i)).toBeInTheDocument()
  })

  it('renders paragraph with calculator description text', () => {
    render(<About />)
    const paragraph = document.querySelector('.about-description')
    expect(paragraph).toBeInTheDocument()
    expect(paragraph?.textContent).toMatch(/react/i)
  })
})
