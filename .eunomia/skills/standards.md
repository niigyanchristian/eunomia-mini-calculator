# Project Standards — eunomia-mini-calculator

## 1. Project Overview

A single-page calculator application built with React and TypeScript, bundled with Vite. The app features a light/dark theme toggle (persisted to `localStorage`), responsive design across four breakpoints, and WCAG-compliant touch targets. The codebase is small (~32 files) and has no routing, no backend, and no external state library.

## 2. Tech Stack & Versions

| Layer | Technology | Version Constraint |
|---|---|---|
| Language | TypeScript | `^5.3.0` |
| UI Framework | React | `^18.2.0` |
| Bundler | Vite | `^5.0.0` |
| Package Manager | npm | — |
| Runtime | Node.js | — |
| Icon Library | lucide-react | `^0.400.0` |
| Unit Test Runner | Vitest | `^1.0.0` |
| Test Utilities | @testing-library/react | `^14.1.0` |
| User-event Testing | @testing-library/user-event | `^14.6.1` |
| E2E / Visual Testing | Playwright | `^1.58.2` |
| Linter | ESLint | `^8.55.0` |
| TS Compilation Target | ES2020 | — |
| Module Resolution | `bundler` | — |
| JSX Transform | `react-jsx` (automatic) | — |

### Key tsconfig settings

- `strict: false` — TypeScript strict mode is **off**. This is the current state; do not enable strict mode without a project-wide migration.
- `noEmit: true` — TypeScript is used for type-checking only; Vite handles transpilation.
- `isolatedModules: true` — required by Vite.
- Test files (`**/*.test.ts`, `**/*.test.tsx`, `**/test/**`) are **excluded** from `tsconfig.json` compilation but are picked up by Vitest independently.

## 3. Design Language

### 3.1 Color Palette & Theming

All colors are defined as **CSS custom properties** on `:root` (light theme) and `[data-theme='dark']` (dark theme). Never use hard-coded color values in component CSS — always reference a `var(--*)` token.

**Light theme (default):**

| Token | Value | Usage |
|---|---|---|
| `--app-bg` | `#ffffff` | Page background |
| `--app-text` | `#333333` | Primary text |
| `--calculator-bg` | `#e8e8e8` | Calculator container |
| `--display-bg` | `#f5f5f5` | Display panel |
| `--button-bg-start/end` | `#ffffff` / `#f5f5f5` | Button gradient |
| `--button-focus-outline` | `#4a9eff` | Focus ring |

**Dark theme** mirrors these tokens with darker values (see `App.css` `[data-theme='dark']` block).

**Rules:**
- Theme is toggled via `data-theme` attribute set on **both** the `.app` wrapper and `document.documentElement`.
- Theme preference is persisted under `localStorage` key `"calculator-theme"` with values `"light"` or `"dark"`.
- All themed transitions use `transition: ... 0.3s ease`.

### 3.2 Typography

| Context | Font | Size (desktop) | Weight |
|---|---|---|---|
| Display | `'Courier New', monospace` | `2rem` | 500 |
| Buttons | Browser default (system) | `1.5rem` | 600 |
| Heading (`h1`) | Inherited | — | — |

### 3.3 Responsive Breakpoints (mobile-first conceptually, implemented as max-width)

| Name | Media Query | Description |
|---|---|---|
| Desktop | `> 768px` (no query; base styles) | Full padding, fixed `max-width: 320px` calculator |
| Tablet | `max-width: 768px` | Full-width calculator, moderate reductions |
| Mobile | `max-width: 480px` | Compact padding, smaller font sizes |
| Extra-small | `max-width: 320px` | Minimal padding, smallest readable fonts |

**Rules:**
- Breakpoints are applied via `@media (max-width: ...)` in each component's own CSS file.
- Every interactive element must maintain a **minimum 44×44 px** touch target (WCAG 2.1 Level AAA).
- Use `min-height: 44px; min-width: 44px;` explicitly at every sub-desktop breakpoint.

### 3.4 Spacing System

Spacing uses `rem` units throughout. There is no formal spacing scale; values are per-component. The dominant increments are `0.25rem` steps (`0.5rem`, `0.75rem`, `1rem`, `1.25rem`, `1.5rem`).

