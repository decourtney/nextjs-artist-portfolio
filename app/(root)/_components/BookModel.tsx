import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import { Mesh, MeshStandardMaterial } from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Mesh: Mesh;
    Mesh_1: Mesh;
    Mesh_2: Mesh;
  };
  materials: {
    bookcover: MeshStandardMaterial;
    "book side2": MeshStandardMaterial;
    gold: MeshStandardMaterial;
  };
};

export function BookModel({
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  title,
  ...props
}: GroupProps & {
  rotation?: [number, number, number];
  title?: string;
}): JSX.Element {
  const { nodes, materials } = useGLTF("/book1.glb") as unknown as GLTFResult;
  const coverDecal = useTexture("/images/bookcover.jpg");

  return (
    <group {...props} rotation={rotation} dispose={null}>
      <group position={position}>
        {title && (
          <group
            position={[0, 0.08, 0.2]}
            rotation={[Math.PI / -2, 0, 0]}
            scale={0.07}
          >
            {/* <Text color={"white"} anchorX={"center"} anchorY={"middle"}>
              {title}
            </Text> */}
          </group>
        )}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh.geometry}
          material={materials.bookcover}
        >
          <Decal
            // debug
            map={coverDecal}
            position={[-0.08, 0.2, 0]}
            rotation={[Math.PI / -2, 0, 0]}
            scale={0.9}
          />
        </mesh>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_1.geometry}
          material={materials["book side2"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_2.geometry}
          material={materials.gold}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/book1.glb");
