---
name: framer-motion
description: Production-grade animation with Framer Motion and Motion for React (v12+). Covers motion components, animate, exit animations with AnimatePresence, layout animations (layoutId, shared element transitions), gestures (hover, tap, drag), scroll-driven animations (useScroll, whileInView), variants, orchestration, springs, performance, and Next.js / React Server Components best practices.
license: MIT
---

# Framer Motion & Motion for React

Production-ready animation guide for React and Next.js applications using Framer Motion (and modern `motion/react` v12+).

---

## 1. Package Installation & Imports

Motion transitioned its main package name from `framer-motion` to `motion`. Both are widespread in the ecosystem:

```bash
# Modern standard (Motion v12+)
npm install motion

# Legacy / widely-used package name
npm install framer-motion
```

### Import Styles
```tsx
// Modern (Motion v12+)
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";

// Legacy (framer-motion v11 and below)
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
```

### Next.js & Server Components Rule
Motion components and hooks rely on React browser lifecycle and refs.
> **Critical Rule:** In Next.js App Router or any React Server Component (RSC) environment, any file importing `motion`, `AnimatePresence`, or hooks must declare `"use client";` at the top of the file, or isolate motion logic into dedicated client components.

```tsx
"use client";

import { motion } from "motion/react";

export function FadeInCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 2. Core Animation Concepts

### Declarative `initial`, `animate`, and `exit`
Always animate GPU-accelerated transform properties (`x`, `y`, `scale`, `rotate`, `opacity`) rather than layout dimensions (`top`, `left`, `width`, `height`).

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8
  }}
/>
```

### Transition Types
1. **Spring (Default for natural motion):**
   - `stiffness`: Resistance to deformation (higher = snappier). Typical range: `150` to `400`.
   - `damping`: Opposing force / friction (higher = less oscillation). Typical range: `20` to `40`.
   - `mass`: Inertia (higher = heavier feel). Default `1`.
2. **Tween (Time-based):**
   - `duration`: Duration in seconds.
   - `ease`: Cubic bezier array `[0.16, 1, 0.3, 1]` (custom ease-out), `"easeInOut"`, `"easeOut"`, `"circOut"`.

---

## 3. Variants & Orchestration

Variants decouple animation definition from components and allow clean parent-to-child orchestration with `staggerChildren` and `delayChildren`.

```tsx
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export function FeatureList({ items }: { items: string[] }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {items.map((item, idx) => (
        <motion.li key={idx} variants={itemVariants} className="p-3 rounded-lg bg-card">
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

---

## 4. Exit Animations with `AnimatePresence`

`AnimatePresence` allows components to animate out when removed from the React tree.

### Key Rules
- Direct children of `AnimatePresence` **must** have a unique, stable `key`.
- Use `mode="wait"` when replacing one element with another (e.g. tabs or route transitions).
- Use `mode="popLayout"` for smooth list deletions where remaining items re-flow instantly.

```tsx
import { AnimatePresence, motion } from "motion/react";

export function NotificationBanner({ isVisible, message }: { isVisible: boolean; message: string }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="banner"
          initial={{ opacity: 0, y: -20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -20, height: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden bg-primary text-primary-foreground p-4 rounded-md"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## 5. Layout Animations & Shared Layouts (`layoutId`)

Motion can automatically animate layout changes (flex reordering, size shifts) with GPU transforms via `layout`.

### Shared Element Transitions with `layoutId`
Create seamless transitions between different components (active navigation pill, expanding cards):

```tsx
import { useState } from "react";
import { motion } from "motion/react";

const tabs = ["Overview", "Integrations", "Activity", "Settings"];

export function TabNav() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <nav className="flex space-x-2 border-b border-border p-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors ${
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
```

---

## 6. Gestures & Interactions

Motion provides direct gesture props that clean up React state logic:

```tsx
<motion.button
  whileHover={{ scale: 1.04, y: -1 }}
  whileTap={{ scale: 0.97 }}
  whileFocus={{ ring: 2 }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
>
  Click Me
</motion.button>
```

### Draggable Elements
```tsx
<motion.div
  drag
  dragConstraints={{ left: -100, right: 100, top: -50, bottom: 50 }}
  dragElastic={0.2}
  whileDrag={{ scale: 1.05, cursor: "grabbing" }}
  className="cursor-grab w-24 h-24 bg-accent rounded-xl flex items-center justify-center"
>
  Drag Me
</motion.div>
```

---

## 7. Scroll-Driven Animations

### 1. Viewport Trigger (`whileInView`)
Best for simple trigger-on-scroll sections.

```tsx
<motion.section
  initial={{ opacity: 0, y: 32 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  <h2>Features</h2>
</motion.section>
```

### 2. Scroll Progress Binding (`useScroll` + `useTransform`)
Best for scrubbed timeline or parallax animations.

```tsx
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";

export function ParallaxHeader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  const y = useTransform(smoothProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[80vh] overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-6xl font-bold">Headline In Motion</h1>
      </motion.div>
    </div>
  );
}
```

---

## 8. Imperative Control with `useAnimate`

When complex multi-step timelines or micro-interactions require imperative triggers:

```tsx
import { useAnimate } from "motion/react";

export function TriggerAnimation() {
  const [scope, animate] = useAnimate();

  const handleSuccess = async () => {
    // Step 1: Scale down button
    await animate("button", { scale: 0.9 }, { duration: 0.1 });
    // Step 2: Show checkmark with spring
    await animate(".check-icon", { opacity: 1, scale: [0, 1.2, 1] }, { duration: 0.4 });
    // Step 3: Flash background
    animate(scope.current, { backgroundColor: "#ecfdf5" }, { duration: 0.3 });
  };

  return (
    <div ref={scope} className="p-6 rounded-xl border">
      <button onClick={handleSuccess} className="px-4 py-2 bg-primary text-white rounded">
        Submit Form
      </button>
      <span className="check-icon opacity-0 ml-3 inline-block">✓</span>
    </div>
  );
}
```

---

## 9. Accessibility & Reduced Motion

Always respect user preferences for reduced motion:

```tsx
import { motion, useReducedMotion } from "motion/react";

export function AccessibleCard({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.4 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 10. Performance Checklist

1. **Animate Composited Properties**: Use `x`, `y`, `scale`, `rotate`, `opacity`. Avoid animating `width`, `height`, `margin`, `padding`, `top`, `left`.
2. **Layout with Care**: Use `layout` only when element sizes change dynamically and transforms alone cannot achieve the visual outcome. Add `layoutRoot` when nesting layout animations to prevent unintended propagation.
3. **Clean Keys on AnimatePresence**: Never use array index for keys on dynamic lists wrapped in `AnimatePresence`. Always use unique persistent IDs.
4. **Isolate Client Components**: Keep Next.js Server Components pure. Wrap leaf motion components in small `"use client"` wrappers to keep bundle sizes lean.
