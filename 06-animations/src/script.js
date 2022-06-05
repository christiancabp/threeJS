import "./style.css";
import * as THREE from "three";
import gsap from "gsap";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

//ANIMATION
//USING GSAP no tick nedded
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 });
gsap.to(mesh.position, { duration: 1, delay: 2, x: 0 });

//USING DELTATIME
// let time = Date.now();

//Clock
const clock = new THREE.Clock();

const tick = () => {
  //   console.log("tick");

  //update objects intro
  //   mesh.rotation.x += 0.02;       //dependant on FPS
  //   mesh.rotation.y -= 0.03;
  //   mesh.rotation.z += 0.01;

  //USING DELTATIME
  //   const currentTime = Date.now();
  //   const deltaTime = currentTime - time;
  //   time = currentTime;
  //   console.log(deltaTime); // time between ticks in milliseconds

  //   mesh.rotation.x += 0.001 * deltaTime; //independant of FSP in clients cpu
  //   mesh.rotation.y += 0.001 * deltaTime;

  //USING CLOCK
  const elapsedTime = clock.getElapsedTime(); //independant of FSP built in method
  //   console.log(elapsedTime);
  mesh.rotation.x = elapsedTime;
  mesh.rotation.y = elapsedTime * Math.PI * 2; // 1 rev per second
  //   camera.position.x = Math.cos(elapsedTime * 2);
  //   camera.position.y = Math.sin(elapsedTime * 2);
  //   camera.lookAt(mesh.position);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
