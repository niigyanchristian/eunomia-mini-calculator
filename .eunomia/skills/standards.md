# Project Standards — eunomia-mini-calculator

## 1. Project Overview

**eunomia-mini-calculator** is a single-page frontend calculator application built with React and TypeScript. It provides basic arithmetic operations (addition, subtraction, multiplication, division), decimal support, and a light/dark theme toggle with localStorage persistence. The UI is fully responsive across desktop, tablet, mobile, and extra-small viewports, with WCAG 2.1 accessibility considerations (44px minimum touch targets, focus outlines).

**Project type:** Frontend SPA (no backend, no routing)
**Total source files:** ~14 in `src/`
**Deployment:** Dockerized, served via Vite

---

## 2. Tech Stack & Versions

| Technology | Version | Purpose |
|---|---|---|
| TypeScript | ^5.3.0 | Language |
| React | ^18.2.0 | UI framework |
| React DOM | ^18.2.0 | DOM rendering |
| Vite | ^5.0.0 | Bundler & dev server |
| Vitest | ^1.0.0 | Unit test runner |
| @testing-library/react | ^14.1.0 | Component testing |
| @testing-library/user-event | ^14.6.1 | User interaction simulation |
| @testing-library/jest-dom | ^6.1.0 | DOM assertion matchers |
| Playwright | ^1.58.2 | Visual/E2E testing |
| ESLint | ^8.55.0 | Linting |
| @typescript-eslint/parser | ^8.56.1 | TS parsing for ESLint |
| lucide-react | ^0.400.0 | Icon library (Moon/Sun icons) |
| Node.js | (runtime) | Development runtime |
| npm | (package manager) | Dependency management |

**Module system:** ESM (`"type": "module"` in package.json)
**Target:** ES2020
**JSX transform:** `react-jsx` (automatic — no `import React` needed for JSX)
**TypeScript strict mode:** `false` (see §8 for resolution)

---

## 3. Design Language

### 3.1 Theme System

The app supports two themes — **light** (default) and **dark** — controlled via CSS custom properties on `:root` and `[data-theme='dark']`.

- Theme state is stored in React state, synced to `localStorage` under key `"calculator-theme"`, and applied as a `data-theme` attribute on both the `.app` wrapper and `document.documentElement`.
- All color references in CSS **must** use `var(--token-name)`. Never use hardcoded color values in component CSS.

### 3.2 Color Palette (CSS Custom Properties)

All colors are defined in `src/App.css` under `:root` (light) and `[data-theme='dark']`.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--app-bg` | `#ffffff` | `#1a1a1a` | Page background |
| `--app-text` | `#333333` | `#e0e0e0` | General text |
| `--calculator-bg` | `#e8e8e8` | `#2a2a2a` | Calculator container |
| `--display-bg` | `#f5f5f5` | `#1f1f1f` | Display background |
| `--display-text` | `#333333` | `#e0e0e0` | Display text |
| `--button-bg-start` | `#ffffff` | `#3a3a3a` | Button gradient start |
| `--button-bg-end` | `#f5f5f5` | `#2f2f2f` | Button gradient end |
| `--button-text` | `#333333` | `#e0e0e0` | Button label color |
| `--button-focus-outline` | `#4a9eff` | `#5ab3ff` | Focus ring |

**Rule:** When adding new UI elements, define new custom properties in `App.css` under both `:root` and `[data-theme='dark']`. Do not introduce one-off colors.

### 3.3 Typography

- **Display font:** `'Courier New', monospace` (calculator display only)
- **Button font:** System default, `font-weight: 600`, size scales per breakpoint (1.5rem → 1.125rem)
- **Display font size:** Scales from `2rem` (desktop) down to `1.25rem` (<320px)

### 3.4 Spacing System

Spacing uses `rem` units throughout. There is no formal spacing scale — values are applied contextually:

| Context | Value |
|---|---|
| Calculator padding | `1rem` |
| Button padding (desktop) | `1.25rem` |
| Button grid gap | `0.5rem` (desktop), `0.625rem` (tablet) |
| Display margin-bottom | `1rem` |
| Display margin-top | `2rem` (desktop) → `1.25rem` (<320px) |

**Rule:** Always use `rem` for spacing. Do not use `px` for padding, margin, or gap.

### 3.5 Responsive Breakpoints (Mobile-First Adjustment)

Despite the comment claiming "mobile-first," the actual CSS uses **desktop-first** `max-width` media queries. This is the canonical pattern:

| Breakpoint | Target | Max-width |
|---|---|---|
| Desktop | 769px+ | (base styles) |
| Tablet | 481px–768px | `@media (max-width: 768px)` |
| Mobile | 320px–480px | `@media (max-width: 480px)` |
| Extra small | <320px | `@media (max-width: 320px)` |

