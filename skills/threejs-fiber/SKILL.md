---
name: threejs-fiber
description: "Production guide for 3D WebGL development using Three.js and React Three Fiber (R3F) with @react-three/drei. Covers canvas setup, scene composition, lighting, camera controls, materials, GLTF model loading, useFrame animation loops, custom GLSL shaders, and WebGL performance optimization."
license: MIT
---

# Three.js & React Three Fiber (R3F)

Guide for building performant, production-ready 3D web experiences using Three.js, React Three Fiber (`@react-three/fiber`), and `@react-three/drei`.

---

## 1. Installation & Environment Setup

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

In Next.js App Router, 3D Canvas components rely on WebGL and browser window APIs:
```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
```

---

## 2. Basic Scene Composition

```tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

function RotatingBox(props: any) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  // Animation loop running on every frame
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.5;
    meshRef.current.rotation.y += delta * 0.6;
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.4 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial
        color={hovered ? "#ec4899" : "#3b82f6"}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

export function Scene() {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <RotatingBox position={[0, 0, 0]} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
      </Canvas>
    </div>
  );
}
```

---

## 3. Lighting & Environment

- **`ambientLight`**: Omnidirectional baseline illumination. Keep intensity low (0.2–0.5).
- **`directionalLight`**: Simulates sunlight with parallel rays; provides crisp shadows.
- **`pointLight` / `spotLight`**: Local light sources (lamps, spotlights with decay).
- **Environment Maps (`@react-three/drei`)**:
  ```tsx
  import { Environment } from "@react-three/drei";
  
  <Environment preset="city" background={false} />
  ```

---

## 4. Loading 3D Models (`.glb` / `.gltf`)

Place assets in `/public/models/` and load via `useGLTF`:

```tsx
import { useGLTF } from "@react-three/drei";

export function Model(props: any) {
  const { scene } = useGLTF("/models/robot.glb");
  return <primitive object={scene} {...props} />;
}

// Preload for instant render
useGLTF.preload("/models/robot.glb");
```

---

## 5. Performance Optimization Rules

1. **`frameloop="demand"`**: If the scene only updates on user interaction (not continuous animations), pass `frameloop="demand"` to `<Canvas>` to save GPU and battery life.
2. **`InstancedMesh`**: For rendering many identical objects (particles, grass, tiles), use `instancedMesh` to render 10,000+ items in a single draw call.
3. **Asset Compression**: Always compress 3D assets to `.glb` format using Draco compression:
   ```bash
   npx gltf-pipeline -i input.gltf -o output.glb -d
   ```
4. **Dispose Geometries**: R3F automatically disposes unmounted objects, but custom procedural materials/textures should be cleaned up on unmount.
