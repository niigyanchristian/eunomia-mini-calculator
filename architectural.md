# Mini Calculator - Architectural Documentation

## Project Overview

Mini Calculator is a single-page web application that provides basic arithmetic operations (addition, subtraction, multiplication, division) through a clean, responsive interface with dark/light theme support.

### Tech Stack

| Layer          | Technology                          |
|----------------|-------------------------------------|
| Language       | TypeScript 5.3+                     |
| UI Framework   | React 18.2 (functional components)  |
| Build Tool     | Vite 5.0                            |
| Test Framework | Vitest 1.0 + Testing Library 14.1   |
| Linting        | ESLint 8 + TypeScript ESLint        |
| Runtime        | ES2020 target, ESNext modules       |

### Key Features

- Four arithmetic operations with chaining support
- Decimal number input
- Division-by-zero error handling
- Dark/light theme toggle with localStorage persistence
- Keyboard-accessible buttons

---

## Architecture Overview

The application follows a **component-based architecture** with unidirectional data flow. State is managed locally using React hooks (`useState`, `useEffect`, `useContext`), with no external state management library.

### Design Principles

- **Single Responsibility**: Each component handles one concern (display, button, calculator logic)
- **Lifting State Up**: Theme state lives in `App` and is distributed via React Context; calculator state lives in `Calculator`
- **CSS Custom Properties**: Theming is implemented through CSS variables, avoiding runtime style computation
- **Co-located Files**: Component source, styles, and tests are grouped together in `src/components/`

---

## Component Architecture

### Component Hierarchy

```
App (theme state, ThemeContext.Provider)
 └── Calculator (calculator state, business logic)
      ├── Display (value rendering)
      └── Button[] (user input)
```

### Component Details

#### `App` (`src/App.tsx`)

- **Role**: Application root, theme management
- **State**: `theme: 'light' | 'dark'` (initialized from localStorage)
- **Exports**: `ThemeContext` (React Context for theme state)
- **Behavior**:
  - Reads saved theme from `localStorage('calculator-theme')` on mount
  - Syncs theme to both `localStorage` and `document.documentElement[data-theme]` via `useEffect`
  - Provides `{ theme, toggleTheme }` to descendants via `ThemeContext`

#### `Calculator` (`src/components/Calculator.tsx`)

- **Role**: Core application logic, layout orchestration
- **State**:
  - `currentValue: string` - the currently displayed value (default: `'0'`)
  - `previousValue: string` - the left operand stored during an operation
  - `operation: string` - the pending arithmetic operator
  - `shouldResetDisplay: boolean` - flag to clear display on next digit input
- **Key Functions**:
  - `handleDigit(digit)` - appends digits, replaces leading zero
  - `handleDecimal()` - adds decimal point, prevents duplicates
  - `calculate(left, right, op)` - pure computation, returns string result
  - `handleOperation(nextOp)` - chains operations, computes intermediate results
  - `handleEquals()` - evaluates the pending operation
  - `handleClear()` - resets all state to initial values
- **Consumes**: `ThemeContext` for the theme toggle button

#### `Display` (`src/components/Display.tsx`)

- **Role**: Read-only value display
- **Props**: `value: string | number`
- **Behavior**: Renders the value in a styled container with text overflow handling

#### `Button` (`src/components/Button.tsx`)

- **Role**: Generic calculator button
- **Props**: `label: string`, `onClick: () => void`
- **Behavior**: Renders a styled `<button>` element, fully keyboard-accessible

---

## State Management

### Data Flow

```
User Click
    │
    ▼
Button.onClick()
    │
    ▼
Calculator.handleButtonClick(label)
    │
    ├── handleDigit()    ──► setCurrentValue()
    ├── handleDecimal()  ──► setCurrentValue()
    ├── handleOperation()──► setPreviousValue(), setOperation(), setShouldResetDisplay()
    ├── handleEquals()   ──► setCurrentValue(), setPreviousValue(), setOperation()
    └── handleClear()    ──► reset all state
    │
    ▼
Display re-renders with new currentValue
```

### Theme State Flow

```
App (useState: theme)
 │
 ├── useEffect ──► localStorage.setItem()
 │              ──► document.documentElement.setAttribute('data-theme')
 │
 └── ThemeContext.Provider { theme, toggleTheme }
      │
      └── Calculator (useContext)
           └── theme-toggle button ──► toggleTheme()
```

