# Project Standards — eunomia-mini-calculator

## 1. Project Overview

A single-page React application implementing a mini calculator with authentication (login/signup). The app features a light/dark theme system, responsive design (mobile-first), and accessibility considerations (WCAG 2.1 touch targets, `prefers-reduced-motion`, focus outlines). Authentication is client-side only using an in-memory credential store.

**Project type:** Frontend SPA
**Complexity:** Small — ~39 files, no external API, no routing library

---

## 2. Tech Stack & Versions

| Technology | Version | Notes |
|---|---|---|
| React | ^18.2.0 | Function components only; no class components |
| React DOM | ^18.2.0 | |
| TypeScript | ^5.3.0 | `strict: false` in tsconfig |
| Vite | ^5.0.0 | Dev server, bundler, test runner host |
| Vitest | ^1.0.0 | Unit/component tests (`globals: true`) |
| @testing-library/react | ^14.1.0 | Component rendering in tests |
| @testing-library/user-event | ^14.6.1 | Simulating user interactions |
| @testing-library/jest-dom | ^6.1.0 | Custom DOM matchers |
| Playwright | ^1.58.2 | Visual/E2E testing (scripts only, not integrated into `npm test`) |
| ESLint | ^8.55.0 | With `@typescript-eslint` and `eslint-plugin-react` |
| Node runtime | ESM (`"type": "module"` in package.json) | |
| Package manager | npm | |

---

## 3. Design Language

### 3.1 Theme System

The project uses **CSS custom properties** (variables) defined in `:root` and overridden via `[data-theme='dark']` in `src/App.css`. The theme attribute is set on both the root `.app` div and `document.documentElement`.

```css
/* Light theme: :root { --app-bg: #ffffff; ... } */
/* Dark theme: [data-theme='dark'] { --app-bg: #1a1a1a; ... } */
```

**Rules:**
- All colors **must** reference CSS custom properties — never use hard-coded hex values in component CSS (exception: the error color `#e74c3c` in `Login.css`, which should be migrated to a variable).
- Theme state lives in `App.tsx` via `useState`, persisted to `localStorage` under key `calculator-theme`.
- Theme is exposed via `ThemeContext` (`createContext` in `App.tsx`); consumed with `useContext`.

### 3.2 Color Palette (Light / Dark)

| Token | Light | Dark |
|---|---|---|
| `--app-bg` | `#ffffff` | `#1a1a1a` |
| `--app-text` | `#333333` | `#e0e0e0` |
| `--calculator-bg` | `#e8e8e8` | `#2a2a2a` |
| `--display-bg` | `#f5f5f5` | `#1f1f1f` |
| `--button-focus-outline` | `#4a9eff` | `#4a9eff` |

All additional tokens (button gradients, shadows, borders) follow the same pattern — see `src/App.css` for the full list.

### 3.3 Typography

- **Display (calculator):** `'Courier New', monospace`, `font-weight: 500`, base `2rem` scaling down per breakpoint.
- **Buttons:** `font-weight: 600`, base `1.5rem`.
- **Login/Signup titles:** `font-size: 1.5rem`, `font-weight: 700`.
- **Labels:** `font-size: 0.875rem`, `font-weight: 600`.
- No global font-family is explicitly set for the app body; only the display has a declared font-family. Future work should define a base font in `App.css`.

### 3.4 Spacing System

Spacing uses **rem units** throughout. There is no formal spacing scale; values are chosen per-component. The dominant increments are `0.25rem`, `0.5rem`, `0.75rem`, `1rem`, `1.25rem`, `1.5rem`, `2rem`.

**Canonical rule:** Use `rem` for all spacing and sizing. Do not use `px` for spacing (px is acceptable only for borders: `1px`, `2px`).

### 3.5 Responsive Breakpoints (Mobile-First)

| Breakpoint | Target |
|---|---|
| Default (no query) | Desktop / large screens (769px+) |
| `max-width: 768px` | Tablet (481–768px) |
| `max-width: 480px` | Mobile (320–480px) |
| `max-width: 320px` | Extra-small devices |
| `max-width: 768px` + `orientation: landscape` | Landscape mobile/tablet |

All breakpoints are defined via `@media (max-width: ...)` in each component's CSS file.

### 3.6 Accessibility

- Buttons maintain **minimum 44×44px** touch targets (WCAG 2.1 Level AAA).
- Focus states use `outline: 2px solid var(--button-focus-outline); outline-offset: 2px`.
- `@media (prefers-reduced-motion: reduce)` disables animations globally.
- Error messages use `role="alert"`.
- Form inputs use associated `<label htmlFor="...">` elements.

### 3.7 Transitions

- Background, color, and border transitions: `0.3s ease`.
- Button interactions (hover/active): `0.15s ease`.
- Theme toggle scale: `0.2s ease`.

All transitions must respect the `prefers-reduced-motion` media query defined in `App.css`.

### 3.8 Component Patterns

- Each component is a **named function export** (not default export), except `App` which uses **default export**.
- Each component that has styles gets a **co-located `.css` file** with the same base name.
- Buttons use CSS **linear gradients** for backgrounds, not flat colors.
- Calculator button grid uses `display: grid; grid-template-columns: repeat(4, 1fr)`.

