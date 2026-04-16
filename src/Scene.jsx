import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, Stars } from '@react-three/drei';
import { Bloom, ChromaticAberration, EffectComposer } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

function Bubble({ position, size, speed, color }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (!ref.current) return;

    ref.current.position.y += Math.sin(t * speed) * 0.002;
    ref.current.position.x += Math.cos(t * speed) * 0.001;
  });

  return (
    <Float speed={speed * 2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={ref} args={[size, 32, 32]} position={position}>
        <meshPhysicalMaterial
          color={color}
          roughness={0}
          metalness={0.1}
          transmission={1}
          thickness={1}
          ior={1.45}
          envMapIntensity={2}
          clearcoat={1}
          transparent
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
}

export default function Scene({ quality = 'full' }) {
  const groupRef = useRef();
  const isReduced = quality === 'reduced';
  const bubbleCount = isReduced ? 10 : 20;

  const bubbles = useMemo(
    () =>
      Array.from({ length: bubbleCount }).map((_, i) => ({
        position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
        size: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.2,
        color: i % 2 === 0 ? '#ffffff' : '#ff00aa'
      })),
    [bubbleCount]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
    }

    state.camera.position.x = Math.sin(t / 10) * 0.5;
    state.camera.position.y = Math.cos(t / 10) * 0.5;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <color attach="background" args={['#020205']} />
      <Environment files="/assets/models/env.hdr" background={false} resolution={isReduced ? 128 : 256} />

      <ambientLight intensity={isReduced ? 0.45 : 0.4} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={isReduced ? 1.4 : 2}
        color="#ff00aa"
        castShadow={!isReduced}
      />
      <pointLight position={[-10, -10, -10]} intensity={isReduced ? 0.8 : 1} color="#00ffff" />

      <group ref={groupRef}>
        <Stars radius={100} depth={50} count={isReduced ? 900 : 2000} factor={4} saturation={0} fade speed={0.5} />
        {bubbles.map((props, i) => (
          <Bubble key={i} {...props} />
        ))}
      </group>

      {!isReduced && (
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1} />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.001, 0.001]} />
        </EffectComposer>
      )}
    </>
  );
}
