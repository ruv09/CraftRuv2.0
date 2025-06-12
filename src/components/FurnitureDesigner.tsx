import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DragControls } from 'three/examples/jsm/controls/DragControls';

interface FurnitureDesignerProps {
  onSave?: (design: any) => void;
}

interface FurnitureItem {
  id: string;
  type: string;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
  material: string;
}

const FurnitureDesigner: React.FC<FurnitureDesignerProps> = ({ onSave }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<FurnitureItem | null>(null);
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);
  const [materials, setMaterials] = useState<string[]>(['wood', 'metal', 'glass', 'fabric']);
  const [currentMaterial, setCurrentMaterial] = useState<string>('wood');

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
  }, []);

  const addFurniture = (type: string) => {
    const newItem: FurnitureItem = {
      id: Date.now().toString(),
      type,
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: new THREE.Vector3(1, 1, 1),
      material: currentMaterial,
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

  return (
    <div className="flex h-screen">
      <div ref={containerRef} className="flex-1" />
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Furniture Designer</h2>
        
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Add Furniture</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addFurniture('chair')}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Chair
            </button>
            <button
              onClick={() => addFurniture('table')}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Table
            </button>
            <button
              onClick={() => addFurniture('sofa')}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Sofa
            </button>
            <button
              onClick={() => addFurniture('cabinet')}
              className="p-2 bg-blue-500 text-white rounded"
            >
              Cabinet
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Materials</h3>
          <select
            value={currentMaterial}
            onChange={(e) => setCurrentMaterial(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {materials.map(material => (
              <option key={material} value={material}>
                {material.charAt(0).toUpperCase() + material.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {selectedItem && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selected Item</h3>
            <div className="space-y-2">
              <button
                onClick={() => deleteFurniture(selectedItem.id)}
                className="w-full p-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => onSave?.(furnitureItems)}
          className="w-full p-2 bg-green-500 text-white rounded"
        >
          Save Design
        </button>
      </div>
    </div>
  );
};

export default FurnitureDesigner; 