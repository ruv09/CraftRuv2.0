import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

interface PBRMaterial {
  id: string;
  name: string;
  type: 'wood' | 'metal' | 'fabric' | 'glass' | 'stone' | 'leather';
  maps: {
    albedo: string;
    normal: string;
    roughness: string;
    metallic: string;
    ao: string;
    displacement?: string;
  };
  parameters: {
    roughness: number;
    metalness: number;
    clearcoat: number;
    clearcoatRoughness: number;
    transmission: number;
    ior: number;
    sheen: number;
    sheenRoughness: number;
    sheenColor: string;
  };
}

const defaultMaterials: PBRMaterial[] = [
  {
    id: 'oak_wood',
    name: 'Дуб',
    type: 'wood',
    maps: {
      albedo: '/textures/wood/oak/albedo.jpg',
      normal: '/textures/wood/oak/normal.jpg',
      roughness: '/textures/wood/oak/roughness.jpg',
      metallic: '/textures/wood/oak/metallic.jpg',
      ao: '/textures/wood/oak/ao.jpg',
      displacement: '/textures/wood/oak/displacement.jpg'
    },
    parameters: {
      roughness: 0.7,
      metalness: 0.0,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      transmission: 0.0,
      ior: 1.5,
      sheen: 0.0,
      sheenRoughness: 0.0,
      sheenColor: '#ffffff'
    }
  },
  {
    id: 'brushed_metal',
    name: 'Металл (матовый)',
    type: 'metal',
    maps: {
      albedo: '/textures/metal/brushed/albedo.jpg',
      normal: '/textures/metal/brushed/normal.jpg',
      roughness: '/textures/metal/brushed/roughness.jpg',
      metallic: '/textures/metal/brushed/metallic.jpg',
      ao: '/textures/metal/brushed/ao.jpg'
    },
    parameters: {
      roughness: 0.3,
      metalness: 1.0,
      clearcoat: 0.0,
      clearcoatRoughness: 0.0,
      transmission: 0.0,
      ior: 1.0,
      sheen: 0.0,
      sheenRoughness: 0.0,
      sheenColor: '#ffffff'
    }
  },
  {
    id: 'leather',
    name: 'Кожа',
    type: 'leather',
    maps: {
      albedo: '/textures/leather/classic/albedo.jpg',
      normal: '/textures/leather/classic/normal.jpg',
      roughness: '/textures/leather/classic/roughness.jpg',
      metallic: '/textures/leather/classic/metallic.jpg',
      ao: '/textures/leather/classic/ao.jpg'
    },
    parameters: {
      roughness: 0.6,
      metalness: 0.0,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3,
      transmission: 0.0,
      ior: 1.5,
      sheen: 0.3,
      sheenRoughness: 0.2,
      sheenColor: '#ffffff'
    }
  }
];

interface PBRMaterialManagerProps {
  onMaterialSelect?: (material: THREE.Material) => void;
}

const PBRMaterialManager: React.FC<PBRMaterialManagerProps> = ({ onMaterialSelect }) => {
  const [materials, setMaterials] = useState<PBRMaterial[]>(defaultMaterials);
  const [selectedMaterial, setSelectedMaterial] = useState<PBRMaterial | null>(null);
  const [customParameters, setCustomParameters] = useState<Record<string, number>>({});

  const createPBRMaterial = (materialData: PBRMaterial): THREE.MeshStandardMaterial => {
    const textureLoader = new TextureLoader();
    
    const maps = {
      map: textureLoader.load(materialData.maps.albedo),
      normalMap: textureLoader.load(materialData.maps.normal),
      roughnessMap: textureLoader.load(materialData.maps.roughness),
      metalnessMap: textureLoader.load(materialData.maps.metallic),
      aoMap: textureLoader.load(materialData.maps.ao),
    };

    if (materialData.maps.displacement) {
      maps.displacementMap = textureLoader.load(materialData.maps.displacement);
    }

    // Настройка повторения текстур
    Object.values(maps).forEach(texture => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
      }
    });

    const material = new THREE.MeshStandardMaterial({
      ...maps,
      ...materialData.parameters,
      ...customParameters,
      envMapIntensity: 1.0,
    });

    return material;
  };

  const handleMaterialSelect = (material: PBRMaterial) => {
    setSelectedMaterial(material);
    const pbrMaterial = createPBRMaterial(material);
    onMaterialSelect?.(pbrMaterial);
  };

  const handleParameterChange = (parameter: string, value: number) => {
    setCustomParameters(prev => ({
      ...prev,
      [parameter]: value
    }));

    if (selectedMaterial) {
      const updatedMaterial = createPBRMaterial(selectedMaterial);
      onMaterialSelect?.(updatedMaterial);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Материалы</h2>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {materials.map(material => (
          <button
            key={material.id}
            onClick={() => handleMaterialSelect(material)}
            className={`p-2 rounded ${
              selectedMaterial?.id === material.id
                ? 'bg-blue-500 text-white'
                : 'bg-white hover:bg-gray-200'
            }`}
          >
            {material.name}
          </button>
        ))}
      </div>

      {selectedMaterial && (
        <div className="space-y-4">
          <h3 className="font-semibold">Настройки материала</h3>
          
          <div className="space-y-2">
            <label className="block">
              Шероховатость
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={customParameters.roughness ?? selectedMaterial.parameters.roughness}
                onChange={(e) => handleParameterChange('roughness', parseFloat(e.target.value))}
                className="w-full"
              />
            </label>

            <label className="block">
              Металличность
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={customParameters.metalness ?? selectedMaterial.parameters.metalness}
                onChange={(e) => handleParameterChange('metalness', parseFloat(e.target.value))}
                className="w-full"
              />
            </label>

            <label className="block">
              Прозрачность
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={customParameters.transmission ?? selectedMaterial.parameters.transmission}
                onChange={(e) => handleParameterChange('transmission', parseFloat(e.target.value))}
                className="w-full"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PBRMaterialManager; 