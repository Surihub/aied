import {loadGLTF} from "../../libs/loader.js";
import {mockWithVideo} from '../../libs/camera-mock';
const THREE = window.MINDAR.FACE.THREE;

const capture = (mindarThree) => {
  const {video, renderer, scene, camera} = mindarThree;
  const renderCanvas = renderer.domElement;

  // output canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = renderCanvas.width;
  canvas.height = renderCanvas.height;

  const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.clientWidth;
  const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight / video.clientHeight;
  const sw = video.videoWidth - sx * 2; 
  const sh = video.videoHeight - sy * 2; 

  context.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  
  renderer.preserveDrawingBuffer = true;
  renderer.render(scene, camera); // empty if not run
  context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height);
  renderer.preserveDrawingBuffer = false;

  const data = canvas.toDataURL('image/png');

  const link = document.createElement('a');
  link.download = 'photo.png';
  link.href = data;
  link.click();
}

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

    document.querySelector("#capture").addEventListener("click", () => {
      capture(mindarThree);
    });

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
