import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

function Bubble({ position, size, speed, color }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y += Math.sin(t * speed) * 0.002;
      ref.current.position.x += Math.cos(t * speed) * 0.001;
    }
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
          transparent={true}
          opacity={0.6}
        />
      </Sphere>
    </Float>
  );
}

export default function Scene() {
  const groupRef = useRef();

  const bubbles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ],
      size: Math.random() * 0.5 + 0.2,
      speed: Math.random() * 0.5 + 0.2,
      color: i % 2 === 0 ? "#ffffff" : "#ff00aa"
    }));
  }, []);

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
      <Environment files={"/assets/models/env.hdr"} background={false} resolution={256} />
      
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ff00aa" castShadow />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />

      <group ref={groupRef}>
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
        {bubbles.map((props, i) => (
          <Bubble key={i} {...props} />
        ))}
      </group>

      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1} />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.001, 0.001]}
        />
      </EffectComposer>
    </>
  );
}
