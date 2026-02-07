"use client";

import * as React from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Center, Environment, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import GearQuestion from "./GearQuestion";
import LensQuestion from "./LensQuestion";
import CareerSphere from "./CareerSphere";

function CameraGLB() {
  const gltf = useGLTF("/models/camera.glb");
  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  );
}

const zoomPoints: Array<{ position: [number, number, number]; target: [number, number, number] }> = [
  { position: [0.127, 0.175, 4.132], target: [0.096, 0.132, 3.133] },
  { position: [-1.901, 1.305, 1.488], target: [-1.209, 0.830, 0.946] },
  { position: [-0.126, -0.285, 2.727], target: [-0.080, -0.181, 1.734] },
  { position: [-0.284, -0.386, -3.703], target: [-0.208, -0.283, -2.711] },
  { position: [-0.249, 0.695, 1.769], target: [-0.119, 0.332, 0.846] },
];

function CameraController({ currentZoom }: { currentZoom: number }) {
  const { camera } = useThree();
  const safeIndex = Math.min(currentZoom, zoomPoints.length - 1);

  const tmpPos = React.useRef(new THREE.Vector3()).current;
  const lookAtRef = React.useRef(new THREE.Vector3()).current;

  useFrame((_, delta) => {
    const targetPos = new THREE.Vector3(...zoomPoints[safeIndex].position);
    const targetLook = new THREE.Vector3(...zoomPoints[safeIndex].target);

    tmpPos.copy(camera.position).lerp(targetPos, Math.min(1, 6 * delta));
    camera.position.copy(tmpPos);

    lookAtRef.lerpVectors(lookAtRef, targetLook, Math.min(1, 6 * delta));
    camera.lookAt(lookAtRef);
  });

  return null;
}

export default function Hero3D() {
  const [currentZoom, setCurrentZoom] = React.useState(0);
  const [isStarted, setIsStarted] = React.useState(false);

  const handleClick = () => {
    if (!isStarted) return;
    if (currentZoom === 1) return; // block during GearQuestion
    if (currentZoom < zoomPoints.length - 1) {
      setCurrentZoom((prev) => prev + 1);
    }
  };

  const handleStartSimulation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarted(true);
    setCurrentZoom(0);
  };

  return (
    <div
      className="relative h-[100svh] w-full overflow-hidden bg-[#ffd60a]"
      onClick={handleClick}
    >
      {/* 3D CANVAS */}
      <Canvas
        className={`transition-all duration-[2000ms] ${
          !isStarted ? "blur-[8px] brightness-[0.7]" : "blur-0"
        }`}
        camera={{ position: zoomPoints[0].position, fov: 35 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#ffd60a"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 4]} intensity={2.5} />
        <Environment preset="studio" />

        <React.Suspense
          fallback={<Html center className="text-black font-bold">Initializing...</Html>}
        >
          <CameraGLB />
          <CameraController currentZoom={currentZoom} />
        </React.Suspense>
      </Canvas>

      {/* LANDING OVERLAY */}
      {!isStarted && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-auto">
          <div className="text-[10px] tracking-[0.5em] uppercase text-white/60 mb-4 font-bold drop-shadow-sm">
            Future Career Exploration
          </div>
          <h1 className="text-7xl font-black tracking-tighter text-white sm:text-9xl drop-shadow-md">
            PATHFINDER
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/80 sm:text-xl drop-shadow-sm">
            Snap into focus. Choose your lens and preview your future career path today.
          </p>
          <button
            onClick={handleStartSimulation}
            className="mt-10 group relative flex items-center gap-3 overflow-hidden rounded-full bg-black px-10 py-5 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            <span className="relative z-10 tracking-widest uppercase">Start</span>
            <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse" />
          </button>
        </div>
      )}

      {/* QUESTIONS / CAREER SPHERE */}
      {isStarted && currentZoom === 1 && (
        <div className="absolute inset-0 z-30 pointer-events-auto flex items-center justify-center">
          <GearQuestion onSelect={() => setCurrentZoom((prev) => prev + 1)} />
        </div>
      )}
      {isStarted && currentZoom === 2 && (
        <div className="absolute inset-0 z-30 pointer-events-auto flex items-center justify-center">
          <LensQuestion onSelect={() => setCurrentZoom((prev) => prev + 1)} />
        </div>
      )}
      {isStarted && currentZoom === 3 && (
        <div className="absolute inset-0 z-40 pointer-events-auto flex items-center justify-center">
          <CareerSphere 
            onSelect={() => setCurrentZoom((prev) => prev + 1)}
            onClose={() => setCurrentZoom((prev) => prev - 1)}
          />
        </div>
      )}

      {/* NAV INSTRUCTIONS */}
      {isStarted && currentZoom < zoomPoints.length - 1 && currentZoom !== 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-black/40 text-xs font-bold tracking-widest uppercase animate-bounce z-30 pointer-events-none">
          Click anywhere to advance
        </div>
      )}

      {/* VIGNETTE */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.1)_100%)] z-5 pointer-events-none" />
    </div>
  );
}

useGLTF.preload("/models/camera.glb");
