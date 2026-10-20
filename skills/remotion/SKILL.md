---
name: remotion
description: "Programmatic video creation in React and TypeScript using Remotion. Covers compositions, timelines, Sequences, frame hooks (useCurrentFrame, useVideoConfig), physics-based springs, interpolate() transitions, audio synchronization, and CLI video rendering."
license: MIT
---

# Remotion: Programmatic Video Creation in React

Guide for generating video content, animated explainers, and marketing visuals programmatically with Remotion and React.

---

## 1. Project Initialization & Setup

```bash
# Scaffold a new Remotion project
npx create-video@latest

# Or add to an existing React project
npm install remotion @remotion/cli
```

---

## 2. Core Concepts: Composition & Sequence

Every video in Remotion is rooted in a `<Composition>` that defines its dimensions, frame rate, and duration:

```tsx
// src/Root.tsx
import { Composition } from "remotion";
import { PromoVideo } from "./PromoVideo";

export const RemotionRoot = () => {
  return (
    <Composition
      id="PromoVideo"
      component={PromoVideo}
      durationInFrames={150} // 5 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "Universal Agent Architecture",
      }}
    />
  );
};
```

---

## 3. Frame Animation with `interpolate` & `spring`

```tsx
// src/PromoVideo.tsx
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
  Audio,
} from "remotion";

export const PromoVideo = ({ title }: { title: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural spring entrance
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  // Fade out towards the end
  const opacity = interpolate(frame, [120, 150], [1, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#09090b",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity,
      }}
    >
      <Sequence from={0} durationInFrames={150}>
        <h1
          style={{
            transform: `scale(${scale})`,
            fontSize: 80,
            fontFamily: "Inter, sans-serif",
            fontWeight: 800,
            letterSpacing: "-0.04em",
          }}
        >
          {title}
        </h1>
      </Sequence>
    </div>
  );
};
```

---

## 4. CLI Rendering & Preview

```bash
# Open interactive studio preview
npx remotion preview

# Render video to MP4
npx remotion render src/index.ts PromoVideo out/promo.mp4 --codec=h264
```
