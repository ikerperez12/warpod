import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import KineticScene from './KineticScene';

export default function KineticCanvas({ dpr, quality }) {
  return (
    <Canvas dpr={dpr} camera={{ position: [0, 0, 10], fov: 45 }}>
      <Suspense fallback={null}>
        <KineticScene quality={quality} />
      </Suspense>
    </Canvas>
  );
}
