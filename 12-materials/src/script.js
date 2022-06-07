import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AmbientLight } from "three";
import * as dat from "dat.gui";

/**
 * Debug
 */
const gui = new dat.GUI();

//Loading Texture

const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const doorColorTexture = textureLoader.load("/textures//door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures//door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures//door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures//door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures//door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "/textures//door/Metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "/textures//door/roughness.jpg"
);
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false; //always good practice after using min filter nearest filter

// environment textures

const environmentTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects      // Materials
 */

// MESH BASIC MATERIAL

// const material = new THREE.MeshBasicMaterial({
//   map: doorColorTexture,
// });
// or material.map = door.ColorTexture

// Changing colors PLAY
// material.color.set("purple");
// material.color = new THREE.Color(0xff00ff);

// material.wireframe = true;

// Changing opacity must write both
// material.opacity = 0.5;
// material.transparent = true;

// Must write transparent = true
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;

// Make image double sided for the back of the plane
// material.side = THREE.DoubleSide;

// MESH NORMAL MATERIAL     used for lighting, reflection, refraction

// const material = new THREE.MeshNormalMaterial();

// material.wireframe = true;

// Changing opacity must write both
// material.opacity = 0.5;
// material.transparent = true;

// Flat shading
// material.flatShading = true;

// Make image double sided for the back of the plane
// material.side = THREE.DoubleSide;

// MESH MATCAP MATERIAL // for uploading materials

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// MESH LAMBER MATERIAL    //Material that reacts to light.

// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();

// material.shininess = 200;
// material.specular = new THREE.Color("blue");

// MESH TOON MATERIAL;      //Toon like material

// const material = new THREE.MeshToonMaterial();

// material.gradientMap = gradientTexture;

// MESH STANDARD MATERIAL    //better material reacts to light and has metalness and roughness
// this material uses PBR Phisically based rendering meaning the objects act with real phisics properties

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;

// Adding textures overlapping
// material.map = doorColorTexture; // main

// adding shados with second texture need uv2
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 2;

// adding depth ( relieves )
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05; // Needs a low scale so that the

// adding metalness, roughness and normal to have better dedails
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture; //needs to set scale for better results
// material.normalScale.set(0.5, 0.5);

// now for the  final texture to simply set our door
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

// ENVIRONMENT MAP

material.envMap = environmentTexture;

gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material);
// gui.add(material, "aoMapIntensity").min(0).max(3).step(0.001);
// gui.add(material, "displacementScale").min(0).max(1).step(0.0001);
gui.add(material, "wireframe");

// MESH PHISICAL MATERIAL

// we wont try this one but it basically is the same as ^ but it adds a clear coat on the outside to give it a special shiny effect

// POINTS MATERIAL

// We use this for particles

// SHADER MATERIAL AND RAW SHADER MATERIAL

// Also will be covered later

// Creating 3 Mehes

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

// For aoMap
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 50, 50), material);

// For aoMap
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Light
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);

scene.add(ambientLight, pointLight);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

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

  //update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.1 * elapsedTime;
  plane.rotation.x = 0.1 * elapsedTime;
  torus.rotation.x = 0.1 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
