"use client";

import * as React from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Center, Environment, Html, useGLTF } from "@react-three/drei";
import { useSpring } from "@react-spring/three";
import GearQuestion from "./GearQuestion";

// Camera model
function CameraGLB() {
  const gltf = useGLTF("/models/camera.glb");
  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  );
}

// Preset camera positions and targets from your logs
const zoomPoints = [
  {
    position: [0.12702815436289513, 0.17459237668994612, 4.131778800656173],
    target: [0.09632586549723172, 0.13239397107063872, 3.133141396979745],
  },
  {
    position: [-0.12638870605161748, -0.2847293783376945, 2.727111638454499],
    target: [-0.08034288825279098, -0.18099703162345396, 1.733572820436605],
  },
  {
    position: [-1.9014376064822631, 1.3052005485463005, 1.4883445062314746],
    target: [-1.2087075966650729, 0.8296910783825132, 0.9461121968997364],
  },
  {
    position: [-0.28391502810629843, -0.38648609218204505, -3.7030951412983266],
    target: [-0.20788031075225155, -0.2829820227555771, -2.7113766180423315],
  },
  {
    position: [-0.12638870605161748, -0.2847293783376945, 2.727111638454499],
    target: [-0.08034288825279098, -0.18099703162345396, 1.733572820436605],
  },
  {
    position: [-0.24867532781052656, 0.6947138515320341, 1.769114380577578],
    target: [-0.11894264919447886, 0.3322850990520427, 0.8461762290880525],
  },
];

// CameraController: smoothly moves camera along zoomPoints
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

  const handleClick = () => {
    if (currentZoom < zoomPoints.length - 1) {
      setCurrentZoom((prev) => prev + 1);
    }
  };

  return (
    <div className="relative h-[100svh] w-full" onClick={handleClick}>
      <Canvas camera={{ position: zoomPoints[0].position, fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 4]} intensity={2.2} />
        <Environment preset="studio" />

        <React.Suspense fallback={<Html center>Loading camera…</Html>}>
          <CameraGLB />
          <CameraController currentZoom={currentZoom} />
        </React.Suspense>
      </Canvas>

      {/* Overlay the GearQuestion when camera is at hotspot 1 */}
      {currentZoom === 1 && (
        <GearQuestion onComplete={() => setCurrentZoom((prev) => prev + 1)} />
      )}

      {/* Instructions */}
      {currentZoom < 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-xs">
          Click anywhere to advance camera to the next point
        </div>
      )}
    </div>
  );
}

useGLTF.preload("/models/camera.glb");