import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 500;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const posAttr = particlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities[i * 3];
        posArray[i * 3 + 1] += velocities[i * 3 + 1];
        posArray[i * 3 + 2] += velocities[i * 3 + 2];
        
        if (Math.abs(posArray[i * 3]) > 25) velocities[i * 3] *= -1;
        if (Math.abs(posArray[i * 3 + 1]) > 25) velocities[i * 3 + 1] *= -1;
        if (Math.abs(posArray[i * 3 + 2]) > 15) velocities[i * 3 + 2] *= -1;
      }
      
      posAttr.needsUpdate = true;
      particlesRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#4fd1c5"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function ConnectionLines() {
  const linesRef = useRef<THREE.Group>(null);
  
  const lines = useMemo(() => {
    const lineData: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    for (let i = 0; i < 30; i++) {
      lineData.push({
        start: new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20
        ),
        end: new THREE.Vector3(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20
        ),
      });
    }
    return lineData;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={linesRef}>
      {lines.map((line, i) => {
        const points = [line.start, line.end];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <line key={i}>
            <bufferGeometry attach="geometry" {...geometry} />
            <lineBasicMaterial
              attach="material"
              color="#4fd1c5"
              transparent
              opacity={0.1}
            />
          </line>
        );
      })}
    </group>
  );
}

export function ParticleBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 -z-10 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Particles />
        <ConnectionLines />
      </Canvas>
    </div>
  );
}

export default ParticleBackground;
