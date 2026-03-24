# Project Standards — eunomia-mini-calculator

## 1. Project Overview

A single-page mini calculator application built with React and TypeScript. It supports basic arithmetic operations (addition, subtraction, multiplication, division), decimal input, error handling (division by zero), and a light/dark theme toggle with `localStorage` persistence. The UI is responsive across desktop, tablet, mobile, and extra-small viewports.

## 2. Tech Stack & Versions

| Technology | Version | Purpose |
|---|---|---|
| React | ^18.2.0 | UI library |
| React DOM | ^18.2.0 | DOM rendering |
| TypeScript | ^5.3.0 | Type system |
| Vite | ^5.0.0 | Bundler & dev server |
| Vitest | ^1.0.0 | Unit/component testing |
| @testing-library/react | ^14.1.0 | Component test utilities |
| @testing-library/user-event | ^14.6.1 | Simulated user interaction in tests |
| @testing-library/jest-dom | ^6.1.0 | Custom DOM matchers |
| Playwright | ^1.58.2 | Visual/E2E testing (scripts only) |
| ESLint | ^8.55.0 | Linting |
| @typescript-eslint/* | ^8.56.1 | TypeScript-aware lint rules |
| eslint-plugin-react | ^7.37.5 | React-specific lint rules |
| jsdom | ^28.1.0 | Test DOM environment |
| Node runtime | ES2020 target | Server / tooling runtime |

- **Module system:** ESM (`"type": "module"` in `package.json`, `"module": "ESNext"` in tsconfig)
- **JSX transform:** Automatic (`"jsx": "react-jsx"`) — do **not** import `React` for JSX; only import it when you explicitly use the `React` namespace (e.g., `React.StrictMode`).
- **Strict mode (TS):** `false` — the project does **not** enable TypeScript strict checks.

## 3. Design Language

### 3.1 Color Palette & Theming

All colors are defined as CSS custom properties on `:root` (light) and `[data-theme='dark']` (dark). **Never use hard-coded color values in component CSS.** Always reference a `var(--*)` token.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--app-bg` | `#ffffff` | `#1a1a1a` | Page background |
| `--app-text` | `#333333` | `#e0e0e0` | General text |
| `--calculator-bg` | `#e8e8e8` | `#2a2a2a` | Calculator container |
| `--display-bg` | `#f5f5f5` | `#1f1f1f` | Display background |
| `--display-text` | `#333333` | `#e0e0e0` | Display text |
| `--button-bg-start/end` | `#ffffff` / `#f5f5f5` | `#3a3a3a` / `#2f2f2f` | Button gradient |
| `--button-text` | `#333333` | `#e0e0e0` | Button label |
| `--button-focus-outline` | `#4a9eff` | `#5ab3ff` | Focus ring |

Theme is toggled via `data-theme` attribute set on both the `.app` wrapper **and** `document.documentElement`.

### 3.2 Typography

- **Display:** `'Courier New', monospace`, `font-weight: 500`, base `2rem` (scales down responsively).
- **Buttons:** System default font stack, `font-weight: 600`, base `1.5rem`.
- No external fonts are loaded.

### 3.3 Spacing System

Spacing uses `rem` units exclusively in CSS. No pixel values for padding/margin except borders (`1px`, `2px`) and explicit min-height/min-width for accessibility (`44px`).

| Context | Base | Tablet (≤768px) | Mobile (≤480px) | XS (≤320px) |
|---|---|---|---|---|
| Calculator padding | `1rem` | `1rem` | `0.75rem` | — |
| Button padding | `1.25rem` | `1.125rem` | `1rem` | `0.875rem` |
| Display padding | `1.5rem` | `1.25rem` | `1rem` | `0.75rem` |
| Grid gap | `0.5rem` | `0.625rem` | `0.5rem` | `0.375rem` |

### 3.4 Responsive Breakpoints

Mobile-first thinking, implemented with `max-width` media queries:

| Breakpoint | Label | Target |
|---|---|---|
| `> 768px` | Desktop (default) | Full padding/spacing |
| `≤ 768px` | Tablet | Moderate reduction |
| `≤ 480px` | Mobile | Compact layout |
| `≤ 320px` | Extra-small | Minimal spacing |

**Accessibility mandate:** All interactive elements must maintain a minimum touch target of **44×44 px** (`min-height: 44px; min-width: 44px`) at every breakpoint (WCAG 2.1 AAA).

### 3.5 Component Visual Patterns

- **Buttons:** Linear gradient background (`180deg`), `border-radius: 8px` (scales to `6px`/`4px`), subtle `box-shadow`, `translateY` hover/active micro-animation.
- **Display:** Inset `box-shadow`, `border-radius: 8px`, right-aligned text, `text-overflow: ellipsis` for overflow.
- **Calculator container:** Centered (`margin: 0 auto`), `border-radius: 12px`, drop shadow.
- **Transitions:** `0.3s ease` for theme transitions (background, border, color); `0.15s ease` for button interactions; `0.2s ease` for theme toggle icon scale.

### 3.6 Animation Conventions

- Use CSS `transition` only — no JS animation libraries.
- Hover: `transform: translateY(-1px)` + enhanced shadow.
- Active: `transform: translateY(0)` + inset shadow.
- Theme toggle: `transform: scale(1.1)` on hover, `scale(0.95)` on active.

## 4. Code Conventions

### 4.1 Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Component files | `PascalCase.tsx` | `Calculator.tsx`, `Button.tsx` |
| Component CSS files | `PascalCase.css` (co-located, matching component name) | `Calculator.css` |
| Component functions | `PascalCase`, named export | `export function Button() {}` |
| App root component | `PascalCase`, **default** export | `export default function App()` |
| Interfaces/types | `PascalCase`, suffixed with `Props` for component props | `ButtonProps`, `DisplayProps` |
| CSS class names | `kebab-case` | `.calculator-button`, `.button-grid` |
| CSS custom properties | `--kebab-case` | `--button-bg-start` |
| Test files | `ComponentName.test.tsx` (co-located with source) | `Button.test.tsx` |
| State variables | `camelCase` | `currentValue`, `shouldResetDisplay` |
| Event handlers | `handle` + action | `handleDigit`, `handleOperation` |
| Test helpers | `camelCase` | `getButton()`, `clickButtons()` |
| Contexts | `PascalCase` + `Context` | `ThemeContext` |

### 4.2 File & Folder Structure

```
src/
├── App.tsx              # Root component (default export) + context definitions
├── App.css              # Global styles, CSS custom properties, theme definitions
├── App.test.tsx         # Tests for App
├── main.tsx             # Entry point (ReactDOM.createRoot)
├── components/          # All reusable/feature components
│   ├── Calculator.tsx
│   ├── Calculator.css
│   ├── Calculator.test.tsx
│   ├── Button.tsx
│   ├── Button.css
│   ├── Button.test.tsx
│   ├── Display.tsx
│   ├── Display.css
│   └── Display.test.tsx
└── test/
    └── setup.ts         # Vitest global setup (jest-dom, mocks)
```

**Rules:**
- Every component has a co-located `.css` file imported at the top of the component file.
- Test files are co-located next to the source file they test (inside `src/components/` or `src/`).
- Test infrastructure/setup lives in `src/test/`.
- No `index.ts` barrel files are used — import directly from the component file.

### 4.3 Import Ordering

Follow this order (observed convention), separated by blank lines when grouping changes:

1. React core (`react`, `react-dom`)
2. Sibling/child components (relative paths)
3. Context imports from parent modules
4. CSS imports (always last among imports)

```tsx
// Example — Calculator.tsx
import { useState, useContext } from 'react'
import { Display } from './Display'
import { Button } from './Button'
import { ThemeContext } from '../App'
import './Calculator.css'
```

### 4.4 Component Authoring

- Use **function declarations** (`export function Component()`) — not arrow-function components.
- Use **named exports** for all components except `App`, which uses a **default export**.
- Define the `Props` interface directly above the component in the same file. Do not create a separate types file for simple prop interfaces.
- Destructure props in the function signature.

```tsx
// Canonical component pattern
import './MyComponent.css'

interface MyComponentProps {
  label: string
  onClick: () => void
  className?: string
}

export function MyComponent({ label, onClick, className = '' }: MyComponentProps) {
  return <button className={`my-component${className ? ' ' + className : ''}`} onClick={onClick}>{label}</button>
}
```

### 4.5 Comment Style

- **CSS files:** Block comment header at the top of each file describing the component's responsive strategy and key design decisions. Use `/* */` style.
- **TypeScript files:** No JSDoc or block headers are used. Code is expected to be self-documenting. Inline comments only when logic is non-obvious.

## 5. Architecture Patterns

### 5.1 Component Hierarchy

```
App (root, owns theme state + context)
└── ThemeContext.Provider
    └── Calculator (owns calculator state)
        ├── ThemeToggle (inline button in Calculator)
        ├── Display (pure presentational)
        └── Button (pure presentational, multiple instances)
