console.log(THREE);
//4 ELEMENTS TO GET STARTED

//1. A Scene
const scene = new THREE.Scene();

//2. Create Some objects: we call it Mesh..
//this is a red cube

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: "red" });
const cube = new THREE.Mesh(geometry, material);
cube.rotation.y = -0.5;
cube.rotation.x = 1;

//Adding to scene
scene.add(cube);

//3. Create a camera (point of view)
const sizes = {
  //for AspectRatio
  width: 800,
  height: 600,
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height); //(fieldOfViewInDegres, aspectRatio) Aspect ratio = width/height
camera.position.z = 10;
// camera.rotation.x = 2;
//Adding to scene
scene.add(camera);

//4. Render
const canvas = document.querySelector(".webgl");

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
