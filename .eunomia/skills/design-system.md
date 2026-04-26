# Design System — eunomia-mini-calculator

> **⚠️ Note:** The CSS source files (`Display.css`, `Button.css`, `Calculator.css`, `App.css`) were not provided in the codebase sample. Token values below are inferred from component structure, class naming conventions, and test expectations. Where a value cannot be confirmed from source, it is marked with `⚠️ VERIFY` — an implementer must cross-reference the actual CSS files before treating those values as canonical.

---

## 1. Design Tokens

### 1.1 Colour Palette

The application uses a **light/dark theme system** driven by the `data-theme` attribute on both the root `<div className="app">` and `document.documentElement`.

| Token / Selector | Context | Usage | Notes |
|---|---|---|---|
| `[data-theme="light"]` | Default theme | Light background, dark text | Set on `.app` div AND `<html>` |
| `[data-theme="dark"]` | Alternate theme | Dark background, light text | Toggled via `ThemeContext.toggleTheme()` |

**Theme switching mechanism (canonical):**
```tsx
// Theme is stored in localStorage under key "calculator-theme"
// Valid values: "light" | "dark"
// Invalid/missing values default to "light"
document.documentElement.setAttribute('data-theme', theme) // applied to <html>
// Also applied as prop: <div className="app" data-theme={theme}>
```

**⚠️ VERIFY the following from `App.css`, `Calculator.css`, `Button.css`, `Display.css`:**
- Background colour for light theme surface
- Background colour for dark theme surface
- Text colour for each theme
- Button background colours per variant (digit, operator, clear, equals)
- Display background colour
- Accent / operator colour

### 1.2 Typography

| Element | Selector / Component | Details |
|---|---|---|
| Page Title | `<h1>` in `App.tsx` | Content: `"Chris's Calculator"` |
| Display Value | `.display` div | Renders `string \| number`; must handle long numbers, scientific notation, "Error" state |

**⚠️ VERIFY from CSS files:**
- `font-family` (likely system or monospace for display)
- `font-size` for `<h1>`, `.display`, `.calculator-button`
- `font-weight` values
- `line-height` values

### 1.3 Spacing System

**⚠️ VERIFY from CSS files.** The layout is a calculator grid (4 columns implied by the button array structure):

```
Row 1: C    ÷    ×    -
Row 2: 7    8    9    +
Row 3: 4    5    6    =
Row 4: 1    2    3    .
Row 5: 0 (spans multiple columns)
```

### 1.4 Border Radius

**⚠️ VERIFY from CSS files** — likely applied to `.calculator-button`, `.display`, and the calculator container.

### 1.5 Shadows & Elevation

**⚠️ VERIFY from CSS files** — calculator container likely has a box-shadow for elevation.

### 1.6 Z-Index Scale

No z-index layering is evident from the component structure. This is a single-view, non-overlapping layout.

---

## 2. Atoms

### 2.1 Colour Swatches & Surfaces

| Surface | Class / Selector | Usage |
|---|---|---|
| App Background | `.app` | Full-page background behind calculator |
| Calculator Body | `.calculator` (⚠️ VERIFY) | Calculator container surface |
| Display Surface | `.display` | Result/input display area |
| Button Surface | `.calculator-button` | Default button background |
| Operator Button | `.calculator-button.operator` (⚠️ VERIFY class name) | Operator buttons (÷, ×, -, +) |
| Equals Button | `.calculator-button.equals` (⚠️ VERIFY) | Equals button |
| Clear Button | `.calculator-button.clear` (⚠️ VERIFY) | C button |

### 2.2 Typography Elements

**Page Heading (`<h1>`)**
```tsx
// App.tsx — only heading in the application
<h1>Chris's Calculator</h1>
```

**Display Text (`.display`)**
```tsx
// Renders any string or number value
// Must gracefully handle: integers, decimals, negative numbers, "Error", scientific notation, long strings
<div className="display">{value}</div>
```

**Button Label (`.calculator-button`)**
```tsx
// Single character labels: digits 0-9, operators ÷ × - +, decimal ., clear C, equals =
<button className="calculator-button">{label}</button>
```

### 2.3 Icon Usage

| Library | Package | Version |
|---|---|---|
| Lucide React | `lucide-react` | `^0.400.0` |

**Icons used:**

| Icon | Import | Usage | Rendered When |
|---|---|---|---|
| `Moon` | `import { Moon } from 'lucide-react'` | Theme toggle button | Current theme is `"light"` |
| `Sun` | `import { Sun } from 'lucide-react'` | Theme toggle button | Current theme is `"dark"` |