**Rule:** Use `max-width` media queries (desktop-first). Define base styles for desktop, then override downward.

### 3.6 Accessibility Requirements

- All interactive elements must have a **minimum 44×44px touch target** (WCAG 2.1 AAA).
- Buttons must have visible `:focus` outlines (`outline: 2px solid var(--button-focus-outline); outline-offset: 2px`).
- Theme transition uses `transition: 0.3s ease` on background/color changes.
- Buttons use `transition: all 0.15s ease` for hover/active states.

### 3.7 Component Patterns

- Components are **function components** using named exports (`export function ComponentName`).
- The only exception is `App`, which uses a **default export** (`export default function App`).
- Props are defined as inline `interface` declarations in the same file, named `{ComponentName}Props`.
- CSS is component-scoped via co-located CSS files imported directly into the component.

### 3.8 Animation Conventions

- Theme transitions: `transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease`
- Button hover: `transform: translateY(-1px)` with `0.15s ease`
- Button active: `transform: translateY(0)` (return to baseline)
- Theme toggle hover: `transform: scale(1.1)`; active: `transform: scale(0.95)`

---

## 4. Code Conventions

### 4.1 Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `Calculator.tsx`, `Button.tsx` |
| Component CSS files | PascalCase `.css` (matches component) | `Calculator.css`, `Button.css` |
| Component functions | PascalCase, named export | `export function Calculator()` |
| App root component | PascalCase, default export | `export default function App()` |
| Props interfaces | `{Component}Props` | `ButtonProps`, `DisplayProps` |
| CSS classes | kebab-case | `.calculator-button`, `.button-grid` |
| State variables | camelCase | `currentValue`, `shouldResetDisplay` |
| Handler functions | `handle{Action}` | `handleDigit`, `handleOperation` |
| Test files | `{ComponentName}.test.tsx` | `Button.test.tsx` |
| Context objects | PascalCase + `Context` | `ThemeContext` |

### 4.2 File & Folder Structure

```
src/
├── App.tsx              # Root component (default export + ThemeContext)
├── App.css              # Global styles, CSS custom properties, theme definitions
├── App.test.tsx         # Tests for App
├── main.tsx             # Entry point (ReactDOM.createRoot)
├── components/
│   ├── Button.tsx       # Presentational component
│   ├── Button.css
│   ├── Button.test.tsx
│   ├── Calculator.tsx   # Stateful container component
│   ├── Calculator.css
│   ├── Calculator.test.tsx
│   ├── Display.tsx      # Presentational component
│   ├── Display.css
│   └── Display.test.tsx
└── test/
    └── setup.ts         # Vitest setup (jest-dom matchers, mocks)
```

**Rules:**
- Components live in `src/components/` with co-located `.css` and `.test.tsx` files.
- The root `App` component lives directly in `src/`.
- Test setup and shared test utilities live in `src/test/`.
- Each component has exactly one `.tsx`, one `.css`, and one `.test.tsx` file.

### 4.3 Import Ordering

Imports follow this order (observed from all component files):

1. React/framework imports (`react`, `react-dom`)
2. Third-party libraries (`lucide-react`, `@testing-library/*`, `vitest`)
3. Local components (`./components/Calculator`)
4. Context imports (`../App` for `ThemeContext`)
5. CSS imports (`./Component.css`)

```tsx
// Example: Calculator.tsx
import { useState, useContext } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Display } from './Display'
import { Button } from './Button'
import { ThemeContext } from '../App'
import './Calculator.css'
```

**Rule:** CSS imports are always last. No blank lines between import groups (current pattern).

### 4.4 Comment Style

- **CSS files:** Block comments at the top of each file documenting responsive strategy, breakpoints, and design rationale. Inline comments for individual media queries.
- **TypeScript files:** No JSDoc or inline comments (code is self-documenting). Do not add unnecessary comments to `.tsx` files.

```css
/* Correct — CSS file header */
/*
 * Button Component - Responsive Design
 *
 * Touch Target Requirements:
 * - Minimum 44px x 44px for touch accessibility (WCAG 2.1 Level AAA)
 */
```

### 4.5 Export Style

- Components in `src/components/` use **named exports**: `export function Button()`
- The root `App` component uses a **default export**: `export default function App()`
- Context objects are **named exports** from the file that defines them: `export const ThemeContext`

**Rule:** All new components must use named exports. Default exports are reserved for `App.tsx` only.

---

## 5. Architecture Patterns

### 5.1 Component Architecture

The project follows a simple **container/presentational** pattern:

- **Container component:** `Calculator` — owns all calculator state, defines handlers, renders child components.
- **Presentational components:** `Button`, `Display` — receive data and callbacks via props, contain no business logic.
- **Root component:** `App` — owns theme state, provides `ThemeContext`, renders `Calculator`.

### 5.2 State Management

