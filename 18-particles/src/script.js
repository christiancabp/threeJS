import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
const particleTexture = textureLoader.load("/textures/particles/2.png");

/**
 * PARTICLES
 */

// Sphere Geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

// Creating custom Geometry
const particlesGeometry = new THREE.BufferGeometry();
const count = 20000;
//position attribute
const position = new Float32Array(count * 3); //3 vertices x, y, z
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  // Random vertices
  position[i] = (Math.random() - 0.5) * 10; // Math.random() = 0 to 1
  // Random colors
  colors[i] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(position, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true, // camera is far away from the particle
});

particlesMaterial.vertexColors = true;
// particlesMaterial.color = new THREE.Color("#ff88cc");
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture; //We have a problem
//Optimization
// Solution 1 alphatest
// particlesMaterial.alphaTest = 0.001;        //gets rid of the corners

// Solution 2 not ideal if there are more objects
// particlesMaterial.depthTest = false; //doesnt overpose objects but it can create bugs if there is more objects
// Activate test cube to see bug!

// Solution 3 this solution is usually ideal but it depends on the project.
// particlesMaterial.depthWrite = false;

// Partial Solution 4 Blending (Photoshop) REALLY cool Result
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending; // we can see the effect better with more particles
// it does not draw one pixel over the other it would add more colors to see combined colors
// This may impact the performance.

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/**
 * Test cube
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);
// scene.add(cube)

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
camera.position.z = 3;
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

  // ANIMATING PARTICLES
  // particles.rotation.y = elapsedTime * 0.2;     // all particles rotate together
  // particles.position.y = -elapsedTime * 0.2; // particles will begin falling

  // Creating a wave
  //   for (let i = 0; i < count * 3; i++) {
  //     let i3 = i * 3;
  //     const x = particlesGeometry.attributes.position.array[i3]; // we need this ti offset the wave
  //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
  //       elapsedTime + x
  //     );
  //   }
  //   particlesGeometry.attributes.position.needsUpdate = true; // we need to update after we changed positions
  // This animation works but it doesnt perform very good. too Slow!!

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
