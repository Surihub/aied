import * as THREE from '../../libs/three.js-r132/build/three.module.js';
import {ARButton} from '../../libs/three.js-r132/examples/jsm/webxr/ARButton.js';

document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const geometry = new THREE.BoxBufferGeometry(0.06, 0.06, 0.06); 
    const material = new THREE.MeshPhongMaterial({color: 0x00ff00});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -0.3);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({alpha: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.addEventListener("sessionstart", (e) => {
      console.log("session start");
    });
    renderer.xr.addEventListener("sessionend", () => {
      console.log("session end");
    });
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    //이 방법이 간단하지만, 앞선 예제가 원리를 이해하기에는 좋음
    const arButton = ARButton.createButton(renderer, {optionalFeatures: ['dom-overlay'], domOverlay: {root: document.body}}); 
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(arButton);
  }

  initialize();
});
