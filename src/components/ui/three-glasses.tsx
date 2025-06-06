import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import * as THREE from "three";

interface GlassesGeometryProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  animated?: boolean;
}

const GlassesGeometry = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animated = true,
}: GlassesGeometryProps) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current && animated) {
      meshRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
  });

  // Create glasses geometry
  const glassesGeometry = useMemo(() => {
    const group = new THREE.Group();

    // Left lens frame
    const leftFrameGeometry = new THREE.RingGeometry(0.3, 0.35, 32);
    const leftFrameMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2,
    });
    const leftFrame = new THREE.Mesh(leftFrameGeometry, leftFrameMaterial);
    leftFrame.position.set(-0.4, 0, 0);

    // Right lens frame
    const rightFrameGeometry = new THREE.RingGeometry(0.3, 0.35, 32);
    const rightFrameMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2,
    });
    const rightFrame = new THREE.Mesh(rightFrameGeometry, rightFrameMaterial);
    rightFrame.position.set(0.4, 0, 0);

    // Bridge
    const bridgeGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.2);
    const bridgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2,
    });
    const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
    bridge.rotation.z = Math.PI / 2;
    bridge.position.set(0, 0, 0);

    // Left temple
    const leftTempleGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.8);
    const leftTempleMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2,
    });
    const leftTemple = new THREE.Mesh(leftTempleGeometry, leftTempleMaterial);
    leftTemple.rotation.z = Math.PI / 2;
    leftTemple.position.set(-0.75, 0, 0);

    // Right temple
    const rightTempleGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.8);
    const rightTempleMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      metalness: 0.8,
      roughness: 0.2,
    });
    const rightTemple = new THREE.Mesh(
      rightTempleGeometry,
      rightTempleMaterial,
    );
    rightTemple.rotation.z = Math.PI / 2;
    rightTemple.position.set(0.75, 0, 0);

    // Lenses (slightly transparent)
    const lensGeometry = new THREE.CircleGeometry(0.28, 32);
    const lensMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });

    const leftLens = new THREE.Mesh(lensGeometry, lensMaterial);
    leftLens.position.set(-0.4, 0, 0.01);

    const rightLens = new THREE.Mesh(lensGeometry, lensMaterial);
    rightLens.position.set(0.4, 0, 0.01);

    group.add(
      leftFrame,
      rightFrame,
      bridge,
      leftTemple,
      rightTemple,
      leftLens,
      rightLens,
    );
    return group;
  }, []);

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={glassesGeometry} />
    </group>
  );
};

interface ThreeGlassesProps {
  className?: string;
  animated?: boolean;
  glassesProps?: Partial<GlassesGeometryProps>;
}

export const ThreeGlasses = ({
  className = "",
  animated = true,
  glassesProps = {},
}: ThreeGlassesProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full h-full ${className}`}
    >
      <Canvas
        camera={{
          position: [0, 0, 2],
          fov: 75,
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <GlassesGeometry animated={animated} {...glassesProps} />
      </Canvas>
    </motion.div>
  );
};

// Simpler 2D glasses component for performance
export const SimpleGlasses = ({
  className = "",
  size = 200,
}: {
  className?: string;
  size?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size * 0.4 }}
    >
      <svg
        viewBox="0 0 200 80"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
      >
        {/* Left lens */}
        <circle
          cx="50"
          cy="40"
          r="30"
          fill="none"
          stroke="#333"
          strokeWidth="3"
          className="animate-pulse"
        />

        {/* Right lens */}
        <circle
          cx="150"
          cy="40"
          r="30"
          fill="none"
          stroke="#333"
          strokeWidth="3"
          className="animate-pulse"
        />

        {/* Bridge */}
        <line x1="80" y1="40" x2="120" y2="40" stroke="#333" strokeWidth="3" />

        {/* Left temple */}
        <line x1="20" y1="40" x2="5" y2="35" stroke="#333" strokeWidth="2" />

        {/* Right temple */}
        <line x1="180" y1="40" x2="195" y2="35" stroke="#333" strokeWidth="2" />
      </svg>
    </motion.div>
  );
};
