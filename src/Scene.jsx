import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';

/**
 * ESCENA RECUPERADA: Versión 1 (Bola Roja Deforme)
 * Fondo negro absoluto y material ff00aa.
 */
export default function Scene({ quality = 'full' }) {
  const sphereRef = useRef();
  const isReduced = quality === 'reduced';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (sphereRef.current) {
      sphereRef.current.rotation.x = Math.sin(t / 4) * 0.3;
      sphereRef.current.rotation.y = t * 0.2;
      sphereRef.current.position.y = Math.sin(t / 2) * 0.2;
    }
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      {!isReduced && <Environment preset="city" />}
      
      <ambientLight intensity={isReduced ? 0.75 : 0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={isReduced ? 1.2 : 2}
        color="#ff00aa"
        castShadow={!isReduced}
      />
      <pointLight position={[-10, -10, -10]} intensity={isReduced ? 0.6 : 1} color="#00ffff" />

      <Float speed={isReduced ? 2.8 : 4} rotationIntensity={1} floatIntensity={isReduced ? 1.25 : 2}>
        <Sphere ref={sphereRef} args={[1.5, isReduced ? 32 : 64, isReduced ? 32 : 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#ff00aa"
            speed={isReduced ? 2 : 3}
            distort={isReduced ? 0.35 : 0.6}
            roughness={0}
            metalness={1}
          />
        </Sphere>
      </Float>
    </>
  );
}