```

### 5.2 State Management

- **React `useState` only** — no external state management library.
- **Context API** for cross-cutting concerns (theme). Created and provided in `App.tsx`.
- Calculator logic state (`currentValue`, `previousValue`, `operation`, `shouldResetDisplay`) is co-located in the `Calculator` component via `useState`.
- Theme state lives in `App` with `localStorage` persistence via `useEffect`.

**Rule:** Do not introduce Redux, Zustand, or other state libraries. Use `useState` for local state; use `useContext` for shared state only when prop-drilling exceeds two levels.

### 5.3 Styling Architecture

- **Plain CSS with CSS custom properties** — no CSS-in-JS, CSS modules, Tailwind, or preprocessors.
- One CSS file per component, imported at the top of the component's `.tsx` file.
- Global theme variables defined in `App.css` on `:root` and `[data-theme='dark']`.
- Responsive design via `@media (max-width: ...)` queries inside each component's CSS file.

### 5.4 Error Handling

- Division by zero returns the string `"Error"` displayed in the calculator.
- When in `Error` state, digit input resets the display; operator input is blocked.
- No `try/catch` blocks or error boundaries are present. This is acceptable given the project scope.

## 6. Testing Conventions

### 6.1 Framework & Setup

- **Vitest** with `globals: true` (no need to import `describe`, `it`, `expect`, `beforeEach`).
- **jsdom** environment configured in `vite.config.ts`.
- **`@testing-library/jest-dom`** imported in `src/test/setup.ts` for custom matchers.
- **`@testing-library/user-event`** (`userEvent.setup()`) for all user interaction simulation — do not use `fireEvent`.

### 6.2 Test File Naming & Placement

- Test files: `ComponentName.test.tsx`, co-located with the component.
- Test setup files: `src/test/setup.ts`.
- Test files are **excluded** from TypeScript compilation via `tsconfig.json` `exclude` array.

### 6.3 Test Structure

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentUnderTest } from './ComponentUnderTest'

describe('ComponentUnderTest', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    render(<ComponentUnderTest />)
  })

  describe('feature group', () => {
    it('specific behavior description', async () => {
      // Arrange (in beforeEach or inline)
      // Act
      await user.click(screen.getByRole('button', { name: 'X' }))
      // Assert
      expect(screen.getByText('expected')).toBeInTheDocument()
    })
  })
})
```

