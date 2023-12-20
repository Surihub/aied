const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: '../../assets/targets/course-banner.mind',
    });
    const {renderer, scene, camera} = mindarThree;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.5});
    const plane = new THREE.Mesh(geometry, material);

    const material2 = new THREE.MeshBasicMaterial({color: 0xff0000, transparent: true, opacity: 0.5});
    const plane2 = new THREE.Mesh(geometry, material2);
    plane2.visible = false;

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);
    anchor.group.add(plane2);

    const model = await handpose.load();

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
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

      const detected = predictions.length > 0;
      plane2.visible = detected;
      plane.visible = !detected;

      window.requestAnimationFrame(detect);
    }
    window.requestAnimationFrame(detect);


  }
  start();
});
