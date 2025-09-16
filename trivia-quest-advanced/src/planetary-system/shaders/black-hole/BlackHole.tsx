import { useRef } from "react";
import { shaderMaterial, useFBO } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";
import React from 'react';

const BlackHoleMaterial = shaderMaterial(
    { sceneBuffer: null, resolution: new THREE.Vector2(0.0, 0.0) },
    vertex,
    fragment
);
extend({ BlackHoleMaterial });

function BlackHole() {
    const { gl, scene, camera, size, viewport } = useThree();
    const mesh = useRef<any>(null);
    const material = useRef<any>(null);
    const renderTarget = useFBO();

    useFrame((state, delta) => {
        mesh.current.visible = false;
        gl.setRenderTarget(renderTarget);
        gl.render(scene, camera);
        material.current.sceneBuffer = renderTarget.texture;
        material.current.resolution.set(
            size.width * viewport.dpr,
            size.height * viewport.dpr
        );
        gl.setRenderTarget(null);
        mesh.current.visible = true;
    });

    return (
        <mesh ref={mesh}>
            <icosahedronGeometry args={[1, 20]} />
            <blackHoleMaterial key={BlackHoleMaterial.key} ref={material} />
        </mesh>
    );
}
export default BlackHole;
