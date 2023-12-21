import * as THREE from '../../libs/three.js-r132/build/three.module.js';

document.addEventListener('DOMContentLoaded', () => {
  const initialize = async() => {
    // build three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();

    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // create AR object
    const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06); 
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -0.3);
    scene.add(mesh);

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    renderer.xr.enabled = true;
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }

  initialize();
});
