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
import { ArtworkDocument } from "@/models/Artwork";
import useScreenSize from "@/utils/useScreenSize";
import { Clock } from 'three';

const AnimatedCamera = ({
  artworks,
  currentIndex,
}: {
  artworks: ArtworkDocument[];
  currentIndex: number;
}) => {
  const cameraRef = useRef<any>();
  const [animationProgress, setAnimationProgress] = useState(0);
  const currentArtwork = artworks[currentIndex];

  useFrame((state, delta) => {
    if (animationProgress < 1) {
      // Start lower and further back
      const startPos = [0, 1.3, 1];
      const startRot = [MathUtils.degToRad(-20), 0, 0];
      // End at original position
      const endPos = [0, 1.85, 0.43];
      const endRot = [MathUtils.degToRad(-75), 0, 0];

      // Interpolate position
      const newPos = startPos.map((start, i) =>
        MathUtils.lerp(start, endPos[i], animationProgress)
      );
      const newRot = startRot.map((start, i) =>
        MathUtils.lerp(start, endRot[i], animationProgress)
      );

      // Update camera position
      if (cameraRef.current) {
        cameraRef.current.position.set(...newPos);
        cameraRef.current.rotation.set(...newRot);
      }

      // Increment animation progress
      setAnimationProgress((prev) => Math.min(prev + delta * 1, 1));
    }
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        position={[0, 1.7, 0.4]}
        rotation={[MathUtils.degToRad(-75), 0, 0]}
        makeDefault
        fov={35}
      />
      <OpenBookModel currentArtwork={currentArtwork} />
    </>
  );
};


const AnimatedPointLight = () => {
  const lightRef = useRef<any>();
  const clockRef = useRef(new Clock());
  const [intensity, setIntensity] = useState(0);
  
  const targetIntensity = 0.3;
  const delay = 1;  // 1 second delay
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

const OpenBookCanvas = ({ artworks }: { artworks: ArtworkDocument[] }) => {
  const { width } = useScreenSize();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  return (
    <>
      <div className="w-full h-full">
        {/* Temporary Navigation Buttons */}
        <button
          onClick={prevImage}
          className="bg-black/50 text-white px-4 py-2 rounded"
        >
          Previous
        </button>
        <button
          onClick={nextImage}
          className="bg-black/50 text-white px-4 py-2 rounded"
        >
          Next
        </button>

        <Canvas className={`w-full h-full aspect-video }`} shadows>
          <ambientLight intensity={0.1} />
          <directionalLight
            castShadow
            position={[0, 2, -2]}
            intensity={0.5}
            shadow-mapSize={[1024, 1024]}
          />
          {/* <pointLight
            intensity={0.3}
            color={"#FCD916"}
            position={[-0.3, 1.1, -0.3]}
          /> */}
          <AnimatedPointLight />

          {/* Backdrop for the book */}
          <SoftShadows size={20} samples={10} focus={1} />
          <BakeShadows />

          {/* <Backdrop
            position={[0, 0, -1]}
            scale={2}
            scale-x={4}
            receiveShadow={true}
            floor={0.5}
            segments={20}
          >
            <meshStandardMaterial color="#ffffff" />
          </Backdrop> */}

          {/* <OrbitControls /> */}
          <Suspense fallback={null}>
            <AnimatedCamera artworks={artworks} currentIndex={currentIndex} />
          </Suspense>
        </Canvas>
      </div>
    </>
  );
};

export default OpenBookCanvas;
