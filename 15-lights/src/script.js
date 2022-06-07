import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

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
 * Lights
 */

// AMBIENT LIGHT        used to iluminate everything from everywhere

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// ambientLight.color = new THREE.Color(0xffffff);
// ambientLight.intensity = 0.5;
scene.add(ambientLight);
// gui
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("ambient light");

// DIRECTIONAL LIGHT        one light facing one direction (like the sun) by default comes from the top

const directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
scene.add(directionalLight);
// gui
gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("directional light");
// Changing direction
directionalLight.position.set(1, 0.25, 0);

// HEMISPHERE LIGHT         uses two colors one for the iluminated part one for the shadow

const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);
// gui
gui
  .add(hemisphereLight, "intensity")
  .min(0)
  .max(1)
  .step(0.001)
  .name("hemisphere light");

// POINT LIGHT      acts like a lightbulb at a certain position.

const pointLight = new THREE.PointLight(0xff9000, 0.5, 3, 2); //last parameters are distance nad decay. How far it iluminates
//changing position
pointLight.position.set(1, -0.5, 1);

scene.add(pointLight);
// gui
gui.add(pointLight, "intensity").min(0).max(1).step(0.001).name("point light");

// RECT ARE LIGHT   light plane square only works with meshStandart and MeshPhysical materials

const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 5, 1, 1); //(color, intensity, width, height)
//changing position
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());

scene.add(rectAreaLight);
// gui
gui
  .add(rectAreaLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("rectArea light");

// SPOT LIGHT

const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
// SpotLight(color, intentsity, distance, angle, penumbra, decay)
spotLight.position.set(0, 2, 3);
//changing spotlight target
spotLight.target.position.x = -0.75;

scene.add(spotLight, spotLight.target);
// gui
gui.add(spotLight, "intensity").min(0).max(10).step(0.001).name("spot light");

// LIGHT HELPERS

const hemisphereHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
const directionalHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
const pointHelper = new THREE.PointLightHelper(pointLight, 0.2);
const spotHelper = new THREE.SpotLightHelper(spotLight); //does not update automatically

scene.add(hemisphereHelper, directionalHelper, pointHelper, spotHelper);

window.requestAnimationFrame(() => {
  spotHelper.update();
});

const rectAreaHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaHelper);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
