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
  return data;
}

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    
    //mockWithVideo('../../assets/mock-videos/face1.mp4');

    const mindarThree = new window.MINDAR.FACE.MindARThree({
      container: document.body,
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    const light2 = new THREE.DirectionalLight(0xffffff, 0.6);
    light2.position.set(-0.5, 1, 1);
    scene.add(light);
    scene.add(light2);

    const occluder = await loadGLTF('../../assets/models/sparkar-occluder/headOccluder.glb');
    occluder.scene.scale.set(0.065, 0.065, 0.065);
    occluder.scene.position.set(0, -0.3, 0.15);
    occluder.scene.traverse((o) => {
      if (o.isMesh) {
	const occluderMaterial = new THREE.MeshPhongMaterial({colorWrite: false});
	o.material = occluderMaterial;
      }
    });
    occluder.scene.renderOrder = 0;

    const occluderAnchor = mindarThree.addAnchor(168);
    occluderAnchor.group.add(occluder.scene);

    const glasses = await loadGLTF('../../assets/models/glasses1/scene.gltf');
    glasses.scene.scale.set(0.01, 0.01, 0.01);
    glasses.scene.renderOrder = 1;
    const glassesAnchor = mindarThree.addAnchor(168);
    glassesAnchor.group.add(glasses.scene);

    const glasses2 = await loadGLTF('../../assets/models/glasses2/scene.gltf');
    glasses2.scene.rotation.set(0, -Math.PI/2, 0);
    glasses2.scene.position.set(0, -0.3, 0);
    glasses2.scene.scale.set(0.6, 0.6, 0.6);
    glasses2.scene.renderOrder = 1;
    const glasses2Anchor = mindarThree.addAnchor(168);
    glasses2Anchor.group.add(glasses2.scene);

    const hat1 = await loadGLTF('../../assets/models/hat1/scene.gltf');
    hat1.scene.position.set(0, 1, -0.5);
    hat1.scene.scale.set(0.35, 0.35, 0.35);
    hat1.scene.renderOrder = 1;
    const hat1Anchor = mindarThree.addAnchor(10);
    hat1Anchor.group.add(hat1.scene);

    const hat2 = await loadGLTF('../../assets/models/hat2/scene.gltf');
    hat2.scene.position.set(0, -0.2, -0.5);
    hat2.scene.scale.set(0.008, 0.008, 0.008);
    hat2.scene.renderOrder = 1;
    const hat2Anchor = mindarThree.addAnchor(10);
    hat2Anchor.group.add(hat2.scene);

    const earringLeft = await loadGLTF('../../assets/models/earring/scene.gltf');
    earringLeft.scene.position.set(0, -0.3, -0.3);
    earringLeft.scene.scale.set(0.05, 0.05, 0.05);
    earringLeft.scene.renderOrder = 1;
    const earringLeftAnchor = mindarThree.addAnchor(127);
    earringLeftAnchor.group.add(earringLeft.scene);

    const earringRight = await loadGLTF('../../assets/models/earring/scene.gltf');
    earringRight.scene.position.set(0, -0.3, -0.3);
    earringRight.scene.scale.set(0.05, 0.05, 0.05);
    earringRight.scene.renderOrder = 1;
    const earringRightAnchor = mindarThree.addAnchor(356);
    earringRightAnchor.group.add(earringRight.scene);

    const buttons = ["#glasses1", "#glasses2", "#hat1", "#hat2", "#earring"];
    const models = [[glasses.scene], [glasses2.scene], [hat1.scene], [hat2.scene], [earringLeft.scene, earringRight.scene]];
    const visibles = [true, false, false, true, true];

    const setVisible = (button, models, visible) => {
      if (visible) {
	button.classList.add("selected");
      } else {
	button.classList.remove("selected");
      }
      models.forEach((model) => {
	model.visible = visible;
      });
    }
    buttons.forEach((buttonId, index) => {
      const button = document.querySelector(buttonId);
      setVisible(button, models[index], visibles[index]);
      button.addEventListener('click', () => {
	visibles[index] = !visibles[index];
	setVisible(button, models[index], visibles[index]);
      });
    });

    const previewImage = document.querySelector("#preview-image");
    const previewClose = document.querySelector("#preview-close");
    const preview = document.querySelector("#preview");
    const previewShare = document.querySelector("#preview-share");

    document.querySelector("#capture").addEventListener("click", () => {
      const data = capture(mindarThree);
      preview.style.visibility = "visible";
      previewImage.src = data;
    });

    previewClose.addEventListener("click", () => {
      preview.style.visibility = "hidden";
    });

    previewShare.addEventListener("click", () => {
      const canvas = document.createElement('canvas');
      canvas.width = previewImage.width;
      canvas.height = previewImage.height;
      const context = canvas.getContext('2d');
      context.drawImage(previewImage, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
	const file = new File([blob], "photo.png", {type: "image/png"});
	const files = [file];
	if (navigator.canShare && navigator.canShare({files})) {
	  navigator.share({
	    files: files,
	    title: 'AR Photo',
	  })
	} else {
	  const link = document.createElement('a');
	  link.download = 'photo.png';
	  link.href = previewImage.src;
	  link.click();
	}
      });
    });

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
