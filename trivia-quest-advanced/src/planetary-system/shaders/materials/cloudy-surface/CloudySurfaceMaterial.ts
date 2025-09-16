import * as THREE from 'three'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'
import { shaderMaterial } from '@react-three/drei'

const CloudySurfaceMaterial = shaderMaterial(
    {
        time: 0,
        topColor: new THREE.Color(0.0, 0.0, 0.0),
        botColor: new THREE.Color(0.0, 0.0, 0.0),
        midColor1: new THREE.Color(0.0, 0.0, 0.0),
        midColor2: new THREE.Color(0.0, 0.0, 0.0),
        midColor3: new THREE.Color(0.0, 0.0, 0.0),
        intensity: 0.0,
        octaves: 0,
        highlighted: false,
    },
    vertexShader,
    fragmentShader
)

export { CloudySurfaceMaterial }
