import { useState, useEffect, useRef, forwardRef } from "react"
import { useSolarSystemStore } from "../../States"
import { useFrame, useThree } from "@react-three/fiber"
import { CloudySurfaceMaterial } from "../../shaders/materials/cloudy-surface/CloudySurfaceMaterial";
import Label from "../../ui/label/Label";
import * as THREE from "three";
import React from 'react';

type CloudySurfaceMaterialType = THREE.ShaderMaterial & {
    uniforms: {
        time: { value: number };
    }
};

function SurfaceMaterial({ highlighted }){
    const matRef = useRef<CloudySurfaceMaterialType>(null)
    useFrame((state) => {
        if (matRef.current) {
            matRef.current.uniforms.time.value = state.clock.elapsedTime
            matRef.current.uniforms.highlighted.value = highlighted
        }
    })

    const material = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new (CloudySurfaceMaterial as any)();
    }, []);

    return (
        <primitive
            object={material}
            attach="material"
            topColor={"#868686"}
            botColor={"#868686"}
            midColor1={"#525669"}
            midColor2={"#525669"}
            midColor3={"#525669"}
            octaves={2}
            intensity={0.35}
            ref={matRef}
        />
    )
}

interface QuantumMoonProps {
    onPlanetClick: (planetName: string) => void;
    name: string;
    position: [number, number, number];
    children?: React.ReactNode;
    selectedPlanet: string | null;
}

const planets = ["hour", "timber", "brittle", "deep", "bramble"]

const QuantumMoon = forwardRef<THREE.Group, QuantumMoonProps>(function QuantumMoon({ onPlanetClick, name, children, selectedPlanet, ...props }, ref){

    const focus = useSolarSystemStore((state) => state.focus)
    const quantumObserved = useSolarSystemStore((state) => state.quantumObserved)
    const setQuantumObserved = useSolarSystemStore((state) => state.setQuantumObserved)
    const [currentLocation, setLocation] = useState("deep")
    const { scene } = useThree()

    const { questAreas, selectedQuestAreaIndex } = useSolarSystemStore();
    const isSelected = name === selectedPlanet;
    const questArea = isSelected ? questAreas[selectedQuestAreaIndex] : null;

    useFrame((state) => {
        if (ref && 'current' in ref && ref.current) {
            ref.current.position.x = 10.0 * Math.sin(state.clock.elapsedTime * 0.1)
            ref.current.position.z = 10.0 * Math.cos(state.clock.elapsedTime * 0.1)
        }
    })

    useEffect(() => {
        if (ref && 'current' in ref && ref.current) {
            ref.current.removeFromParent()
            scene.getObjectByName(currentLocation)?.add(ref.current)
        }
    }, [currentLocation, ref, scene])

    useEffect(() => {
        if (quantumObserved) {
            if (ref && 'current' in ref && ref.current) {
                ref.current.removeFromParent()
                const possibleOrbits = planets.filter((planet) => (
                    planet != currentLocation && planet != focus
                ))
                const newLocation = scene.getObjectByName(
                    possibleOrbits[Math.floor(Math.random() * possibleOrbits.length)]
                )
                if (newLocation) {
                    newLocation.add(ref.current)
                    setLocation(newLocation.name)
                }
                setQuantumObserved(false)
            }
        }

        if (ref && 'current' in ref && ref.current && ref.current.parent?.name === focus ) {
            setQuantumObserved(true)
        }
    }, [currentLocation, focus, quantumObserved, ref, scene, setQuantumObserved])


    return(
        <group {...props} ref={ref} name={name} position={[-4,0,0]} onClick={() => onPlanetClick(name)}>
            <Label position={[0,1.2,0]} fontSize={0.1} isSelected={questArea?.name === 'Quantum Moon'}>
                Quantum Moon
            </Label>
            <mesh scale={0.6}>
                <sphereGeometry />
                <SurfaceMaterial highlighted={isSelected} />
            </mesh>
            {children}
        </group>
    )
})

export default QuantumMoon