Theme state is persisted across sessions via `localStorage`. On mount, the saved value is read with a fallback to `'light'` for invalid or missing values.

---

## Styling Architecture

### Approach

The project uses **plain CSS with CSS Custom Properties (variables)** for theming. Each component has a co-located `.css` file.

### File Structure

| File                          | Scope                                     |
|-------------------------------|-------------------------------------------|
| `src/App.css`                 | CSS variables (design tokens), app layout |
| `src/components/Calculator.css` | Calculator container, grid layout, theme toggle |
| `src/components/Display.css`  | Display styling                           |
| `src/components/Button.css`   | Button styling with hover/active/focus states |

### Theming System

Theme switching is driven by a `data-theme` attribute on both the app container and `<html>` element. CSS custom properties are defined in two blocks:

- **`:root`** - Light theme (default): white/gray palette
- **`[data-theme='dark']`** - Dark theme: dark gray palette

Design tokens cover every visual aspect:

| Token Category | Examples |
|----------------|----------|
| Backgrounds    | `--app-bg`, `--calculator-bg`, `--display-bg`, `--button-bg-start/end` |
| Text colors    | `--app-text`, `--display-text`, `--button-text` |
| Borders        | `--display-border`, `--button-border` |
| Shadows        | `--calculator-shadow`, `--button-shadow`, `--display-shadow-inset` |
| Interactive    | `--button-hover-*`, `--button-active-*`, `--button-focus-outline` |

All color transitions use `transition: 0.3s ease` for smooth theme switching.

### Layout

- **App**: Centered with `max-width: 1200px`, full viewport height
- **Calculator**: `max-width: 320px`, centered, rounded corners with box shadow
- **Button Grid**: CSS Grid with `grid-template-columns: repeat(4, 1fr)` and `0.5rem` gap
- **Display**: Right-aligned monospace text (`Courier New`), text overflow with ellipsis
- **Buttons**: Gradient backgrounds, subtle shadow depth, transform animations on hover/active

---

## Testing Strategy

### Framework

- **Vitest** as the test runner (configured in `vite.config.ts`)
- **jsdom** as the DOM environment
- **@testing-library/react** for component rendering and queries
- **@testing-library/user-event** for simulating user interactions
- **@testing-library/jest-dom** for DOM-specific matchers

### Configuration

Test setup is in `src/test/setup.ts`, which:
- Imports `@testing-library/jest-dom` for extended matchers
- Provides a `LocalStorageMock` for `localStorage` in the jsdom environment

Vitest is configured with `globals: true` so `describe`, `it`, `expect` are available without imports.

### Test Files

| File                               | Coverage Area                              |
|------------------------------------|--------------------------------------------|
| `src/App.test.tsx`                 | Theme toggle, localStorage persistence, data-theme attribute |
| `src/components/Calculator.test.tsx` | All arithmetic ops, chaining, decimals, error handling, clear |
| `src/components/Display.test.tsx`  | Value rendering (strings, numbers, edge cases) |
| `src/components/Button.test.tsx`   | Click handling, keyboard accessibility, label rendering |

### Testing Patterns

- **Behavior-driven**: Tests simulate user interactions (clicks, keyboard) rather than testing implementation details
- **Accessible queries**: Uses `getByRole`, `getByText` over test IDs
- **Helper functions**: `Calculator.test.tsx` uses `getButton()`, `getDisplay()`, and `clickButtons()` helpers for readable tests
- **Grouped by feature**: Tests are organized with nested `describe` blocks (e.g., "digit input", "addition", "error handling")

---

## Build & Development

