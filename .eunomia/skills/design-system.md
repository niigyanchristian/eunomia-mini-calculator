# Design System — eunomia-mini-calculator

> **Note:** The CSS source files (`App.css`, `Display.css`, `Button.css`, `Calculator.css`) were not provided in the codebase sample. Token values below are documented from component source, test expectations, and structural conventions. Where a CSS file is the authoritative source but was unavailable, this is called out with `⚠️ CSS_SOURCE_NEEDED`. An implementing agent **must** consult those files for exact hex/px values before building.

---

## 1. Design Tokens

### 1.1 Colour Palette

The application uses a **light/dark theme system** controlled via a `data-theme` attribute on both `<html>` and the `.app` wrapper element.

| Token / Selector | Light Value | Dark Value | Usage |
|---|---|---|---|
| `[data-theme="light"]` background | ⚠️ CSS_SOURCE_NEEDED (`App.css`) | ⚠️ CSS_SOURCE_NEEDED | App page background |
| `[data-theme="dark"]` background | ⚠️ CSS_SOURCE_NEEDED (`App.css`) | ⚠️ CSS_SOURCE_NEEDED | App page background (dark) |
| `.display` background | ⚠️ CSS_SOURCE_NEEDED (`Display.css`) | ⚠️ CSS_SOURCE_NEEDED | Calculator display panel |
| `.display` text colour | ⚠️ CSS_SOURCE_NEEDED (`Display.css`) | ⚠️ CSS_SOURCE_NEEDED | Display text |
| `.calculator-button` background | ⚠️ CSS_SOURCE_NEEDED (`Button.css`) | ⚠️ CSS_SOURCE_NEEDED | Default digit button |
| `.calculator-button.operator` bg | ⚠️ CSS_SOURCE_NEEDED (`Button.css`) | ⚠️ CSS_SOURCE_NEEDED | Operator buttons (+, −, ×, ÷) |
| `.calculator-button.equals` bg | ⚠️ CSS_SOURCE_NEEDED (`Button.css`) | ⚠️ CSS_SOURCE_NEEDED | Equals button |
| `.calculator-button.clear` bg | ⚠️ CSS_SOURCE_NEEDED (`Button.css`) | ⚠️ CSS_SOURCE_NEEDED | Clear button |

**Theme mechanism (canonical):**

```tsx
// Theme is stored in localStorage under key "calculator-theme"
// Valid values: "light" | "dark"
// Default: "light"
// Applied via: document.documentElement.setAttribute('data-theme', theme)
//              AND <div className="app" data-theme={theme}>
```

### 1.2 Typography

| Element | Selector | Font Family | Size | Weight | Line Height | Source |
|---|---|---|---|---|---|---|
| App title | `h1` inside `.app` | ⚠️ CSS_SOURCE_NEEDED | ⚠️ CSS_SOURCE_NEEDED | ⚠️ CSS_SOURCE_NEEDED | ⚠️ CSS_SOURCE_NEEDED | `App.css` |
| Display value | `.display` | ⚠️ CSS_SOURCE_NEEDED (likely monospace) | ⚠️ CSS_SOURCE_NEEDED | ⚠️ CSS_SOURCE_NEEDED | ⚠️ CSS_SOURCE_NEEDED | `Display.css` |
| Button label | `.calculator-button` | ⚠️ CSS_SOURCE_NEEDED | ⚠️ CSS_SOURCE_NEEDED | ⚠️ CSS_SOURCE_NEEDED | ⚠️ CSS_SOURCE_NEEDED | `Button.css` |

### 1.3 Spacing System

⚠️ CSS_SOURCE_NEEDED — Spacing values are defined in `Calculator.css` (grid gap), `Button.css` (padding), and `App.css` (page padding). Consult those files.

### 1.4 Border Radius

⚠️ CSS_SOURCE_NEEDED — Likely applied to `.calculator-button`, `.display`, and the calculator container. Consult `Button.css`, `Display.css`, `Calculator.css`.

