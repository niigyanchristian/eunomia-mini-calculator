# Design System — eunomia-mini-calculator

> **Generated from codebase analysis.** CSS source files (`Button.css`, `Display.css`,
> `Login.css`, `Calculator.css`, `App.css`) are referenced by components but were not
> available for token extraction. Where exact hex/pixel values could not be read from
> source, they are marked ⚠️ **VERIFY IN CSS**. All component APIs, class names,
> behavioural specs, and variant structures are extracted directly from TSX and test files.

---

## 1. Design Tokens

### 1.1 Colour Palette

The project uses a **light / dark theme** system driven by the `data-theme` attribute on
both `<html>` and the `.app` wrapper div. Tokens are expected to live as CSS custom
properties scoped under `[data-theme="light"]` and `[data-theme="dark"]` in `App.css`.

| Token (semantic) | Context | CSS Class / Attribute | Notes |
|---|---|---|---|
| Background – App | Page background | `.app` | Switches via `data-theme` |
| Background – Calculator | Calculator container | `.calculator` (⚠️ in `Calculator.css`) | — |
| Background – Display | Result display area | `.display` | — |
| Background – Button (digit) | Number keys 0-9, decimal | `.calculator-button` | Default variant |
| Background – Button (operator) | `÷ × - +` | `.calculator-button.operator-button` | — |
| Background – Button (clear) | `C` | `.calculator-button.clear-button` | — |
| Background – Button (equals) | `=` | `.calculator-button.equals-button` | — |
| Background – Login card | Auth card surface | `.login-card` | — |
| Text – Primary | Display value, headings | `.display`, `h1`, `.login-title` | — |
| Text – Error | Validation messages | `.login-error` | — |
| Border – Input | Form field borders | `.login-input` | — |

**Theme switching mechanism (canonical):**

```tsx
// Reading saved theme
const [theme, setTheme] = useState<'light' | 'dark'>(() => {
  const savedTheme = localStorage.getItem('calculator-theme')
  return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light'
})

// Applying theme
useEffect(() => {
  localStorage.setItem('calculator-theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
}, [theme])

// Toggle
const toggleTheme = () => {
  setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
}
```

**Theme toggle indicator:**
- Light mode → button shows `🌙` (moon emoji)
- Dark mode → button shows `☀️` (sun emoji)

> ⚠️ **Action required:** Open `App.css`, `Calculator.css`, `Button.css`, `Display.css`,
> and `Login.css` to extract the actual hex values for each `[data-theme]` scope and
> populate this table with concrete values like `#1A1A2E`, `#FFFFFF`, etc.

---

### 1.2 Typography

| Element | CSS Class | Font Size | Dynamic Sizing | Weight | Usage |
|---|---|---|---|---|---|
| App heading | `h1` (in `App`) | ⚠️ VERIFY | No | ⚠️ VERIFY | "Mini Calculator" title |
| Display value | `.display` | Default (unset = inherited) | **Yes** — see below | ⚠️ VERIFY | Calculator result |
| Login title | `.login-title` | ⚠️ VERIFY | No | ⚠️ VERIFY | "Sign In" / "Sign Up" |
| Login label | `.login-label` | ⚠️ VERIFY | No | ⚠️ VERIFY | Field labels |
| Login error | `.login-error` | ⚠️ VERIFY | No | ⚠️ VERIFY | Validation text |
| Button label | `.calculator-button` | ⚠️ VERIFY | No | ⚠️ VERIFY | "0"–"9", operators |

**Display dynamic font sizing (canonical implementation):**

```tsx
const dynamicFontSize = useMemo(() => {
  const length = displayValue.length
  if (length <= 8) return undefined   // use CSS default
  if (length <= 12) return '1.5rem'   // 24px at 16px root
  if (length <= 16) return '1.2rem'   // 19.2px at 16px root
  return '1rem'                       // 16px — minimum
}, [displayValue])
```

