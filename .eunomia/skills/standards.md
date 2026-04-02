# Project Standards — eunomia-mini-calculator

## 1. Project Overview

A lightweight, single-page calculator application built with React and TypeScript. The app features basic arithmetic operations, a light/dark theme toggle with localStorage persistence, and a fully responsive mobile-first layout. There is no routing, no external API communication, and no state management library — all state is managed via React hooks and Context.

## 2. Tech Stack & Versions

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | ^5.3.0 |
| UI Framework | React | ^18.2.0 |
| Build Tool | Vite | ^5.0.0 |
| Package Manager | npm | — |
| Runtime | Node.js | — |
| Unit Testing | Vitest + @testing-library/react | ^1.0.0 / ^14.1.0 |
| E2E / Visual Testing | Playwright | ^1.58.2 |
| Linting | ESLint + @typescript-eslint | ^8.56.1 |
| Module Target | ESNext (ESM — `"type": "module"`) | — |
| TS Target | ES2020 | — |
| JSX Transform | React JSX (automatic runtime) | — |
| Strict Mode | `strict: false` in tsconfig (**see §8**) | — |

## 3. Design Language

### 3.1 Theme System

The project uses **CSS custom properties** defined on `:root` (light) and `[data-theme='dark']` (dark). All color references in component CSS **must** use these variables — never hard-coded hex values.

```css
/* ✅ Correct */
background-color: var(--button-bg-start);

/* ❌ Wrong — breaks theming */
background-color: #ffffff;
```

Theme is toggled via `data-theme` attribute set on both the `.app` wrapper and `document.documentElement`.

### 3.2 Color Palette (CSS Variable Families)

| Family | Purpose | Example Variables |
|---|---|---|
| `--app-*` | Page-level background & text | `--app-bg`, `--app-text` |
| `--calculator-*` | Calculator container | `--calculator-bg`, `--calculator-shadow` |
| `--display-*` | Display component | `--display-bg`, `--display-border`, `--display-text` |
| `--button-*` | Button states (default, hover, active, focus) | `--button-bg-start`, `--button-hover-border` |

When adding new UI elements, extend these families or create a new `--component-*` family in `App.css` under both `:root` and `[data-theme='dark']`.

### 3.3 Typography

- **Display component:** `'Courier New', monospace`, `font-weight: 500`
- **Buttons:** System font (inherited), `font-weight: 600`
- Font sizes are specified in `rem` and scale via media queries.

### 3.4 Spacing System

No formal spacing scale is used. Spacing is declared in `rem` units directly. Follow existing proportions:

| Breakpoint | Typical padding | Button font-size |
|---|---|---|
| Desktop (>768px) | `1.25rem` – `1.5rem` | `1.5rem` |
| Tablet (481–768px) | `1rem` – `1.125rem` | `1.375rem` |
| Mobile (320–480px) | `0.75rem` – `1rem` | `1.25rem` |
| Extra-small (<320px) | `0.75rem` – `0.875rem` | `1.125rem` |

### 3.5 Responsive Breakpoints (Mobile-First Media Queries)

Use `max-width` breakpoints consistently:

```
768px  — tablet
480px  — mobile
320px  — extra-small
```

All interactive elements **must** maintain a minimum `44px × 44px` touch target (WCAG 2.1 Level AAA).

### 3.6 Transitions & Animation

- Use `transition` for theme changes and interactive feedback only.
- Standard duration: `0.15s ease` (buttons), `0.3s ease` (theme/background).
- Use `transform: translateY()` and `scale()` for subtle interaction feedback.
- **No** keyframe animations or libraries — keep it CSS transitions only.

### 3.7 Component Patterns

- Components are **functional** — no class components.
- Each component lives in `src/components/` as a pair: `ComponentName.tsx` + `ComponentName.css`.
- Components receive data via props; global cross-cutting concerns (theme) via React Context.
- Buttons use **gradient backgrounds** (`linear-gradient`) for all states.

## 4. Code Conventions

### 4.1 Naming

| Entity | Convention | Example |
|---|---|---|
| Component files | PascalCase `.tsx` | `Calculator.tsx` |
| Component CSS files | PascalCase `.css` (matches component) | `Calculator.css` |
| Component functions | PascalCase, named export | `export function Button()` |
| App root component | PascalCase, **default** export | `export default function App()` |
| Interfaces / Types | PascalCase, suffixed with purpose | `ButtonProps`, `DisplayProps` |
| Event handlers (internal) | `handle` + Action | `handleDigit`, `handleEquals` |
| State variables | camelCase | `currentValue`, `shouldResetDisplay` |
| CSS classes | kebab-case | `.calculator-button`, `.button-grid` |
| Test files | Same name + `.test.tsx` co-located | `Button.test.tsx` beside `Button.tsx` |
| Context objects | PascalCase + `Context` suffix | `ThemeContext` |

