import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import { CloudySurfaceMaterial } from "../../shaders/materials/cloudy-surface/CloudySurfaceMaterial";
import Label from "../../ui/label/Label";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

import React from 'react';

interface GiantsDeepProps {
    onPlanetClick: (planetName: string) => void;
    visible: boolean;
    name: string;
    position: [number, number, number];
}

type GLTFResult = GLTF & {
    nodes: {
        ["giants-deep"]: THREE.Mesh;
        OPC_Base_Proxy: THREE.Mesh;
        OPC_Cannon_Mid_Proxy: THREE.Mesh;
        OPC_Cannon_Tip_Proxy: THREE.Mesh;
    };
    materials: Record<string, unknown>;
};

type CloudySurfaceMaterialType = THREE.ShaderMaterial & {
    uniforms: {
        time: { value: number };
    }
};

function Surface(){
    const matRef = useRef<CloudySurfaceMaterialType>(null)
    useFrame((state) => {
        if (matRef.current) {
            matRef.current.uniforms.time.value = state.clock.elapsedTime
        }
    })

    const material = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (CloudySurfaceMaterial as any)();
    }, []);

    return (
        <primitive
            object={material}
            attach="material"
            topColor={"#516231"}
            botColor={"#225200"}
            midColor1={"#315255"}
            midColor2={"#3b3900"}
            midColor3={"#579600"}
            intensity={0.08}
            ref={matRef}
        />
    )
}

const GiantsDeep: React.FC<GiantsDeepProps> = ({ onPlanetClick, ...props }) => {
    const planet = useRef<THREE.Group>(null)
    const { nodes } = useGLTF(
        "/planetary-system/planets/giants-deep/models/giants-deep.glb"
    ) as unknown as GLTFResult;

    const opc = useTexture("/planetary-system/planets/giants-deep/textures/opc.webp");
    opc.flipY = false;

    useFrame((state) => {
        if (planet.current) {
            planet.current.rotation.y = state.clock.elapsedTime * 0.1
        }
    })

    return (
        <group {...props} dispose={null} ref={planet} onClick={() => onPlanetClick('Giants Deep')}>
            <Label position={[4.0,0.5,5.0]} fontSize={0.1}>
                Orbital Probe Cannon
            </Label>
            <mesh
                geometry={nodes["giants-deep"].geometry}
                rotation={[Math.PI / 2, 0, 0]}
                scale={5}
            >
                <Surface />
            </mesh>
            <mesh
                geometry={nodes.OPC_Base_Proxy.geometry}
                position={[4.243, 0, 4.243]}
                rotation={[Math.PI / 2, 0, -Math.PI / 4]}
                scale={0.005}
            >
                <meshLambertMaterial map={opc} />
            </mesh>
            <mesh
                geometry={nodes.OPC_Cannon_Mid_Proxy.geometry}
                position={[3.055, 0.003, 5.154]}
                rotation={[Math.PI / 2, 0, -0.542]}
                scale={0.005}
            >
                <meshLambertMaterial map={opc} />
            </mesh>
            <mesh
                geometry={nodes.OPC_Cannon_Tip_Proxy.geometry}
                position={[2.086, 0.003, 5.623]}
                rotation={[Math.PI / 2, 0, -0.363]}
                scale={0.005}
            >
                <meshLambertMaterial map={opc} />
            </mesh>
        </group>
    );
}
export default GiantsDeep;
useGLTF.preload("/planetary-system/planets/giants-deep/models/giants-deep.glb");
useTexture.preload("/planetary-system/planets/giants-deep/textures/opc.webp");
