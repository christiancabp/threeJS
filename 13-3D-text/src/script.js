import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
//Bringing font from node modules
// import typeFaceFont from "three/examples/fonts/helvetiker_regular.typeface.json";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Axis Helper
const axes = new THREE.AxesHelper();
// scene.add(axes);  //removed

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const matCapTexture = textureLoader.load("/textures/matcaps/6.png");

/**
 * Loading font
 */
// For color gui
const debugObject = {
  color: 0xff0000,
};

const fontLoader = new FontLoader(); //need to import this module ln 5

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log("font loaded");
  const textGeometry = new TextGeometry("Isabella", {
    // need to import module
    font: font, // or just font since is the  same name
    size: 0.5,
    height: 0.2,
    curveSegments: 4,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });
  textGeometry.computeBoundingBox();
  console.log(textGeometry.boundingBox);

  // Moving text to center Hard Way
  //   textGeometry.translate(
  //     -textGeometry.boundingBox.max.x * 0.5,
  //     -textGeometry.boundingBox.max.y * 0.5,
  //     -textGeometry.boundingBox.max.z * 0.5
  //   );

  //Moving to center easy way
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({
    // color: debugObject.color,  // not when we are using matcap
  });
  textMaterial.matcap = matCapTexture;

  //   gui.add(textMaterial, "wireframe");
  //Color GUI
  //   gui.addColor(debugObject, "color").onChange(() => {
  //     console.log("color has changed!");
  //     textMaterial.color.set(debugObject.color);
  //   });

  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

/**
 * Object
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

// scene.add(cube); //Cubed removed

//CREATING 100 DOGNUTS
//The wrong way  NOT OPTIMIZED

console.time("donuts");

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matCapTexture });

for (let i = 0; i < 200; i++) {
  //creating donut
  const donut = new THREE.Mesh(donutGeometry, donutMaterial);
  //random position
  donut.position.x = (Math.random() - 0.5) * 10;
  donut.position.y = (Math.random() - 0.5) * 10;
  donut.position.z = (Math.random() - 0.5) * 10;
  // Random Rotation
  donut.rotation.x = Math.random() * Math.PI;
  donut.rotation.y = Math.random() * Math.PI;
  //math scale
  const scaleRandomNumber = Math.random(); //we want to keep a unifor donut just big or small
  donut.scale.set(scaleRandomNumber, scaleRandomNumber, scaleRandomNumber);

  scene.add(donut);
}

console.timeEnd("donuts");

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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
