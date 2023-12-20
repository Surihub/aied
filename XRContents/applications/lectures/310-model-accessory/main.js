import {loadGLTF} from "../../libs/loader.js";
import {mockWithVideo} from '../../libs/camera-mock';
const THREE = window.MINDAR.FACE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    mockWithVideo('../../assets/mock-videos/face1.mp4');

    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const glasses = await loadGLTF('../../assets/models/glasses1/scene.gltf');
    glasses.scene.scale.set(0.01, 0.01, 0.01);

    const anchor = mindarThree.addAnchor(168);
    anchor.group.add(glasses.scene);

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
