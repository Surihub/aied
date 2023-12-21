import {loadTexture} from "../../libs/loader.js";
const THREE = window.MINDAR.FACE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    // initialize MindAR 
    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body
    });
    const {renderer, scene, camera} = mindarThree;

     // start AR
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });

    const video = mindarThree.video;
  }
  start();
});
