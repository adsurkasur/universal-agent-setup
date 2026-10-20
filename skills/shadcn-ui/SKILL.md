---
name: shadcn-ui
description: "Architecture, customization, and usage guidelines for shadcn/ui. Covers Radix UI accessible primitives, CLI component generation (npx shadcn@latest add), the cn() utility (clsx + tailwind-merge), cva (class-variance-authority) variants, asChild slot composition, CSS variable theming, and forms with zod & react-hook-form."
license: MIT
---

# shadcn/ui Component Architecture

Best practices for building accessible, themeable React/Next.js interfaces with shadcn/ui, Radix UI primitives, and Tailwind CSS.

---

## 1. Core Principles

- **Ownership Over Abstraction**: Components live directly in your codebase (`@/components/ui/*`). You own the code; customize it directly rather than fighting library constraints.
- **Accessible Primitives**: Built on top of Radix UI primitives ensuring keyboard navigation, focus management, ARIA roles, and screen reader compliance.
- **CVA Variants**: Styling variants are declared with `class-variance-authority` (`cva`) for type-safe props.

---

## 2. Setup & CLI Workflow

```bash
# Initialize shadcn/ui in project
npx shadcn@latest init

# Add required components
npx shadcn@latest add button dialog card input dropdown-menu form
```

### The `cn` Utility (`lib/utils.ts`)
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 3. The `asChild` Pattern (Radix Slot)

When you want a component (like a `Button`) to render as a Next.js `Link` or custom anchor without invalid nested interactive elements:

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NavLink() {
  return (
    <Button asChild variant="outline">
      <Link href="/dashboard">Go to Dashboard</Link>
    </Button>
  );
}
```

---

## 4. Customizing Variants with `cva`

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border border-input hover:bg-accent",
        glow: "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

---

## 5. Forms with Zod & React Hook Form

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export function EmailForm() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </Form>
  );
}
```
