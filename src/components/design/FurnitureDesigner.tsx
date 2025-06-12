import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import PBRMaterialManager from '../materials/PBRMaterialManager';

interface FurnitureDesignerProps {
  onSave?: (design: any) => void;
  scannedPointCloud?: THREE.Points;
}

interface FurnitureItem {
  id: string;
  type: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  material: THREE.Material;
}

const FurnitureDesigner: React.FC<FurnitureDesignerProps> = ({ onSave, scannedPointCloud }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null);
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);
  const [materials, setMaterials] = useState<string[]>(['wood', 'metal', 'glass', 'fabric']);
  const [currentMaterial, setCurrentMaterial] = useState<string>('wood');
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureItem | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<THREE.Material | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const controlsRef = useRef<any>(null);
  const dragControlsRef = useRef<DragControls | null>(null);
  const objectsRef = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    camera.position.z = 5;

    // Grid
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Add scanned point cloud if available
    if (scannedPointCloud) {
      scene.add(scannedPointCloud);
    }

    // Drag controls
    const dragControls = new DragControls([], camera, renderer.domElement);
    dragControls.addEventListener('dragstart', () => {
      controls.enabled = false;
    });
    dragControls.addEventListener('dragend', () => {
      controls.enabled = true;
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Window resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [scannedPointCloud]);

  const addFurniture = (type: string) => {
    const newItem: FurnitureItem = {
      id: Date.now().toString(),
      type,
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1),
      material: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    };
    setFurnitureItems([...furnitureItems, newItem]);
  };

  const updateFurniture = (id: string, updates: Partial<FurnitureItem>) => {
    setFurnitureItems(items =>
      items.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const deleteFurniture = (id: string) => {
    setFurnitureItems(items => items.filter(item => item.id !== id));
  };

  const handleMaterialSelect = (material: THREE.Material) => {
    setSelectedMaterial(material);
    if (selectedItem) {
      const updatedFurniture = {
        ...selectedItem,
        material: material
      };
      setSelectedItem(updatedFurniture);
      setFurnitureItems(prev =>
        prev.map(f => (f.id === selectedItem.id ? updatedFurniture : f))
      );
    }
  };

  return (
    <div className="flex h-full">
      <div className="w-64 p-4 bg-gray-100 border-r">
        <h2 className="text-xl font-bold mb-4">Мебель</h2>
        <div className="space-y-2">
          {materials.map(type => (
            <button
              key={type}
              onClick={() => addFurniture(type)}
              className="w-full p-2 bg-white rounded hover:bg-gray-200"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <PBRMaterialManager onMaterialSelect={handleMaterialSelect} />
        </div>
      </div>

      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 75 }}
          shadows
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Environment preset="studio" />
          
          <OrbitControls
            ref={controlsRef}
            enabled={!isDragging}
            makeDefault
          />

          <gridHelper args={[20, 20]} />

          {furnitureItems.map(furniture => (
            <FurnitureModel
              key={furniture.id}
              furniture={furniture}
              isSelected={selectedItem?.id === furniture.id}
              onSelect={() => setSelectedItem(furniture)}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
};

export default FurnitureDesigner; 