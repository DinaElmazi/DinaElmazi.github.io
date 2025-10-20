import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

//Model List
const models = [
    { name: 'Damian', thumb: 'models/Damian/thumbnail.png' },
    { name: 'Pig', thumb: 'models/Pig/thumbnail.png' },
    { name: 'Apple', thumb: 'models/Apple/thumbnail.png' },
    { name: 'Orange', thumb: 'models/Orange/thumbnail.png' },
    { name: 'FruitCrate', thumb: 'models/FruitCrate/thumbnail.png' }
];

//Variables
const gallery = document.querySelector(".Gallery");
const modal = document.querySelector(".Modal3D");
const modalCloser = document.querySelector(".modalCloser");
const animButtons = document.querySelector(".AnimationControls");

let camera, scene, renderer, mixer;
let clock= new THREE.Clock();

// Build Thumbnail Gallery
models.forEach((model) => {
  const img = document.createElement('img');
  img.src = model.thumb;
  img.alt = model.name;
  img.className="Thumb3D";
  gallery.appendChild(img);
  img.addEventListener('click', () => init(model));
});

//Initializer
function init(model) {
  const basePath = `models/${model.name}/`;
  const fileName = `${model.name}.gltf`;

  //Show Modal
  modal.style.display = "flex";

  // Clear any previous renderers if modal was opened before
  modal.querySelectorAll('canvas').forEach(c => c.remove());

  // Camera Setup
  camera = new THREE.PerspectiveCamera(45, modal.clientWidth / modal.clientHeight, 0.1, 100);
  camera.position.set(1.5, 4, 9);

  // Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x303030);

  // Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(modal.clientWidth, modal.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  modal.appendChild(renderer.domElement);

  // Orbit Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.update();
  controls.addEventListener('change', render);

  // Model Loading
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('jsm/libs/draco/gltf/');
  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  loader.setPath(basePath);
  loader.load(fileName, (gltf) => {
    scene.add(gltf.scene);
    if (gltf.animations && gltf.animations.length) {
    //Clear & Setup
    animButtons.innerHTML = "";
    mixer = new THREE.AnimationMixer(gltf.scene);

    //Loop for each clip found
    gltf.animations.forEach((clip) => {
      // Animation Button Creation
      const btn = document.createElement('button');
      btn.textContent = clip.name;
      btn.dataset.clip = clip.name;
      btn.classList.add("AnimButton");
      animButtons.appendChild(btn);

      // Anim Button Event Listener
      btn.addEventListener('click', () => {
        mixer.stopAllAction();
        const action = mixer.clipAction(clip);
        action.reset();
        action.setLoop(THREE.LoopRepeat); // <- loop forever
        action.play();
      });
    });
    }
    if (gltf.animations.length==0){animButtons.innerHTML = "";};

    render();
  }, undefined, (error) => {
    console.error(`Error loading model "${model.name}":`, error);
  });

  // Resizing Handler
  window.addEventListener('resize', () => {
    camera.aspect = modal.clientWidth / modal.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modal.clientWidth, modal.clientHeight);
    render();
  });

  // Scene Render Call
  function render() {
    if (mixer) mixer.update(clock.getDelta());
    renderer.render(scene, camera);
  }

  // ModaL Closer
  modalCloser.addEventListener('click', () => {
    modal.style.display = "none";
    renderer.dispose();
    modal.querySelectorAll('canvas').forEach(c => c.remove());
  });

  renderer.setAnimationLoop(render);
}