| Display Length | Font Size |
|---|---|
| 1–8 characters | CSS default (⚠️ verify in `Display.css`) |
| 9–12 characters | `1.5rem` |
| 13–16 characters | `1.2rem` |
| 17+ characters | `1rem` |

---

### 1.3 Spacing System

No formal spacing token scale was found. Spacing is applied per-component in individual
CSS files. ⚠️ **Verify in CSS files** for actual `padding`, `margin`, and `gap` values.

**Canonical convention:** Spacing appears to be defined inline per CSS class rather than
through a shared token system.

> **Recommendation:** Introduce CSS custom properties for spacing:
> `--space-xs: 4px`, `--space-sm: 8px`, `--space-md: 16px`, `--space-lg: 24px`,
> `--space-xl: 32px`.

---

### 1.4 Border Radius

⚠️ Defined in individual CSS files (`Button.css`, `Login.css`). Extract from `.calculator-button`, `.login-card`, `.login-input`, `.login-submit`.

---

### 1.5 Shadows & Elevation

⚠️ Likely applied to `.login-card` and possibly `.calculator` container. Verify in `Login.css` and `Calculator.css`.

---

### 1.6 Z-Index Scale

No z-index layering detected in the component code. The app is single-layer (no modals, drawers, or overlays).

---

## 2. Atoms

### 2.1 Colour Swatches & Surfaces

Two surface contexts exist:

| Surface | Class | Context |
|---|---|---|
| App root | `.app` | Full-page wrapper; theme-aware |
| Card | `.login-card` | Elevated auth card |
| Display | `.display` | Calculator readout |
| Button | `.calculator-button` | Grid cell in calculator |

Theme is applied via:
```html
<div class="app" data-theme="light"> ... </div>
```

---

### 2.2 Typography Elements

Only two heading levels are used:

**h1 — Page Title**
```tsx
<h1>Mini Calculator</h1>
```
Used once, on the calculator page after login.

**h2 — Section Title**
```tsx
<h2 className="login-title">Sign In</h2>
<h2 className="login-title">Sign Up</h2>
```
Used in auth cards.

**Label**
```tsx
<label htmlFor="email" className="login-label">Email</label>
```

**Error text**
```tsx
<p className="login-error" role="alert">{error}</p>
```
Always wrapped with `role="alert"` for accessibility.

---

### 2.3 Icon Usage

No icon library is used. The only iconography is **emoji**:
- `🌙` — light mode indicator (toggle button)
- `☀️` — dark mode indicator (toggle button)

---

### 2.4 Dividers & Lines

No explicit dividers or `<hr>` elements found in the codebase.

---

### 2.5 Spacing Primitives

No shared spacing primitives. Each component's CSS file owns its spacing. See Section 1.3.

---

## 3. Molecules

### 3.1 Button

#### Variants

| Variant | CSS Class(es) | Usage | Labels |
|---|---|---|---|
| **Digit** | `.calculator-button` | Number input | `0` `1` `2` `3` `4` `5` `6` `7` `8` `9` |
| **Decimal** | `.calculator-button` | Decimal point | `.` |
| **Operator** | `.calculator-button .operator-button` | Arithmetic ops | `÷` (`\u00f7`) `×` (`\u00d7`) `-` `+` |
| **Clear** | `.calculator-button .clear-button` | Reset calculator | `C` |
| **Equals** | `.calculator-button .equals-button` | Compute result | `=` |
| **Login Submit** | `.login-submit` | Form submission | `Login`, `Sign Up` |
| **Login Link** | `.login-link` | Navigation | `Sign up`, `Back to login` |
| **Theme Toggle** | (in Calculator) | Toggle light/dark | `🌙` / `☀️` |

#### Component API

```tsx
interface ButtonProps {
  label: string       // Text displayed on the button
  onClick: () => void // Click handler
  className?: string  // Additional CSS class for variant styling
}
```

#### Code Example — Calculator Button (all variants)

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

