"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
  Sphere,
  Torus,
  Box,
  Cone,
  Icosahedron,
  Octahedron,
  Environment,
  PerspectiveCamera,
  Stars,
  Trail,
} from "@react-three/drei";
import * as THREE from "three";
import type { SceneConfig } from "@/lib/generate-3d";

function SceneObject({ config }: { config: SceneConfig }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const time = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    time.current += delta;

    switch (config.animationType) {
      case "rotate":
        meshRef.current.rotation.x += delta * 0.3;
        meshRef.current.rotation.y += delta * 0.5;
        break;
      case "float":
        meshRef.current.position.y = Math.sin(time.current * 1.5) * 1.2;
        meshRef.current.rotation.x = Math.sin(time.current * 0.8) * 0.2;
        meshRef.current.rotation.y += delta * 0.3;
        break;
      case "pulse":
        const s = 1 + Math.sin(time.current * 2) * 0.15;
        meshRef.current.scale.set(s, s, s);
        meshRef.current.rotation.y += delta * 0.4;
        break;
      case "wave":
        meshRef.current.position.y = Math.sin(time.current * 2 + meshRef.current.position.x * 2) * 0.8;
        meshRef.current.position.x = Math.cos(time.current * 0.5) * 2;
        meshRef.current.rotation.z += delta * 0.2;
        break;
      case "explode":
        const e = Math.sin(time.current * 1.5) * 0.3 + 0.7;
        meshRef.current.scale.set(e, e, e);
        meshRef.current.rotation.x += delta * 0.8;
        meshRef.current.rotation.y += delta * 1.2;
        break;
    }
  });

  const Primitive = useMemo(() => {
    switch (config.type) {
      case "product": return Torus;
      case "logo": return Icosahedron;
      case "text": return Box;
      case "character": return Cone;
      case "cyber": return Octahedron;
      default: return Sphere;
    }
  }, [config.type]);

  const props = useMemo(() => {
    switch (config.type) {
      case "product": return { args: [1, 0.4, 32, 32] as const };
      case "logo": return { args: [1, 16] as const };
      case "text": return { args: [1.5, 1.5, 1.5] as const };
      case "character": return { args: [1, 2, 16] as const };
      case "cyber": return { args: [1.2, 8] as const };
      default: return { args: [1, 32, 32] as const };
    }
  }, [config.type]);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef} {...props}>
        {config.type === "product" || config.type === "text" ? (
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.5}
            chromaticAberration={0.1}
            anisotropy={0.3}
            distortion={0.1}
            color={config.colors[0]}
            metalness={0.3}
            roughness={0.2}
          />
        ) : config.type === "cyber" ? (
          <MeshDistortMaterial
            color={config.colors[1]}
            speed={2}
            distort={0.3}
            radius={1}
            metalness={0.8}
            roughness={0.2}
            emissive={config.colors[0]}
            emissiveIntensity={0.5}
          />
        ) : (
          <meshPhysicalMaterial
            color={config.colors[0]}
            metalness={0.6}
            roughness={0.1}
            envMapIntensity={1.5}
            clearcoat={0.3}
          />
        )}
      </mesh>
    </Float>
  );
}

function Particles({ config }: { config: SceneConfig }) {
  const count = Math.min(config.particleCount, 500);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    const c = new THREE.Color(config.particleColor);
    for (let i = 0; i < count; i++) {
      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }
    return cols;
  }, [count, config.particleColor]);

  const pointsRef = useRef<THREE.Points>(null!);
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * delta * 0.2;
      pos[i * 3] += Math.cos(state.clock.elapsedTime * 0.5 + i * 0.1) * delta * 0.1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function Rings({ config }: { config: SceneConfig }) {
  const groupRef = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x += delta * 0.05;
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation-x={Math.PI / 2 + i * 0.4} position-y={i * 0.3 - 0.3}>
          <ringGeometry args={[1.5 + i * 0.6, 1.6 + i * 0.6, 64]} />
          <meshBasicMaterial
            color={config.colors[i % config.colors.length]}
            transparent
            opacity={0.2 - i * 0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Scene3D({ config }: { config: SceneConfig }) {
  const bgColor = new THREE.Color(config.backgroundColor);

  return (
    <div className="w-full h-full relative">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          outputColorSpace: "srgb",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{ background: bgColor.getStyle() }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, config.cameraDistance]} fov={45} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={config.lightIntensity} />
        <pointLight position={[-5, -3, 2]} intensity={0.5} color={config.colors[1]} />
        <pointLight position={[3, -2, -5]} intensity={0.3} color={config.colors[2]} />

        <SceneObject config={config} />
        <Particles config={config} />
        <Rings config={config} />

        <Stars radius={40} depth={60} count={config.particleCount > 100 ? 1000 : 500} factor={4} fade speed={1} />
        <Environment preset="city" />
        <fog attach="fog" args={[config.fogColor || config.backgroundColor, 5, 15]} />
      </Canvas>
    </div>
  );
}
