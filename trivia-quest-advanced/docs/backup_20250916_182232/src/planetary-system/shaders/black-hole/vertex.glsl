// src/planetary-system/shaders/black-hole/vertex.glsl

uniform float uTime;
uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;

varying float vElevation;
varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Add some wave-like elevation for a dynamic effect
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime) * uBigWavesElevation;
    elevation += sin(modelPosition.y * uBigWavesFrequency.y + uTime) * uBigWavesElevation;

    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vElevation = elevation;
    vUv = uv;
}
