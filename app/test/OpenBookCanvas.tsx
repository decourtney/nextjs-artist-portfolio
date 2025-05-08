"use client";

import {
  Backdrop,
  BakeShadows,
  OrbitControls,
  PerspectiveCamera,
  SoftShadows,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useRef, useState } from "react";
import OpenBookModel from "./OpenBookModel";
import { MathUtils } from "three";
import { ArtworkDocument, PopulatedArtworkDocument } from "@/models/Artwork";
import useScreenSize from "@/utils/useScreenSize";
import { Clock } from "three";

interface OpenBookCanvasProps {
  artworks: PopulatedArtworkDocument[]; // or use undefined instead of null if preferred
}

const OpenBookCanvas = ({ artworks }: OpenBookCanvasProps) => {
  return (
    <>
      <div className="w-full h-full">
        <Canvas className={`w-full h-full aspect-video }`} shadows>
          <ambientLight intensity={0.1} />
          <directionalLight
            castShadow
            position={[0, 2, -2]}
            intensity={0.5}
            shadow-mapSize={[1024, 1024]}
          />
          <AnimatedPointLight />
          <SoftShadows size={20} samples={10} focus={1} />

          <Suspense fallback={null}>
            <PerspectiveCamera
              position={[0, 1.85, 0.43]}
              rotation={[MathUtils.degToRad(-75), 0, 0]}
              makeDefault
              fov={35}
            />
            <OpenBookModel artworks={artworks} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};

export default OpenBookCanvas;

const AnimatedPointLight = () => {
  const lightRef = useRef<any>();
  const clockRef = useRef(new Clock());
  const [intensity, setIntensity] = useState(0);

  const targetIntensity = 0.3;
  const delay = 1; // 1 second delay
  const animationSpeed = 0.5;

  useFrame(() => {
    if (lightRef.current) {
      const elapsedTime = clockRef.current.getElapsedTime();

      if (elapsedTime >= delay) {
        const progressAfterDelay = elapsedTime - delay;
        const newIntensity = Math.min(
          progressAfterDelay * animationSpeed,
          targetIntensity
        );

        lightRef.current.intensity = newIntensity;
      }
    }
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={intensity}
      color={"#FCD916"}
      position={[-0.3, 1.1, -0.5]}
    />
  );
};