### 3.9 Navigation / Routing

There is **no routing library**. View switching (login ↔ signup ↔ calculator) is managed via component state in `App.tsx` with `window.history.pushState` for URL updates. Do not introduce a router unless the app grows to warrant it.

---

## 4. Code Conventions

### 4.1 Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `Calculator.tsx`, `Login.tsx` |
| Component CSS files | PascalCase `.css` (matches component) | `Calculator.css`, `Button.css` |
| Non-component TS modules | camelCase `.ts` | `credentialStore.ts` |
| Test files | Same name + `.test.tsx` / `.test.ts` | `Button.test.tsx`, `credentialStore.test.ts` |
| React components | PascalCase named function exports | `export function Calculator()` |
| Props interfaces | `{ComponentName}Props` | `ButtonProps`, `DisplayProps`, `LoginProps` |
| CSS classes | kebab-case | `.calculator-button`, `.login-container` |
| State variables | camelCase | `currentValue`, `shouldResetDisplay` |
| Event handlers | `handle{Action}` inside component, `on{Action}` in props | `handleDigit` / `onLogin` |
| Context objects | PascalCase + `Context` suffix | `ThemeContext` |

### 4.2 File & Folder Structure

```
src/
├── App.tsx              # Root component (default export)
├── App.css              # Global styles, theme variables, resets
├── App.test.tsx          # Integration tests for App
├── main.tsx             # Entry point (ReactDOM.createRoot)
├── auth/
│   ├── credentialStore.ts      # Domain logic module
│   └── credentialStore.test.ts
├── components/
│   ├── Button.tsx       # Presentational component
│   ├── Button.css
│   ├── Button.test.tsx
│   ├── Calculator.tsx   # Stateful container component
│   ├── Calculator.css
│   ├── Calculator.test.tsx
│   ├── Display.tsx
│   ├── Display.css
│   ├── Display.test.tsx
│   ├── Login.tsx
│   ├── Login.css
│   ├── Login.test.tsx
│   ├── Signup.tsx        # Reuses Login.css
│   └── Signup.test.tsx
└── test/
    └── setup.ts          # Vitest global setup (jest-dom, localStorage mock)
```

**Rules:**
- Components live in `src/components/`.
- Non-UI logic modules live in feature directories (`src/auth/`).
- Test files are co-located beside the source file they test.
- Test setup/utilities live in `src/test/`.

### 4.3 Import Ordering

Observed (canonical) order:

```tsx
// 1. React imports
import React, { useState, useEffect, useContext } from 'react'

// 2. Third-party library imports (testing-library, vitest, etc.)

// 3. Local component imports
import { Display } from './Display'
import { Button } from './Button'

// 4. Context / utility imports
import { ThemeContext } from '../App'

// 5. CSS imports (always last among imports)
import './Calculator.css'
```

### 4.4 Comment Style

- CSS files include **block comment headers** explaining responsive breakpoints and design rationale.
- Inline `//` comments are used sparingly in TypeScript for non-obvious logic (e.g., IEEE 754 precision handling).
- Do not add boilerplate or obvious comments. Comments should explain *why*, not *what*.

### 4.5 Formatting

- **No semicolons** in TypeScript/TSX (the codebase is inconsistent here — see §8). **Canonical standard: omit semicolons** since the majority of component code omits them.
- Single quotes for strings in TypeScript.
- **No trailing commas** observed as a consistent rule.
- Arrow functions for callbacks and inline handlers; named `function` declarations for component definitions and exported module functions.

---

## 5. Architecture Patterns

### 5.1 Component Architecture

- **Presentational components** (`Button`, `Display`): Receive data/callbacks via props, render UI, own their CSS.
- **Container components** (`Calculator`): Own state, implement business logic, compose presentational components.
- **Page-level components** (`Login`, `Signup`): Self-contained views with their own form state and validation.
- **Root component** (`App`): Owns global state (auth, theme, view routing), provides context.

### 5.2 State Management

- **React `useState`** for all state. No external state libraries.
- **React `createContext` / `useContext`** for cross-cutting concerns (theme only).
- **`localStorage`** for persistence (theme preference only).
- State is lifted to the nearest common ancestor; no prop drilling beyond one level.

### 5.3 Error Handling

- Form validation errors are stored as component-level string state (`error`).
- Errors render conditionally: `{error && <p className="login-error" role="alert">{error}</p>}`.
- Calculator arithmetic errors (division by zero, overflow) produce the string `'Error'` in the display value.
- There is no global error boundary. Consider adding `<ErrorBoundary>` for production.

---

## 6. API Design

Not applicable — this is a client-only application with no backend API.

---

## 7. Testing Conventions

### 7.1 Framework & Configuration

- **Vitest** with `globals: true` — `describe`, `it`, `expect`, `beforeEach` are globally available (no imports required, though some files import them explicitly from `vitest`).
- **jsdom** environment for all tests.
- Setup file: `src/test/setup.ts` (imports `@testing-library/jest-dom`, mocks `localStorage`).

### 7.2 File Naming & Placement

