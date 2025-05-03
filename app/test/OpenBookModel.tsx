import { ArtworkDocument } from "@/models/Artwork";
import {
  Decal,
  RenderTexture,
  Svg,
  Text,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { useRef } from "react";
import { MathUtils, Mesh, MeshStandardMaterial } from "three";
import { GLTF } from "three-stdlib";
import { IoArrowRedo, IoArrowUndo } from "react-icons/io5";
import { Html } from "@react-three/drei";

interface OpenBookModelProps {
  currentArtwork: ArtworkDocument;
  // Optional: add transition props if needed
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

const OpenBookModel = ({ currentArtwork }: OpenBookModelProps) => {
  const { nodes, materials } = useGLTF("/assets/open_book.glb") as GLTFResult;
  const artworkTexture = useTexture(currentArtwork.src);

  return (
    <group
      dispose={null}
      position={[0, 0.3, 0]}
      rotation={[MathUtils.degToRad(10), 0, 0]}
      ref={useRef(null)}
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
      >
        <Decal
          // debug
          position={[-0.29, 0, 0]}
          rotation={[MathUtils.degToRad(-90), 0, 0]}
          scale={.50}
        >
          <meshStandardMaterial
            map={artworkTexture}
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
                  currentArtwork.description || "No description available."
                )}
              </Text>
            </RenderTexture>
          </meshStandardMaterial>
        </Decal>
      </mesh>
    </group>
  );
};

useGLTF.preload("/assets/open_book.glb");

export default OpenBookModel;

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
