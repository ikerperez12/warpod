import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './Scene';

export default function BackgroundCanvas({ dpr, quality }) {
  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ powerPreference: 'high-performance', antialias: quality === 'full', alpha: false }}
    >
      <Suspense fallback={null}>
        <Scene quality={quality} />
      </Suspense>
    </Canvas>
  );
}
