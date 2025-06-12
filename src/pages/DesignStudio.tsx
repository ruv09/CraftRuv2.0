import React, { useState } from 'react';
import * as THREE from 'three';
import FurnitureDesigner from '../components/design/FurnitureDesigner';
import CameraScanner from '../components/design/CameraScanner';
import { Header } from '../components/layout/Header';

const DesignStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'design' | 'scan'>('design');
  const [scannedPointCloud, setScannedPointCloud] = useState<THREE.Points | null>(null);

  const handleScanComplete = (pointCloud: THREE.Points) => {
    setScannedPointCloud(pointCloud);
    setActiveTab('design');
  };

  return (
    <>
      <Header />
      <div className="h-[calc(100vh-64px)] flex flex-col">
        <div className="bg-gray-800 text-white p-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('design')}
              className={`px-4 py-2 rounded ${
                activeTab === 'design' ? 'bg-blue-500' : 'bg-gray-600'
              } hover:bg-opacity-90 transition-colors`}
            >
              Furniture Designer
            </button>
            <button
              onClick={() => setActiveTab('scan')}
              className={`px-4 py-2 rounded ${
                activeTab === 'scan' ? 'bg-blue-500' : 'bg-gray-600'
              } hover:bg-opacity-90 transition-colors`}
            >
              3D Scanner
            </button>
          </div>
        </div>

        <main className="flex-1">
          {activeTab === 'design' ? (
            <FurnitureDesigner scannedPointCloud={scannedPointCloud || undefined} />
          ) : (
            <CameraScanner onScanComplete={handleScanComplete} />
          )}
        </main>
      </div>
    </>
  );
};

export default DesignStudio; 