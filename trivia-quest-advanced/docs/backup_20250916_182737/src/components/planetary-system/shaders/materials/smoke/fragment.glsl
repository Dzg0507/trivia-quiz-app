// src/planetary-system/shaders/materials/smoke/fragment.glsl
uniform float time;
uniform sampler2D map; // This is our smoke_column.png texture

varying vec2 vUv;

void main() {
    // Animate the UVs to make the smoke appear to rise
    vec2 uv = vUv;
    uv.y += time * 0.1; // Adjust 0.1 to change the speed

    vec4 smokeColor = texture2D(map, uv);

    // Use the texture's alpha channel for transparency
    gl_FragColor = vec4(smokeColor.rgb, smokeColor.a);
}