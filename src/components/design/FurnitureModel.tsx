import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

interface FurnitureModelProps {
  furniture: {
    id: string;
    type: string;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
    material: THREE.Material;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const FurnitureModel: React.FC<FurnitureModelProps> = ({
  furniture,
  isSelected,
  onSelect
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { nodes, materials } = useGLTF(`/models/${furniture.type}.glb`);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material = furniture.material;
    }
  }, [furniture.material]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(furniture.position);
      meshRef.current.rotation.copy(furniture.rotation);
      meshRef.current.scale.copy(furniture.scale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onSelect}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={isSelected ? '#ff0000' : '#ffffff'}
        metalness={0.5}
        roughness={0.5}
      />
    </mesh>
  );
};

export default FurnitureModel; 