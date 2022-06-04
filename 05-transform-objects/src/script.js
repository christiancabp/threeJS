import "./style.css";
import * as THREE from "three";
import { AxesHelper, Group } from "three";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
//Group of objects
const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

group.add(mesh);

const cube2 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: "blue" })
);
cube2.position.x = -1;
group.add(cube2);

const cube3 = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: "green" })
);
cube3.position.x = 2;
group.add(cube3);

group.rotation.z = -1;

// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = -1;
mesh.position.set(0.7, -0.6, -1); //same as 3 previous lines

console.log(mesh.position.length()); //1.3601470508735443
// mesh.position.normalize(); //to make vector = 1

//AXES HELPER  l__
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

//Scale
mesh.scale.set(2, 0.5, 0.5);

//Rotation
mesh.rotation.y = Math.PI * 0.25;

/**
 * Sizes
 */
const sizes = {
  width: 800,
  height: 600,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
camera.position.x = 1;
camera.position.y = 1;
scene.add(camera);

camera.lookAt(mesh.position);
console.log(mesh.position.distanceTo(camera.position)); //4.104875150354759

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
