import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useGLTF, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, position, scale, rotationSpeed, mouse }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      // Rotation based on time
      ref.current.rotation.y = t * rotationSpeed;
      ref.current.rotation.z = Math.sin(t * 0.5) * 0.2;

      // Mouse follow effect (physics-like)
      const targetX = mouse.current[0] * 2;
      const targetY = mouse.current[1] * 2;
      
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, position[0] + targetX, 0.05);
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, position[1] + targetY, 0.05);
      
      // Dynamic tilt based on mouse velocity/pos
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetY * 0.5, 0.05);
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, -targetX * 0.5, 0.05);
    }
  });

  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive 
      object={clonedScene} 
      ref={ref} 
      position={position} 
      scale={scale} 
    />
  );
}

export default function KineticScene({ quality = 'full' }) {
  const mouse = useRef([0, 0]);
  const isReduced = quality === 'reduced';

  useFrame((state) => {
    mouse.current = [state.mouse.x, state.mouse.y];
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      {!isReduced && <Environment files="/assets/models/env.hdr" background={false} resolution={256} />}
      <ambientLight intensity={isReduced ? 0.8 : 0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={isReduced ? 1.25 : 2} />
      <pointLight position={[-10, -10, -10]} color="#ff0077" intensity={isReduced ? 1 : 2} />

      <Float speed={isReduced ? 1.4 : 2.1} rotationIntensity={isReduced ? 0.35 : 0.65} floatIntensity={isReduced ? 0.5 : 0.85}>
        <Model
          url="/assets/models/helmet.glb"
          position={[0, 0, 0]}
          scale={isReduced ? 2.1 : 2.5}
          rotationSpeed={0.1}
          mouse={mouse}
        />
      </Float>
      
      {!isReduced && (
        <>
          <Model
            url="/assets/models/head.glb"
            position={[-5, 2, -2]}
            scale={0.6}
            rotationSpeed={-0.2}
            mouse={mouse}
          />

          <Model
            url="/assets/models/box.glb"
            position={[5, -2, -1]}
            scale={1.8}
            rotationSpeed={0.4}
            mouse={mouse}
          />
        </>
      )}

      {!isReduced && (
        <ContactShadows
          position={[0, -5, 0]}
          opacity={0.5}
          scale={30}
          blur={2.5}
          far={6}
        />
      )}
    </>
  );
}

useGLTF.preload('/assets/models/helmet.glb');
useGLTF.preload('/assets/models/head.glb');
useGLTF.preload('/assets/models/box.glb');
