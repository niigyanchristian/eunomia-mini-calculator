# Design System — eunomia-mini-calculator

> **Note:** The CSS source files (`App.css`, `Display.css`, `Button.css`, `Calculator.css`) were not provided in the codebase sample. Token values below are **inferred from component structure, test expectations, and standard calculator UI conventions**. Where a value could not be extracted from source, it is marked with `⚠️ INFERRED`. When the actual CSS files are available, these values **must be reconciled** with the real stylesheet.

---

## 1. Design Tokens

### 1.1 Colour Palette

The application uses a **light/dark theme** system controlled via the `data-theme` attribute on both the root `<div class="app">` and `document.documentElement`.

| Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--bg-app` | ⚠️ `#f0f0f0` | ⚠️ `#1a1a2e` | Page / app background (`div.app`) |
| `--bg-calculator` | ⚠️ `#ffffff` | ⚠️ `#16213e` | Calculator container background |
| `--bg-display` | ⚠️ `#e8e8e8` | ⚠️ `#0f3460` | Display panel background |
| `--color-display-text` | ⚠️ `#333333` | ⚠️ `#ffffff` | Display text colour |
| `--bg-button-digit` | ⚠️ `#ffffff` | ⚠️ `#1a1a2e` | Digit buttons (0–9, `.`) |
| `--bg-button-operator` | ⚠️ `#f5923e` | ⚠️ `#e94560` | Operator buttons (`+`, `-`, `×`, `÷`, `=`) |
| `--bg-button-clear` | ⚠️ `#dc3545` | ⚠️ `#c0392b` | Clear button (`C`) |
| `--color-button-text` | ⚠️ `#333333` | ⚠️ `#ffffff` | Button label text |
| `--color-heading` | ⚠️ `#333333` | ⚠️ `#ffffff` | `<h1>` heading text |

**Theme mechanism (extracted):**

```tsx
// Theme is stored in localStorage under key "calculator-theme"
// Valid values: "light" | "dark"
// Default: "light"
// Applied via: data-theme attribute on <html> and <div class="app">
document.documentElement.setAttribute('data-theme', theme)
```

### 1.2 Typography

| Element | Font Family | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| `h1` | ⚠️ system sans-serif | ⚠️ `1.5rem` (24px) | ⚠️ `700` | ⚠️ `1.2` | Page title "Mini Calculator" |
| `.display` | ⚠️ monospace / sans-serif | ⚠️ `2rem` – `2.5rem` (32–40px) | ⚠️ `400` | ⚠️ `1.2` | Calculator display value |
| `.calculator-button` | ⚠️ sans-serif | ⚠️ `1.25rem` (20px) | ⚠️ `600` | ⚠️ `1` | Button labels |

### 1.3 Spacing System

| Token | Value | Usage |
|---|---|---|
| `--spacing-xs` | ⚠️ `4px` | Minimal internal gaps |
| `--spacing-sm` | ⚠️ `8px` | Button grid gap |
| `--spacing-md` | ⚠️ `16px` | Calculator container padding |
| `--spacing-lg` | ⚠️ `24px` | Section spacing |
| `--spacing-xl` | ⚠️ `32px` | App-level vertical padding |

### 1.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-button` | ⚠️ `8px` | Calculator buttons |
| `--radius-display` | ⚠️ `8px` | Display panel |
| `--radius-container` | ⚠️ `12px` – `16px` | Calculator container |

### 1.5 Shadows & Elevation

| Token | Value | Usage |
|---|---|---|
| `--shadow-calculator` | ⚠️ `0 4px 12px rgba(0,0,0,0.15)` | Calculator container card shadow |
| `--shadow-button-active` | ⚠️ `inset 0 2px 4px rgba(0,0,0,0.2)` | Button pressed/active state |

### 1.6 Z-Index Scale

This project is a single-view calculator with no overlapping layers. No z-index tokens are needed.

---

## 2. Atoms

### 2.1 Colour Swatches & Surfaces

Two surface levels exist:

1. **App background** — the full-page surface behind the calculator (`div.app`)
2. **Calculator surface** — the card-like container housing display + buttons

Theme switching is achieved via the `data-theme` attribute. CSS should use attribute selectors:

```css
/* Canonical pattern */
[data-theme='light'] {
  --bg-app: #f0f0f0;
  --color-text: #333333;
}
[data-theme='dark'] {
  --bg-app: #1a1a2e;
  --color-text: #ffffff;
}
```

### 2.2 Typography Elements

Only two typographic roles exist in the project:

**Heading (`h1`)**

```tsx
// Used in App.tsx — one instance only
<h1>Mini Calculator</h1>
```

**Display value (`.display`)**

```tsx
// Renders numbers, "Error", or partial expressions
<div className="display">{value}</div>
```

**Button label**

```tsx
<button className="calculator-button">{label}</button>
```

### 2.3 Icon Usage

No icon library is used. The theme toggle button uses **emoji characters** as icons:

| State | Icon | Unicode |
|---|---|---|
| Light mode active (click to go dark) | 🌙 | U+1F319 |
| Dark mode active (click to go light) | ☀️ | U+2600 FE0F |

```tsx
// From Calculator.tsx (inferred from tests)
<button onClick={toggleTheme} aria-label="Toggle theme">
  {theme === 'light' ? '🌙' : '☀️'}
</button>
```

### 2.4 Dividers & Lines

No explicit dividers exist in this project. Visual separation is achieved through **background colour contrast** between the display and the button grid.

### 2.5 Spacing Primitives

Spacing is applied via CSS classes. The project uses **CSS files per component** (co-located):

| Component | CSS File |
|---|---|
| `App` | `src/App.css` |
| `Calculator` | `src/components/Calculator.css` |
| `Display` | `src/components/Display.css` |
| `Button` | `src/components/Button.css` |

**Convention:** All spacing is defined in component CSS. No utility-class system (e.g., Tailwind) is used.

---

## 3. Molecules

### 3.1 Button (`<Button>`)

**File:** `src/components/Button.tsx` + `src/components/Button.css`

**Props:**

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `label` | `string` | ✅ | — | Text displayed on the button |
| `onClick` | `() => void` | ✅ | — | Click handler |
| `className` | `string` | ❌ | `''` | Additional CSS class for variant styling |

**Variants (applied via `className` prop):**

| Variant | className value | Buttons | Colour role |
|---|---|---|---|
| Digit | `''` (default) | `0`–`9`, `.` | Neutral / default bg |
| Operator | `'operator'` | `+`, `-`, `×`, `÷` | Accent / orange |
| Equals | `'equals'` | `=` | Accent / orange (or distinct) |
| Clear | `'clear'` | `C` | Destructive / red |
| Zero (wide) | `'zero'` | `0` | Neutral, spans 2 columns |
| Theme toggle | `'theme-toggle'` | 🌙 / ☀️ | Neutral |

**States:**

| State | Visual treatment |
|---|---|
| Default | Standard background per variant |
| Hover | ⚠️ Slightly lighter/darker background shift |
| Active / Pressed | ⚠️ Darker background + inset shadow |
| Focused | ⚠️ Outline or ring (keyboard navigation) |
| Disabled | Not implemented — no `disabled` prop exists |

**Complete code example (canonical):**

```tsx
// src/components/Button.tsx
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

**Usage in Calculator:**

```tsx
{/* Digit button */}
<Button label="5" onClick={() => handleDigit('5')} />

{/* Operator button */}
<Button label="+" onClick={() => handleOperation('+')} className="operator" />

{/* Clear button */}
<Button label="C" onClick={handleClear} className="clear" />

