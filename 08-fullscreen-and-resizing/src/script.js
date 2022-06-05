import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//RESIZING in page event handler

window.addEventListener("resize", () => {
  console.log("window has been resized");
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Updating camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //Updating render
  renderer.setSize(sizes.width, sizes.height);

  //HANDLING PIXEL RATIO for perfect render in difewrent devices.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // handeling up to two pixel ratio
});

//GOING FULLSCREEN with double click!

window.addEventListener("dblclick", () => {
  //Does not work with safari theres another version for that.
  console.log("double click");
  if (!document.fullscreenElement) {
    console.log("go fullscreen");
    canvas.requestFullscreen();
  } else {
    console.log("leave fullscreen");
    document.exitFullscreen();
  }
});

//Version for all browsers.

// window.addEventListener("dblclick", () => {
//   const fullscreenElement =
//     document.fullscreenElement || document.webkitFullscreenElement;

//   if (!fullscreenElement) {
//     if (canvas.requestFullscreen) {
//       canvas.requestFullscreen();
//     } else if (canvas.webkitRequestFullscreen) {
//       canvas.webkitRequestFullscreen();
//     }
//   } else {
//     if (document.exitFullscreen) {
//       document.exitFullscreen();
//     } else if (document.webkitExitFullscreen) {
//       document.webkitExitFullscreen();
//     }
//   }
// });

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

//HANDLING PIXEL RATIO for perfect render in difewrent devices.
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // handeling up to two pixel ratio

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