**Rule:** Always use `rem` for padding, margin, and gap. Never use `px` for spacing (exception: borders and box-shadows, which use `px`).

### 3.5 Component Visual Patterns

- **Buttons:** Styled with CSS `linear-gradient` backgrounds, `border-radius: 8px` (scaling down at breakpoints), subtle `box-shadow`, and a `translateY(-1px)` hover lift.
- **Display:** `inset` box-shadow, `text-overflow: ellipsis`, single-line (`white-space: nowrap`).
- **Calculator container:** `border-radius: 12px`, centered with `margin: 0 auto`.
- **Transitions:** All interactive state changes use `transition: all 0.15s ease` (buttons) or `0.3s ease` (theme changes).

### 3.6 Animation Conventions

- Theme toggle button: `transform: scale(1.1)` on hover, `scale(0.95)` on active.
- Calculator buttons: `translateY(-1px)` on hover, `translateY(0)` on active.
- No keyframe animations are used. Keep transitions CSS-only and under `0.3s`.

## 4. Code Conventions

### 4.1 Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| React components | PascalCase, named `export function` | `export function Calculator()` |
| Component files | PascalCase `.tsx` | `Calculator.tsx`, `Button.tsx` |
| CSS files | PascalCase, matching component | `Calculator.css`, `Button.css` |
| Test files | PascalCase with `.test.tsx` suffix | `Calculator.test.tsx` |
| CSS class names | kebab-case | `.calculator-button`, `.theme-toggle` |
| CSS custom properties | kebab-case with `--` prefix | `--button-bg-start` |
| Interfaces/types | PascalCase with descriptive suffix | `ButtonProps`, `DisplayProps` |
| State variables | camelCase | `currentValue`, `shouldResetDisplay` |
| Event handlers | `handle` + action | `handleDigit`, `handleOperation` |
| Test helpers | camelCase | `getButton`, `clickButtons` |
| Context objects | PascalCase + `Context` | `ThemeContext` |

### 4.2 File & Folder Structure

src/
├── App.tsx              # Root component, theme provider
├── App.css              # Global styles, CSS variables, theme definitions
├── App.test.tsx         # Tests co-located with App
├── main.tsx             # Entry point (ReactDOM.createRoot)
├── components/
│   ├── Calculator.tsx   # Main calculator logic
│   ├── Calculator.css
│   ├── Calculator.test.tsx
│   ├── Button.tsx       # Presentational button
│   ├── Button.css
│   ├── Button.test.tsx
│   ├── Display.tsx      # Presentational display
│   ├── Display.css
│   └── Display.test.tsx
└── test/
    └── setup.ts         # Vitest setup (jest-dom, mocks)