{/* Zero button (wide, spans 2 columns) */}
<Button label="0" onClick={() => handleDigit('0')} className="zero" />
```

**⚠️ Inconsistency:** The `className` values for variants (`operator`, `clear`, `equals`, `zero`) are inferred from the button layout in `Calculator.tsx`. The actual className assignments in the truncated `Calculator.tsx` source must be verified against `Calculator.css`.

### 3.2 Display (`<Display>`)

**File:** `src/components/Display.tsx` + `src/components/Display.css`

**Props:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `value` | `string \| number` | ✅ | The value shown in the display |

**Visual spec:**

| Property | Value |
|---|---|
| CSS class | `.display` |
| Text alignment | ⚠️ Right-aligned |
| Font size | ⚠️ `2rem`–`2.5rem` |
| Font weight | ⚠️ `400` |
| Overflow | ⚠️ `hidden` or `ellipsis` (long numbers are supported per tests) |
| Padding | ⚠️ `16px 20px` |
| Background | Themed surface (darker than button area) |

**States:**

| State | Display content | Visual treatment |
|---|---|---|
| Initial | `"0"` | Normal |
| Number | `"123.45"` | Normal |
| Error | `"Error"` | Same styling (no distinct error style detected) |
| Empty string | `""` | Empty div, no crash |

**Complete code example (canonical):**

```tsx
// src/components/Display.tsx
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

### 3.3–3.7

**Not applicable.** This project contains no Badge, Avatar, Checkbox, Radio, Toggle, Select, Dropdown, Tooltip, or Input/TextField components.

---

## 4. Organisms

### 4.1 Calculator (`<Calculator>`)

**File:** `src/components/Calculator.tsx` + `src/components/Calculator.css`

The Calculator is the sole organism — it composes `Display` + a grid of `Button` molecules.

**Layout structure:**

```
┌──────────────────────────────┐
│         .display             │  ← Display component (full width)
│                          0   │
├───────┬───────┬───────┬──────┤
│   C   │   ÷   │   ×   │  -  │  ← Row 1: Clear + operators
├───────┼───────┼───────┼──────┤
│   7   │   8   │   9   │  +  │  ← Row 2: Digits + operator
├───────┼───────┼───────┼──────┤
│   4   │   5   │   6   │  =  │  ← Row 3: Digits + equals
├───────┼───────┼───────┼──────┤
│   1   │   2   │   3   │  .  │  ← Row 4: Digits + decimal
├───────┴───────┼───────┼──────┤
│       0       │              │  ← Row 5: Zero spans 2 cols
└───────────────┴──────────────┘
```

**Button order (from source):**

```tsx
const buttons = [
  'C', '÷', '×', '-',
  '7', '8', '9', '+',
  '4', '5', '6', '=',
  '1', '2', '3', '.',
  '0',  // spans 2 columns
]
```

**Grid:** 4-column CSS grid. Button `0` uses ⚠️ `grid-column: span 2`.

**State management:**

| State variable | Type | Initial | Purpose |
|---|---|---|---|
| `currentValue` | `string` | `'0'` | Currently displayed value |
| `previousValue` | `string` | `''` | Left operand for pending operation |
| `operation` | `string` | `''` | Pending operator (`+`, `-`, `×`, `÷`) |
| `shouldResetDisplay` | `boolean` | `false` | Whether next digit replaces display |

**Theme toggle button** is rendered inside Calculator (confirmed by tests showing it alongside calculator buttons). It uses `ThemeContext` consumed via `useContext`.

**Complete code example (canonical):**

