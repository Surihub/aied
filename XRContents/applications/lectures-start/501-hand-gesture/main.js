import {loadGLTF} from "../../libs/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/robot.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
    scene.add(light);

    const robot = await loadGLTF('../../assets/models/robot/RobotExpressive.glb');
    robot.scene.scale.set(0.2, 0.2, 0.2);
    robot.scene.position.set(0, -0.2, 0);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(robot.scene);

    const mixer = new THREE.AnimationMixer(robot.scene);

    const model = await handpose.load();

      // start
    const clock = new THREE.Clock();
    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      const delta = clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    });

    const video = mindarThree.video;
    let skipCount = 0;
    const detect = async () => {
      if (skipCount < 10) {
	skipCount += 1;
	window.requestAnimationFrame(detect);
	return;
      }
      skipCount = 0;

      const predictions = await model.estimateHands(video);
      
      window.requestAnimationFrame(detect);
    };
    window.requestAnimationFrame(detect);
  }
  start();
});
