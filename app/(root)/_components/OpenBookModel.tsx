import React, { useRef } from "react";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import {
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshMatcapMaterial,
  MeshStandardMaterial,
  MathUtils,
} from "three";

type GLTFResult = GLTF & {
  nodes: {
    book_open_1: Mesh;
    book_open_2: Mesh;
    book_open_3: Mesh;
    book_open_4: Mesh;
  };
  materials: {
    page_grunge: MeshStandardMaterial;
    bookcover: MeshStandardMaterial;
    book_content: MeshStandardMaterial;
    gold: MeshStandardMaterial;
  };
};

const OpenBookModel = () => {
  const { nodes, materials } = useGLTF("/assets/open_book.glb") as GLTFResult;
  const decalImage = useTexture("/images/bookcover.jpg");

  console.log("nodes", nodes);
  console.log("materials", materials);
  return (
    <group
      dispose={null}
      position={[0, 0.3, 0]}
      rotation={[0, 0, MathUtils.degToRad(90)]}
      ref={useRef(null)}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.book_open_1.geometry}
        material={materials.bookcover}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.book_open_2.geometry}
        material={materials.book_content}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.book_open_3.geometry}
        material={materials.gold}
      />
      <mesh
        castShadow
        // receiveShadow
        geometry={nodes.book_open_4.geometry}
        material={materials.page_grunge}
      >
  
      </mesh>
    </group>
  );
};

useGLTF.preload("/assets/open_book.glb");

export default OpenBookModel;
