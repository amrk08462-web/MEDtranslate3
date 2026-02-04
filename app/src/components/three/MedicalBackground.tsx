import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Floating particles component
function FloatingParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const particleCount = 150;
  
  const [positions, velocities] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    
    return [positions, velocities];
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const positionArray = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particleCount; i++) {
      positionArray[i * 3] += velocities[i * 3];
      positionArray[i * 3 + 1] += velocities[i * 3 + 1];
      positionArray[i * 3 + 2] += velocities[i * 3 + 2];
      
      // Boundary check
      if (Math.abs(positionArray[i * 3]) > 10) velocities[i * 3] *= -1;
      if (Math.abs(positionArray[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
      if (Math.abs(positionArray[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// DNA Helix component
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const strandCount = 40;
  
  const [strand1Positions, strand2Positions] = useMemo(() => {
    const s1: THREE.Vector3[] = [];
    const s2: THREE.Vector3[] = [];
    
    for (let i = 0; i < strandCount; i++) {
      const t = i / strandCount;
      const y = (t - 0.5) * 8;
      const angle = t * Math.PI * 4;
      const radius = 1.5;
      
      s1.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ));
      
      s2.push(new THREE.Vector3(
        Math.cos(angle + Math.PI) * radius,
        y,
        Math.sin(angle + Math.PI) * radius
      ));
    }
    
    return [s1, s2];
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <group ref={groupRef} position={[6, 0, -5]}>
      {/* Strand 1 */}
      {strand1Positions.map((pos, i) => (
        <mesh key={`s1-${i}`} position={pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
        </mesh>
      ))}
      
      {/* Strand 2 */}
      {strand2Positions.map((pos, i) => (
        <mesh key={`s2-${i}`} position={pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#0891b2" transparent opacity={0.8} />
        </mesh>
      ))}
      
      {/* Connections */}
      {strand1Positions.map((pos1, i) => {
        const pos2 = strand2Positions[i];
        const midPoint = pos1.clone().add(pos2).multiplyScalar(0.5);
        const distance = pos1.distanceTo(pos2);
        
        return (
          <mesh key={`conn-${i}`} position={midPoint}>
            <cylinderGeometry args={[0.02, 0.02, distance, 4]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
}

// Floating medical cross
function MedicalCross() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <group ref={meshRef} position={[-6, 2, -3]}>
      {/* Vertical bar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
      </mesh>
      {/* Horizontal bar */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.3, 0.3]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.7} />
      </mesh>
      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.02, 8, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Neural network nodes
function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null);
  const nodeCount = 20;
  
  const nodes = useMemo(() => {
    const n: { position: THREE.Vector3; connections: number[] }[] = [];
    
    for (let i = 0; i < nodeCount; i++) {
      n.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4
        ),
        connections: []
      });
    }
    
    // Create random connections
    n.forEach((node, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = Math.floor(Math.random() * nodeCount);
        if (targetIndex !== i && !node.connections.includes(targetIndex)) {
          node.connections.push(targetIndex);
        }
      }
    });
    
    return n;
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });
  
  return (
    <group ref={groupRef} position={[-5, -2, -6]}>
      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh key={`node-${i}`} position={node.position}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.9} />
        </mesh>
      ))}
      
      {/* Connections */}
      {nodes.map((node, i) => 
        node.connections.map((targetIndex) => {
          const target = nodes[targetIndex];
          const midPoint = node.position.clone().add(target.position).multiplyScalar(0.5);
          const distance = node.position.distanceTo(target.position);
          const direction = target.position.clone().sub(node.position).normalize();
          const quaternion = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 1, 0),
            direction
          );
          
          return (
            <mesh 
              key={`line-${i}-${targetIndex}`} 
              position={midPoint}
              quaternion={quaternion}
            >
              <cylinderGeometry args={[0.01, 0.01, distance, 4]} />
              <meshBasicMaterial color="#0891b2" transparent opacity={0.4} />
            </mesh>
          );
        })
      )}
    </group>
  );
}

// Main scene component
function Scene() {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 10);
  }, [camera]);
  
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#0891b2" />
      
      <FloatingParticles />
      <DNAHelix />
      <MedicalCross />
      <NeuralNetwork />
    </>
  );
}

// Main export component
export function MedicalBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance'
        }}
      >
        <Scene />
      </Canvas>
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
