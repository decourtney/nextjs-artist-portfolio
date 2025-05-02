"use client";

import {
  Backdrop,
  OrbitControls,
  PerspectiveCamera,
  SoftShadows,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import OpenBookModel from "./OpenBookModel";
import { MathUtils } from "three";

const OpenBookCanvas = () => {
  return (
    <Canvas className="bg-green-300 w-full aspect-video" shadows>
      <PerspectiveCamera
        position={[0, 1.7, 0.4]}
        rotation={[MathUtils.degToRad(-75), 0, 0]}
        makeDefault
        fov={35}
      />
      <ambientLight intensity={0.3} />
      <directionalLight
        castShadow
        position={[0, 1, 0]}
        intensity={0.6}
        shadow-mapSize={[2048, 2048]}
      />
      <SoftShadows size={10} samples={10} focus={0} />
      {/* <OrbitControls /> */}
      <OpenBookModel />

      <Backdrop
        position={[0, 0, -1]}
        scale={2} // Scales the backdrop, 1 by default
        scale-x={4} // Scales the backdrop on the x-axis, 1 by default
        receiveShadow={true}
        floor={0.5} // Stretches the floor segment, 0.25 by default
        segments={20} // Mesh-resolution, 20 by default
      >
        <meshStandardMaterial color="#ffffff" />
      </Backdrop>
    </Canvas>
  );
};

export default OpenBookCanvas;