### 1.5 Shadows & Elevation

⚠️ CSS_SOURCE_NEEDED — Likely applied to the calculator container for elevation. Consult `Calculator.css`, `App.css`.

### 1.6 Z-Index Scale

No z-index layering is used in this application. There are no modals, overlays, dropdowns, or stacking contexts beyond normal flow.

---

## 2. Atoms

### 2.1 Colour Swatches & Surfaces

Two surface contexts exist:

| Surface | Class / Selector | Description |
|---|---|---|
| Page background | `.app` | Full-page background, theme-aware |
| Display surface | `.display` | Calculator screen area, likely darker/contrasted |
| Button surface (digit) | `.calculator-button` | Standard digit button |
| Button surface (operator) | `.calculator-button.operator` | Operator variant |
| Button surface (equals) | `.calculator-button.equals` | Equals action |
| Button surface (clear) | `.calculator-button.clear` | Clear/reset action |
| Button surface (zero) | `.calculator-button.zero` | Wide zero button |

### 2.2 Typography Elements

Only three typographic roles exist in this project:

**App Title (`<h1>`)**
```tsx
<h1>Mini Calculator</h1>
```
- Rendered inside `.app` container
- Single heading on the page; no `h2`–`h6` are used

**Display Value**
```tsx
<div className="display">{value}</div>
```
- Displays numbers, decimals, `"Error"` string
- Must handle long numbers (tested up to 15 digits) and scientific notation
- Right-aligned text is the calculator convention (verify in `Display.css`)

**Button Label**
```tsx
<button className="calculator-button">{label}</button>
```
- Single character labels: digits `0`–`9`, operators `+`, `-`, `×`, `÷`, `.`, `=`, `C`
- Unicode characters: `×` is `\u00d7`, `÷` is `\u00f7`

### 2.3 Icon Usage

No icon library is used. The theme toggle uses **emoji characters** as icons:

| State | Icon | Character |
|---|---|---|
| Light mode (click to go dark) | 🌙 | Moon emoji |
| Dark mode (click to go light) | ☀️ | Sun emoji |

### 2.4 Dividers & Lines

No explicit dividers or separator elements exist in the codebase.

### 2.5 Spacing Primitives

The calculator uses a **CSS Grid layout** (defined in `Calculator.css`). Button spacing is controlled via grid `gap`. Consult `Calculator.css` for exact gap values.

---

## 3. Molecules

### 3.1 Button

The `Button` is the core interactive atom/molecule of the application.

**API:**

| Prop | Type | Required | Default | Description |
|---|---|---|---|---|
| `label` | `string` | Yes | — | Text displayed on the button |
| `onClick` | `() => void` | Yes | — | Click handler |
| `className` | `string` | No | `''` | Additional CSS class(es) for variant styling |

**Variants (determined by `className` prop):**

| Variant | className value | Used for | Labels |
|---|---|---|---|
| Digit | _(none / empty)_ | Number input | `0`–`9` |
| Operator | `"operator"` | Arithmetic ops | `+`, `-`, `×` (`\u00d7`), `÷` (`\u00f7`) |
| Equals | `"equals"` | Compute result | `=` |
| Clear | `"clear"` | Reset calculator | `C` |
| Zero | `"zero"` | Wide zero button | `0` |
| Decimal | _(none / empty)_ | Decimal point | `.` |
| Theme toggle | `"theme-toggle"` | Toggle light/dark | `🌙` / `☀️` |

**States:**

| State | Trigger | Visual | Source |
|---|---|---|---|
| Default | — | ⚠️ CSS_SOURCE_NEEDED | `Button.css` |
| Hover | `:hover` | ⚠️ CSS_SOURCE_NEEDED | `Button.css` |
| Active | `:active` | ⚠️ CSS_SOURCE_NEEDED | `Button.css` |
| Focus | `:focus` / `Tab` key | ⚠️ CSS_SOURCE_NEEDED | `Button.css` |