```

**Rules:**
- Each component gets **three co-located files**: `Component.tsx`, `Component.css`, `Component.test.tsx`.
- Test files live **next to** the component they test, not in a separate `__tests__` directory.
- The `src/test/` directory is reserved for test infrastructure (setup files, global mocks).
- Playwright / visual test scripts live at the **project root**, not inside `src/`.
- Global CSS variables and theme definitions live in `App.css`.

### 4.3 Component Authoring

- Use **function declarations** (`export function Component()`) — not arrow-function components.
- The root `App` component uses `export default function App()`. All other components use **named exports** (`export function Calculator()`).
- Define a `Props` interface directly above the component in the same file, named `<Component>Props`.
- Destructure props in the function signature with defaults where applicable:
  ```tsx
  export function Button({ label, onClick, className = '' }: ButtonProps) {
  ```
- Do **not** use `React.FC` or `React.FunctionComponent`.

### 4.4 Import Ordering

Canonical order (observed in all source files):

```tsx
// 1. React core imports
import { useState, useContext } from 'react'

// 2. Third-party library imports
import { Moon, Sun } from 'lucide-react'

// 3. Local component imports
import { Display } from './Display'
import { Button } from './Button'

// 4. Context / utility imports
import { ThemeContext } from '../App'

// 5. CSS imports (always last)
import './Calculator.css'
```

**Rule:** CSS imports are always the last import in a component file.

### 4.5 Comment Style

- CSS files include a **block comment header** at the top documenting the component's responsive design strategy, breakpoints, and any non-obvious layout behavior.
- Inline CSS comments use `/* ... */` to explain specific values (e.g., `/* WCAG 2.1 minimum touch target */`).
- TypeScript files have **no comments** — code is expected to be self-documenting. Do not add JSDoc to components or props interfaces unless the behavior is genuinely non-obvious.

### 4.6 Formatting & Syntax

- **No semicolons** in TypeScript/TSX files (the codebase omits them consistently).
- **Single quotes** for string literals in TypeScript.
- **Single quotes** for CSS attribute selectors (`[data-theme='dark']`).
- **2-space indentation** in all files.
- Trailing newline at end of files.

## 5. Architecture Patterns

### 5.1 Component Hierarchy

```
App (theme state, context provider)
└── Calculator (calculator state & logic, theme consumer)
    ├── Display (presentational — renders value)
    └── Button (presentational — fires onClick)
```

- **App** owns theme state and provides it via `ThemeContext`.
- **Calculator** owns all calculator state (`currentValue`, `previousValue`, `operation`, `shouldResetDisplay`) using `useState`.
- **Display** and **Button** are pure presentational components with no internal state.

### 5.2 State Management

- **React `useState` only.** No external state management library (Redux, Zustand, etc.).
- **React `createContext`** is used solely for theme propagation.
- Context is created and exported from `App.tsx`, consumed via `useContext` in child components.
- Persistent state uses `localStorage` directly (no abstraction layer).

**Rule:** Do not introduce an external state management library. For cross-component state, use React Context. For component-local state, use `useState`.

### 5.3 Styling Architecture

- **Plain CSS files** — one per component, imported directly into the component file.
- No CSS Modules, no CSS-in-JS, no Tailwind, no Sass/SCSS.
- Theming is accomplished via CSS custom properties toggled by a `data-theme` attribute.
- Component styles are scoped by class-name convention (`.calculator-button`, `.display`), not by CSS Modules.

**Rule:** Do not introduce CSS Modules, styled-components, Tailwind, or any other styling paradigm. Use plain `.css` files with CSS custom properties for theming.

### 5.4 Error Handling

- Calculator errors (e.g., division by zero) are represented by the string `"Error"` in `currentValue`.
- When `currentValue === 'Error'`, operations are blocked and digit input resets the display.
- There is no global error boundary. This is acceptable for the current project scope.

## 6. Testing Conventions

### 6.1 Test Framework & Configuration

- **Vitest** with `globals: true` (no need to import `describe`, `it`, `expect` — but `vi` must be explicitly imported from `vitest`).
- **jsdom** environment configured in `vite.config.ts`.
- **Setup file:** `src/test/setup.ts` — imports `@testing-library/jest-dom` for DOM matchers and provides a `localStorage` mock.

### 6.2 Test File Naming & Placement

- Test files are named `<Component>.test.tsx` and placed **adjacent to the component file**.
- Infrastructure/setup files go in `src/test/`.

### 6.3 Test Structure

- Use `describe` blocks to group by component and then by feature area:
  ```tsx
  describe('Calculator', () => {
    describe('digit input', () => { ... })
    describe('decimal point handling', () => { ... })
  })
  ```
- Use `beforeEach` to set up common state (render component, create `userEvent.setup()`).
- Extract **test helper functions** at the top of the test file for repeated actions:
  ```tsx
  function getButton(label: string) {
    return screen.getByRole('button', { name: label })
  }

  async function clickButtons(user: ReturnType<typeof userEvent.setup>, labels: string[]) {
    for (const label of labels) {
      await user.click(getButton(label))
    }
  }
  ```

### 6.4 Testing Patterns

- **Rendering:** Use `render(<Component />)` from `@testing-library/react`.
- **Queries:** Prefer `screen.getByRole` and `screen.getByText`. Use `container.querySelector` only when testing CSS classes (no accessible role available).
- **User interactions:** Always use `@testing-library/user-event` (not `fireEvent`):
  ```tsx
  const user = userEvent.setup()
  await user.click(getButton('5'))
  ```
- **Mocking:** Use `vi.fn()` for callback mocks. Use `vi.mock()` sparingly.
- **Assertions:** Use jest-dom matchers (`toBeInTheDocument`, `toHaveTextContent`, `toHaveAttribute`).

### 6.5 What Must Be Tested

- Every component must have a test file covering:
  - Renders without crashing
  - Correct CSS class is applied
  - All props are rendered correctly (including edge cases)
  - User interactions trigger expected behavior
- Theme persistence and toggle behavior
- Calculator arithmetic logic (all operations, chaining, error states)

### 6.6 Visual / E2E Testing

- Playwright scripts exist at the project root for screenshot-based visual validation.
- These are **not** part of the `npm test` command — they are run separately and require a running dev server.
- Screenshots are saved to `.eunomia/screenshots/qa/`.

## 7. Known Inconsistencies & Resolutions

### 7.1 Module System Conflict in Playwright Scripts

| File | Module System |
|---|---|
| `playwright-visual-test.js` | ESM (`import { chromium } from 'playwright'`) |
| `screenshot.js` | CommonJS (`const { chromium } = require('playwright')`) |

**Resolution:** The project uses `"type": "module"` in `package.json`. **All new JavaScript/TypeScript files must use ESM imports.** `screenshot.js` is non-conformant and should not be used as a reference. The canonical pattern is `playwright-visual-test.js`.

### 7.2 Default Export vs Named Export

| File | Export Style |
|---|---|
| `App.tsx` | `export default function App()` |
| All other components | `export function Component()` |

**Resolution:** The **canonical standard** is **named exports** for all components. `App.tsx` uses `export default` because Vite's entry-point resolution expects it. **Do not use `export default` for any new component.** Only `App.tsx` is permitted to use a default export.

### 7.3 `Display` Props Accept `string | number`

The `DisplayProps` interface accepts `value: string | number`, but the `Calculator` component always passes a `string`. The union type adds unnecessary complexity.

**Resolution:** `Display` should accept `string | number` to remain flexible. This is acceptable but the `Calculator` should continue to pass strings. Do not narrow the type in `Display`.

### 7.4 Global `describe`/`it`/`expect` vs Explicit Imports

Some test files import `{ describe, it, expect, beforeEach }` from `vitest` explicitly (e.g., `App.test.tsx`), while others rely on `globals: true` and omit the import (e.g., `Calculator.test.tsx`).

**Resolution:** Since `globals: true` is configured, **do not import** `describe`, `it`, `expect`, or `beforeEach` from `vitest`. Only import `vi` (for mocking) explicitly. Remove explicit imports of globals in existing files when touching them.

### 7.5 `strict: false` in tsconfig

TypeScript strict mode is disabled. This is intentional for this project's scope.

**Resolution:** Do not enable `strict: true` without a full migration. However, write new code **as if** strict mode were enabled — use explicit types, avoid `any`, handle potential `null`/`undefined`.

## 8. Anti-Patterns (Do NOT Do These)

### 8.1 Do NOT use `fireEvent` from `@testing-library/react`
Always use `@testing-library/user-event` for simulating user interactions. `fireEvent` does not accurately simulate browser behavior (e.g., it skips focus, does not trigger `onChange` chains).

### 8.2 Do NOT use CommonJS (`require` / `module.exports`)
The project is ESM-only (`"type": "module"`). Always use `import`/`export`. The file `screenshot.js` violates this — do not follow its pattern.

### 8.3 Do NOT hard-code color values in component CSS
All colors must reference CSS custom properties defined in `App.css`. Hard-coded hex/rgb values in component CSS files will break theming.

### 8.4 Do NOT use `React.FC` or `React.FunctionComponent`
Use plain function declarations with typed props interfaces.

### 8.5 Do NOT introduce CSS Modules, CSS-in-JS, Tailwind, or SCSS
The project uses plain CSS files with CSS custom properties. Maintain this approach.

### 8.6 Do NOT add `px` units for spacing (padding, margin, gap)
Use `rem` for all spacing. `px` is acceptable only for `border-width`, `box-shadow`, and `outline`.

### 8.7 Do NOT create `__tests__` directories
Test files are co-located with the source files they test.

### 8.8 Do NOT use inline styles in JSX
All styling is done via CSS classes and CSS custom properties. The only attribute set directly on elements is `data-theme`.

### 8.9 Do NOT add comments to TypeScript files unless genuinely necessary
The codebase convention is comment-free TypeScript. CSS files receive block-comment headers; TypeScript files do not.

### 8.10 Do NOT use `var` or untyped variables
Use `const` by default, `let` when reassignment is needed. Always provide type annotations for function parameters and non-obvious return types.
```