// Usage — digit
<Button label="7" onClick={() => handleDigit('7')} />

// Usage — operator
<Button label="+" onClick={() => handleOperation('+')} className="operator-button" />

// Usage — clear
<Button label="C" onClick={handleClear} className="clear-button" />

// Usage — equals
<Button label="=" onClick={handleEquals} className="equals-button" />
```

#### Behavioural Notes
- Responds to **click**, **Enter key**, and **Space key** (native `<button>` behaviour — confirmed by tests).
- No disabled state is implemented.
- No loading state exists.
- No explicit hover/active/focus styles are visible in TSX (defined in `Button.css` — ⚠️ verify).

---

### 3.2 Input / Text Field

Used exclusively in the auth forms (Login, Signup).

#### States

| State | Implementation |
|---|---|
| Default | `.login-input` base styles |
| Focused | ⚠️ CSS `:focus` pseudo-class in `Login.css` |
| Error | Error message shown via `.login-error` (not on the input itself) |
| Disabled | Not implemented |

#### Component Pattern (not extracted as a standalone component)

Inputs are inline in Login/Signup — not a reusable atom. Here is the canonical pattern:

```tsx
<div className="login-field">
  <label htmlFor="email" className="login-label">Email</label>
  <input
    id="email"
    type="email"
    className="login-input"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email"
    required
  />
</div>
```

#### Field Types Used

| Field | `type` | `id` | Placeholder |
|---|---|---|---|
| Email | `email` | `email` | "Enter your email" |
| Password | `password` | `password` | "Enter your password" |
| Confirm Password | `password` | `confirm-password` | "Confirm your password" |

> **Inconsistency:** Input fields are not extracted into a reusable `<TextField>` component.
> The same markup pattern is duplicated across `Login.tsx` and `Signup.tsx`.
> **Canonical recommendation:** Extract a `<FormField>` atom.

---

### 3.3–3.7 Badge, Avatar, Checkbox, Radio, Toggle, Select, Dropdown, Tooltip

**Not present in this codebase.** This is a minimal calculator app.

---

## 4. Organisms

### 4.1 Form — Auth Form

Two forms exist: **Login** and **Signup**. They share the same CSS (`Login.css`) and identical structural patterns.

#### Login Form

```tsx
import React, { useState } from 'react'
import './Login.css'
import { validateCredentials } from '../auth/credentialStore'

interface LoginProps {
  onLogin: () => void
  onGoToSignup?: () => void
}

export function Login({ onLogin, onGoToSignup }: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateCredentials(email, password)) {
      setError('')
      onLogin()
    } else {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign In</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email" className="login-label">Email</label>
            <input
              id="email"
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password" className="login-label">Password</label>
            <input
              id="password"
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit">Login</button>
          <button type="button" className="login-link" onClick={onGoToSignup ?? (() => {})}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}
```

#### Signup Form

```tsx
import React, { useState } from 'react'
import './Login.css'
import { addCredential, emailExists } from '../auth/credentialStore'

interface SignupProps {
  onSignup: () => void
  onGoToLogin: () => void
}

export function Signup({ onSignup, onGoToLogin }: SignupProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (emailExists(email)) {
      setError('An account with this email already exists.')
      return
    }
    addCredential(email, password)
    setError('')
    onSignup()
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Sign Up</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          {/* email field */}
          {/* password field */}
          {/* confirm password field */}
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit">Sign Up</button>
          <button type="button" className="login-link" onClick={onGoToLogin}>
            Back to login
          </button>
        </form>
      </div>
    </div>
  )
}
```

#### Form Structure (canonical)

```
.login-container          ← full-page centering wrapper
  └─ .login-card          ← elevated card surface
       ├─ .login-title    ← h2 heading
       └─ .login-form     ← <form>
            ├─ .login-field  ← field wrapper (repeated)
            │    ├─ .login-label
            │    └─ .login-input
            ├─ .login-error  ← conditional, role="alert"
            ├─ .login-submit ← primary action button
            └─ .login-link   ← secondary navigation button
