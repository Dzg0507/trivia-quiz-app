import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

import React from 'react';

interface LabelProps {
    children: React.ReactNode;
    position: [number, number, number];
    fontSize: number;
    maxWidth?: number;
}

function Label({ children, ...props }: LabelProps){

    const textRef = useRef<THREE.Object3D>(null)

    useFrame((state) => {
        if (textRef.current) {
            textRef.current.lookAt(state.camera.position)
        }
    })

    return (
        <Text
        {...props}
        font={'/planetary-system/fonts/SpaceMono-Regular.ttf'}
        ref={textRef}
        >
            {children}
        </Text>
    )
}
export default Label
