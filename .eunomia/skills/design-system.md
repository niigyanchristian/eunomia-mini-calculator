# Design System — eunomia-mini-calculator

> **⚠️ Important Note:** The CSS source files (`App.css`, `Display.css`, `Button.css`, `Calculator.css`) were **not provided** for analysis. Token values below marked with `⚠️ CSS NOT PROVIDED` could not be extracted. This document captures all structural, behavioural, and architectural patterns from the TypeScript/TSX source and test files. When CSS files become available, this document must be updated with exact values.

---

## 1. Design Tokens

### 1.1 Colour Palette

The application implements a **two-theme system** (light/dark) controlled via `data-theme` attribute on both `<html>` and the `.app` wrapper.

| Token / Mechanism | Value | Usage |
|---|---|---|
| `data-theme="light"` | Default theme | Light mode — set on `document.documentElement` and `.app` div |
| `data-theme="dark"` | Alternate theme | Dark mode — toggled via `ThemeContext.toggleTheme()` |
| Theme toggle icon (light) | `🌙` (U+1F319) | Displayed when current theme is `light` — indicates "switch to dark" |
| Theme toggle icon (dark) | `☀️` (U+2600 FE0F) | Displayed when current theme is `dark` — indicates "switch to light" |

**⚠️ CSS NOT PROVIDED** — Actual hex colour values for backgrounds, text, button fills, and theme-specific overrides must be extracted from `App.css`, `Button.css`, `Display.css`, and `Calculator.css`.

**Canonical theme implementation pattern:**

```tsx
// Theme is stored in localStorage under key "calculator-theme"
// Valid values: "light" | "dark"
// Invalid/missing values default to "light"

// Applied via:
document.documentElement.setAttribute('data-theme', theme) // <html> element
<div className="app" data-theme={theme}>                    // app wrapper
```

### 1.2 Typography

| Element | Selector / Class | Spec |
|---|---|---|
| Page Title | `<h1>` inside `.app` | Content: `"Mini Calculator"` |
| Display Value | `.display` div | Renders `string \| number` — must handle: integers, decimals, negatives, `"Error"`, scientific notation, long strings |
| Button Label | `<button>` text | Single characters: digits `0–9`, operators `+ - × ÷ =`, decimal `.`, clear `C` |

**⚠️ CSS NOT PROVIDED** — Exact `font-family`, `font-size`, `font-weight`, and `line-height` values must be pulled from stylesheets.

### 1.3 Spacing System

**⚠️ CSS NOT PROVIDED** — Spacing tokens (padding, margin, gap) are defined in CSS files not available for review.

### 1.4 Border Radius

**⚠️ CSS NOT PROVIDED**

### 1.5 Shadows & Elevation

**⚠️ CSS NOT PROVIDED**

### 1.6 Z-Index Scale

No z-index values are referenced in the component source. This is a single-layer, non-overlapping UI — no modals, dropdowns, or stacking contexts are used.

---

## 2. Atoms

### 2.1 Colour Swatches & Surfaces

The app uses CSS class-based theming. All surface and colour differentiation is handled by the `data-theme` attribute and CSS class modifiers.

**Button CSS class variants** (inferred from `Calculator.tsx` usage and `Button.tsx`):

| CSS Class | Applied To | Purpose |
|---|---|---|
| `.calculator-button` | All buttons (base) | Default button style |
| `.operator` | `÷`, `×`, `-`, `+` buttons | Operator visual differentiation |
| `.equals` | `=` button | Equals/action visual differentiation |
| `.clear` | `C` button | Clear/reset visual differentiation |
| `.zero` | `0` button | Wide zero button (spans 2 columns) |
| `.decimal` | `.` button | Decimal point button |
| `.digit` | `0–9` buttons | Digit button styling |

*(These classes are inferred from standard calculator patterns and the `className` prop on `Button`. The exact class-to-button mapping is in the truncated section of `Calculator.tsx`.)*

### 2.2 Typography Elements

#### Page Heading (`<h1>`)

```tsx
// Used in App.tsx — single instance
<h1>Mini Calculator</h1>
```