```

#### Validation Messages

| Context | Error Message |
|---|---|
| Login — bad credentials | `"Invalid email or password."` |
| Signup — password mismatch | `"Passwords do not match."` |
| Signup — duplicate email | `"An account with this email already exists."` |

All errors render as `<p className="login-error" role="alert">`.

---

### 4.2 Card — Login Card

The only card pattern is `.login-card` inside `.login-container`. There is no generic
`<Card>` component. ⚠️ Visual properties (shadow, border-radius, padding) are in `Login.css`.

---

### 4.3 Calculator

The Calculator is the primary organism after authentication.

#### Structure

```
.calculator               ← main container
  ├─ <Display />          ← .display — shows current value
  ├─ Theme toggle button  ← aria-label="Toggle theme"
  └─ Button grid          ← layout via CSS Grid (⚠️ verify in Calculator.css)
       Row 1: C  ÷  ×  -
       Row 2: 7  8  9  +
       Row 3: 4  5  6  =
       Row 4: 1  2  3  .
       Row 5: 0 (spans columns)
```

#### Button Layout (from test: `expectedButtons`)

```
['C', '÷', '×', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '.', '0']
```

#### Display Component

```tsx
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
```

#### Calculator State Machine

| State | Behaviour |
|---|---|
| Initial | Display shows `"0"` |
| Digit entry | Replaces leading `"0"`; appends otherwise |
| Decimal | Adds `"."` if not already present; `"0."` if display was reset |
| Operator | Stores current value as `previousValue`, sets `operation`, flags `shouldResetDisplay` |
| Equals | Computes `previousValue [op] currentValue`, displays result |
| Clear (`C`) | Resets to initial state |
| Error recovery | Any digit press after `"Error"` resets to that digit |
| Division by zero | Returns `"Error"` |
| Range check | `Math.abs(num) <= 9999999999` — otherwise `"Error"` |
| Precision | Rounds to 14 significant digits to mitigate IEEE 754 artifacts |

---

### 4.4–4.6 Navigation, Table, Toast

**Not present in this codebase.**

---

## 5. Templates & Layout Patterns

### 5.1 Page Layout

Two page states controlled by `isAuthenticated`:

**Unauthenticated:**
```tsx
<div className="app" data-theme={theme}>
  {view === 'login' ? <Login /> : <Signup />}
</div>
```

**Authenticated:**
```tsx
<div className="app" data-theme={theme}>
  <h1>Mini Calculator</h1>
  <Calculator />