**Keyboard interaction (verified by tests):**
- `Enter` triggers `onClick` ✅
- `Space` triggers `onClick` ✅
- Standard `<button>` element — inherits native keyboard accessibility

**Canonical implementation:**

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

**Usage in Calculator (how variants are applied):**

```tsx
// From Calculator.tsx — the button mapping logic
const getButtonClass = (btn: string): string => {
  if (['+', '-', '\u00d7', '\u00f7'].includes(btn)) return 'operator'
  if (btn === '=') return 'equals'
  if (btn === 'C') return 'clear'
  if (btn === '0') return 'zero'
  return ''
}

// Rendering:
<Button
  key={btn}
  label={btn}
  onClick={() => handleButtonClick(btn)}
  className={getButtonClass(btn)}
/>
```

### 3.2 Display

The `Display` is a read-only output molecule showing the calculator's current value.

**API:**

| Prop | Type | Required | Description |
|---|---|---|---|
| `value` | `string \| number` | Yes | The value to render |

**Displayed content types (verified by tests):**

| Content | Example | Behaviour |
|---|---|---|
| Integer | `123` | Rendered as-is |
| Decimal | `3.14159` | Rendered as-is |
| Negative | `-42` | Rendered with minus sign |
| Zero | `0` | Default state |
| Error | `"Error"` | Shown on division by zero |
| Empty string | `""` | Element present, no text content |
| Long number | `123456789012345` | No truncation at component level |
| Scientific notation | `10000000000` → `10000000000` | Rendered via JS `.toString()` |

**Canonical implementation:**

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

**Visual notes:**
- The display is **not** an `<input>` — it is a `<div>`, making it read-only
- CSS class is always `display` (no variants)
- Long number overflow handling must be defined in `Display.css` (likely `overflow: hidden` or `text-overflow: ellipsis` or `font-size` scaling)

---

## 4. Organisms

### 4.1 Calculator

The `Calculator` is the single organism in the application — it composes `Display` + `Button` grid + state management.

**Structure:**

```
┌─────────────────────────────┐
│        Mini Calculator      │  ← h1 (in App, outside Calculator)
├─────────────────────────────┤
│                         0   │  ← Display
├───────┬───────┬───────┬─────┤
│   C   │   ÷   │   ×   │  -  │  ← Row 1: clear + operators
├───────┼───────┼───────┼─────┤
│   7   │   8   │   9   │  +  │  ← Row 2: digits + operator
├───────┼───────┼───────┼─────┤
│   4   │   5   │   6   │  =  │  ← Row 3: digits + equals
├───────┼───────┼───────┼─────┤
│   1   │   2   │   3   │  .  │  ← Row 4: digits + decimal
├───────┴───────┼───────┼─────┤
│       0       │             │  ← Row 5: zero (spans 2 cols)
└───────────────┴─────────────┘
```

**Button layout order (from source):**

```typescript
const buttons = [
  'C', '÷', '×', '-',    // row 1
  '7', '8', '9', '+',    // row 2
  '4', '5', '6', '=',    // row 3
  '1', '2', '3', '.',    // row 4
  '0',                    // row 5 (wide — spans 2+ columns)
]
```

> The grid is 4 columns. The `0` button uses CSS class `zero` to span multiple columns (likely `grid-column: span 2` in `Calculator.css`).

**State management:**

| State Variable | Type | Initial | Purpose |
|---|---|---|---|
| `currentValue` | `string` | `'0'` | Currently displayed number |
| `previousValue` | `string` | `''` | Left operand stored after operator press |
| `operation` | `string` | `''` | Current pending operator |
| `shouldResetDisplay` | `boolean` | `false` | Flag to replace display on next digit |

**Behaviour rules:**

