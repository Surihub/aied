import * as THREE from '../../libs/three.js-r132/build/three.module.js';
import {ARButton} from '../../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    const eventsDiv = document.querySelector("#events");

    const controller = renderer.xr.getController(0);
    controller.addEventListener('selectstart', () => {
      eventsDiv.prepend("selectstart \n");
    });
    controller.addEventListener('selectend', () => {
      eventsDiv.prepend("selectend \n");
    });
    controller.addEventListener('select', () => {
      eventsDiv.prepend("select \n");
    });

    const arButton = ARButton.createButton(renderer, {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}});
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);
  }

  initialize();
});
