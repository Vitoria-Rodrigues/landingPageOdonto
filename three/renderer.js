import * as THREE from 'three';
// It's better practice to import addons from the 'three/addons/' path
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import TWEEN from 'tween';
// Get the div element from the DOM
const rendererDiv = document.getElementById('rendererDiv');

// Check if the div exists before proceeding
if (rendererDiv) {
    let coin, scene, camera, renderer;
    let animationInterval
    function init() {
        // Scene and Camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(10, rendererDiv.clientWidth / rendererDiv.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 10); // Moved camera back a bit to see the model better

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Use a brighter ambient light
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 3); // Add a directional light for shadows/highlights
        directionalLight.position.set(5, 10, 7.5);
        scene.add(directionalLight);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        // Set the initial size
        renderer.setSize(rendererDiv.clientWidth, rendererDiv.clientHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        
        // Append the renderer's canvas to the div
        rendererDiv.appendChild(renderer.domElement);

        // GLTF Loader
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
            'https://res.cloudinary.com/deqmqcdww/image/upload/v1756767584/coin_idib0y.glb',
            function (gltf) {
                coin = gltf.scene;
                coin.scale.set(8, 8, 8); // Scaled up the coin to make it more visible
                scene.add(coin);
                    startRotationAnimation(); 
                    
                    // Set an interval to trigger the animation every 5 seconds
                    animationInterval = setInterval(startRotationAnimation, 5000);
            },
            undefined, // We don't need the progress function to start the animation
            function (error) {
                console.error('An error happened while loading the model:', error);
            }
        );

        // **FIX 1: Add the event listener for resizing**
        window.addEventListener('resize', onWindowResize);
    }

    function onWindowResize() {
        // **FIX 2: Use clientWidth/clientHeight for the div**
        // A div doesn't have innerWidth/innerHeight, those are for the window object
        const width = rendererDiv.clientWidth;
        const height = rendererDiv.clientHeight;

        // Update camera aspect ratio
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // Update renderer size
        renderer.setSize(width, height);
    }

    function animate() {
        requestAnimationFrame(animate);

        // **FIX 3: Check if the 'coin' model has loaded before trying to rotate it**
        // Also corrected the typo from 'icon' to 'coin'
        // if (coin) {
        //     coin.rotation.y += 0.007;
        // }
        if(TWEEN) TWEEN.update()
        renderer.render(scene, camera);
    }

    // Initialize and start the animation loop
    init();
    // **FIX 4: The animation loop should be started here, once, after setup.**
    animate();

    function startRotationAnimation() {
        // Ensure model is loaded before trying to animate
        if (!coin) return;

        // The target rotation is the current rotation + a full circle (360 degrees)
        const targetRotation = { y: coin.rotation.y + Math.PI * 2 };

        // Create a new Tween
        new TWEEN.Tween(coin.rotation)
            .to(targetRotation, 1500) // Animate to the target in 1.5 seconds (1500 ms)
            .easing(TWEEN.Easing.Quadratic.InOut) // Use a smooth easing function
            .start(); // Start the tween
    }

} else {
    console.error("The div with ID 'rendererDiv' was not found.");
}