import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';


interface AnimationState {
  scene?: THREE.Scene;
  camera?: THREE.PerspectiveCamera;
  renderer?: THREE.WebGLRenderer;
  torusKnot?: THREE.Mesh<THREE.TorusKnotGeometry, THREE.MeshPhongMaterial>;
  light?: THREE.PointLight;
}

const createScene = (mount: HTMLDivElement) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  mount.appendChild(renderer.domElement);

  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  const material = new THREE.MeshPhongMaterial({
    color: new THREE.Color('#ffcc00'),
    specular: 0xffffff,
    shininess: 100
  });
  const torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  return { scene, camera, renderer, torusKnot, light };
};

const BackgroundAnimation = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const state = useRef<AnimationState>({}).current;
  

  const animate = useCallback(() => {
    if (state.torusKnot) {
      state.torusKnot.rotation.x += 0.005;
      state.torusKnot.rotation.y += 0.005;

      const time = performance.now() * 0.0002;
      const hue = (Math.sin(time) + 1) / 2; // Varies between 0 and 1
      state.torusKnot.material.color.setHSL(hue, 0.8, 0.6);
    }
    if (state.renderer && state.scene && state.camera) {
      state.renderer.render(state.scene, state.camera);
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [state]);

  const handleResize = useCallback(() => {
    if (state.camera && state.renderer && mountRef.current) {
      state.camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      state.camera.updateProjectionMatrix();
      state.renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    }
  }, [state]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (state.torusKnot && state.light && mountRef.current) {
      const { clientX, clientY } = event;
      const { clientWidth, clientHeight } = mountRef.current;

      const rotateX = (clientY / clientHeight) * Math.PI * 2 - Math.PI;
      const rotateY = (clientX / clientWidth) * Math.PI * 2 - Math.PI;

      gsap.to(state.torusKnot.rotation, {
        x: rotateX,
        y: rotateY,
        duration: 1.5,
        ease: 'power2.out',
      });

      const lightX = (clientX / clientWidth) * 20 - 10;
      const lightY = -(clientY / clientHeight) * 20 + 10;

      gsap.to(state.light.position, {
        x: lightX,
        y: lightY,
        duration: 1.5,
        ease: 'power2.out',
      });

    }
  }, [state]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const { scene, camera, renderer, torusKnot, light } = createScene(mount);
    state.scene = scene;
    state.camera = camera;
    state.renderer = renderer;
    state.torusKnot = torusKnot;
    state.light = light;

    animate();
    window.addEventListener('resize', handleResize);
    mount.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      mount.removeChild(renderer.domElement);
    };
  }, [animate, handleResize, handleMouseMove, state]);

  return <div ref={mountRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
};

export default BackgroundAnimation;