**Rules:**
- Use nested `describe` blocks to group related behaviors (e.g., `'digit input'`, `'decimal point handling'`).
- Use `vi.fn()` for mock functions.
- Query elements by **role** first (`getByRole`), then by **text** (`getByText`). Avoid `getByTestId` unless no semantic alternative exists.
- Prefer helper functions at the top of test files to reduce repetition (e.g., `getButton()`, `getDisplay()`, `clickButtons()`).
- Use `async/await` with `userEvent` — all user interactions are asynchronous.

### 6.4 What Must Be Tested

- All component rendering (default state, various prop values).
- User interactions (click, keyboard activation).
- State transitions (calculator operations, theme toggling).
- Edge cases (division by zero, multiple decimal points, long numbers, error recovery).
- Persistence behavior (localStorage read/write for theme).

### 6.5 Visual / E2E Testing

Playwright scripts exist as standalone `.js` files in the project root for visual regression testing. These are **not** part of the `npm test` pipeline and are run manually.

## 7. Known Inconsistencies & Resolutions

### 7.1 Module System Inconsistency in Playwright Scripts

**Issue:** `playwright-visual-test.js` uses ESM (`import { chromium } from 'playwright'`), while `screenshot.js` uses CommonJS (`const { chromium } = require('playwright')`).