| Action | Behaviour |
|---|---|
| Digit when display is `'0'` | Replaces `0` (no leading zeros) |
| Digit after operator | Resets display, starts new number |
| Digit after `=` | Resets display, starts new number |
| Digit when `'Error'` | Replaces error with digit |
| `.` when no decimal exists | Appends `.` |
| `.` when decimal exists | No-op (prevents `1.2.3`) |
| `.` after operator | Shows `0.` |
| `.` when `'Error'` | Shows `0.` |
| Operator after digit | Stores current value, sets operation |
| Operator after operator | Chains — computes intermediate result |
| `=` | Computes result, clears operation |
| `=` with no pending operation | No-op |
| `=` when `'Error'` | No-op |
| `C` | Full reset to initial state |
| `÷` by `0` | Displays `"Error"` |

**Theme toggle button** (rendered inside Calculator):

```tsx
<button
  className="theme-toggle"
  onClick={toggleTheme}
  aria-label="Toggle theme"
>
  {theme === 'light' ? '🌙' : '☀️'}
</button>
```

- `aria-label="Toggle theme"` — verified by test: `screen.getByRole('button', { name: /toggle theme/i })`
- Placed within the Calculator component, consumes `ThemeContext`

**Canonical implementation (complete):**

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

  const handleButtonClick = (btn: string) => {
    if (btn === 'C') return handleClear()
    if (btn === '=') return handleEquals()
    if (btn === '.') return handleDecimal()
    if (['+', '-', '\u00d7', '\u00f7'].includes(btn)) return handleOperation(btn)
    handleDigit(btn)
  }

  const getButtonClass = (btn: string): string => {
    if (['+', '-', '\u00d7', '\u00f7'].includes(btn)) return 'operator'
    if (btn === '=') return 'equals'
    if (btn === 'C') return 'clear'
    if (btn === '0') return 'zero'
    return ''
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
      <div className="button-grid">
        {buttons.map((btn) => (
          <Button
            key={btn}
            label={btn}
            onClick={() => handleButtonClick(btn)}
            className={getButtonClass(btn)}
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

The application has a single-page, single-component layout:

```tsx
// src/App.tsx — canonical page structure
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  <div className="app" data-theme={theme}>
    <h1>Mini Calculator</h1>
    <Calculator />
  </div>
</ThemeContext.Provider>
```

- **Centred layout**: The `.app` container centres the calculator on the page (likely `display: flex; justify-content: center; align-items: center; min-height: 100vh` — verify in `App.css`)
- **No routing**: Single view, no `react-router`
- **No sidebar/navbar**: Self-contained widget layout

### 5.2 Responsive Design

From test file evidence, the Display component is tested at:
- **Mobile**: 375×667 (iPhone SE class)
- **Tablet**: 768×1024 (iPad class)

No breakpoint utilities or responsive grid system exists. The calculator likely uses a fixed-width container that scales or centres. Verify in `Calculator.css` and `App.css`.

### 5.3 Error States

| Error | Trigger | Display | Recovery |
|---|---|---|---|
| Division by zero | `n ÷ 0 =` | `"Error"` shown in Display | Press any digit or `.` to reset; `C` for full clear; operators are no-op during Error |

No network errors, loading states, or empty states exist — this is a purely client-side calculator.

---

## 6. Interaction & Animation

### 6.1 Transition Conventions

⚠️ CSS_SOURCE_NEEDED — Check `Button.css` for `:hover` / `:active` transitions and `App.css` for theme transition animations.

**Expected conventions:**
- Button press feedback (`:active` state) — likely a background colour shift or scale transform
- Theme transition — may use `transition` on `background-color` and `color` for smooth light↔dark switch

### 6.2 Focus & Accessibility

| Feature | Implementation |
|---|---|
| Keyboard activation | Native `<button>` elements — `Enter` and `Space` work (verified by tests) |
| Focus ring | ⚠️ CSS_SOURCE_NEEDED — check if custom `:focus` / `:focus-visible` styles exist in `Button.css` |
| Theme toggle | `aria-label="Toggle theme"` on the toggle button (verified by test) |
| Screen reader | Display is a `<div>` — **no `aria-live` region** (see Anti-Patterns) |
| Semantic HTML | Uses `<button>` elements (good), `<h1>` for title (good) |

---

## 7. Platform-Specific Rules

Not applicable — this is a web-only React application.

---

## 8. Anti-Patterns

### 8.1 Display lacks `aria-live` for screen readers

**Problem:** The `.display` div updates dynamically but has no `aria-live="polite"` or `role="status"` attribute. Screen reader users won't hear calculation results.

**Fix:**
```tsx
<div className="display" role="status" aria-live="polite" aria-atomic="true">
  {value}
</div>
```

### 8.2 Theme toggle is inside Calculator — should be in App

**Problem:** The theme toggle button is rendered inside `Calculator.tsx` but the theme state lives in `App.tsx`. This couples a global concern (theming) to a domain component (calculator). If a second component were added, the toggle placement would be incorrect.

**Canonical pattern:** Move the toggle button to `App.tsx`, above or beside the `<h1>`.

### 8.3 No `aria-label` on calculator buttons

**Problem:** Operator buttons use Unicode characters (`×`, `÷`) which may not be announced clearly by all screen readers.

**Fix:**
```tsx
<button aria-label="multiply" className="calculator-button operator">×</button>
<button aria-label="divide" className="calculator-button operator">÷</button>
```

### 8.4 CSS is not co-located with design tokens

**Problem:** The project uses plain `.css` files with no CSS custom properties (variables) file or shared token system. Colours and spacing are likely duplicated across `App.css`, `Button.css`, `Display.css`, and `Calculator.css`.

**Canonical pattern:** Create a `src/tokens.css` file with CSS custom properties:
```css
:root {
  /* Colours — light theme */
  --color-bg: #f0f0f0;
  --color-surface: #ffffff;
  --color-display-bg: #222222;
  --color-display-text: #ffffff;
  --color-btn-digit: #e0e0e0;
  --color-btn-operator: #ff9500;
  --color-btn-equals: #ff9500;
  --color-btn-clear: #a5a5a5;
  /* ... actual values from CSS files */
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  /* ... */
}
```

Then reference tokens in component CSS: `background: var(--color-btn-digit)`.

### 8.5 Floating-point arithmetic without rounding

**Problem:** The calculator uses raw `parseFloat` and JS arithmetic. Expressions like `0.1 + 0.2` will display `0.30000000000000004`.

**Fix:** Round results to a reasonable precision (e.g., 12 significant digits):
```typescript
const result = parseFloat((left + right).toPrecision(12))
return String(result)
```

### 8.6 `className` string concatenation pattern

**Problem:** The Button component concatenates class names manually:
```tsx
const buttonClass = `calculator-button${className ? ' ' + className : ''}`
```

This is fragile. For this small project it works, but the canonical approach for growth would be a `clsx` or `classnames` utility:
```tsx
import clsx from 'clsx'
const buttonClass = clsx('calculator-button', className)
```

---

## Appendix: File → Component Map

| File | Type | Exports | CSS Dependency |
|---|---|---|---|
| `src/App.tsx` | Template | `default App`, `ThemeContext` | `App.css` |
| `src/main.tsx` | Entry | — | — |
| `src/components/Calculator.tsx` | Organism | `Calculator` | `Calculator.css` |
| `src/components/Display.tsx` | Atom | `Display` | `Display.css` |
| `src/components/Button.tsx` | Atom | `Button` | `Button.css` |

---

## Appendix: CSS Files Required for Complete Token Extraction

To complete this design system with exact pixel values, an implementing agent **must** read:

1. **`src/App.css`** — Page layout, theme colour definitions, `h1` typography
2. **`src/components/Calculator.css`** — Grid layout (columns, gap, container width)
3. **`src/components/Display.css`** — Display dimensions, background, text colour, font-size, text-align, overflow handling
4. **`src/components/Button.css`** — Button sizes, colours per variant, hover/active/focus states, border-radius, font-size, `.zero` column span