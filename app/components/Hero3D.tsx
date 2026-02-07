"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Center,
  Environment,
  Html,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";

function CameraGLB() {
  const gltf = useGLTF("/models/camera.glb");

  return (
    <Center>
      <primitive object={gltf.scene} />
    </Center>
  );
}

export default function Hero3D() {
  return (
    <section className="relative h-[100svh] w-full overflow-hidden bg-black">
      <Canvas camera={{ position: [0, 0.2, 3], fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 4]} intensity={2.2} />
        <Environment preset="studio" />

        <React.Suspense
          fallback={
            <Html center className="text-white/70">
              Loading camera model…
            </Html>
          }
        >
          <Bounds fit clip observe margin={1.2}>
            <CameraGLB />
          </Bounds>

          {/* Debug controls, remove later */}
          <OrbitControls enablePan={false} />
        </React.Suspense>
      </Canvas>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[46%] w-[92%] -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-[11px] tracking-[0.35em] text-white/55">
            HACKTION CAREER SIM
          </div>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white sm:text-7xl">
            Power On
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
            Scroll to set the shot, choose the lens, then hit record.
          </p>
          <div className="mt-10 text-xs tracking-widest text-white/40">
            SCROLL TO EXPLORE
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_35%,rgba(0,0,0,0.85)_100%)]" />
      </div>
    </section>
  );
}

useGLTF.preload("/models/camera.glb");
