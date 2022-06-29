import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400 });

const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */

// Draco Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

let mixer = null;
// Loading 3D models
const gltfLoader = new GLTFLoader(); // this loader can load binary and embbeded gltf and we can add Draco
// adding Draco Loader
gltfLoader.setDRACOLoader(dracoLoader); // optional algorith to load draco files and others only runs when loading Draco Files.
gltfLoader.load(
  '/models/mech_drone/scene.gltf', // multiple meshes
  (gltf) => {
    // Success callback func
    // console.log("success!");
    console.log(gltf);

    // Loading using while loop
    // while (gltf.scene.children.length) {
    //   scene.add(gltf.scene.children[0]);
    // }

    // Load Using copy array
    // const children = [...gltf.scene.children];
    // for (const child of children) {
    //   scene.add(child);
    // }

    // Animating Model
    mixer = new THREE.AnimationMixer(gltf.scene); // Animation handler
    const action = mixer.clipAction(gltf.animations[0]);

    action.play();

    // Casting shadows for each scene child element.
    gltf.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });

    // Load by loading whole scene
    gltf.scene.scale.set(5, 5, 5);

    scene.add(gltf.scene);
  },
  () => {
    // Progress callback func
    console.log('Progress!');
  },
  () => {
    // When error callback func
    console.log('Error!');
  }
);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#1e1a20',
    metalness: 0,
    roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
// floor.position.z = -10;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
directionalLight.lookAt(0, 0, 0); //Always point to the center of the scene!
scene.add(directionalLight);

// We can render a light helper to see where the light is pointing.
const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(lightHelper);

// gui control
gui
  .add(directionalLight, 'intensity')
  .max(10)
  .min(0.1)
  .step(0.01)
  .name('directional light intensity: ');

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
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Updating Animation Mixer
  if (mixer) {
    mixer.update(deltaTime);
  }

  directionalLight.position.x = Math.cos(elapsedTime * 0.5) * 4;
  directionalLight.position.z = Math.sin(elapsedTime * 0.5) * 4;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
