import { ArtworkDocument } from "@/models/Artwork";
import { Decal, RenderTexture, Text, useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useState } from "react";
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
  artworks: ArtworkDocument[];
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
  const { nodes, materials, animations } = useGLTF(
    "/assets/open_book.glb"
  ) as GLTFResult;

  // Preload textures to prevent flickering
  const textures = useLoader(
    TextureLoader,
    artworks.map((artwork) => artwork.src)
  );
  const leftTexture = textures[currentIndex];
  const rightTexture = textures[currentIndex + 1];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 2) % artworks.length);
  };
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 2 + artworks.length) % artworks.length);
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
            position={[-0.29, 0, -0.125]}
            rotation={[MathUtils.degToRad(-90), 0, 0]}
            scale={0.5}
          >
            <meshStandardMaterial
              map={leftTexture}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </Decal>

          <Decal
            // debug
            position={[-0.29, 0, 0.25]}
            rotation={[
              MathUtils.degToRad(-90),
              MathUtils.degToRad(0),
              MathUtils.degToRad(0),
            ]}
            scale={1}
          >
            <meshStandardMaterial
              polygonOffset
              polygonOffsetFactor={-1}
              transparent
            >
              <RenderTexture attach="map">
                <Text
                  fontSize={0.2}
                  color="black"
                  maxWidth={6}
                  anchorX={"center"}
                  anchorY={"middle"}
                  overflowWrap="break-word"
                  characters="abcdefghijklmnopqrstuvwxyz0123456789!"
                >
                  {artworks[currentIndex].description ||
                    "No description available."}
                </Text>
              </RenderTexture>
            </meshStandardMaterial>
          </Decal>
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
          <Decal
            // debug
            position={[0.29, 0, -0.125]}
            rotation={[MathUtils.degToRad(-90), 0, 0]}
            scale={0.5}
          >
            <meshStandardMaterial
              map={rightTexture}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </Decal>

          <Decal
            // debug
            position={[0.29, 0, 0.25]}
            rotation={[
              MathUtils.degToRad(-90),
              MathUtils.degToRad(0),
              MathUtils.degToRad(0),
            ]}
            scale={1}
          >
            <meshStandardMaterial
              polygonOffset
              polygonOffsetFactor={-1}
              transparent
            >
              <RenderTexture attach="map">
                <Text
                  fontSize={0.2}
                  color="black"
                  maxWidth={6}
                  anchorX={"center"}
                  anchorY={"middle"}
                  overflowWrap="break-word"
                  characters="abcdefghijklmnopqrstuvwxyz0123456789!"
                >
                  {artworks[currentIndex].description ||
                    "No description available."}
                </Text>
              </RenderTexture>
            </meshStandardMaterial>
          </Decal>
        </mesh>
      </group>
    </>
  );
};

useGLTF.preload("/assets/open_book.glb");

export default OpenBookModel;