- Test files are **co-located** with their source: `Component.test.tsx` beside `Component.tsx`.
- Test files are excluded from the TypeScript compilation (`tsconfig.json` excludes `**/*.test.ts`, `**/*.test.tsx`).

### 7.3 Test Structure

```tsx
// Setup
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Helper functions at top of file for repeated actions
function getButton(label: string) {
  return screen.getByRole('button', { name: label })
}

describe('ComponentName', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    render(<Component />)
  })

  it('describes expected behavior', async () => {
    // Arrange → Act → Assert
  })

  describe('sub-feature', () => {
    // Grouped tests
  })
})
```

**Rules:**
- Use `userEvent.setup()` (not `fireEvent`) for simulating user interactions.
- Query elements using **accessible queries** (`getByRole`, `getByLabelText`, `getByText`) — avoid `querySelector` except for CSS class assertions.
- Use `vi.fn()` for mock functions; `vi.mock()` for module mocks.
- Use `vi.resetModules()` or `vi.mocked()` when testing module-level state.
- Every component must have a corresponding test file.
- Test both the happy path and error/edge cases.

### 7.4 What Must Be Tested

- All components: rendering, user interactions, conditional rendering.
- Form components: validation logic, error display, successful submission callbacks.
- Business logic modules (`credentialStore`): all exported functions.
- Theme toggling: persistence, DOM attribute changes, icon state.

### 7.5 E2E / Visual Testing

Playwright scripts exist at the project root (`playwright-visual-test.js`) but are **not** integrated into `npm test`. They are run manually against a live dev server. Future work should formalize this.

---

## 8. Known Inconsistencies & Resolutions

| # | Inconsistency | Resolution (Canonical Standard) |
|---|---|---|
| 1 | **Export style:** `App.tsx` uses `export default function App()`, all other components use `export function Component()` (named exports). | **Named exports** for all components. `App` retains its default export as the single entry-point component. Do not add default exports to any other component. |
| 2 | **Vitest global imports:** Some test files import `{ describe, it, expect }` from `vitest` explicitly, while others rely on `globals: true`. | **Rely on globals** — do not import `describe`, `it`, `expect`, `beforeEach`. **Do** explicitly import `vi` from `vitest` when mocking is needed (since `vi` is not a standard global). |
| 3 | **Semicolons:** `credentialStore.ts` and some test files use semicolons; component files largely omit them. | **Omit semicolons.** Add a Prettier or ESLint rule to enforce this. |
| 4 | **Signup.tsx reuses `Login.css`** instead of having its own CSS file. | **Acceptable** since Signup and Login share identical layout. If Signup diverges visually, extract shared styles to a `Auth.css` and create `Signup.css` for overrides. |
| 5 | **`screenshot.js` uses CommonJS** (`require()`), while `playwright-visual-test.js` uses ESM (`import`). | **Use ESM** for all scripts. The project is `"type": "module"`. Delete or convert `screenshot.js` to ESM. |
| 6 | **`strict: false`** in `tsconfig.json`. | This is intentional for now. Future work should migrate to `"strict": true` incrementally. Do not introduce patterns that rely on `strict: false` (e.g., implicit `any`). |
| 7 | **Error color `#e74c3c` is hard-coded** in `Login.css` instead of using a CSS variable. | Add `--error-color`, `--error-bg`, `--error-border` to the theme variable system and reference them. |

---

## 9. Anti-Patterns (Do NOT Do These)

### 9.1 Do NOT use `fireEvent` from `@testing-library/react`
Always use `@testing-library/user-event` (`userEvent.setup()`) for interaction simulation. It more accurately models real user behavior.

### 9.2 Do NOT use `document.querySelector` in tests for assertions
Use Testing Library's accessible queries (`getByRole`, `getByLabelText`, `getByText`). The only acceptable use of `querySelector` is to check CSS class presence when no accessible query applies.

### 9.3 Do NOT hard-code color values in component CSS
All colors must reference CSS custom properties from the theme system in `App.css`. This ensures theme consistency.

### 9.4 Do NOT create class components
The entire codebase uses function components with hooks. Class components are not permitted.

### 9.5 Do NOT add default exports to non-root components
Only `App.tsx` uses a default export. All other modules must use named exports for better refactoring support and explicit import semantics.

### 9.6 Do NOT use `px` units for spacing or font sizing
Use `rem`. Reserve `px` only for borders (`1px solid ...`) and thin outlines (`2px solid ...`).

### 9.7 Do NOT use inline styles for theming or layout
Inline `style` props are acceptable only for **dynamic computed values** (e.g., `Display.tsx` dynamically setting `fontSize` based on value length). All static styling must live in CSS files.

### 9.8 Do NOT store sensitive credentials in client-side code
The in-memory `credentialStore` is a development-only mock. Do not extend this pattern for production use.

### 9.9 Do NOT use CommonJS (`require` / `module.exports`)
The project is configured as ESM (`"type": "module"`). All files must use `import` / `export`.

### 9.10 Do NOT skip `role="alert"` on error messages
All user-facing error messages must include `role="alert"` for screen reader accessibility, following the established pattern in `Login.tsx` and `Signup.tsx`.