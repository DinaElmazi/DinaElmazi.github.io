import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Models list — add as many as you want
const models = [
  { name: 'robot', path: 'models/robot/model.gltf', thumb: 'models/robot/thumbnail.jpg' },
  { name: 'dancer', path: 'models/dancer/model.gltf', thumb: 'models/dancer/thumbnail.jpg' },
  { name: 'car', path: 'models/car/model.gltf', thumb: 'models/car/thumbnail.jpg' }
];

// DOM elements
const gallery = document.getElementById('gallery');
const modal = document.getElementById('viewer-modal');
const viewer = document.getElementById('viewer');
const closeBtn = document.getElementById('close-btn');
const animButtons = document.getElementById('animation-buttons');

let scene, camera, renderer, controls, mixer, clock;

// Build gallery
models.forEach((model) => {
  const img = document.createElement('img');
  img.src = model.thumb;
  img.alt = model.name;
  img.addEventListener('click', () => openViewer(model));
  gallery.appendChild(img);
});

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, viewer.clientWidth / viewer.clientHeight, 0.1, 100);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  viewer.innerHTML = '';
  viewer.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1, 0);

  clock = new THREE.Clock();
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta());
  controls.update();
  renderer.render(scene, camera);
}

function openViewer(model) {
  modal.classList.remove('hidden');
  initScene();

  const loader = new GLTFLoader();
  loader.load(model.path, (gltf) => {
    const modelObj = gltf.scene;
    modelObj.traverse((child) => {
      if (child.isMesh) {
        // Ensure unlit yet textured material
        child.material = new THREE.MeshBasicMaterial({ map: child.material.map });
      }
    });

    scene.add(modelObj);

    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(modelObj);
      createAnimationButtons(gltf.animations);
    }
  });
}

function createAnimationButtons(animations) {
  animButtons.innerHTML = '';
  animations.forEach((clip) => {
    const btn = document.createElement('button');
    btn.textContent = clip.name;
    btn.addEventListener('click', () => {
      mixer.stopAllAction();
      mixer.clipAction(clip).reset().play();
    });
    animButtons.appendChild(btn);
  });
}

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  if (renderer) {
    renderer.dispose();
  }
  animButtons.innerHTML = '';
});