import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// console.log(GLTFLoader);

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

const debugObject = {
  mapIntensity: 3,
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Updating materials Function.
 */

const updateMaterials = () => {
  scene.traverse((child) => {
    // Find ALL MESHES..!!
    // console.log(child);

    // Filter only mesh type children
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      //   console.log(child);
      // this does the same as scene.environment = environmentMap;
      // we are using it here to traverse through the children and
      // have more control with gui. this is also useful to target
      // children in the scene and edit them.
      child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.mapIntensity;
      child.material.needsUpdate = true;

      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Test sphere
 */
const testSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial()
);
// scene.add(testSphere);

/**
 * Environment Map
 */

const environmentMap = cubeTextureLoader.load([
  '/textures/environmentMaps/3/px.jpg',
  '/textures/environmentMaps/3/nx.jpg',
  '/textures/environmentMaps/3/py.jpg',
  '/textures/environmentMaps/3/ny.jpg',
  '/textures/environmentMaps/3/pz.jpg',
  '/textures/environmentMaps/3/nz.jpg',
]);

// Changing environment to srgbEncoding for gamma optimization.
environmentMap.encoding = THREE.sRGBEncoding;

// Adding Environment map to the Scene
scene.background = environmentMap;

// Adding Environment map to meshes in the scene.
scene.environment = environmentMap;

gui
  .add(debugObject, 'mapIntensity')
  .min(0)
  .max(10)
  .step(0.001)
  .name('EnvMap Intensity')
  .onChange(() => {
    updateMaterials();
  });

/**
 * Models
 */

// Loading Hamburguer

// gltfLoader.load('/models/hamburger.glb', (gltf) => {
//   gltf.scene.scale.set(0.3, 0.3, 0.3);
//   gltf.scene.position.set(0, -1, 0);
// Loading flight helmet

gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  //   console.log(gltf);
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI * 0.5; // Rotate torwards the camera.

  scene.add(gltf.scene);

  updateMaterials();

  gui
    .add(gltf.scene.rotation, 'y')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name('rotation');
});

/**
 * Lights
 */

const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;

directionalLight.shadow.camera.far = 15;

//camera helper for light
const lightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);

directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.05;

scene.add(directionalLight);

// Directional Light gui control
gui
  .add(directionalLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.001)
  .name('Light Intensity');
gui
  .add(directionalLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('lightX');
gui
  .add(directionalLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('lightY');
gui
  .add(directionalLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('lightZ');

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
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
camera.position.set(4, 1, -4);
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
renderer.physicallyCorrectLights = true; // BETTER LIGHTS..!
renderer.outputEncoding = THREE.sRGBEncoding; // OPTIMIZING SCENE for eye perception with gamma factor..!
//https://medium.com/game-dev-daily/the-srgb-learning-curve-773b7f68cf7a
renderer.toneMapping = THREE.LinearToneMapping; // MAKE IT MORE REALISTIC.
// renderer.toneMapping = THREE.CineonToneMapping; // MAKE IT MORE REALISTIC.
// renderer.toneMapping = THREE.ACESFilmicToneMapping; // MAKE IT MORE REALISTIC.
renderer.toneMappingExposure = 2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui
  .add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    updateMaterials();
  });

gui
  .add(renderer, 'toneMappingExposure')
  .min(0)
  .max(10)
  .step(0.001)
  .name('toneMapping Exposure:');

/**
 * Animate
 */
const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