**Theme Toggle Button (from `Calculator.tsx`):**
```tsx
import { Moon, Sun } from 'lucide-react'

// Inside Calculator component:
// The toggle button has aria-label "Toggle theme" (confirmed by test: screen.getByRole('button', { name: /toggle theme/i }))
<button onClick={toggleTheme} aria-label="Toggle theme">
  {theme === 'light' ? <Moon /> : <Sun />}
</button>
```

**Icon conventions:**
- Use Lucide React (`lucide-react`) — do NOT use other icon libraries
- Icons are rendered as inline SVG via Lucide components
- Icons carry the class `lucide-moon` / `lucide-sun` on the `<svg>` element (confirmed by test: `toggleButton.querySelector('svg.lucide-moon')`)

### 2.4 Dividers & Lines

No explicit dividers are used in this application. Visual separation is achieved through background colour contrast between the display and button grid.

### 2.5 Spacing Primitives

**Layout approach:** CSS classes (BEM-ish convention with plain class names). No utility-class framework (no Tailwind, no CSS modules). Each component imports its own `.css` file:

```
Display.tsx  → Display.css
Button.tsx   → Button.css
Calculator.tsx → Calculator.css
App.tsx      → App.css
```

---

## 3. Molecules

### 3.1 Button (`<Button>`)

**File:** `src/components/Button.tsx` + `src/components/Button.css`

**Props:**

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `label` | `string` | ✅ | — | Text displayed on the button |
| `onClick` | `() => void` | ✅ | — | Click handler |
| `className` | `string` | ❌ | `''` | Additional CSS class(es) for variant styling |

**CSS class construction:**
```
Base class: "calculator-button"
With variant: "calculator-button {className}"
```

**Variants (by `className` prop, applied by parent `Calculator`):**

The button array in `Calculator.tsx` maps labels to variant classNames. Based on the button layout:

| Label(s) | Likely `className` | Role |
|---|---|---|
| `0`–`9` | `""` (default) or `"digit"` | Digit input |
| `+`, `-`, `×`, `÷` | `"operator"` (⚠️ VERIFY) | Arithmetic operator |
| `=` | `"equals"` (⚠️ VERIFY) | Execute calculation |
| `C` | `"clear"` (⚠️ VERIFY) | Clear/reset |
| `.` | `""` or `"decimal"` (⚠️ VERIFY) | Decimal point |
| `0` | May span 2 columns (⚠️ VERIFY) | Zero button (wider) |

**States:**
- **Default:** Resting state
- **Hover:** ⚠️ VERIFY from CSS (likely background colour shift)
- **Active/Pressed:** ⚠️ VERIFY from CSS
- **Focus:** Keyboard-accessible — confirmed by tests (Enter and Space key activate the button)
- **Disabled:** Not implemented — no `disabled` prop exists

**Accessibility:**
- Rendered as native `<button>` element (correct semantics)
- Keyboard operable: Enter and Space trigger `onClick` (native button behaviour, confirmed by tests)

**Canonical Code Example:**
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

**Usage:**
```tsx
<Button label="7" onClick={() => handleDigit('7')} />
<Button label="+" onClick={() => handleOperation('+')} className="operator" />
<Button label="=" onClick={handleEquals} className="equals" />
<Button label="C" onClick={handleClear} className="clear" />
```

---

### 3.2 Display (`<Display>`)

**File:** `src/components/Display.tsx` + `src/components/Display.css`

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `value` | `string \| number` | ✅ | The value to display |

**Visual spec:**
- Single `.display` div
- Must handle: integers, decimals, negative numbers, empty string, "Error" text, long numbers, scientific notation
- Text alignment: ⚠️ VERIFY (typically right-aligned for calculators)
- Overflow behaviour for long numbers: ⚠️ VERIFY from CSS (likely `overflow: hidden` or `text-overflow: ellipsis`, or font-size scaling)

**Canonical Code Example:**
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

**Usage:**
```tsx
<Display value="0" />        {/* Initial state */}
<Display value="123.45" />   {/* Number input */}
<Display value="Error" />    {/* Division by zero */}
<Display value={-42} />      {/* Negative result */}
```

---

## 4. Organisms

### 4.1 Calculator (`<Calculator>`)

**File:** `src/components/Calculator.tsx` + `src/components/Calculator.css`

**Structure:**
```
┌──────────────────────────────┐
│ [Theme Toggle]     (top bar) │
├──────────────────────────────┤
│                              │
│         .display             │
│            "0"               │
│                              │
├───────┬───────┬───────┬──────┤
│   C   │   ÷   │   ×   │  -  │
├───────┼───────┼───────┼──────┤
│   7   │   8   │   9   │  +  │
├───────┼───────┼───────┼──────┤
│   4   │   5   │   6   │  =  │
├───────┼───────┼───────┼──────┤
│   1   │   2   │   3   │  .  │
├───────┴───────┼───────┴──────┤
│       0       │              │
└───────────────┴──────────────┘
```