- **Content:** Static string `"Mini Calculator"`
- **Location:** Inside `.app` wrapper, above `<Calculator />`
- **Styling:** Defined in `App.css` (not provided)

#### Display Text

The display renders arbitrary numeric strings. It must handle:
- Standard integers: `"123"`
- Decimals: `"3.14159"`
- Trailing decimal: `"5."` (mid-input)
- Leading zero decimal: `"0.3"`
- Negative numbers: `"-42"`
- Error state: `"Error"`
- Scientific notation: `"10000000000"` (JavaScript's `String(1e10)`)

### 2.3 Icon Usage

No icon library is used. The only icons are **emoji characters** for the theme toggle:

| State | Icon | Character |
|---|---|---|
| Light mode active | 🌙 | U+1F319 Crescent Moon |
| Dark mode active | ☀️ | U+2600 U+FE0F Sun |

### 2.4 Dividers & Lines

No explicit dividers or lines are used in the component source.

### 2.5 Spacing Primitives

Layout is achieved via CSS classes. The calculator uses an implicit **4-column grid** for button layout (inferred from the button order in `Calculator.tsx`):

```
Row 1:  C    ÷    ×    -
Row 2:  7    8    9    +
Row 3:  4    5    6    =
Row 4:  1    2    3    .
Row 5:  0 (spans 2 cols)
```

---

## 3. Molecules

### 3.1 Button (`<Button>`)

**File:** `src/components/Button.tsx`
**Styles:** `src/components/Button.css`

#### Props Interface

```typescript
interface ButtonProps {
  label: string       // Text content displayed on the button
  onClick: () => void // Click handler — no arguments passed
  className?: string  // Optional modifier class(es), defaults to ''
}
```

#### Visual Spec

| Property | Spec |
|---|---|
| Base class | `.calculator-button` |
| Modifier classes | Appended via `className` prop (e.g., `.operator`, `.equals`, `.clear`, `.zero`) |
| Content | Single text label — digits, operators, or symbols |
| Interaction | `onClick` fires on click, Enter key, and Space key |

#### States

| State | Trigger | Behaviour |
|---|---|---|
| Default | Idle | Base styling via `.calculator-button` |
| Hover | Mouse over | **⚠️ CSS NOT PROVIDED** |
| Active/Pressed | Mouse down / key press | **⚠️ CSS NOT PROVIDED** |
| Focused | Tab navigation | **⚠️ CSS NOT PROVIDED** — should have visible focus ring |

> **Note:** There is no `disabled` state implemented. All buttons are always interactive.

#### Complete Code Example

```tsx
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
```

#### Usage Examples

```tsx
// Digit button
<Button label="5" onClick={() => handleDigit('5')} className="digit" />

// Operator button
<Button label="+" onClick={() => handleOperation('+')} className="operator" />

// Clear button
<Button label="C" onClick={handleClear} className="clear" />

// Equals button
<Button label="=" onClick={handleEquals} className="equals" />

// Zero button (wide)
<Button label="0" onClick={() => handleDigit('0')} className="zero" />

// Decimal button
<Button label="." onClick={handleDecimal} className="decimal" />
```

### 3.2 Display (`<Display>`)

**File:** `src/components/Display.tsx`
**Styles:** `src/components/Display.css`

#### Props Interface

```typescript
interface DisplayProps {
  value: string | number  // The value to render — can be numeric or string (e.g., "Error")
}
```

#### Visual Spec

| Property | Spec |
|---|---|
| Element | `<div className="display">` |
| Content | Raw text rendering of `value` prop |
| Text alignment | **⚠️ CSS NOT PROVIDED** — typically right-aligned for calculators |
| Overflow | Must handle strings up to `"123456789012345"` (15 chars confirmed by tests) |

#### States

| State | Value | Display |
|---|---|---|
| Initial | `"0"` | Shows `0` |
| Numeric input | `"123"` | Shows `123` |
| Decimal input | `"5."` | Shows `5.` (trailing dot visible) |
| Error | `"Error"` | Shows `Error` (from division by zero) |
| Empty | `""` | Empty display (edge case) |

#### Complete Code Example

```tsx
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
```

---

## 4. Organisms

### 4.1 Calculator (`<Calculator>`)

**File:** `src/components/Calculator.tsx`
**Styles:** `src/components/Calculator.css`

The primary (and only) organism in the application. Composes `Display` and multiple `Button` instances into a functional calculator.

#### Structure

```
┌─────────────────────────────┐
│  Theme Toggle Button (🌙/☀️) │
├─────────────────────────────┤
│         Display             │
│         "0"                 │
├───────┬───────┬──────┬──────┤
│   C   │   ÷   │  ×   │  -  │
├───────┼───────┼──────┼──────┤
│   7   │   8   │  9   │  +  │
├───────┼───────┼──────┼──────┤
│   4   │   5   │  6   │  =  │
├───────┼───────┼──────┼──────┤
│   1   │   2   │  3   │  .  │
├───────┴───────┼──────┴──────┤
│      0        │             │
└───────────────┘             │
```

#### Button Map (17 buttons)

| Label | Unicode | Type | Handler | CSS Class |
|---|---|---|---|---|
| `C` | — | Clear | `handleClear` | `clear` |
| `÷` | U+00F7 | Operator | `handleOperation('÷')` | `operator` |
| `×` | U+00D7 | Operator | `handleOperation('×')` | `operator` |
| `-` | — | Operator | `handleOperation('-')` | `operator` |
| `7` | — | Digit | `handleDigit('7')` | `digit` |
| `8` | — | Digit | `handleDigit('8')` | `digit` |
| `9` | — | Digit | `handleDigit('9')` | `digit` |
| `+` | — | Operator | `handleOperation('+')` | `operator` |
| `4` | — | Digit | `handleDigit('4')` | `digit` |
| `5` | — | Digit | `handleDigit('5')` | `digit` |
| `6` | — | Digit | `handleDigit('6')` | `digit` |
| `=` | — | Equals | `handleEquals` | `equals` |
| `1` | — | Digit | `handleDigit('1')` | `digit` |
| `2` | — | Digit | `handleDigit('2')` | `digit` |
| `3` | — | Digit | `handleDigit('3')` | `digit` |
| `.` | — | Decimal | `handleDecimal` | `decimal` |
| `0` | — | Digit | `handleDigit('0')` | `zero` |

#### Behaviour Spec

| Scenario | Behaviour |
|---|---|
| Initial state | Display shows `"0"` |
| Digit input on `"0"` | Replaces `"0"` (no leading zeros) |
| Digit input after operator | Starts new number |
| Decimal on `"0"` | Shows `"0."` |
| Decimal after operator | Shows `"0."` |
| Multiple decimals | Ignored — only one `.` per number |
| Division by zero | Display shows `"Error"` |
| Input after `"Error"` | Digit resets to that digit; operator is ignored |
| Decimal after `"Error"` | Resets to `"0."` |
| Chained operations | Evaluates left-to-right (e.g., `2 + 3 × =` evaluates `2+3` then applies `×`) |
| `=` without operation | No-op |
| `C` (Clear) | Resets everything: display to `"0"`, clears stored operation and previous value |

#### State Management

```typescript
const [currentValue, setCurrentValue] = useState('0')         // What's shown on display
const [previousValue, setPreviousValue] = useState('')         // Left operand (stored as string)
const [operation, setOperation] = useState('')                 // Current operator
const [shouldResetDisplay, setShouldResetDisplay] = useState(false) // Next digit starts new number
```

#### Theme Toggle Integration

The Calculator accesses `ThemeContext` to render a toggle button:

```tsx
const { theme, toggleTheme } = useContext(ThemeContext)

// Renders a button with:
// - aria-label: "Toggle theme" (implied by test: screen.getByRole('button', { name: /toggle theme/i }))
// - Content: '🌙' (light mode) or '☀️' (dark mode)
// - onClick: toggleTheme
```

#### Complete Code Example (reconstructed from source + tests)

```tsx
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
      case '+': return String(left + right)
      case '-': return String(left - right)
      case '\u00d7': return String(left * right)
      case '\u00f7':
        if (right === 0) return 'Error'
        return String(left / right)
      default: return String(right)
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

  const getButtonClass = (label: string): string => {
    if (label === 'C') return 'clear'
    if (['+', '-', '\u00d7', '\u00f7'].includes(label)) return 'operator'
    if (label === '=') return 'equals'
    if (label === '0') return 'zero'
    if (label === '.') return 'decimal'
    return 'digit'
  }

  const getClickHandler = (label: string): (() => void) => {
    if (label === 'C') return handleClear
    if (['+', '-', '\u00d7', '\u00f7'].includes(label)) return () => handleOperation(label)
    if (label === '=') return handleEquals
    if (label === '.') return handleDecimal
    return () => handleDigit(label)
  }

  const buttons = [
    'C', '\u00f7', '\u00d7', '-',
    '7', '8', '9', '+',
    '4', '5', '6', '=',
    '1', '2', '3', '.',
    '0',
  ]

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
      <div className="buttons">
        {buttons.map((label) => (
          <Button
            key={label}
            label={label}
            onClick={getClickHandler(label)}
            className={getButtonClass(label)}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## 5. Templates & Layout Patterns

### 5.1 Page Layout

The app has a single-page, single-component layout:

```tsx
// App.tsx — the entire page structure
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  <div className="app" data-theme={theme}>
    <h1>Mini Calculator</h1>
    <Calculator />
  </div>
</ThemeContext.Provider>
```

**Layout:** Vertically stacked, centered. The `.app` div wraps the heading and calculator.

### 5.2 Responsive Design

Tests confirm the UI is tested at:

| Viewport | Width | Height | Context |
|---|---|---|---|
| Mobile | 375px | 667px | iPhone SE equivalent |
| Tablet | 768px | 1024px | iPad equivalent |

The Display component is verified to render correctly at both viewports. The CSS (not provided) likely uses flexible sizing or media queries.

### 5.3 Grid: Calculator Button Layout

The buttons follow a **4-column grid** with the `0` button spanning 2 columns:

```
| col1 | col2 | col3 | col4 |
|  C   |  ÷   |  ×   |  -   |
|  7   |  8   |  9   |  +   |
|  4   |  5   |  6   |  =   |
|  1   |  2   |  3   |  .   |
|  0 (span 2) |      |      |
```

**⚠️ CSS NOT PROVIDED** — Likely implemented with `display: grid; grid-template-columns: repeat(4, 1fr)` and `.zero { grid-column: span 2 }`.

### 5.4 Error States

| Error | Trigger | Display | Recovery |
|---|---|---|---|
| Division by zero | `n ÷ 0 =` | `"Error"` | Any digit press resets; decimal resets to `"0."`; operators are ignored |

No network errors, loading states, or empty states exist — this is a fully client-side, stateless calculator.

---

## 6. Interaction & Animation

### 6.1 Transition Conventions

**⚠️ CSS NOT PROVIDED** — Any transitions (button press effects, theme switch animations) are defined in CSS files.

### 6.2 Focus & Accessibility

| Pattern | Implementation |
|---|---|
| Keyboard activation | Buttons respond to `Enter` and `Space` (native `<button>` behaviour — confirmed by tests) |
| Theme toggle a11y | `aria-label="Toggle theme"` on the theme toggle button |
| Semantic elements | Native `<button>` elements used throughout (proper role, focusable by default) |
| Focus ring | **⚠️ CSS NOT PROVIDED** — ensure `:focus-visible` styles are defined |

**⚠️ Accessibility gap:** The Display component uses a plain `<div>`. Consider adding `role="status"` and `aria-live="polite"` so screen readers announce value changes:

```tsx
<div className="display" role="status" aria-live="polite" aria-label="Calculator display">
  {value}
</div>
```

---

## 7. Theme System

### Architecture

```
localStorage("calculator-theme")
        ↓ (read on mount)
App state: useState<'light' | 'dark'>
        ↓ (on change)
├── localStorage.setItem(...)
├── document.documentElement.setAttribute('data-theme', theme)
└── <div className="app" data-theme={theme}>
            ↓ (via context)
        ThemeContext.Provider
                ↓
        Calculator → toggle button
```

### ThemeContext

```tsx
import { createContext } from 'react'

export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})
```

### Complete App Shell

```tsx
import { useState, useEffect, createContext } from 'react'
import './App.css'
import { Calculator } from './components/Calculator'