### 4.2 File & Folder Structure

```
src/
├── App.tsx              # Root component (default export)
├── App.css              # Global styles & CSS custom properties
├── App.test.tsx          # Root component tests
├── main.tsx             # Entry point (ReactDOM.createRoot)
├── components/
│   ├── Button.tsx
│   ├── Button.css
│   ├── Button.test.tsx
│   ├── Calculator.tsx
│   ├── Calculator.css
│   ├── Calculator.test.tsx
│   ├── Display.tsx
│   ├── Display.css
│   └── Display.test.tsx
└── test/
    └── setup.ts         # Vitest setup (jest-dom, mocks)
```

Rules:
- **Co-locate** component, its CSS, and its test in the same directory.
- Test setup and global test utilities go in `src/test/`.
- Playwright / visual test scripts live at the project root as standalone `.js` files.

### 4.3 Import Ordering

Follow this order (observed in all source files):

1. React / React hooks (`react`, `react-dom`)
2. Sibling components (`./Display`, `./Button`)
3. Context / shared modules (`../App`)
4. CSS imports (`./Component.css`)

```tsx
// ✅ Canonical order
import { useState, useContext } from 'react'
import { Display } from './Display'
import { Button } from './Button'
import { ThemeContext } from '../App'
import './Calculator.css'
```

### 4.4 Export Style

| What | Style |
|---|---|
| Components in `src/components/` | **Named** export: `export function Button()` |
| Root `App` component | **Default** export: `export default function App()` |
| Context objects | **Named** export alongside the component that creates them |

### 4.5 Comment Style

- **CSS files** begin with a block comment documenting the component's responsive strategy, breakpoint rationale, and accessibility considerations.
- **TypeScript files** have no block-level comments — code should be self-documenting.
- Inline comments are acceptable sparingly for non-obvious logic.

## 5. Architecture Patterns

### 5.1 Component Hierarchy

```
App (default export, owns theme state + context provider)
└── Calculator (owns calculator state)
    ├── Display (presentational, props only)
    └── Button (presentational, props only)
```

### 5.2 State Management

- **Local state** via `useState` for all component-level data.
- **Context API** (`createContext` / `useContext`) for cross-cutting concerns (currently: theme).
- **No** external state libraries (Redux, Zustand, etc.) — keep it hooks + context.
- **localStorage** for persistence of user preferences (theme). Access localStorage in `useState` initialiser and `useEffect` sync — never in render body.

### 5.3 Styling Approach

- **Plain CSS files** — one per component, imported at the top of the component file.
- **CSS custom properties** for theming; defined centrally in `App.css`.
- **No CSS modules, CSS-in-JS, Tailwind, or Sass.** Keep all styling in vanilla `.css` files.
- Global resets (`box-sizing`, `margin`, `overflow-x`) live in `App.css`.

### 5.4 Error Handling

- Calculator errors (e.g., division by zero) surface as the string `"Error"` in the display.
- When display shows `"Error"`, subsequent digit input clears it and starts fresh.
- Operations are silently ignored while in an error state.

## 6. Testing Conventions

### 6.1 Unit / Integration Tests

| Aspect | Standard |
|---|---|
| Runner | Vitest with `globals: true` (no need to import `describe`/`it`/`expect` — but **do** import them explicitly from `vitest` for clarity; both patterns exist, see §8) |
| DOM environment | jsdom (configured in `vite.config.ts`) |
| Assertion library | `@testing-library/jest-dom` (loaded in `src/test/setup.ts`) |
| Rendering | `@testing-library/react` — `render`, `screen` |
| User interaction | `@testing-library/user-event` — always create via `userEvent.setup()` |
| Mock functions | `vi.fn()` from Vitest |

### 6.2 Test File Conventions

- Test files are **co-located** with source: `Component.test.tsx` next to `Component.tsx`.
- Use `describe` blocks to group by feature/concern (e.g., `'digit input'`, `'onClick handler'`).
- Use descriptive `it(...)` strings starting with a verb: `'renders'`, `'displays'`, `'calls'`, `'prevents'`.
- Extract reusable helpers at the top of the test file (e.g., `getButton`, `getDisplay`, `clickButtons`).

