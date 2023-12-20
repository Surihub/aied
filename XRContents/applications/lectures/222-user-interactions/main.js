import {loadGLTF, loadAudio} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/musicband.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const raccoon = await loadGLTF('../../assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);
    raccoon.scene.userData.clickable = true

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(raccoon.scene);

    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audio = await loadAudio('../../assets/sounds/musicband-drum-set.mp3');
    sound.setBuffer(audio);

    document.body.addEventListener('click', (e) => {
      // normalize to -1 to 1
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      const mouse = new THREE.Vector2(mouseX, mouseY);
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
	let o = intersects[0].object; 
	while (o.parent && !o.userData.clickable) {
	  o = o.parent;
	}
	if (o.userData.clickable) {
	  if (o === raccoon.scene) {
	    sound.play();
	  }
	}
      }
    });

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }
  start();
});
