import {loadGLTF, loadVideo} from "../../libs/loader.js";
import {mockWithVideo} from '../../libs/camera-mock';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    mockWithVideo('../../assets/mock-videos/course-banner1.mp4');
    
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/course-banner.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const video = await loadVideo("../../assets/videos/guitar-player.mp4");
    const texture = new THREE.VideoTexture(video);

    const geometry = new THREE.PlaneGeometry(1, 1080/1920);
    const material = new THREE.MeshBasicMaterial({map: texture});
    
    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      video.play();
    }
    anchor.onTargetLost = () => {
      video.pause();
    }

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
