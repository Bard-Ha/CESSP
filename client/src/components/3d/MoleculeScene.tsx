import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import * as THREE from "three";

interface AtomData {
  element: string;
  position: [number, number, number];
  color: string;
  radius: number;
}

interface BondData {
  start: [number, number, number];
  end: [number, number, number];
}

function Atom({ position, color, radius }: { position: [number, number, number]; color: string; radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <Sphere ref={meshRef} args={[radius, 32, 32]} position={position}>
      <meshStandardMaterial
        color={color}
        metalness={0.3}
        roughness={0.4}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </Sphere>
  );
}

function Bond({ start, end }: BondData) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end)
  ], [start, end]);

  return (
    <Line
      points={points}
      color="#4fd1c5"
      lineWidth={3}
      opacity={0.6}
      transparent
    />
  );
}

function MoleculeStructure({ atoms, bonds, rotating = true }: { atoms: AtomData[]; bonds: BondData[]; rotating?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && rotating) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {atoms.map((atom, i) => (
        <Atom
          key={`atom-${i}`}
          position={atom.position}
          color={atom.color}
          radius={atom.radius}
        />
      ))}
      {bonds.map((bond, i) => (
        <Bond key={`bond-${i}`} start={bond.start} end={bond.end} />
      ))}
    </group>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
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
        size={0.05}
        color="#4fd1c5"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

const defaultLithiumCobaltOxide: { atoms: AtomData[]; bonds: BondData[] } = {
  atoms: [
    { element: "Li", position: [0, 2, 0], color: "#9b59b6", radius: 0.4 },
    { element: "Li", position: [0, -2, 0], color: "#9b59b6", radius: 0.4 },
    { element: "Co", position: [0, 0, 0], color: "#3498db", radius: 0.5 },
    { element: "O", position: [1.5, 0.8, 0], color: "#e74c3c", radius: 0.35 },
    { element: "O", position: [-1.5, 0.8, 0], color: "#e74c3c", radius: 0.35 },
    { element: "O", position: [0, 0.8, 1.5], color: "#e74c3c", radius: 0.35 },
    { element: "O", position: [0, 0.8, -1.5], color: "#e74c3c", radius: 0.35 },
    { element: "O", position: [1.5, -0.8, 0], color: "#e74c3c", radius: 0.35 },
    { element: "O", position: [-1.5, -0.8, 0], color: "#e74c3c", radius: 0.35 },
  ],
  bonds: [
    { start: [0, 0, 0], end: [1.5, 0.8, 0] },
    { start: [0, 0, 0], end: [-1.5, 0.8, 0] },
    { start: [0, 0, 0], end: [0, 0.8, 1.5] },
    { start: [0, 0, 0], end: [0, 0.8, -1.5] },
    { start: [0, 0, 0], end: [1.5, -0.8, 0] },
    { start: [0, 0, 0], end: [-1.5, -0.8, 0] },
    { start: [0, 2, 0], end: [0, 0, 0] },
    { start: [0, -2, 0], end: [0, 0, 0] },
  ],
};

export function MoleculeScene({ 
  atoms = defaultLithiumCobaltOxide.atoms,
  bonds = defaultLithiumCobaltOxide.bonds,
  showParticles = true,
  rotating = true,
  className = ""
}: { 
  atoms?: AtomData[];
  bonds?: BondData[];
  showParticles?: boolean;
  rotating?: boolean;
  className?: string;
}) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#4fd1c5" />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#4fd1c5" />
        
        <MoleculeStructure atoms={atoms} bonds={bonds} rotating={rotating} />
        
        {showParticles && <ParticleField />}
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={15}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

export default MoleculeScene;
