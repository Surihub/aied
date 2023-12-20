import {mockWithVideo} from '../../libs/camera-mock';
const THREE = window.MINDAR.FACE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    mockWithVideo('../../assets/mock-videos/face1.mp4');

    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
    const material = new THREE.MeshBasicMaterial( {color: 0x00ffff, transparent: true, opacity: 0.5} );
    const sphere = new THREE.Mesh( geometry, material );

    const anchor = mindarThree.addAnchor(1);
    anchor.group.add(sphere);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
