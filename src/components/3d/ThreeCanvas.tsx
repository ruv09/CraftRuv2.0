import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeCanvasProps {
  showGrid: boolean;
  zoom: number;
  selectedObject: string | null;
  onObjectSelect: (objectId: string | null) => void;
}

// Простой куб для демонстрации
const DemoFurniture: React.FC<{ position: [number, number, number]; onClick: () => void }> = ({ position, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={meshRef} position={position} onClick={onClick}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
};

// Компонент загрузки
const LoadingFallback: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
    <div className="text-gray-600 dark:text-gray-300">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
      <div>Загрузка 3D сцены...</div>
    </div>
  </div>
);

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  showGrid,
  zoom,
  selectedObject,
  onObjectSelect,
}) => {
  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          shadows
          camera={{ position: [5, 5, 5], fov: 75 }}
          style={{ background: 'linear-gradient(to bottom, #e0f2fe, #f5f5f5)' }}
        >
          {/* Освещение */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />

          {/* Камера */}
          <PerspectiveCamera makeDefault position={[5, 5, 5]} />

          {/* Управление камерой */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2}
          />

          {/* Сетка */}
          {showGrid && (
            <Grid
              position={[0, 0, 0]}
              args={[20, 20]}
              cellSize={1}
              cellThickness={0.5}
              cellColor="#999999"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#666666"
              fadeDistance={30}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid={true}
            />
          )}

          {/* Пол */}
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial 
              color="#f0f0f0" 
              transparent 
              opacity={0.8} 
            />
          </mesh>

          {/* Демо мебель */}
          <DemoFurniture
            position={[0, 0.5, 0]}
            onClick={() => onObjectSelect('demo-cube-1')}
          />
          <DemoFurniture
            position={[2, 0.5, 2]}
            onClick={() => onObjectSelect('demo-cube-2')}
          />

          {/* Окружение */}
          <Environment preset="studio" />
        </Canvas>
      </Suspense>

      {/* Информационная панель */}
      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-sm">
        <div className="text-gray-600 dark:text-gray-300">
          <div>Управление:</div>
          <div>• ЛКМ - поворот</div>
          <div>• ПКМ - панорама</div>
          <div>• Колесо - масштаб</div>
        </div>
      </div>
    </div>
  );
};
