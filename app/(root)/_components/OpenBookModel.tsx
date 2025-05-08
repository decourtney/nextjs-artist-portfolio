import { PopulatedArtworkDocument } from "@/models/Artwork";
import { Decal, RenderTexture, Text, useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useEffect, useState } from "react";
import {
  AnimationClip,
  Bone,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SkinnedMesh,
  TextureLoader,
} from "three";
import { GLTF } from "three-stdlib";

interface OpenBookModelProps {
  artworks: PopulatedArtworkDocument[];
}

type GLTFResult = GLTF & {
  nodes: {
    Bone: Bone;
    book_cover_1: Mesh;
    book_cover_2: Mesh;
    book_cover_3: Mesh;
    left_page: Mesh;
    left_page_loose: SkinnedMesh;
    right_page: Mesh;
    right_page_arm: Object3D;
    right_page_loose: SkinnedMesh;
  };
  materials: {
    page_grunge: MeshStandardMaterial;
    bookcover: MeshStandardMaterial;
    book_content: MeshStandardMaterial;
    gold: MeshStandardMaterial;
  };
  animations: AnimationClip[];
};

const OpenBookModel = ({ artworks }: OpenBookModelProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textureScales, setTextureScales] = useState<
    { x: number; y: number }[]
  >([{ x: 0, y: 0 }]);

  const { nodes, materials, animations } = useGLTF(
    "/assets/open_book.glb"
  ) as GLTFResult;

  // Preload textures to prevent flickering
  const textures = useLoader(
    TextureLoader,
    artworks.map((artwork) => artwork.src)
  );

  // Calculate dynamic scales to preserve aspect ratio
  useEffect(() => {
    const scales = artworks.map((artwork) => {
      const { metaWidth, metaHeight } = artwork;

      const pageWidth = 0.4;
      const pageHeight = 0.6;

      // Calculate aspect ratios
      const imageAspectRatio = metaWidth / metaHeight;
      const pageAspectRatio = pageWidth / pageHeight;

      let scaleX, scaleY;
      if (imageAspectRatio > pageAspectRatio) {
        // Image is wider relative to page - fit width
        scaleX = pageWidth; // Cap at page width
        scaleY = (pageWidth / metaWidth) * metaHeight; // Scale height proportionally
      } else {
        // Image is taller relative to page - fit height
        scaleY = pageHeight; // Cap at page height
        scaleX = (pageHeight / metaHeight) * metaWidth; // Scale width proportionally
      }

      return { x: scaleX, y: scaleY };
    });
    setTextureScales(scales);
  }, [artworks, textures]);

  const currentTexture = textures[currentIndex];
  const currentScale = textureScales[currentIndex] || { x: 1, y: 1 };

  // Navigation Controls
  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % artworks.length);
  };
  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + artworks.length) % artworks.length);
  };

  return (
    <>
      <group
        dispose={null}
        position={[0, 0.3, 0]}
        rotation={[MathUtils.degToRad(10), 0, 0]}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.book_cover_1.geometry}
          material={materials.bookcover}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.book_cover_2.geometry}
          material={materials.book_content}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.book_cover_3.geometry}
          material={materials.gold}
        />

        {/* Left Page Mesh */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.left_page.geometry}
          material={materials.page_grunge}
          rotation={[0, 0, 0]}
          onClick={prevImage}
        >
          <Decal
            // debug
            position={[-0.28, 0, 0]}
            rotation={[MathUtils.degToRad(-90), 0, 0]}
            scale={[currentScale.x, currentScale.y, 1]}
          >
            <meshStandardMaterial
              map={currentTexture}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </Decal>

          {/* Artwork Info */}
          {createTextDecal(
            -0.35,
            0.38,
            artworks[currentIndex].size?.label,
            0.16
          )}
          {createTextDecal(
            -0.3,
            0.38,
            artworks[currentIndex].substance?.label,
            0.16
          )}
          {createTextDecal(
            -0.25,
            0.38,
            artworks[currentIndex].medium?.label,
            0.16
          )}
        </mesh>

        {/* Right Page Mesh */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.right_page.geometry}
          material={materials.page_grunge}
          rotation={[0, 0, 0]}
          onClick={nextImage}
        >
          {createTextDecal(
            0.3,
            0,
            artworks[currentIndex].description || "No description available.",
            0.2
          )}
        </mesh>
      </group>
    </>
  );
};

useGLTF.preload("/assets/open_book.glb");

export default OpenBookModel;

// Function to create text decals for artwork info and description
const createTextDecal = (
  posX: number,
  posZ: number,
  text: string,
  fontSize: number
) => {
  return (
    <Decal
      // debug
      position={[posX, 0, posZ]}
      rotation={[
        MathUtils.degToRad(-90),
        MathUtils.degToRad(0),
        MathUtils.degToRad(0),
      ]}
      scale={1}
    >
      <meshStandardMaterial polygonOffset polygonOffsetFactor={-1} transparent>
        <RenderTexture attach="map">
          <Text
            fontSize={fontSize}
            color="black"
            maxWidth={6}
            anchorX={"center"}
            anchorY={"middle"}
            overflowWrap="break-word"
            characters="abcdefghijklmnopqrstuvwxyz0123456789!"
          >
            {text}
          </Text>
        </RenderTexture>
      </meshStandardMaterial>
    </Decal>
  );
};