**Canonical standard:** Use **ESM** (`import`/`export`) for all JavaScript and TypeScript files. The project is configured with `"type": "module"`. `screenshot.js` is non-conformant.

### 7.2 Default Export vs Named Export

**Issue:** `App.tsx` uses `export default function App()`, while all other components use named exports (`export function Button()`).

**Canonical standard:** Use **named exports** for all components. `App.tsx`'s default export is the **sole exception** — it is acceptable because Vite/React conventions expect the root App to be a default export. Do not use default exports for any other component.

### 7.3 `ThemeContext` Defined in `App.tsx`

**Issue:** The `ThemeContext` is created and exported from `App.tsx` rather than a dedicated context file.

**Canonical standard (going forward):** For a project of this size, this is acceptable. If additional contexts are introduced, create a `src/contexts/` directory with one file per context (e.g., `src/contexts/ThemeContext.ts`).

### 7.4 Vitest `globals: true` but Inconsistent Imports

**Issue:** `App.test.tsx` explicitly imports `{ describe, it, expect, beforeEach }` from `vitest`, while `Calculator.test.tsx` and `Display.test.tsx` rely on globals (no import).

**Canonical standard:** Rely on **Vitest globals** — do **not** import `describe`, `it`, `expect`, `beforeEach` from `vitest`. Only import `vi` when needed for mocking.

```tsx
// ✅ Correct
import { vi } from 'vitest'  // only when using vi.fn(), vi.mock(), etc.

// ❌ Do not do this
import { describe, it, expect, beforeEach } from 'vitest'
```

### 7.5 `Display` Prop Type Accepts `string | number`

**Issue:** `DisplayProps.value` is typed as `string | number`, but the `Calculator` component only ever passes strings. The union type adds unnecessary complexity.

**Canonical standard:** Keep the `string | number` union for now since tests exercise both. If the component is refactored, prefer `string` only and convert numbers before passing.

## 8. Anti-Patterns (Do NOT Do These)

### 8.1 Do Not Use Hard-Coded Colors in CSS
All colors must use CSS custom properties from `App.css`. Never write `color: #333` directly in a component CSS file.

### 8.2 Do Not Use `fireEvent` in Tests
Always use `@testing-library/user-event` (`userEvent.setup()`) for simulating user interactions. It more accurately models real user behavior.

### 8.3 Do Not Use `px` for Spacing
Use `rem` for all padding, margin, gap, and font-size values. The only exceptions are:
- Borders (`1px`, `2px`)
- Minimum touch targets (`44px` for accessibility)

### 8.4 Do Not Use Arrow Functions for Component Definitions
```tsx
// ❌ Do not do this
const Button = ({ label }: ButtonProps) => { ... }

// ✅ Do this
export function Button({ label }: ButtonProps) { ... }
```

### 8.5 Do Not Use CSS Modules, CSS-in-JS, or Tailwind
This project uses plain CSS with CSS custom properties. Do not introduce styled-components, emotion, CSS modules, or utility-class frameworks.

### 8.6 Do Not Use CommonJS Syntax
The project is ESM-only. Never use `require()` or `module.exports`. Always use `import`/`export`.

### 8.7 Do Not Add External State Management Libraries
Use `useState` for local state and `useContext` for shared state. Do not introduce Redux, Zustand, Jotai, or similar libraries.

### 8.8 Do Not Use `getByTestId` in Tests
Prefer semantic queries: `getByRole`, `getByText`, `getByLabelText`. Add `data-testid` only as a last resort.

### 8.9 Do Not Skip Accessibility in Responsive Styles
Every responsive breakpoint must preserve the `44px` minimum touch target on interactive elements. Never reduce `min-height` or `min-width` below `44px`.