### Vite Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react()],       // @vitejs/plugin-react for JSX transform, Fast Refresh
  server: {
    port: 5173,             // Fixed dev server port
    open: true              // Auto-opens browser on dev start
  },
  test: {
    globals: true,           // No need to import describe/it/expect
    environment: 'jsdom',    // DOM simulation for component tests
    setupFiles: './src/test/setup.ts'
  }
})
```

### TypeScript Configuration (`tsconfig.json`)

| Setting                       | Value         | Rationale                           |
|-------------------------------|---------------|-------------------------------------|
| `target`                      | ES2020        | Modern JS features                  |
| `module`                      | ESNext        | ES module syntax                    |
| `moduleResolution`            | bundler       | Vite-compatible resolution          |
| `jsx`                         | react-jsx     | Automatic JSX runtime (no React import needed) |
| `strict`                      | false         | Relaxed type checking               |
| `noEmit`                      | true          | Vite handles compilation            |
| `allowImportingTsExtensions`  | true          | Allows `.tsx` in import paths       |
| `isolatedModules`             | true          | Required for Vite's esbuild         |

Test files (`**/*.test.ts`, `**/*.test.tsx`, `**/test/**`) are excluded from compilation but are handled by Vitest separately.

### NPM Scripts

| Script    | Command              | Purpose                      |
|-----------|----------------------|------------------------------|
| `dev`     | `vite`               | Start development server     |
| `build`   | `tsc && vite build`  | Type-check then bundle       |
| `preview` | `vite preview`       | Preview production build     |
| `lint`    | `eslint src --ext ts,tsx` | Lint TypeScript files    |
| `test`    | `vitest run`         | Run tests once               |

---

## Code Organization

```
eunomia-mini-calculator/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config (app)
├── tsconfig.node.json          # TypeScript config (Vite/Node)
├── vite.config.ts              # Vite + Vitest config
├── .eslintrc.json              # ESLint config
└── src/
    ├── main.tsx                # React DOM entry (StrictMode)
    ├── App.tsx                 # Root component + ThemeContext
    ├── App.css                 # Global styles + CSS variables
    ├── App.test.tsx            # Theme functionality tests
    ├── test/
    │   └── setup.ts            # Test environment setup
    └── components/
        ├── Calculator.tsx      # Calculator logic + layout
        ├── Calculator.css      # Calculator styles
        ├── Calculator.test.tsx # Calculator tests
        ├── Display.tsx         # Display component
        ├── Display.css         # Display styles
        ├── Display.test.tsx    # Display tests
        ├── Button.tsx          # Button component
        ├── Button.css          # Button styles
        └── Button.test.tsx     # Button tests
```

### Conventions

- **Named exports** for components (`export function Calculator`)
- **Default export** for `App` (standard React entry convention)
- **TypeScript interfaces** for component props (e.g., `DisplayProps`, `ButtonProps`)
- **Co-located styles**: Each component has a matching `.css` file imported directly
- **Co-located tests**: Test files sit alongside their source files

---

## Technical Decisions

### Why Local State Over External State Management

The calculator's state (current value, previous value, operation) is confined to a single component (`Calculator`). There is no need for Redux, Zustand, or other global state libraries. React's built-in `useState` is sufficient and avoids unnecessary complexity.

### Why React Context for Theme (Not Props)

Theme state needs to cross the `App -> Calculator` boundary. While prop drilling would work for this shallow hierarchy, Context provides a cleaner API and scales if more components need theme access.

### Why CSS Custom Properties Over CSS-in-JS

CSS variables provide theme switching without JavaScript runtime overhead. The `data-theme` attribute triggers a pure CSS cascade, meaning theme changes are handled entirely by the browser's style engine. This results in smooth transitions and zero re-renders for style updates.

### Why String-Based Calculator State

`currentValue` is stored as a `string` rather than `number` to correctly handle:
- Leading zeros and trailing decimal points (`"0."`, `"5."`)
- Display of the `"Error"` state
- Direct concatenation of digit inputs

### Why No Operator Precedence

The calculator uses left-to-right evaluation (like a basic physical calculator) rather than mathematical operator precedence. This is intentional: `2 + 3 x 4` evaluates as `(2 + 3) x 4 = 20`, matching user expectations for a simple calculator.

### Why Vitest Over Jest

Vitest integrates natively with Vite, sharing the same configuration and transformation pipeline. This eliminates the need for separate Babel/transform configs that Jest would require in a Vite project.

---

## Future Considerations

- **Keyboard Input**: Add `keydown` event listeners for number keys and operators to allow keyboard-driven calculation without clicking buttons
- **History/Memory**: Add calculation history or memory (M+, M-, MR) functionality
- **Operator Highlighting**: Visually indicate the active operator button
- **Display Formatting**: Add thousand separators for large numbers and limit decimal precision
- **Responsive Improvements**: Adapt button sizing for different screen widths
- **Accessibility Enhancements**: Add ARIA live regions for the display so screen readers announce value changes
- **Error Recovery**: Provide more granular error messages (e.g., "Cannot divide by zero") instead of generic "Error"
