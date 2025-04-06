"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, RootState } from "@react-three/fiber";
import { SoftShadows, Plane, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { easing } from "maath";
import { BookModel } from "./BookModel";

function Backdrop() {
  return (
    <>
      <SoftShadows size={25} samples={20} focus={0.5} />
      <Plane
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        args={[5, 5]}
      >
        <shadowMaterial transparent opacity={0.3} />
      </Plane>
    </>
  );
}

// Main component
export default function Book3D({ title }: { title: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
        {/* Ensure proper formatting of dynamic content */}
        {`Loading 3D Book: ${title}`}
      </div>
    );
  }

  return (
    <div className="w-full h-[500px]">
      <Canvas
        camera={{
          position: [0.5, 1.1, 0.5],
          fov: 50,
        }}
        shadows
      >
        <ambientLight intensity={0.4} />
        <directionalLight
          castShadow
          position={[-1, 3, 3]}
          intensity={1}
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
        >
          <orthographicCamera
            attach="shadow-camera"
            args={[-5, 5, -5, 5, 0.1, 50]}
          />
        </directionalLight>
        {/* <pointLight position={[2, 3, -2]} intensity={0.1} /> */}
        <Backdrop />
        <BookModel
          rotation={[0, Math.PI / 6, 0]}
          position={[0, 0, 0]}
          title={`
            Midnight at 
            Kyrie Eleison Castle`}
        />
        {/* <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        /> */}
      </Canvas>
    </div>
  );
}