</div>
```

The `.app` class is the outermost layout wrapper. It is expected to be a centered flex/grid container (⚠️ verify in `App.css`).

### 5.2 Responsive Behaviour

The Display component tests reference viewports:
- **Mobile:** 375×667
- **Tablet:** 768×1024

No CSS breakpoints are visible in TSX. Responsive rules are in CSS files (⚠️ verify).

The Display's dynamic font sizing (Section 1.2) is the primary responsive content adaptation.

### 5.3 Empty States

Not applicable — the calculator always shows `"0"` as its initial/empty state.

### 5.4 Loading States

Not implemented. No spinners, skeletons, or loading indicators exist.

### 5.5 Error States

| Error Type | Display | Pattern |
|---|---|---|
| Calculation error | `"Error"` in `.display` | Division by zero, out of range |
| Auth validation error | `<p class="login-error" role="alert">` | Inline below form fields |

---

## 6. Interaction & Animation

### 6.1 Transition Conventions

No transitions or animations are defined in the TSX layer. Any transitions are in CSS files (⚠️ verify for button hover/active transitions).

### 6.2 Focus & Accessibility

| Feature | Implementation |
|---|---|
| Error announcements | `role="alert"` on `.login-error` |
| Form labels | Explicit `<label htmlFor="...">` on all inputs |
| Required fields | `required` attribute on all auth inputs |
| Keyboard support | Native `<button>` and `<input>` — Enter and Space work (confirmed by tests) |
| Theme toggle | `aria-label="Toggle theme"` (referenced in tests) |
| Focus ring | ⚠️ Verify in CSS — likely browser default or custom `:focus` styles |

---

## 7. Platform-Specific Rules

Not applicable — this is a web-only React SPA.

---

## 8. Anti-Patterns & Inconsistencies

| # | Issue | Location | Recommendation |
|---|---|---|---|
| 1 | **No design tokens file.** Colours, spacing, radii, and shadows are scattered across 5 CSS files with no shared custom properties. | `*.css` | Create a `tokens.css` or `:root` block in `App.css` defining all `--color-*`, `--space-*`, `--radius-*`, `--shadow-*` variables. |
| 2 | **Form fields are not reusable.** The label + input pattern is duplicated verbatim in `Login.tsx` and `Signup.tsx`. | `Login.tsx`, `Signup.tsx` | Extract a `<FormField label type id placeholder value onChange />` atom. |
| 3 | **Signup imports `Login.css`** instead of its own stylesheet. | `Signup.tsx` → `import './Login.css'` | This is intentional (shared styles) but fragile. Consider renaming to `Auth.css` or co-locating shared auth styles. |
| 4 | **`onGoToSignup` is optional** in `LoginProps` but always provided in practice. The fallback `() => {}` is a no-op smell. | `Login.tsx` | Make `onGoToSignup` required or handle the missing case explicitly in UI (hide the button). |
| 5 | **No reusable error component.** Error display (`<p className="login-error" role="alert">`) is inlined. | `Login.tsx`, `Signup.tsx` | Extract `<InlineError message={string} />`. |
| 6 | **Theme toggle button lives inside `Calculator`**, coupling theme switching to a specific view. | `Calculator.tsx` | Move theme toggle to `App.tsx` layout level so it's accessible on auth pages too. |
| 7 | **`window.history.pushState`** is called directly for routing without any router library or consistent pattern. | `App.tsx` | Either adopt a router (`react-router`) or remove the URL manipulation since the app doesn't read `location.pathname`. |
| 8 | **No `max-length` or input constraint** on calculator display — users can enter arbitrarily long numbers. | `Calculator.tsx` | Add a character limit (e.g., 16 digits) and prevent further input. |
| 9 | **Display accepts both `string` and `number`** but always converts to string internally. | `Display.tsx` | Consider accepting only `string` to make the contract explicit. |

---

## Appendix: CSS Class Reference

All CSS classes used in the codebase, grouped by file:

| CSS File | Classes |
|---|---|
| `App.css` | `.app` |
| `Calculator.css` | `.calculator` (⚠️ assumed) |
| `Display.css` | `.display` |
| `Button.css` | `.calculator-button` |
| `Login.css` | `.login-container`, `.login-card`, `.login-title`, `.login-form`, `.login-field`, `.login-label`, `.login-input`, `.login-error`, `.login-submit`, `.login-link` |

Variant classes (applied via `className` prop on `<Button>`):
| Class | Passed as |
|---|---|
| `.operator-button` | `className="operator-button"` |
| `.clear-button` | `className="clear-button"` |
| `.equals-button` | `className="equals-button"` |

---

## Appendix: File Dependency Map

```
App.tsx
├── App.css
├── Calculator.tsx
│   ├── Calculator.css
│   ├── Display.tsx → Display.css
│   └── Button.tsx  → Button.css
├── Login.tsx → Login.css
├── Signup.tsx → Login.css (shared)
└── auth/credentialStore.ts
```

---

> **Next step:** To complete this design system with pixel-perfect token values, extract
> all CSS custom properties, hex colours, `px`/`rem` values, `border-radius`,
> `box-shadow`, `transition`, and media queries from the five CSS files listed above
> and backfill the ⚠️ VERIFY markers in this document.