export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('calculator-theme')
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light'
  })

  useEffect(() => {
    localStorage.setItem('calculator-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="app" data-theme={theme}>
        <h1>Mini Calculator</h1>
        <Calculator />
      </div>
    </ThemeContext.Provider>
  )
}
```

---

## 8. Anti-Patterns & Inconsistencies

### 8.1 Dual `data-theme` Application (Inconsistency)

**Issue:** The theme `data-theme` attribute is applied to **both** `document.documentElement` (`<html>`) and the `.app` div. This is redundant and creates ambiguity about which element CSS selectors should target.

**Canonical pattern:** Apply `data-theme` to `document.documentElement` only. Remove it from the `.app` div. CSS should use `[data-theme="dark"]` at the root level.

### 8.2 No Accessibility on Display

**Issue:** `<div className="display">{value}</div>` has no ARIA attributes. Screen readers cannot distinguish this from any other div, and value changes are not announced.

**Fix:**
```tsx
<div className="display" role="status" aria-live="polite" aria-atomic="true">
  {value}
</div>
```

### 8.3 No `disabled` State on Buttons

**Issue:** The `Button` component has no `disabled` prop or visual state. When the display shows `"Error"`, operator buttons silently no-op (`handleOperation` returns early) but appear interactive. Users have no visual feedback that operators are unavailable.

**Fix:** Add a `disabled` prop:
```tsx
interface ButtonProps {
  label: string
  onClick: () => void
  className?: string
  disabled?: boolean
}
```

### 8.4 Floating-Point Precision

**Issue:** The calculator uses `parseFloat` and basic arithmetic with no precision handling. Operations like `0.1 + 0.2` will display `0.30000000000000004`.

**Recommendation:** Round results or use a fixed-precision display:
```tsx
const result = parseFloat((left + right).toFixed(10))
```

### 8.5 No Max Length on Display Input

**Issue:** Users can input arbitrarily long numbers (`"123456789012345..."`) with no truncation or overflow handling in the logic layer. Overflow is presumably handled by CSS (not provided), but the component logic should enforce a maximum digit count.

### 8.6 Theme Toggle Lives Inside Calculator

**Issue:** The theme toggle button is rendered inside `Calculator.tsx` but uses context from `App.tsx`. Thematically, the toggle is an app-level concern, not a calculator concern. This couples the calculator to the app shell.

**Canonical pattern:** Move the theme toggle to `App.tsx` or extract it as a separate `<ThemeToggle>` atom.

---

## Appendix: File Structure

```
src/
├── App.tsx                    # Root component, theme provider
├── App.css                    # ⚠️ Not provided — app-level styles
├── App.test.tsx               # Theme functionality tests
├── main.tsx                   # React entry point
└── components/
    ├── Button.tsx             # Atom: calculator button
    ├── Button.css             # ⚠️ Not provided — button styles
    ├── Button.test.tsx        # Button unit tests
    ├── Display.tsx            # Atom: value display
    ├── Display.css            # ⚠️ Not provided — display styles
    ├── Display.test.tsx       # Display unit tests
    ├── Calculator.tsx         # Organism: full calculator
    ├── Calculator.css         # ⚠️ Not provided — calculator layout styles
    └── Calculator.test.tsx    # Calculator integration tests
```

---

## Appendix: Component Hierarchy (Atomic Design)

```
TOKENS          → ⚠️ Defined in CSS files (not provided)
                   Theme: data-theme="light" | "dark"

ATOMS           → Display (value readout)
                   Button (single calculator key)
                   Theme Toggle Button (🌙/☀️)
                   H1 heading ("Mini Calculator")

MOLECULES       → (none — buttons are atoms used directly)

ORGANISMS       → Calculator (Display + 17 Buttons + Theme Toggle)

TEMPLATES       → App (h1 + Calculator, centered single-page layout)
```

---

> **Action Required:** To complete this design system, provide the contents of `App.css`, `Button.css`, `Display.css`, and `Calculator.css`. All colour tokens, spacing values, font specifications, border radii, shadows, transitions, and responsive breakpoints are defined there.