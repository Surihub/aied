import {loadGLTF} from '../applications/libs/loader.js';
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded',() => {
    const start = async () => {

        // initialize MindAR 
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: './target.mind',
          });
        const {renderer, scene, camera} = mindarThree;

        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);
        
        const gltf = await loadGLTF('./3dModel/cylinderSample.gltf');
        gltf.scene.scale.set(0.3, 0.3, 0.3);
        gltf.scene.position.set(0, 0, 0.5);
        gltf.scene.rotation.set(Math.PI/2, 0, 0);


        const Anchor = mindarThree.addAnchor(0);
        Anchor.group.add(gltf.scene);
        
        //gltf.animations
        const mixer = new THREE.AnimationMixer(gltf.scene);
        const action = mixer.clipAction(gltf.animations[0]); //첫 번째 애니메이션 실행
        action.setLoop(THREE.LoopOnce); // Set the animation to play only once
        const targetTime = gltf.animations[0].duration;

        const clock = new THREE.Clock();

        //Button Operation 추가
        const foldButton = document.querySelector("#fold");
        const unfoldButton = document.querySelector("#unfold");
        const pauseButton = document.querySelector("#pause");

        //타겟을 찾으면 button이 보이게
        Anchor.onTargetFound = () => {
            // console.log("전개도 확인")
            foldButton.style.display = "inline";
            pauseButton.style.display = "inline";
            action.play();
            mixer.timeScale = 0;
        };

        Anchor.onTargetLost = () => {
            // console.log("전개도 확인")
            foldButton.style.display = "none";
            unfoldButton.style.display = "none";
            pauseButton.style.display = "none";
        };

        foldButton.addEventListener('click', ()=>{
            //console.log("fold button clicked")
            action.play()
            unfoldButton.style.display = "inline";
            foldButton.style.display = "none";
            mixer.timeScale = 1;
        }); 

        unfoldButton.addEventListener('click', ()=>{
            //console.log("unfold button clicked")
            unfoldButton.style.display = "none";
            foldButton.style.display = "inline";
            mixer.timeScale = -1;
        }) ;

        pauseButton.addEventListener('click', ()=>{
            if (mixer) {
                mixer.timeScale = 0; // Pauses the animation
            }
            // console.log(gltf.animations[0]);
            // console.log(mixer._actions[0].time-targetTime);
            //console.log(mixer._actions[0].time);
        })

        //Touch Interaction 추가해보기
        // // Variable to store initial touch position
        // let touchStartX = 0;

        // // Touch start event handler
        // const onTouchStart = (event) => {
        //     touchStartX = event.touches[0].clientX;
        // };

        // // Touch move event handler
        // const onTouchMove = (event) => {
        //     const touchX = event.touches[0].clientX;
        //     const deltaX = touchX - touchStartX;
        
        //     // Adjust rotation based on touch movement
        //     const rotationSpeed = 0.01;
        //     gltf.scene.rotation.y += deltaX * rotationSpeed;
        
        //     touchStartX = touchX;
        // };

        // // Add touch event listeners
        // renderer.domElement.addEventListener('touchstart', onTouchStart);
        // renderer.domElement.addEventListener('touchmove', onTouchMove);
        

        // start AR
        await mindarThree.start();
        renderer.setAnimationLoop(()=>{
            const delta = clock.getDelta();
            //gltf.scene.rotation.set(0, gltf.scene.rotation.y+delta, 0); //3D 모델에 내장된 애니메이션은 아니고, 코드에서 직접 애니메이션 효과를 주는 방식 애니메이션이라기 보다는 움직이는 효과 정도?
            mixer.update(delta); //애니메이션 매 프레임마다 불러오기
            renderer.render(scene, camera);
            //console.log(mixer)
            if (mixer.timeScale === 1){
                if (Math.abs(mixer._actions[0].time-targetTime) < 0.05 ) {
                    mixer.timeScale = 0;
                };
            } else if (mixer.timeScale === -1){
                if (mixer._actions[0].time < 0.05  ) {
                    mixer.timeScale = 0;
                };
            }
        });
    }
    start();

    
});