---
name: tailwind-v4
description: "Modern styling guidelines for Tailwind CSS v4. Covers CSS-first configuration (@import 'tailwindcss'; and @theme), elimination of tailwind.config.js, native cascade layers, modern color formats (OKLCH, Display-P3), container queries (@container), 3D transforms, custom @utility directives, and migration from v3."
license: MIT
---

# Tailwind CSS v4: Architecture & Modern Styling

Guide for configuring and developing with Tailwind CSS v4's CSS-first architecture.

---

## 1. Key Architectural Changes (v3 vs v4)

- **No `tailwind.config.js`**: Configuration is now written directly in CSS using standard directives (`@import "tailwindcss";` and `@theme`).
- **Oxide Engine**: Ultra-fast Rust-based engine with near-instant incremental compilation.
- **Modern Color System**: Native support for wide-gamut color spaces (`oklch`, `display-p3`) alongside standard sRGB.

---

## 2. Configuration Setup (`globals.css`)

```css
@import "tailwindcss";

@theme {
  /* Typography */
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Custom Color Tokens (OKLCH for perceptual uniformity) */
  --color-primary: oklch(0.62 0.21 258);
  --color-primary-hover: oklch(0.56 0.23 258);
  --color-surface: oklch(0.98 0.005 260);
  --color-surface-dark: oklch(0.14 0.01 260);

  /* Animation Tokens */
  --ease-fluid: cubic-bezier(0.16, 1, 0.3, 1);
  --animate-accordion-down: accordion-down 0.2s var(--ease-fluid);
}
```

---

## 3. Modern v4 Utility Features

### 1. Native Container Queries
Style elements based on the size of their parent container rather than the entire viewport:

```html
<div class="@container">
  <div class="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 gap-4">
    <!-- Items adjust dynamically based on container width -->
  </div>
</div>
```

### 2. Native 3D Transform Utilities
```html
<div class="perspective-1000">
  <div class="transform-3d rotate-x-12 rotate-y-6 hover:rotate-y-0 transition-transform duration-500">
    3D Card Surface
  </div>
</div>
```

### 3. Custom Utilities with `@utility`
Define bespoke utility classes that participate in Tailwind's variant system (`hover:`, `focus:`, `dark:`):

```css
@utility shadow-glow {
  box-shadow: 0 0 20px -5px var(--color-primary);
}
```

```html
<button class="shadow-glow hover:scale-105 transition-transform">
  Glowing Button
</button>
```

---

## 4. Best Practices & Quality Floor

1. **Avoid Arbitrary Values When Tokens Exist**: Prefer semantic tokens (`text-primary`, `bg-surface`) over arbitrary one-offs (`text-[#3b82f6]`).
2. **Accessible Contrast**: Ensure foreground text meets WCAG AA (4.5:1 for normal text, 3:1 for large headings) across light and dark themes.
3. **Compound Transitions**: Use `transition-[property]` or `transition-colors` rather than naked `transition-all` to minimize reflow overhead.