**Button layout (from source — 4-column grid):**
```tsx
const buttons = [
  'C', '÷', '×', '-',
  '7', '8', '9', '+',
  '4', '5', '6', '=',
  '1', '2', '3', '.',
  '0',  // Last row — "0" likely spans 2+ columns
]
```

**State management:**

| State Variable | Type | Initial | Purpose |
|---|---|---|---|
| `currentValue` | `string` | `'0'` | Currently displayed value |
| `previousValue` | `string` | `''` | Left operand stored after operator press |
| `operation` | `string` | `''` | Pending operator (`+`, `-`, `×`, `÷`) |
| `shouldResetDisplay` | `boolean` | `false` | Flag: next digit replaces display |

**Behaviour rules (canonical, extracted from source):**

1. **Digit input:** Replaces `'0'`; appends otherwise. After an operator, resets display first.
2. **Decimal:** Adds `'0.'` if display would start with `.`. Prevents duplicate `.` in same number.
3. **Operators:** If a pending operation exists and user presses another operator, the intermediate result is computed (chaining).
4. **Equals:** Computes `previousValue {operation} currentValue`. Clears `previousValue` and `operation` after.
5. **Division by zero:** Returns `"Error"`. Subsequent digit input clears the error. Operators are blocked during error state.
6. **Clear (C):** Resets all state to initial values.

**Theme toggle (inside Calculator):**
```tsx
const { theme, toggleTheme } = useContext(ThemeContext)

// Renders a button with aria-label="Toggle theme"
// Shows <Moon /> icon in light mode, <Sun /> icon in dark mode
```

**Dependencies:**
- `Display` component
- `Button` component
- `ThemeContext` from `App.tsx`
- `Moon`, `Sun` from `lucide-react`

**Canonical Code Example (complete, from source):**
```tsx
import { useState, useContext } from 'react'
import { Moon, Sun } from 'lucide-react'
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

  const buttons = [
    'C', '\u00f7', '\u00d7', '-',
    '7', '8', '9', '+',
    '4', '5', '6', '=',
    '1', '2', '3', '.',
    '0',
  ]

  const getButtonProps = (label: string) => {
    const isOperator = ['+', '-', '\u00d7', '\u00f7'].includes(label)
    const isEquals = label === '='
    const isClear = label === 'C'

    let className = ''
    if (isOperator) className = 'operator'
    else if (isEquals) className = 'equals'
    else if (isClear) className = 'clear'

    let handler: () => void
    if (label === 'C') handler = handleClear
    else if (label === '=') handler = handleEquals
    else if (label === '.') handler = handleDecimal
    else if (isOperator) handler = () => handleOperation(label)
    else handler = () => handleDigit(label)

    return { label, onClick: handler, className }
  }

  return (
    <div className="calculator">
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? <Moon /> : <Sun />}
      </button>
      <Display value={currentValue} />
      <div className="button-grid">
        {buttons.map((label) => (
          <Button key={label} {...getButtonProps(label)} />
        ))}
      </div>
    </div>
  )
}
```

> **Note:** The `getButtonProps` function and JSX return were not fully provided in the source sample. The above is reconstructed from the partial source + test expectations (all 17 buttons rendered, theme toggle present with aria-label). ⚠️ VERIFY exact implementation against full `Calculator.tsx`.

---

## 5. Templates & Layout Patterns

### 5.1 Page Layout

**App shell (`App.tsx`):**
```tsx
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  <div className="app" data-theme={theme}>
    <h1>Chris's Calculator</h1>
    <Calculator />
  </div>
</ThemeContext.Provider>
```

**Structure:**
- Single-page application, no routing
- Centered layout (⚠️ VERIFY from `App.css` — likely `display: flex; justify-content: center; align-items: center; min-height: 100vh`)
- `<h1>` page title above calculator
- Single `<Calculator>` organism

### 5.2 Responsive Behaviour

Tests confirm the application is tested at:

| Viewport | Width | Height | Usage |
|---|---|---|---|
| Mobile | `375px` | `667px` | iPhone SE-class |
| Tablet | `768px` | `1024px` | iPad-class |

⚠️ VERIFY breakpoints and responsive rules from CSS files.

### 5.3 Theme System (Canonical Pattern)

```tsx
// 1. Context definition (App.tsx)
export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})

// 2. Provider wraps entire app
<ThemeContext.Provider value={{ theme, toggleTheme }}>

// 3. Theme persisted to localStorage
localStorage.setItem('calculator-theme', theme)

// 4. Theme applied to HTML root AND app container
document.documentElement.setAttribute('data-theme', theme)
<div className="app" data-theme={theme}>

// 5. Consumer pattern (any child component)
const { theme, toggleTheme } = useContext(ThemeContext)
```