```tsx
// src/components/Calculator.tsx
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
    if (currentValue === 'Error') { setCurrentValue(digit); return }
    if (shouldResetDisplay) { setCurrentValue(digit); setShouldResetDisplay(false); return }
    if (currentValue === '0' && digit !== '.') { setCurrentValue(digit) }
    else { setCurrentValue(currentValue + digit) }
  }

  const handleDecimal = () => {
    if (currentValue === 'Error') { setCurrentValue('0.'); return }
    if (shouldResetDisplay) { setCurrentValue('0.'); setShouldResetDisplay(false); return }
    if (!currentValue.includes('.')) { setCurrentValue(currentValue + '.') }
  }

  const calculate = (left: number, right: number, op: string): string => {
    switch (op) {
      case '+': return String(left + right)
      case '-': return String(left - right)
      case '\u00d7': return String(left * right)
      case '\u00f7': return right === 0 ? 'Error' : String(left / right)
      default: return String(right)
    }
  }

  const handleOperation = (nextOp: string) => {
    if (currentValue === 'Error') return
    if (previousValue && operation && !shouldResetDisplay) {
      const result = calculate(parseFloat(previousValue), parseFloat(currentValue), operation)
      setPreviousValue(result); setCurrentValue(result)
    } else { setPreviousValue(currentValue) }
    setOperation(nextOp); setShouldResetDisplay(true)
  }

  const handleEquals = () => {
    if (!previousValue || !operation || currentValue === 'Error') return
    const result = calculate(parseFloat(previousValue), parseFloat(currentValue), operation)
    setCurrentValue(result); setPreviousValue(''); setOperation(''); setShouldResetDisplay(true)
  }

  const handleClear = () => {
    setCurrentValue('0'); setPreviousValue(''); setOperation(''); setShouldResetDisplay(false)
  }

  const getButtonProps = (label: string) => {
    const ops = ['+', '-', '\u00d7', '\u00f7']
    if (label === 'C') return { onClick: handleClear, className: 'clear' }
    if (label === '=') return { onClick: handleEquals, className: 'equals' }
    if (label === '.') return { onClick: handleDecimal, className: '' }
    if (ops.includes(label)) return { onClick: () => handleOperation(label), className: 'operator' }
    if (label === '0') return { onClick: () => handleDigit('0'), className: 'zero' }
    return { onClick: () => handleDigit(label), className: '' }
  }

  const buttons = ['C', '\u00f7', '\u00d7', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '.', '0']

  return (
    <div className="calculator">
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <Display value={currentValue} />
      <div className="button-grid">
        {buttons.map((label) => {
          const { onClick, className } = getButtonProps(label)
          return <Button key={label} label={label} onClick={onClick} className={className} />
        })}
      </div>
    </div>
  )
}
```

### 4.2–4.6

**Not applicable.** No Card, Modal, Navigation, Table, or Toast components exist in this project.

---

## 5. Templates & Layout Patterns

### 5.1 Page Layout

The application is a **single-page, single-component layout** centred on screen.

```
┌──────────────────────────────────────────┐
│                  .app                     │
│                                          │
│           <h1>Mini Calculator</h1>       │
│                                          │
│          ┌──────────────────┐            │
│          │   .calculator    │            │
│          │   (centred)      │            │
│          └──────────────────┘            │
│                                          │
└──────────────────────────────────────────┘
```

**Canonical App shell:**

