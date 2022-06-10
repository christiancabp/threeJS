import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";
import gsap from "gsap"; //npm i gsap@3.5.1

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#5162db",
};

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor);
  particlesMaterial.color.set(parameters.materialColor);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Texture
 */

const textureLoader = new THREE.TextureLoader();
const gradiantTexture = textureLoader.load("textures/gradients/5.jpg");
gradiantTexture.magFilter = THREE.NearestFilter;

/**
 * Objects
 */

//  MATERIAL    MeshToonMaterial

const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradiantTexture,
});

const objectsDistance = 4;

const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);

mesh1.position.y = -objectsDistance * 0;
mesh2.position.y = -objectsDistance * 1;
mesh3.position.y = -objectsDistance * 2;

mesh1.position.x = 2;
mesh2.position.x = -2;
mesh3.position.x = 2;

// TEMPORARY POSITION EXAMPLE
// mesh1.position.y = 2;
// mesh1.scale.set(0.5, 0.5, 0.5);

// mesh2.visible = false;

// mesh3.position.y = -2;
// mesh3.scale.set(0.5, 0.5, 0.5);

scene.add(mesh1, mesh2, mesh3);

const sectionMeshes = [mesh1, mesh2, mesh3];

/**
 * Particles
 */

// Geometry
const count = 200;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  // Creating random coordinates
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
  positions[i * 3 + 1] =
    objectsDistance * 0.5 -
    Math.random() * objectsDistance * sectionMeshes.length;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
});

//Particles
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#ffffff");
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);

gui.add(directionalLight, "intensity").min(0).max(2).step(0.001);
gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);

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
 * Scroll
 */

let scrollY = window.scrollY;
// Creating Spin
let currentSection = 0;

window.addEventListener("scroll", () => {
  //   console.log(scrollY);
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);
  if (newSection != currentSection) {
    currentSection = newSection;
    console.log("Section: ", currentSection);

    // Green Sock Animation
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    });
  }
});

/**
 * Cursor
 */

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  //   console.log("mouse moved!");
  //   console.log(event.clientX);
  cursor.x = event.clientX / sizes.width - 0.5; //getting numbers from -0.5 to +0.5
  cursor.y = event.clientY / sizes.height - 0.5;

  //   console.log(cursor);
});

/**
 * Camera
 */
// Group
const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
// renderer.setClearAlpha(1); //1 =black 0 = white
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

  // ANIMATE CAMERA
  camera.position.y = (-scrollY / sizes.height) * objectsDistance;
  //uses the height of our window and the distance between the objects
  const parallaxX = cursor.x * 0.5;
  const parallaxY = -cursor.y * 0.5;
  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 5 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 5 * deltaTime;

  // ANIMATE OBJECTS
  for (const mesh of sectionMeshes) {
    mesh.rotation.x += deltaTime * 0.1;
    mesh.rotation.y += deltaTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();