**Canonical rules:**
- localStorage key: `"calculator-theme"`
- Valid values: `"light"` | `"dark"`
- Invalid/missing values **default to `"light"`**
- Theme attribute set on **both** `document.documentElement` and `.app` div

---

## 6. Interaction & Animation

### 6.1 Transition Conventions

⚠️ VERIFY from CSS files. Likely `transition` properties on:
- `.calculator-button` (hover/active state changes)
- `.app` (theme transition, e.g. `background-color 0.3s ease`)

### 6.2 Focus & Accessibility

| Concern | Implementation |
|---|---|
| Keyboard operability | Native `<button>` elements — Enter and Space activate (confirmed by tests) |
| Theme toggle | `aria-label="Toggle theme"` on theme toggle button |
| Screen reader | Buttons use visible `label` text as accessible name |
| Focus ring | ⚠️ VERIFY from CSS — should use browser default or custom `:focus-visible` ring |

**Canonical rule:** All interactive elements MUST be native `<button>` elements (not `<div onClick>`). This is correctly implemented throughout the codebase.

---

## 7. Platform-Specific Rules

Not applicable — this is a web-only React SPA.

---

## 8. Anti-Patterns

### 8.1 ❌ Do NOT use CSS Modules or CSS-in-JS
The project uses **plain `.css` file imports** per component. Do not introduce `styled-components`, `emotion`, CSS modules (`.module.css`), or Tailwind.

### 8.2 ❌ Do NOT add a `disabled` state to Button
The current `Button` component has no `disabled` prop. Error states are handled by ignoring operations in the Calculator logic (`if (currentValue === 'Error') return`), not by disabling buttons visually. Follow this pattern.

### 8.3 ❌ Do NOT use inline styles
No inline `style={}` props are used anywhere. All styling is via CSS classes.

### 8.4 ❌ Do NOT duplicate theme attribute application
Theme must be applied to **both** `document.documentElement` and the `.app` div (this dual-application is intentional — CSS may target either `[data-theme]` selector). Do not remove either.

### 8.5 ❌ Do NOT use `useReducer` for calculator state
The calculator uses four independent `useState` hooks. This is the canonical pattern for this project — do not refactor to `useReducer`.

### 8.6 ⚠️ Inconsistency: Unicode characters for operators
Operators use Unicode escape sequences in some places and literal characters in others:
- `'\u00d7'` = `×` (multiplication)
- `'\u00f7'` = `÷` (division)

**Canonical rule:** Always use the Unicode escape sequence in JavaScript/TypeScript logic (`'\u00d7'`, `'\u00f7'`) for consistency and to avoid encoding issues. The rendered output will display the correct symbol.

---

## Appendix: File Structure

```
src/
├── App.tsx              # Root component, ThemeContext provider
├── App.css              # App-level styles, theme variables ⚠️ NOT PROVIDED
├── App.test.tsx         # Theme functionality tests
├── main.tsx             # React DOM entry point
├── components/
│   ├── Button.tsx       # Atom: calculator button
│   ├── Button.css       # Button styles ⚠️ NOT PROVIDED
│   ├── Button.test.tsx  # Button unit tests
│   ├── Calculator.tsx   # Organism: full calculator
│   ├── Calculator.css   # Calculator layout styles ⚠️ NOT PROVIDED
│   ├── Calculator.test.tsx # Calculator integration tests
│   ├── Display.tsx      # Atom: value display
│   ├── Display.css      # Display styles ⚠️ NOT PROVIDED
│   └── Display.test.tsx # Display unit tests
```

---

## Appendix: Component Hierarchy (Atomic Design)

```
Template:    App (page shell + ThemeContext)
  └─ Organism:  Calculator (state + layout + theme toggle)
       ├─ Atom:     Display (value rendering)
       ├─ Atom:     Button (clickable calculator key) × 17
       └─ Atom:     Moon / Sun icon (from lucide-react)
```

---

> **🔴 CRITICAL: CSS files are missing from this analysis.** To complete this design system with pixel-perfect token values, the following files MUST be reviewed:
> - `src/App.css` — theme variables, app layout, h1 typography
> - `src/components/Calculator.css` — grid layout, theme toggle positioning, container styling
> - `src/components/Button.css` — all button variant colours, sizes, hover/active states, border radius
> - `src/components/Display.css` — display background, text alignment, font size, overflow handling
>
> Once those files are provided, all `⚠️ VERIFY` markers in this document should be resolved with exact hex codes, pixel values, and token names.