### 6.3 What Must Be Tested

- **Every component** must have a test file covering:
  - Renders without crashing
  - Correct CSS class applied
  - All prop variations / edge cases
- **Interactive components**: verify click, keyboard (Enter, Space), and state transitions.
- **Theme**: persistence to localStorage, toggle behavior, correct attributes.

### 6.4 Visual / E2E Tests

- Playwright scripts at the project root (`playwright-visual-test.js`).
- Test against `http://localhost:5173` (dev server must be running).
- Capture screenshots at three canonical viewports: mobile (375×667), tablet (768×1024), desktop (1920×1080).

## 7. Build & Tooling

### 7.1 Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | `tsc && vite build` — type-check then bundle |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint on `src/**/*.{ts,tsx}` |
| `npm test` | `vitest run` (single run, no watch) |

### 7.2 ESLint Configuration

- Parser: `@typescript-eslint/parser`
- `react/react-in-jsx-scope` is **off** (automatic JSX runtime).
- Environments: `es2021`, `node`, `browser`, `jest`.

## 8. Known Inconsistencies & Resolutions

### 8.1 Vitest Global Imports

**Conflict:** `Calculator.test.tsx` and `Display.test.tsx` rely on `globals: true` (no explicit imports of `describe`, `it`, `expect`). `App.test.tsx` and `Button.test.tsx` explicitly import them from `vitest`.

**Canonical standard:** **Explicitly import** test utilities from `vitest` (`describe`, `it`, `expect`, `vi`, `beforeEach`) in every test file. This makes dependencies visible and avoids confusion.

```tsx
// ✅ Do this in every test file
import { describe, it, expect, beforeEach, vi } from 'vitest'
```

### 8.2 ESLint `jest` Environment

**Conflict:** The ESLint config sets `"jest": true` but the project uses **Vitest**, not Jest.

**Resolution:** This is harmless (Vitest globals share names with Jest) but should be corrected to avoid confusion. Replace with a comment or remove it; global types come from `vitest/globals`.

### 8.3 `strict: false` in tsconfig

**Conflict:** TypeScript strict mode is disabled, which weakens type safety (allows implicit `any`, unchecked nulls, etc.).

**Resolution:** This is the current project setting. **Do not change it mid-project** without a dedicated migration, but be aware: new code should still avoid implicit `any` and use explicit types wherever possible as if strict mode were enabled.

### 8.4 Module Format Inconsistency in Playwright Scripts

**Conflict:** `playwright-visual-test.js` uses ESM (`import`), while `screenshot.js` uses CommonJS (`require`). The project is `"type": "module"` so CommonJS syntax will fail without renaming to `.cjs`.

**Canonical standard:** All JavaScript files must use **ESM** (`import`/`export`). `screenshot.js` must be converted.

### 8.5 Export Style for Root Component

**Conflict:** `App.tsx` uses `export default function App()` while all other components use named exports.

**Resolution:** This is **intentional** — only the root `App` component uses a default export (consumed by `main.tsx`). All other components use named exports. Maintain this convention.

## 9. Anti-Patterns (Do NOT Do These)

| Anti-Pattern | Why | Do Instead |
|---|---|---|
| Hard-coded color values in component CSS | Breaks light/dark theming | Use CSS custom properties from `App.css` |
| CSS Modules, styled-components, Tailwind | Inconsistent with project approach | Use plain `.css` files with CSS custom properties |
| Class components | Not used anywhere; hooks are the standard | Use functional components with hooks |
| Direct DOM manipulation (`document.querySelector`) in component code | Bypasses React's virtual DOM | Use refs (`useRef`) or state; exception: `document.documentElement.setAttribute` for theme in `useEffect` only |
| External state management libraries | Over-engineered for this project's scope | Use `useState` + `useContext` |
| `require()` / CommonJS in any file | Project is ESM (`"type": "module"`) | Use `import` / `export` |
| Omitting test utilities imports and relying on globals | Inconsistent, obscures dependencies | Explicitly import from `vitest` |
| Inline styles in JSX | Not used in codebase; violates CSS-variable theming | Define styles in the component's `.css` file |
| `any` type annotations | Defeats TypeScript's purpose | Use specific types or `unknown` and narrow |
| Placing new components outside `src/components/` | Breaks co-location convention | All reusable UI components go in `src/components/` |
| Media queries with `min-width` | Project uses `max-width` (desktop-default, scale down) | Use `max-width` breakpoints at 768px, 480px, 320px |