```tsx
// src/App.tsx
import { useState, useEffect, createContext } from 'react'
import './App.css'
import { Calculator } from './components/Calculator'

export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggleTheme: () => void
}>({ theme: 'light', toggleTheme: () => {} })

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('calculator-theme')
    return (saved === 'dark' || saved === 'light') ? saved : 'light'
  })

  useEffect(() => {
    localStorage.setItem('calculator-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light')

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

**CSS layout expectations for `.app`:**

```css
/* ⚠️ INFERRED — verify against src/App.css */
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--bg-app);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}
```

### 5.2 Responsive Behaviour

Tests verify rendering at **375px** (mobile) and **768px** (tablet) viewports. The calculator should be responsive:

| Breakpoint | Behaviour |
|---|---|
| `≤ 375px` | Calculator fills available width with padding |
| `376px – 768px` | Calculator is fixed-width, centred |
| `> 768px` | Calculator is fixed-width, centred |

**Calculator max-width:** ⚠️ ~`320px`–`400px`

### 5.3 Empty States

Not applicable — the display always shows at least `"0"`.

### 5.4 Loading States

Not applicable — no async operations exist.

### 5.5 Error States

A single error state exists: **division by zero** displays `"Error"` in the Display component. After an error:

- Pressing any **digit** replaces `"Error"` with that digit
- Pressing **decimal** starts `"0."`
- Pressing an **operator** is a no-op
- Pressing **C** resets to `"0"`
- Pressing **=** is a no-op

---

## 6. Interaction & Animation

### 6.1 Transition Conventions

| What animates | Duration | Easing | Property |
|---|---|---|---|
| Theme transition | ⚠️ `0.3s` | ⚠️ `ease` | `background-color`, `color` |
| Button hover/active | ⚠️ `0.1s`–`0.15s` | ⚠️ `ease` | `background-color`, `transform` |

**Rule:** Only colour and subtle scale transforms should animate. No layout animations.

### 6.2 Focus & Accessibility

| Pattern | Implementation |
|---|---|
| Theme toggle | `aria-label="Toggle theme"` (confirmed by tests) |
| Buttons | Native `<button>` elements — keyboard accessible by default |
| Enter key | Fires `onClick` (confirmed by tests) |
| Space key | Fires `onClick` (confirmed by tests) |
| Focus ring | ⚠️ Browser default or custom outline — verify in CSS |

**Canonical rule:** All interactive elements **must** be `<button>` elements (not `<div onClick>`). This convention is correctly followed throughout the codebase.

---

## 7. Platform-Specific Rules

Not applicable — this is a web-only React application.

---

## 8. Anti-Patterns

### 8.1 ❌ Do NOT duplicate theme state on multiple DOM nodes

**Found:** `data-theme` is set on **both** `document.documentElement` and the `.app` div. This creates two sources of truth. CSS selectors that target `[data-theme]` could match either, leading to specificity conflicts.

**Canonical fix:** Set `data-theme` only on `document.documentElement`. Remove it from the `.app` div, or vice versa — pick one.

### 8.2 ❌ Do NOT use emoji as icons in production

**Found:** Theme toggle uses `🌙` and `☀️` emoji characters. Emoji rendering is inconsistent across platforms and cannot be styled (colour, size precision).

**Canonical recommendation:** Replace with inline SVG icons for consistent rendering and styling control.

### 8.3 ❌ Do NOT pass variant styling via raw `className` strings

**Found:** `<Button className="operator">` relies on the consumer knowing magic string class names. This is error-prone.

**Canonical improvement:**

```tsx
// Prefer a typed variant prop:
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'digit' | 'operator' | 'clear' | 'equals' | 'zero'
}
```

### 8.4 ❌ Do NOT use inline context default values that silently fail

**Found:**

```tsx
export const ThemeContext = createContext<{...}>({
  theme: 'light',
  toggleTheme: () => {},  // Silent no-op if Provider is missing
})
```

**Canonical fix:** Default to `null` and throw at consumption time if the provider is absent:

```tsx
const ThemeContext = createContext<ThemeContextType | null>(null)

function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
```

### 8.5 ❌ Do NOT store display state as unparsed strings without formatting

**Found:** `currentValue` can grow to arbitrary length (e.g., `"123456789012345"`). No number formatting, truncation, or overflow handling is implemented in the component logic. Long results from floating-point arithmetic (e.g., `0.30000000000000004`) will display raw.

**Canonical fix:** Add a display formatting utility that caps precision and handles overflow:

```tsx
function formatDisplay(value: string): string {
  const num = parseFloat(value)
  if (isNaN(num)) return value // "Error" etc.
  if (value.length > 12) return num.toPrecision(10)
  return value
}
```

---

## Appendix: File Structure

```
src/
├── App.tsx              # Root component, ThemeContext provider
├── App.css              # App-level styles, theme variables
├── main.tsx             # ReactDOM entry point
├── components/
│   ├── Button.tsx       # Atom: calculator button
│   ├── Button.css       # Button styles (all variants)
│   ├── Button.test.tsx  # Button unit tests
│   ├── Display.tsx      # Atom: value display
│   ├── Display.css      # Display styles
│   ├── Display.test.tsx # Display unit tests
│   ├── Calculator.tsx   # Organism: full calculator
│   ├── Calculator.css   # Calculator layout (grid)
│   └── Calculator.test.tsx # Calculator integration tests
```

**Component hierarchy:**

```
App (ThemeContext.Provider)
└── Calculator (organism)
    ├── Display (atom)
    └── Button × 17 (atoms, variant via className)
```