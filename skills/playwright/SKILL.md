---
name: playwright
description: "End-to-End (E2E) web testing, browser automation, and visual regression testing using Playwright. Covers page navigation, resilient user-facing locators (getByRole, getByText, getByTestId), auto-waiting actions, assertions, visual comparisons, network mocking, and MCP browser control."
license: MIT
---

# Playwright: End-to-End Web Automation & Testing

Production-ready guide for browser automation, E2E testing, and visual verification with Playwright.

---

## 1. Setup & Installation

```bash
# Initialize Playwright in project
npm init playwright@latest

# Or install manually
npm install -D @playwright/test
npx playwright install --with-deps
```

### Basic Test Structure (`tests/example.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Resilient user-facing locators
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('SecurePassword123!');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Auto-retrying assertion
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByRole('heading', { name: 'Welcome Back' })).toBeVisible();
  });
});
```

---

## 2. Locator Hierarchy (Resilient by Design)

Avoid fragile CSS paths (`div > div:nth-child(2) > button`). Always use semantic locators in this priority order:

1. **`page.getByRole(role, { name })`** — Most resilient; tests accessibility semantics.
   ```typescript
   page.getByRole('button', { name: 'Submit' })
   page.getByRole('dialog', { name: 'Confirm Action' })
   page.getByRole('checkbox', { name: 'I agree to the terms' })
   ```
2. **`page.getByLabel(text)`** — Best for form inputs associated with `<label>`.
   ```typescript
   page.getByLabel('Username').fill('alex')
   ```
3. **`page.getByPlaceholder(text)`** — Useful when inputs lack permanent labels.
4. **`page.getByText(text, { exact: false })`** — For non-interactive content.
5. **`page.getByTestId(id)`** — Fallback for complex interactive widgets lacking semantic roles.
   ```typescript
   page.getByTestId('cart-item-counter')
   ```

---

## 3. Auto-Waiting & Assertions

Playwright automatically waits for elements to be actionable (visible, stable, enabled) before performing clicks or fills. **Never use arbitrary `setTimeout` or `page.waitForTimeout()`**.

### Auto-Retrying Assertions (Always `await`)
```typescript
// Visibility
await expect(page.getByRole('alert')).toBeVisible();
await expect(page.getByText('Loading...')).toBeHidden();

// Content
await expect(page.getByTestId('status')).toHaveText('Complete');
await expect(page.getByLabel('Quantity')).toHaveValue('5');

// State
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled();
await expect(page.getByRole('checkbox')).toBeChecked();
```

---

## 4. Visual Verification & Screenshots

### Visual Snapshots
```typescript
test('visual regression check', async ({ page }) => {
  await page.goto('/pricing');
  // Full page screenshot comparison
  await expect(page).toHaveScreenshot('pricing-page.png', {
    maxDiffPixelRatio: 0.05,
    fullPage: true,
  });
});
```

### On-Demand Debug Screenshots
```typescript
await page.screenshot({ path: 'artifacts/debug-screen.png', fullPage: true });
```

---

## 5. Network Mocking & API Interception

```typescript
test('handles server error gracefully', async ({ page }) => {
  // Mock API response
  await page.route('**/api/v1/profile', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    });
  });

  await page.goto('/profile');
  await expect(page.getByText('Failed to load profile. Please try again.')).toBeVisible();
});
```

---

## 6. Playwright via MCP (AI Agent Inspection)

When using `@playwright/mcp` within an AI coding agent:
- Use `page.goto` to navigate to local dev server (`http://localhost:3000`).
- Call `screenshot` tool to visually review layout, animation frames, and color palettes.
- Call `click` or `fill` to test dynamic interactive states without human intervention.
