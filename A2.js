/*
 * UBC CPSC 314 2023W2
 * Assignment 2 Template
 */

import { setup, loadAndPlaceGLB } from "./js/setup.js";
import * as THREE from "./js/three.module.js";
import { SourceLoader } from "./js/SourceLoader.js";
import { THREEx } from "./js/KeyboardState.js";

// Setup and return the scene and related objects.
// You should look into js/setup.js to see what exactly is done here.
const { renderer, scene, camera, worldFrame } = setup();

// Used THREE.Clock for animation
var clock = new THREE.Clock();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Initialize uniforms

// As in A1 we position the sphere in the world solely using this uniform
// So the initial y-offset being 1.0 here is intended.
const sphereOffset = { type: "v3", value: new THREE.Vector3(0.0, 1.0, 0.0) };

// Distance threshold beyond which the armadillo should shoot lasers at the sphere (needed for Q1c).
const LaserDistance = 10.0;

// Waving threshold distance
const waveDistance = 5.0;

// TODO: you may want to add more const's or var's to implement
// the armadillo waving its hand

// Materials: specifying uniforms and shaders
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    sphereOffset: sphereOffset,
  },
});

const eyeMaterial = new THREE.ShaderMaterial();

// TODO: make necessary changes to implement the laser eyes

// Load shaders.
const shaderFiles = [
  "glsl/sphere.vs.glsl",
  "glsl/sphere.fs.glsl",
  "glsl/eye.vs.glsl",
  "glsl/eye.fs.glsl",
];

new SourceLoader().load(shaderFiles, function (shaders) {
  sphereMaterial.vertexShader = shaders["glsl/sphere.vs.glsl"];
  sphereMaterial.fragmentShader = shaders["glsl/sphere.fs.glsl"];

  eyeMaterial.vertexShader = shaders["glsl/eye.vs.glsl"];
  eyeMaterial.fragmentShader = shaders["glsl/eye.fs.glsl"];
});

// TODO: Load and place the Armadillo geometry in GLB format
loadAndPlaceGLB("glb/armadillo.glb", function (armadillo) {
  armadillo.scene.position.set(0.0, 5.3, -8.0);
  armadillo.scene.rotation.y = Math.PI;
  armadillo.scene.scale.set(0.1, 0.1, 0.1);
  armadillo.scene.parent = worldFrame;
  scene.add(armadillo.scene);
});

// Create the main sphere geometry
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const sphereLight = new THREE.PointLight(0xffffff, 50.0, 100);
scene.add(sphereLight);

// Example for an eye ball
// TODO: Create two eye ball meshes from the same geometry
const eyeGeometry = new THREE.SphereGeometry(1.0, 32, 32);
const eyeScale = 0.5;

const leftEyeSocket = new THREE.Object3D();
const leftEyeSocketPos = new THREE.Vector3(0, 4, 0);
leftEyeSocket.position.copy(leftEyeSocketPos);

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.scale.copy(new THREE.Vector3(eyeScale, eyeScale, eyeScale));
leftEyeSocket.add(leftEye);

scene.add(leftEyeSocket);

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();

function checkKeyboard() {
  if (keyboard.pressed("W")) sphereOffset.value.z -= 0.1;
  else if (keyboard.pressed("S")) sphereOffset.value.z += 0.1;

  if (keyboard.pressed("A")) sphereOffset.value.x -= 0.1;
  else if (keyboard.pressed("D")) sphereOffset.value.x += 0.1;

  if (keyboard.pressed("E")) sphereOffset.value.y -= 0.1;
  else if (keyboard.pressed("Q")) sphereOffset.value.y += 0.1;

  // The following tells three.js that some uniforms might have changed.
  sphereMaterial.needsUpdate = true;
  eyeMaterial.needsUpdate = true;

  // Move the sphere light in the scene. This allows the floor to reflect the light as it moves.
  sphereLight.position.set(
    sphereOffset.value.x,
    sphereOffset.value.y,
    sphereOffset.value.z
  );
}

// Setup update callback
function update() {
  // TODO: make neccesary changes to implement gazing, the armadillo waving its hand, etc.
  checkKeyboard();

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
