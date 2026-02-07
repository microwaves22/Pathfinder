"use client";

import * as React from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Center, Environment, Html, useGLTF } from "@react-three/drei";
import { useSpring } from "@react-spring/three";
import GearQuestion from "./GearQuestion"; // Gear interaction component

// Camera model
function CameraGLB() {
  const gltf = useGLTF("/models/camera.glb");
  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  );
}

// Preset camera positions and lookAt targets
const zoomPoints = [
  {
    position: [0.12702815436289513, 0.17459237668994612, 4.131778800656173],
    target: [0.09632586549723172, 0.13239397107063872, 3.133141396979745],
  },
  {
    position: [-1.9014376064822631, 1.3052005485463005, 1.4883445062314746],
    target: [-1.2087075966650729, 0.8296910783825132, 0.9461121968997364],
  },
  {
    position: [-0.12638870605161748, -0.2847293783376945, 2.727111638454499],
    target: [-0.08034288825279098, -0.18099703162345396, 1.733572820436605],
  },
  {
    position: [-0.28391502810629843, -0.38648609218204505, -3.7030951412983266],
    target: [-0.20788031075225155, -0.2829820227555771, -2.7113766180423315],
  },
  {
    position: [-0.24867532781052656, 0.6947138515320341, 1.769114380577578],
    target: [-0.11894264919447886, 0.3322850990520427, 0.8461762290880525],
  },
];

// Smooth camera controller
function CameraController({ currentZoom }: { currentZoom: number }) {
  const { camera } = useThree();
  const safeIndex = Math.min(currentZoom, zoomPoints.length - 1);

  const spring = useSpring({
    camPos: zoomPoints[safeIndex].position,
    camTarget: zoomPoints[safeIndex].target,
    config: { mass: 1, tension: 120, friction: 30 },
  });

  useFrame(() => {
    const { camPos, camTarget } = spring;
    if (camPos && camTarget) {
      const [x, y, z] = camPos.get() as [number, number, number];
      const [tx, ty, tz] = camTarget.get() as [number, number, number];
      camera.position.set(x, y, z);
      camera.lookAt(tx, ty, tz);
    }
  });

  return null;
}

export default function Hero3D() {
  const [currentZoom, setCurrentZoom] = React.useState(0);
  const [isStarted, setIsStarted] = React.useState(false);

  // Advance to next hotspot on click - only if simulation has started
  const handleClick = () => {
    if (isStarted && currentZoom < zoomPoints.length - 1) {
      setCurrentZoom((prev) => prev + 1);
    }
  };

  // Logic to trigger the simulation start
  const handleStartSimulation = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents handleClick from firing immediately
    setIsStarted(true);
    setCurrentZoom(0); // Ensure we stay/start at the first zoom point
  };

  return (
    <div 
      className="relative h-[100svh] w-full overflow-hidden bg-[#ffd60a]" 
      onClick={handleClick}
    >
      {/* 3D CANVAS */}
      <Canvas 
        className={`transition-all duration-[2000ms] ${!isStarted ? 'blur-[8px] brightness-[0.7]' : 'blur-0'}`}
        camera={{ position: zoomPoints[0].position, fov: 35 }} 
        dpr={[1, 2]}
      >
        <color attach="background" args={['#ffd60a']} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 4]} intensity={2.5} />
        <Environment preset="studio" />

        <React.Suspense fallback={<Html center className="text-black font-bold">Initializing...</Html>}>
          <CameraGLB />
          {/* Movement only triggers via spring once started */}
          <CameraController currentZoom={currentZoom} />
        </React.Suspense>
      </Canvas>

      {/* LANDING PAGE OVERLAY */}
     {/* LANDING PAGE OVERLAY */}
      <div className={`pointer-events-none absolute inset-0 transition-all duration-1000 z-10 ${isStarted ? 'opacity-0 scale-[1.5]' : 'opacity-100 scale-100'}`}>
        <div className="absolute left-1/2 top-[42%] w-full -translate-x-1/2 -translate-y-1/2 text-center px-4">
          
          {/* Upper Small Text - Changed to white/60 */}
          <div className="text-[10px] tracking-[0.5em] uppercase text-white/60 mb-4 font-bold drop-shadow-sm">
            Future Career Exploration
          </div>

          {/* Main Title - Changed to text-white with a shadow */}
          <h1 className="text-7xl font-black tracking-tighter text-white sm:text-9xl drop-shadow-md">
            PATHFINDER
          </h1>

          {/* Lower Description - Changed to text-white/80 */}
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/80 sm:text-xl drop-shadow-sm">
            Snap into focus. Choose your lens and preview your future career path today.
          </p>

        </div>
      </div>

      {/* START BUTTON */}
      {!isStarted && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20">
          <button 
            onClick={handleStartSimulation}
            className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-black px-10 py-5 font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            <span className="relative z-10 tracking-widest uppercase">Start</span>
            <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse" />
          </button>
        </div>
      )}

      {/* Simulation UI: Overlay GearQuestion at hotspot 1 */}
      {isStarted && currentZoom === 1 && (
        <GearQuestion onComplete={() => setCurrentZoom((prev) => prev + 1)} />
      )}

      {/* Navigation Instructions */}
      {isStarted && currentZoom < zoomPoints.length - 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-black/40 text-xs font-bold tracking-widest uppercase animate-bounce">
          Click anywhere to advance
        </div>
      )}

      {/* Cinematic Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.1)_100%)]" />
    </div>
  );
}

useGLTF.preload("/models/camera.glb");