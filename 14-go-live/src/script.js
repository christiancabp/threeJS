import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/8.png");
const particleTexture = textureLoader.load("textures/matcaps/2.png");

/**
 * Fonts
 */
const fontLoader = new FontLoader();

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  // Material
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

  // Text
  const textGeometry = new TextGeometry("WELCOME", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.center();

  const text = new THREE.Mesh(textGeometry, material);
  scene.add(text);
});

/**
 * PARTICLES
 */

const particlesGeometry = new THREE.BufferGeometry();
const count = 40000;
//position attribute
const position = new Float32Array(count * 3); //3 vertices x, y, z

for (let i = 0; i < count * 3; i++) {
  // Random vertices
  position[i] = (Math.random() - 0.5) * 25; // Math.random() = 0 to 1
}

// Geometry
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(position, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true, // camera is far away from the particle
});

particlesMaterial.color = new THREE.Color("#ffffff");
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture; //We have a problem

// Optimizing result
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending; // we can see the effect better with more particles
// it does not draw one pixel over the other it would add more colors to see combined colors

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// Donuts
// const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

// for (let i = 0; i < 100; i++) {
//   const donut = new THREE.Mesh(donutGeometry, material);
//   donut.position.x = (Math.random() - 0.5) * 10;
//   donut.position.y = (Math.random() - 0.5) * 10;
//   donut.position.z = (Math.random() - 0.5) * 10;
//   donut.rotation.x = Math.random() * Math.PI;
//   donut.rotation.y = Math.random() * Math.PI;
//   const scale = Math.random();
//   donut.scale.set(scale, scale, scale);

//   scene.add(donut);
// }

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Animating Particles
  particles.rotation.x = elapsedTime * 0.01;
  particles.rotation.y = elapsedTime * 0.01;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
