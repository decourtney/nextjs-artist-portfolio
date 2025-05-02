"use client";

import {
  Backdrop,
  BakeShadows,
  OrbitControls,
  PerspectiveCamera,
  SoftShadows,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import OpenBookModel from "./OpenBookModel";
import { MathUtils } from "three";
import { ArtworkDocument } from "@/models/Artwork";

interface OpenBookCanvasProps {
  artworks: ArtworkDocument[]; // Replace with the actual type of artworks
}

const OpenBookCanvas = ({ artworks }: OpenBookCanvasProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentArtwork = artworks[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
  };

  return (
    <Canvas className="bg-green-300 w-full aspect-video" shadows>
      <Suspense fallback={null}>
        <PerspectiveCamera
          position={[0, 1.7, 0.4]}
          rotation={[MathUtils.degToRad(-75), 0, 0]}
          makeDefault
          fov={35}
        />
        <ambientLight intensity={0.1} />
        <directionalLight
          castShadow
          position={[0, 2, -1]}
          intensity={0.5}
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight
          intensity={0.3}
          color={"#FCD916"}
          position={[-0.3, 1.1, -0.5]}
        />
        <SoftShadows size={20} samples={10} focus={1} />
        <BakeShadows />
        {/* <OrbitControls /> */}
        <OpenBookModel currentArtwork={currentArtwork} />

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
      </Suspense>
    </Canvas>
  );
};

export default OpenBookCanvas;
