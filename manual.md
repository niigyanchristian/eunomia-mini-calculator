# Mini Calculator - Comprehensive User Manual

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [Usage Guide](#usage-guide)
5. [Development Guide](#development-guide)
6. [Testing](#testing)
7. [Building & Deployment](#building--deployment)
8. [Theme Support](#theme-support)
9. [Troubleshooting](#troubleshooting)
10. [API Reference](#api-reference)

---

## Project Overview

### What It Does

Mini Calculator is a modern, feature-rich calculator web application built with React and TypeScript. It provides a clean, intuitive interface for performing basic arithmetic operations with support for both light and dark themes.

### Key Features

- **Basic Arithmetic Operations**: Addition, subtraction, multiplication, and division
- **Decimal Support**: Full support for decimal numbers with automatic leading zero
- **Operation Chaining**: Perform multiple operations in sequence without pressing equals
- **Error Handling**: Graceful handling of division by zero and error states
- **Theme Switching**: Toggle between light and dark modes with persistent preference
- **Responsive Design**: Clean, centered layout with CSS custom properties
- **Keyboard Accessible**: Full support for keyboard navigation and interaction
- **Comprehensive Testing**: 100% test coverage with unit and integration tests

### Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI library for component-based architecture |
| **TypeScript** | 5.3.0 | Type-safe JavaScript with strong typing |
| **Vite** | 5.0.0 | Fast build tool and development server |
| **Vitest** | 1.0.0 | Unit testing framework compatible with Vite |
| **Testing Library** | 14.1.0 | React component testing utilities |
| **ESLint** | 8.55.0 | Code linting and quality enforcement |
| **Playwright** | 1.58.2 | End-to-end browser testing |

---

## Architecture

### Component Structure

The application follows a hierarchical component structure:

```
App (Root Component)
├── ThemeContext.Provider
│   └── Calculator
│       ├── Theme Toggle Button
│       ├── Display
│       └── Button Grid
│           └── Button (×17)
```

### Component Breakdown

#### 1. App Component (`src/App.tsx`)

**Responsibilities:**
- Root application component
- Theme state management using React Context
- Persistence of theme preference to localStorage
- Application of theme to document root

**Key Implementation** (lines 5-35):
```typescript
export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('calculator-theme')
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light'
  })

  useEffect(() => {
    localStorage.setItem('calculator-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }
  // ...
}
```

#### 2. Calculator Component (`src/components/Calculator.tsx`)

**Responsibilities:**
- Calculator logic and state management
- Button layout and event handling
- Operation execution and display updates

**State Variables** (lines 9-12):
- `currentValue`: The displayed value (string)
- `previousValue`: Stored value for pending operations
- `operation`: Current pending operation (+, -, ×, ÷)
- `shouldResetDisplay`: Flag to reset display on next digit input

**Key Functions:**
- `handleDigit(digit: string)` - Process digit input (lines 14-29)
- `handleDecimal()` - Add decimal point with validation (lines 31-44)
- `calculate(left, right, op)` - Perform arithmetic calculation (lines 46-60)
- `handleOperation(nextOp)` - Process operation button clicks (lines 62-75)
- `handleEquals()` - Compute final result (lines 77-85)
- `handleClear()` - Reset calculator state (lines 87-92)

#### 3. Display Component (`src/components/Display.tsx`)

**Responsibilities:**
- Display current calculator value
- Format and style numeric output

**Props Interface** (lines 3-5):
```typescript
interface DisplayProps {
  value: string | number
}
```

**Implementation** (lines 7-13):
```typescript
export function Display({ value }: DisplayProps) {
  return (
    <div className="display">
      {value}
    </div>
  )
}
```

#### 4. Button Component (`src/components/Button.tsx`)

**Responsibilities:**
- Render individual calculator buttons
- Handle click events

**Props Interface** (lines 3-6):
```typescript
interface ButtonProps {
  label: string
  onClick: () => void
}
```

### State Management

The application uses two state management approaches:

1. **React Context** for theme state (global)
   - Defined in `src/App.tsx` (lines 5-11)
   - Consumed in `Calculator` component (line 8)

2. **Component State** for calculator logic (local)
   - Four state variables in `Calculator` component
   - All calculator logic contained within single component

### Data Flow

```
User Interaction (Button Click)
    ↓
handleButtonClick() determines button type
    ↓
├─ Digit → handleDigit() → Updates currentValue
├─ Decimal → handleDecimal() → Adds decimal point
├─ Operation → handleOperation() → Stores operation & previous value
├─ Equals → handleEquals() → Calculates & displays result
└─ Clear → handleClear() → Resets all state
    ↓
State Update
    ↓
Display Re-render with new value
```

---

## Installation & Setup

### Prerequisites

Before installing, ensure you have:
- **Node.js** v16 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)

Verify installation:
```bash
node --version  # Should show v16.x.x or higher
npm --version   # Should show 8.x.x or higher
```

### Installation Steps

1. **Clone or download the project**
   ```bash
   cd /path/to/eunomia-mini-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

   This installs all required packages defined in `package.json`:
   - Production dependencies: `react`, `react-dom`
   - Development dependencies: TypeScript, Vite, ESLint, Vitest, Testing Library

3. **Verify installation**
   ```bash
   npm run lint  # Should complete without errors
   ```

### Running the Development Server

Start the development server:
```bash
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

The application will:
- Open automatically in your default browser (configured in `vite.config.ts` line 8)
- Be available at `http://localhost:5173`
- Hot-reload when you make changes to source files

To stop the server, press `Ctrl+C` in the terminal.

---

## Usage Guide

### Basic Operations

#### Performing Calculations

1. **Addition**
   - Enter first number: `5`
   - Press operation: `+`
   - Enter second number: `3`
   - Press equals: `=`
   - Result: `8`

2. **Subtraction**
   - Example: `9 - 4 = 5`
   - Supports negative results: `3 - 8 = -5`

3. **Multiplication** (× symbol, Unicode U+00D7)
   - Example: `6 × 7 = 42`
   - Multiply by zero: `5 × 0 = 0`

4. **Division** (÷ symbol, Unicode U+00F7)
   - Example: `8 ÷ 2 = 4`
   - Decimal results: `7 ÷ 2 = 3.5`
   - Division by zero: `5 ÷ 0 = Error`

#### Working with Decimals

- **Starting with decimal**: Pressing `.` shows `0.`
- **Adding decimal**: `5.25` entered as `5` → `.` → `2` → `5`
- **Preventing multiple decimals**: `1.2.3` results in `1.23` (second decimal ignored)
- **Decimal after operation**: `5 + .3` interprets as `5 + 0.3`

#### Operation Chaining

The calculator supports chaining multiple operations:

```
Input:  1 0 + 5 - 3 × 2 =
Steps:  10 + 5 = 15
        15 - 3 = 12
        12 × 2 = 24
Result: 24
```

When you press an operation button while another operation is pending, the calculator automatically evaluates the previous operation.

#### Clear Function

Press `C` to:
- Reset display to `0`
- Clear stored values
- Cancel pending operations
- Exit error state

#### Error Handling

**Division by Zero:**
- Input: `5 ÷ 0 =`
- Display: `Error`
- Recovery: Press any digit to start fresh, or press `C` to clear

**Error State Behavior:**
- Operations are ignored while in error state
- Pressing a digit clears error and starts new number
- Pressing `.` clears error and starts with `0.`

### Button Layout

```
┌────┬────┬────┬────┐
│ C  │ ÷  │ ×  │ -  │
├────┼────┼────┼────┤
│ 7  │ 8  │ 9  │ +  │
├────┼────┼────┼────┤
│ 4  │ 5  │ 6  │ =  │
├────┼────┼────┼────┤
│ 1  │ 2  │ 3  │ .  │
├────┴────┴────┼────┤
│      0       │    │
└──────────────┴────┘
```

### Keyboard Support

While the current implementation uses click handlers, all buttons support:
- **Mouse Click**: Primary interaction method
- **Enter Key**: Activate focused button
- **Space Key**: Activate focused button
- **Tab Key**: Navigate between buttons
- **Focus Indicators**: Visible outline when button is focused

The focus outline is styled via CSS (see `Button.css` lines 29-32):
```css
.calculator-button:focus {
  outline: 2px solid var(--button-focus-outline);
  outline-offset: 2px;
}
```

### Theme Switching

Click the theme toggle button (top-right corner of calculator):
- **Light mode**: Shows 🌙 (moon icon)
- **Dark mode**: Shows ☀️ (sun icon)

Your theme preference is automatically saved and restored on subsequent visits.

---

## Development Guide

### Project Structure

```
eunomia-mini-calculator/
├── index.html                 # HTML entry point
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
├── .eslintrc.json             # ESLint rules
├── src/
│   ├── main.tsx               # React application entry point
│   ├── App.tsx                # Root component with theme context
│   ├── App.css                # Global styles and CSS variables
│   ├── App.test.tsx           # App component tests
│   ├── test/
│   │   └── setup.ts           # Test configuration and localStorage mock
│   └── components/
│       ├── Calculator.tsx     # Main calculator component
│       ├── Calculator.css     # Calculator layout styles
│       ├── Calculator.test.tsx # Calculator integration tests
│       ├── Display.tsx        # Display component
│       ├── Display.css        # Display styles
│       ├── Display.test.tsx   # Display component tests
│       ├── Button.tsx         # Button component
│       ├── Button.css         # Button styles
│       └── Button.test.tsx    # Button component tests
└── manual.md                  # This file
```

### Code Structure

#### TypeScript Configuration

The project uses strict TypeScript settings (`tsconfig.json`):
- Target: ES2020
- Module: ESNext
- JSX: react-jsx (automatic runtime, no need to import React)
- Strict mode: Disabled for flexibility (line 8)
- Test files excluded from compilation (line 19)

#### Component Conventions

1. **File Naming**: PascalCase with `.tsx` extension
   - `Calculator.tsx`, `Button.tsx`, `Display.tsx`

2. **Export Pattern**: Named exports
   ```typescript
   export function Calculator() { ... }
   ```

3. **Props Interface**: TypeScript interfaces for type safety
   ```typescript
   interface ButtonProps {
     label: string
     onClick: () => void
   }
   ```

4. **Styling**: Co-located CSS files
   - Component: `Button.tsx`
   - Styles: `Button.css`
   - Import in component: `import './Button.css'`

### Adding New Features

#### Example: Adding a Square Root Button

1. **Update Button Layout** (`Calculator.tsx`, line 94-100):
   ```typescript
   const buttons = [
     'C', '√', '÷', '\u00d7', '-',  // Add √ button
     '7', '8', '9', '+',
     // ... rest of buttons
   ]
   ```

2. **Add Handler Function** (in Calculator component):
   ```typescript
   const handleSquareRoot = () => {
     if (currentValue === 'Error') return
     const value = parseFloat(currentValue)
     if (value < 0) {
       setCurrentValue('Error')
     } else {
       setCurrentValue(String(Math.sqrt(value)))
       setShouldResetDisplay(true)
     }
   }
   ```

3. **Update Button Click Handler** (`Calculator.tsx`, line 102-114):
   ```typescript
   const handleButtonClick = (label: string) => {
     if (label === '√') {
       handleSquareRoot()
     } else if (label >= '0' && label <= '9') {
       handleDigit(label)
     }
     // ... rest of conditions
   }
   ```

4. **Write Tests** (`Calculator.test.tsx`):
   ```typescript
   describe('square root', () => {
     it('calculates square root correctly', async () => {
       await clickButtons(user, ['1', '6', '√'])
       expect(getDisplay()).toHaveTextContent('4')
     })

     it('shows error for negative numbers', async () => {
       await clickButtons(user, ['9', '-', '1', '6', '=', '√'])
       expect(getDisplay()).toHaveTextContent('Error')
     })
   })
   ```

### Coding Conventions

1. **React Patterns**:
   - Functional components with hooks (no class components)
   - `useState` for local state
   - `useContext` for global state
   - `useEffect` for side effects (localStorage, DOM updates)

2. **TypeScript**:
   - Explicit types for function parameters and props
   - Type inference for variables when obvious
   - Interfaces for component props
   - String literal types for theme: `'light' | 'dark'`

3. **CSS**:
   - CSS custom properties for theming (`--variable-name`)
   - Theme variants using `[data-theme='dark']` selector
   - BEM-like naming: `.calculator-button`, `.theme-toggle`
   - Transitions for smooth theme switching (0.3s ease)

4. **State Management**:
   - Keep state as close to where it's used as possible
   - Lift state only when needed for sharing
   - Use Context for truly global state (theme)

---

## Testing

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode:**
```bash
npx vitest
```

**Run tests with coverage:**
```bash
npx vitest run --coverage
```

### Test Structure

The project has comprehensive test coverage across all components:

#### Test Files Overview

| Test File | Lines | Test Cases | Coverage |
|-----------|-------|------------|----------|
| `App.test.tsx` | 107 | 9 | Theme functionality |
| `Calculator.test.tsx` | 289 | 40+ | Calculator logic |
| `Button.test.tsx` | 215 | 30+ | Button interactions |
| `Display.test.tsx` | 81 | 15+ | Display rendering |

#### Test Configuration

**Setup File** (`src/test/setup.ts`):
- Imports `@testing-library/jest-dom` for custom matchers
- Provides localStorage mock for testing (lines 3-19)

**Vite Config** (`vite.config.ts`, lines 10-14):
```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
}
```

### Testing Patterns

#### Component Testing

**Example from Button.test.tsx** (lines 28-37):
```typescript
it('calls onClick handler when clicked', async () => {
  const user = userEvent.setup()
  const mockOnClick = vi.fn()
  render(<Button label="1" onClick={mockOnClick} />)

  const button = screen.getByRole('button', { name: '1' })
  await user.click(button)

  expect(mockOnClick).toHaveBeenCalledTimes(1)
})
```

**Key Patterns:**
- Use `userEvent` for realistic user interactions
- Query by role for accessibility (`getByRole`)
- Mock functions with `vi.fn()` from Vitest
- Test user behavior, not implementation details

#### Integration Testing

**Example from Calculator.test.tsx** (lines 92-96):
```typescript
it('adds two integers', async () => {
  await clickButtons(user, ['2', '+', '3', '='])
  expect(getDisplay()).toHaveTextContent('5')
})
```

**Helper Functions** (lines 5-17):
```typescript
function getButton(label: string) {
  return screen.getByRole('button', { name: label })
}

function getDisplay() {
  return document.querySelector('.display')!
}

async function clickButtons(user, labels: string[]) {
  for (const label of labels) {
    await user.click(getButton(label))
  }
}
```

### Writing New Tests

**Template for New Component Test:**
```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { YourComponent } from './YourComponent'

describe('YourComponent', () => {
  it('renders without crashing', () => {
    render(<YourComponent />)
    expect(screen.getByRole('...')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const user = userEvent.setup()
    render(<YourComponent />)

    await user.click(screen.getByRole('button'))

    expect(/* assertion */).toBe(/* expected */)
  })
})
```

**Best Practices:**
1. Test user-visible behavior, not implementation
2. Use semantic queries (`getByRole`, `getByLabelText`)
3. Prefer `userEvent` over `fireEvent`
4. Test both happy paths and edge cases
5. Group related tests with `describe` blocks
6. Use descriptive test names: `it('does what the user expects', ...)`

---

## Building & Deployment

### Production Build

Create an optimized production build:
```bash
npm run build
```

**Build Process:**
1. TypeScript compilation (`tsc`)
2. Vite bundling and optimization
3. Output to `dist/` directory

**Build Output:**
```
dist/
├── index.html           # Entry HTML
├── assets/
│   ├── index-[hash].js  # Bundled JavaScript
│   └── index-[hash].css # Bundled CSS
└── vite.svg             # Favicon
```

**Build Optimizations:**
- Code minification
- Tree shaking (removes unused code)
- CSS optimization and bundling
- Asset hashing for cache busting
- Source maps for debugging (if enabled)

### Preview Production Build

Test the production build locally:
```bash
npm run preview
```

This serves the `dist/` folder using Vite's preview server, allowing you to verify the production build before deployment.

### Deployment Options

#### 1. Static Hosting (Recommended)

Deploy the `dist/` folder to any static hosting service:

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**GitHub Pages:**
```bash
# Add to package.json
"homepage": "https://username.github.io/repo-name",

# Build and deploy
npm run build
npx gh-pages -d dist
```

#### 2. Manual Deployment

Upload the `dist/` folder contents to any web server:
- Apache
- Nginx
- Amazon S3
- Google Cloud Storage
- Azure Static Web Apps

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/calculator/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Deployment Checklist

- [ ] Run `npm test` and ensure all tests pass
- [ ] Run `npm run lint` and fix any issues
- [ ] Run `npm run build` successfully
- [ ] Test with `npm run preview`
- [ ] Verify theme switching works
- [ ] Test calculator operations
- [ ] Check responsive design
- [ ] Verify localStorage persistence
- [ ] Test in multiple browsers

---

## Theme Support

### Overview

The calculator supports two themes:
- **Light Mode**: Clean, bright interface with subtle shadows
- **Dark Mode**: Easy on the eyes with muted colors

Theme preference is automatically saved to localStorage and restored on subsequent visits.

### Implementation

#### Theme Context

**Context Definition** (`src/App.tsx`, lines 5-11):
```typescript
export const ThemeContext = createContext<{
  theme: 'light' | 'dark'
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {},
})
```

#### Theme State Management

**Initialization with localStorage** (`src/App.tsx`, lines 14-17):
```typescript
const [theme, setTheme] = useState<'light' | 'dark'>(() => {
  const savedTheme = localStorage.getItem('calculator-theme')
  return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light'
})
```

**Persistence Effect** (`src/App.tsx`, lines 19-22):
```typescript
useEffect(() => {
  localStorage.setItem('calculator-theme', theme)
  document.documentElement.setAttribute('data-theme', theme)
}, [theme])
```

#### CSS Custom Properties

**Light Theme Variables** (`src/App.css`, lines 1-23):
```css
:root {
  --app-bg: #ffffff;
  --app-text: #333333;
  --calculator-bg: #e8e8e8;
  --display-bg: #f5f5f5;
  --button-bg-start: #ffffff;
  --button-text: #333333;
  /* ... more variables ... */
}
```

**Dark Theme Overrides** (`src/App.css`, lines 25-47):
```css
[data-theme='dark'] {
  --app-bg: #1a1a1a;
  --app-text: #e0e0e0;
  --calculator-bg: #2a2a2a;
  --display-bg: #1f1f1f;
  --button-bg-start: #3a3a3a;
  --button-text: #e0e0e0;
  /* ... more variables ... */
}
```

#### Theme Toggle Button

**Implementation** (`src/components/Calculator.tsx`, lines 118-124):
```typescript
<button
  className="theme-toggle"
  onClick={toggleTheme}
  aria-label="Toggle theme"
>
  {theme === 'light' ? '🌙' : '☀️'}
</button>
```

**Styling** (`src/components/Calculator.css`, lines 12-38):
```css
.theme-toggle {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.theme-toggle:hover {
  transform: scale(1.1);
}
```

### Adding Custom Themes

To add a new theme (e.g., "blue"):

1. **Update Theme Type** (`src/App.tsx`):
   ```typescript
   const [theme, setTheme] = useState<'light' | 'dark' | 'blue'>('light')
   ```

2. **Add CSS Variables** (`src/App.css`):
   ```css
   [data-theme='blue'] {
     --app-bg: #001f3f;
     --app-text: #7fdbff;
     /* ... define all variables ... */
   }
   ```

3. **Update Toggle Logic**:
   ```typescript
   const toggleTheme = () => {
     setTheme((prev) => {
       if (prev === 'light') return 'dark'
       if (prev === 'dark') return 'blue'
       return 'light'
     })
   }
   ```

### Theme Transitions

All theme-aware elements include CSS transitions for smooth switching:
```css
transition: background-color 0.3s ease, color 0.3s ease;
```

This applies to:
- App background (`src/App.css`, line 56)
- Calculator container (`src/components/Calculator.css`, line 9)
- Display (`src/components/Display.css`, line 18)
- Buttons (via CSS variables)

---

## Troubleshooting

### Common Issues

#### Build Errors

**Issue**: `npm run build` fails with TypeScript errors

**Solution**:
```bash
# Check TypeScript errors
npx tsc --noEmit

# Fix errors in reported files
# Common issues: missing types, incorrect imports
```

**Issue**: Module not found errors

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Development Server

**Issue**: Port 5173 already in use

**Solution**:
```bash
# Option 1: Kill process using port
lsof -ti:5173 | xargs kill -9

# Option 2: Use different port
npm run dev -- --port 3000
```

**Issue**: Changes not reflecting (hot reload not working)

**Solution**:
- Check file is saved
- Refresh browser manually
- Restart dev server: `Ctrl+C` then `npm run dev`

#### Testing Issues

**Issue**: Tests fail with "localStorage is not defined"

**Solution**:
Ensure `src/test/setup.ts` is properly configured and imported in `vite.config.ts` (line 13).

**Issue**: Tests timeout or hang

**Solution**:
```bash
# Run with increased timeout
npx vitest run --testTimeout=10000
```

#### Runtime Issues

**Issue**: Calculator shows "Error" unexpectedly

**Causes**:
1. Division by zero: `5 ÷ 0 = Error`
2. Invalid calculation state

**Solution**: Press `C` to clear and start fresh

**Issue**: Theme not persisting

**Possible causes**:
1. Browser blocking localStorage (privacy mode)
2. localStorage quota exceeded

**Solution**:
```javascript
// Check localStorage in browser console
localStorage.getItem('calculator-theme')

// Clear if corrupted
localStorage.removeItem('calculator-theme')
```

#### Display Issues

**Issue**: Long numbers overflow display

**Current behavior**: Display uses CSS `text-overflow: ellipsis` and `overflow: hidden` (`Display.css`, lines 15-17)

**Enhancement idea**: Implement automatic font scaling:
```css
.display {
  font-size: clamp(1rem, 2rem, 2rem);
}
```

**Issue**: Buttons not clickable on mobile

**Check**: Ensure no CSS is blocking touch events
```css
.calculator-button {
  touch-action: manipulation; /* Add this */
}
```

### Browser Compatibility

**Tested Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Known Issues:**
- Internet Explorer: Not supported (uses modern ES2020+ features)
- Safari < 14: CSS custom properties may not work in dark mode

**Polyfills Not Required:**
The build target (ES2020) is supported by all modern browsers.

### Performance

**Issue**: Slow initial load

**Solutions**:
1. Enable gzip/brotli compression on server
2. Use CDN for static assets
3. Implement code splitting (if app grows)

**Issue**: Memory leaks in long sessions

**Check**: Ensure event listeners are cleaned up (current implementation is clean)

---

## API Reference

### Components

#### App Component

**File**: `src/App.tsx`

**Exports**:
- `ThemeContext` - React Context for theme management
- `App` (default) - Root application component

**Context Value**:
```typescript
{
  theme: 'light' | 'dark',
  toggleTheme: () => void
}
```

**Usage**:
```typescript
import App from './App'
import { ThemeContext } from './App'

// In a component
const { theme, toggleTheme } = useContext(ThemeContext)
```

---

#### Calculator Component

**File**: `src/components/Calculator.tsx`

**Export**: `Calculator` (named export)

**Props**: None

**State**:
```typescript
{
  currentValue: string,      // Display value ("0", "123", "Error")
  previousValue: string,     // Stored operand ("")
  operation: string,         // Pending operation ("", "+", "-", "×", "÷")
  shouldResetDisplay: boolean // Reset flag for next digit input
}
```

**Internal Functions**:

##### `handleDigit(digit: string): void`
Processes digit button clicks (0-9).

**Behavior**:
- Replaces "Error" state with digit
- Resets display if `shouldResetDisplay` is true
- Replaces leading zero (except before decimal)
- Appends digit to current value

##### `handleDecimal(): void`
Adds decimal point to current number.

**Behavior**:
- Replaces "Error" with "0."
- Resets display to "0." if `shouldResetDisplay` is true
- Prevents multiple decimals in same number

##### `calculate(left: number, right: number, op: string): string`
Performs arithmetic operation.

**Parameters**:
- `left`: First operand
- `right`: Second operand
- `op`: Operation ("+", "-", "×", "÷")

**Returns**: Result as string, or "Error" for division by zero

##### `handleOperation(nextOp: string): void`
Processes operation button clicks (+, -, ×, ÷).

**Behavior**:
- Evaluates pending operation if one exists
- Stores current value as previous value
- Sets new operation
- Sets reset display flag

##### `handleEquals(): void`
Computes and displays final result.

**Behavior**:
- Requires previous value and operation to be set
- Calls `calculate()` with stored values
- Clears operation state
- Sets reset display flag

##### `handleClear(): void`
Resets calculator to initial state.

**Behavior**:
- Sets current value to "0"
- Clears previous value
- Clears operation
- Clears reset display flag

**Usage**:
```typescript
import { Calculator } from './components/Calculator'

function MyApp() {
  return <Calculator />
}
```

---

#### Display Component

**File**: `src/components/Display.tsx`

**Export**: `Display` (named export)

**Props**:
```typescript
interface DisplayProps {
  value: string | number  // Value to display
}
```

**Example**:
```typescript
import { Display } from './components/Display'

<Display value="123.45" />
<Display value={42} />
<Display value="Error" />
```

**Styling**: `.display` class from `Display.css`

---

#### Button Component

**File**: `src/components/Button.tsx`

**Export**: `Button` (named export)

**Props**:
```typescript
interface ButtonProps {
  label: string           // Button text (e.g., "5", "+", "=")
  onClick: () => void     // Click handler
}
```

**Example**:
```typescript
import { Button } from './components/Button'

<Button label="7" onClick={() => console.log('7 clicked')} />
<Button label="+" onClick={handleOperation} />
```

**Styling**: `.calculator-button` class from `Button.css`

---

### CSS Classes

#### Global Classes

| Class | File | Purpose |
|-------|------|---------|
| `.app` | `App.css` | Main app container |

#### Calculator Classes

| Class | File | Purpose |
|-------|------|---------|
| `.calculator` | `Calculator.css` | Calculator container |
| `.theme-toggle` | `Calculator.css` | Theme toggle button |
| `.button-grid` | `Calculator.css` | 4-column button grid |

#### Component Classes

| Class | File | Purpose |
|-------|------|---------|
| `.display` | `Display.css` | Display container |
| `.calculator-button` | `Button.css` | Individual button |

### CSS Custom Properties

All theme-related properties are defined as CSS custom properties in `src/App.css`:

**Application:**
- `--app-bg`: Application background color
- `--app-text`: Application text color

**Calculator:**
- `--calculator-bg`: Calculator background
- `--calculator-shadow`: Calculator box shadow

**Display:**
- `--display-bg`: Display background
- `--display-border`: Display border color
- `--display-text`: Display text color
- `--display-shadow-inset`: Display inner shadow

**Buttons:**
- `--button-bg-start`: Button gradient start
- `--button-bg-end`: Button gradient end
- `--button-border`: Button border color
- `--button-text`: Button text color
- `--button-shadow`: Button shadow
- `--button-hover-bg-start`: Hover gradient start
- `--button-hover-bg-end`: Hover gradient end
- `--button-hover-border`: Hover border color
- `--button-hover-shadow`: Hover shadow
- `--button-active-bg-start`: Active gradient start
- `--button-active-bg-end`: Active gradient end
- `--button-active-border`: Active border color
- `--button-focus-outline`: Focus outline color

### Package Scripts

Defined in `package.json`:

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start development server |
| `build` | `tsc && vite build` | Build for production |
| `preview` | `vite preview` | Preview production build |
| `lint` | `eslint src --ext ts,tsx` | Run ESLint |
| `test` | `vitest run` | Run tests once |

**Usage**:
```bash
npm run <script>
```

---

## Appendix

### File Reference

**Configuration Files:**
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript compiler options
- `vite.config.ts` - Vite bundler configuration
- `.eslintrc.json` - ESLint code quality rules

**Source Files:**
- `src/main.tsx` - React entry point (9 lines)
- `src/App.tsx` - Root component with theme (37 lines)
- `src/App.css` - Global styles and CSS variables (63 lines)
- `src/components/Calculator.tsx` - Calculator logic (138 lines)
- `src/components/Calculator.css` - Calculator layout (45 lines)
- `src/components/Display.tsx` - Display component (14 lines)
- `src/components/Display.css` - Display styling (20 lines)
- `src/components/Button.tsx` - Button component (15 lines)
- `src/components/Button.css` - Button styling (33 lines)

**Test Files:**
- `src/test/setup.ts` - Test configuration (20 lines)
- `src/App.test.tsx` - App theme tests (107 lines)
- `src/components/Calculator.test.tsx` - Calculator integration tests (289 lines)
- `src/components/Display.test.tsx` - Display component tests (81 lines)
- `src/components/Button.test.tsx` - Button component tests (215 lines)

### Version History

- **v1.0.0** - Initial release with calculator functionality and theme support

### Contributing

This is a learning project. For improvements:
1. Write tests first
2. Follow existing code patterns
3. Update this manual if adding features
4. Run linter and tests before committing

### License

This project is for educational purposes.

---

**Manual Version**: 1.0
**Last Updated**: 2026-03-07
**Project Version**: 1.0.0