- **Local state only** — all state is managed via `useState` hooks. No external state library.
- **Context API** — used exclusively for cross-cutting concerns (theme). `ThemeContext` is defined in `App.tsx` and consumed via `useContext` in child components.
- **No prop drilling for theme** — always consume `ThemeContext` rather than passing theme as props.

```tsx
// Canonical: use context for theme
const { theme, toggleTheme } = useContext(ThemeContext)

// Anti-pattern: do NOT pass theme as prop
<Calculator theme={theme} />  // ❌
```

### 5.3 State Shape (Calculator)

| State Variable | Type | Purpose |
|---|---|---|
| `currentValue` | `string` | Currently displayed value |
| `previousValue` | `string` | Left operand stored during operation |
| `operation` | `string` | Pending arithmetic operator |
| `shouldResetDisplay` | `boolean` | Flag to clear display on next digit input |

**Rule:** Calculator values are stored as **strings**, not numbers. Parsing to `number` happens only at calculation time via `parseFloat()`.

### 5.4 Persistence

- Theme preference persists in `localStorage` under key `"calculator-theme"`.
- State is read from localStorage in the `useState` initializer (lazy init pattern).
- State is written to localStorage in a `useEffect` that depends on the state value.

```tsx
// Canonical localStorage pattern
const [theme, setTheme] = useState<'light' | 'dark'>(() => {
  const saved = localStorage.getItem('calculator-theme')
  return (saved === 'dark' || saved === 'light') ? saved : 'light'
})

useEffect(() => {
  localStorage.setItem('calculator-theme', theme)
}, [theme])
```

### 5.5 Error Handling

- Division by zero returns the string `"Error"` as the display value.
- The `"Error"` state is checked at the top of handler functions; most operations are blocked during error state.
- Entering a new digit clears the error state.
- There is no global error boundary.

---

## 6. Styling Conventions

### 6.1 CSS Architecture

- **Plain CSS** with component-scoped files (no CSS modules, no CSS-in-JS, no Tailwind).
- Each component imports its own `.css` file.
- Global styles and CSS custom property definitions live in `App.css`.
- The global box-sizing reset (`box-sizing: border-box`) is defined in `App.css`.

**Rule:** Do not introduce CSS modules, styled-components, Tailwind, or any CSS-in-JS solution. Use plain `.css` files.

### 6.2 CSS Class Naming

- Use **flat kebab-case** class names: `.calculator-button`, `.button-grid`, `.theme-toggle`.
- No BEM methodology, no nesting-based naming.
- Component root elements use the component concept as class name: `.calculator`, `.display`.
- Modifier classes are simple descriptive words: `.wide`.

### 6.3 Layout

- The calculator uses `CSS Grid` for the button layout: `grid-template-columns: repeat(4, 1fr)`.
- The wide button (e.g., "0") spans full width via `.wide { grid-column: span 4; }`.
- Centering is achieved via `margin: 0 auto` on the calculator container.
- The calculator has a `max-width: 320px` on desktop, expanding to `100%` on tablet/mobile.

---

## 7. Testing Conventions

### 7.1 Test Framework & Setup

- **Test runner:** Vitest with `globals: true` (no need to import `describe`, `it`, `expect`, `beforeEach`).
- **DOM environment:** jsdom
- **Setup file:** `src/test/setup.ts` — imports `@testing-library/jest-dom` and provides a `localStorage` mock.
- **User interaction:** Always use `@testing-library/user-event` (not `fireEvent`).

### 7.2 Test File Naming & Placement

- Test files are co-located with their component: `src/components/Button.test.tsx`
- Test file naming: `{ComponentName}.test.tsx`
- E2E/visual test scripts live at the project root: `playwright-visual-test.js`

### 7.3 Test Structure

```tsx
// Canonical test structure
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders without crashing', () => { ... })

  describe('onClick handler', () => {
    it('calls onClick handler when clicked', async () => {
      const user = userEvent.setup()
      // ...
    })
  })
})
```

**Rules:**
- Use `describe` blocks to group related tests. Use nested `describe` for sub-categories.
- Use `screen` queries (not destructured `getByX` from render) as the primary query method.
- Use `userEvent.setup()` at the beginning of tests that involve user interaction. Assign to a `user` variable.
- Mock functions with `vi.fn()`.
- Use helper functions for repetitive test operations (e.g., `getButton()`, `getDisplay()`, `clickButtons()`).

### 7.4 Query Priority

- Prefer `screen.getByRole('button', { name: '5' })` for buttons.
- Use `screen.getByText()` for display content.
- Use `document.querySelector('.display')` when querying by CSS class (used for the display element).
- Use `container.querySelector()` sparingly, only when role/text queries are insufficient.

### 7.5 What Must Be Tested

