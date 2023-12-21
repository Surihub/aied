// reference: https://github.com/stspanho/aframe-hit-test

AFRAME.registerComponent('ar-reticle', {
  init: function () {
    this.xrHitTestSource = null;
    this.viewerSpace = null;
    this.refSpace = null;

    this.el.sceneEl.renderer.xr.addEventListener('sessionend', (ev) => {
      this.viewerSpace = null;
      this.refSpace = null;
      this.xrHitTestSource = null;
    });

    this.el.sceneEl.renderer.xr.addEventListener('sessionstart', (ev) => {
      let session = this.el.sceneEl.renderer.xr.getSession();

      let element = this.el;
      session.addEventListener('select', function () {
	let position = element.getAttribute('position');
	document.getElementById('box').setAttribute('position', position);
	document.getElementById('box').setAttribute('visible', true);
      });

      session.requestReferenceSpace('viewer').then((space) => {
	this.viewerSpace = space;
	session.requestHitTestSource({space: this.viewerSpace}).then((hitTestSource) => {
	  this.xrHitTestSource = hitTestSource;
	});
      });

      session.requestReferenceSpace('local').then((space) => {
	this.refSpace = space;
      });
    });
  },

  tick: function () {
    if (this.el.sceneEl.is('ar-mode')) {
      if (!this.viewerSpace) return;

      let frame = this.el.sceneEl.frame;
      let xrViewerPose = frame.getViewerPose(this.refSpace);

      if (this.xrHitTestSource && xrViewerPose) {
	let hitTestResults = frame.getHitTestResults(this.xrHitTestSource);
	if (hitTestResults.length > 0) {
	  let pose = hitTestResults[0].getPose(this.refSpace);

	  let inputMat = new THREE.Matrix4();
	  inputMat.fromArray(pose.transform.matrix);

	  let position = new THREE.Vector3();
	  position.setFromMatrixPosition(inputMat);
	  this.el.setAttribute('position', position);
	  this.el.setAttribute('visible', true);
	} else {
	  this.el.setAttribute('visible', false);
	}
      }
    }
  }
});
