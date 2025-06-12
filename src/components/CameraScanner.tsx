import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MediaPipeCamera } from '@mediapipe/camera_utils';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import * as poseDetection from '@tensorflow-models/pose-detection';

interface CameraScannerProps {
  onScanComplete?: (pointCloud: THREE.Points) => void;
}

const CameraScanner: React.FC<CameraScannerProps> = ({ onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize MediaPipe camera
    const camera = new MediaPipeCamera(video, {
      onFrame: async () => {
        if (ctx && video) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (isScanning) {
            // Process frame for 3D scanning
            processFrame(ctx, canvas);
          }
        }
      },
      width: 1280,
      height: 720,
    });

    // Initialize pose detection
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      {
        modelType: 'thunder',
      }
    );

    // Start camera
    camera.start();

    return () => {
      camera.stop();
    };
  }, [isScanning]);

  const processFrame = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Get image data for processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Process depth information
    // This is a simplified version - in a real implementation, you'd use
    // more sophisticated depth estimation algorithms
    const depthData = estimateDepth(imageData);
    
    // Convert to point cloud
    const pointCloud = createPointCloud(depthData);
    
    // Update progress
    setScanProgress(prev => Math.min(prev + 1, 100));
    
    if (scanProgress >= 100) {
      setIsScanning(false);
      onScanComplete?.(pointCloud);
    }
  };

  const estimateDepth = (imageData: ImageData): Float32Array => {
    // Simplified depth estimation
    // In a real implementation, you'd use more sophisticated algorithms
    const depthData = new Float32Array(imageData.data.length / 4);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      depthData[i / 4] = (r + g + b) / 765; // Normalized depth
    }
    return depthData;
  };

  const createPointCloud = (depthData: Float32Array): THREE.Points => {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(depthData.length * 3);
    
    for (let i = 0; i < depthData.length; i++) {
      const x = (i % 1280) / 1280 - 0.5;
      const y = 0.5 - (i / 1280) / 720;
      const z = depthData[i];
      
      vertices[i * 3] = x;
      vertices[i * 3 + 1] = y;
      vertices[i * 3 + 2] = z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    const material = new THREE.PointsMaterial({ size: 0.01, color: 0xffffff });
    return new THREE.Points(geometry, material);
  };

  const startScanning = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  const stopScanning = () => {
    setIsScanning(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        width={1280}
        height={720}
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={isScanning ? stopScanning : startScanning}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </button>
        {isScanning && (
          <div className="px-4 py-2 bg-white text-black rounded-lg">
            Progress: {scanProgress}%
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraScanner; 