- **Every component** must have a corresponding `.test.tsx` file.
- **Rendering:** Verify the component renders without crashing.
- **Props:** Verify all prop variations produce correct output.
- **User interactions:** Click, keyboard (Enter, Space) for interactive elements.
- **State transitions:** For stateful components, test the full lifecycle (input → operation → result).
- **Edge cases:** Error states, empty values, boundary conditions.
- **Theme:** Test theme toggle, persistence, and initial load from localStorage.

### 7.6 Visual/E2E Tests

- Playwright scripts are standalone JS files at the project root.
- They test across three viewport sizes: mobile (375×667), tablet (768×1024), desktop (1920×1080).
- Screenshots are saved to `.eunomia/screenshots/qa/`.

---

## 8. Known Inconsistencies & Resolutions

### 8.1 `strict: false` in tsconfig.json

**Issue:** TypeScript strict mode is disabled. This allows implicit `any`, unchecked nulls, and other type-safety gaps.
**Resolution:** The current codebase works under non-strict mode. **For all new code, write as if strict mode were enabled** — explicitly type all function parameters, avoid implicit `any`, and handle null/undefined explicitly. Do not introduce code that would fail under `strict: true`.

### 8.2 CSS comment claims "mobile-first" but uses desktop-first queries

**Issue:** `App.css` header comment says "mobile-first approach" but all media queries use `max-width` (desktop-first).
**Resolution:** The **canonical pattern is desktop-first** (`max-width` queries). The comment is inaccurate. Use `max-width` media queries for all responsive styles.

### 8.3 `screenshot.js` uses CommonJS, `playwright-visual-test.js` uses ESM

**Issue:** Two Playwright scripts exist at the root with different module systems. `screenshot.js` uses `require()` (CommonJS), while `playwright-visual-test.js` uses `import` (ESM). The project has `"type": "module"`, making `screenshot.js` invalid.
**Resolution:** **`playwright-visual-test.js` is the canonical E2E script.** Use ESM (`import`) for all JavaScript files. See §9 for `screenshot.js` deprecation.

### 8.4 App title inconsistency

**Issue:** `package.json` names the project `"eunomia-mini-calculator"`, tests reference `'Mini Calculator'`, but `App.tsx` renders `"Chris's Calculator"`.
**Resolution:** The rendered title in `App.tsx` is the source of truth for UI. Tests should match the actual rendered text.

### 8.5 Display component accepts `string | number` but Calculator only passes `string`

**Issue:** `DisplayProps.value` is typed as `string | number`, and tests exercise both types, but the Calculator only ever passes string values.
**Resolution:** Keep the union type for flexibility, but **Calculator state values are always strings**. The Display component must handle both types.

### 8.6 ThemeContext defined in App.tsx

**Issue:** `ThemeContext` is exported from `App.tsx` alongside the root component, creating a coupling where any component needing theme must import from App.
**Resolution:** This is acceptable for the current project size. If the project grows, extract `ThemeContext` to `src/contexts/ThemeContext.ts`.

---

## 9. Anti-Patterns (Do NOT do these)

### 9.1 ❌ Do not use CommonJS (`require`/`module.exports`)

The project is ESM (`"type": "module"`). `screenshot.js` uses CommonJS and is broken. All new files must use `import`/`export`.

### 9.2 ❌ Do not use `fireEvent` from @testing-library/react

Always use `@testing-library/user-event` for simulating user interactions. `fireEvent` does not simulate the full browser event chain.

```tsx
// ❌ Wrong
fireEvent.click(button)

// ✅ Correct
const user = userEvent.setup()
await user.click(button)
```

### 9.3 ❌ Do not use inline styles in React components

All styling is done via CSS classes in co-located `.css` files. Do not use `style={{}}` props.

### 9.4 ❌ Do not hardcode color values in component CSS

All colors must reference CSS custom properties defined in `App.css`.

```css
/* ❌ Wrong */
.my-element { color: #333333; }

/* ✅ Correct */
.my-element { color: var(--app-text); }
```

### 9.5 ❌ Do not use `px` for spacing

Use `rem` for all padding, margin, gap, and font-size values. `px` is acceptable only for borders (`1px`, `2px`) and minimum touch target sizes (`min-height: 44px`).

### 9.6 ❌ Do not introduce external state management libraries

State is managed via `useState` and `useContext`. Do not add Redux, Zustand, Jotai, or similar unless the project scope fundamentally changes.

### 9.7 ❌ Do not add CSS-in-JS or utility CSS frameworks

The project uses plain CSS with CSS custom properties. Do not introduce styled-components, Emotion, Tailwind, or CSS modules.

### 9.8 ❌ Do not use class components

All components are function components. Do not introduce React class components.

### 9.9 ❌ Do not duplicate the visual test script

`screenshot.js` is a broken duplicate of `playwright-visual-test.js`. Do not create additional screenshot scripts. Use and maintain `playwright-visual-test.js` as the single E2E visual test.