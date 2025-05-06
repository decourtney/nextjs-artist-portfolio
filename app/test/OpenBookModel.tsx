import { ArtworkDocument } from "@/models/Artwork";
import { Decal, RenderTexture, Text, useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { useState } from "react";
import { MathUtils, Mesh, MeshStandardMaterial, TextureLoader } from "three";
import { GLTF } from "three-stdlib";

interface OpenBookModelProps {
  artworks: ArtworkDocument[];
}

type GLTFResult = GLTF & {
  nodes: {
    book_cover_1: Mesh;
    book_cover_2: Mesh;
    book_cover_3: Mesh;
    left_page: Mesh;
    right_page: Mesh;
  };
  materials: {
    page_grunge: MeshStandardMaterial;
    bookcover: MeshStandardMaterial;
    book_content: MeshStandardMaterial;
    gold: MeshStandardMaterial;
  };
};

const OpenBookModel = ({ artworks }: OpenBookModelProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { nodes, materials } = useGLTF("/assets/open_book.glb") as GLTFResult;

  // Preload textures to prevent flickering
  const textures = useLoader(
    TextureLoader,
    artworks.map((artwork) => artwork.src)
  );
  const currentTexture = textures[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % artworks.length);
  };
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + artworks.length) % artworks.length);
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
            position={[-0.29, 0, 0]}
            rotation={[MathUtils.degToRad(-90), 0, 0]}
            scale={0.5}
          >
            <meshStandardMaterial
              map={currentTexture}
              polygonOffset
              polygonOffsetFactor={-1}
            />
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
            position={[0.29, 0, 0]}
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
                  color={"black"}
                  fontSize={0.2}
                  rotation={[0, 0, 0]}
                  characters="abcdefghijklmnopqrstuvwxyz0123456789!"
                >
                  {wrapText(
                    artworks[currentIndex].description ||
                      "No description available."
                  )}
                </Text>
              </RenderTexture>
            </meshStandardMaterial>
          </Decal>
        </mesh>
      </group>
    </>
  );
};

// useGLTF.preload("/assets/open_book.glb");

export default OpenBookModel;

// Function to wrap text into multiple lines based on a maximum character limit
// Currently this was the only way I could get the text to wrap correctly in the texture
function wrapText(str: string, maxChars = 60) {
  const words = str.split(" ");
  let lines = [];
  let line = "";

  for (let word of words) {
    if ((line + word).length > maxChars) {
      lines.push(line.trim());
      line = "";
    }
    line += word + " ";
  }
  if (line) lines.push(line.trim());
  return lines.join("\n");
}
