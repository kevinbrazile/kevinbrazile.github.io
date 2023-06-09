import * as THREE from './three.module.js';
import {
    OrbitControls
} from './OrbitControls.js';
import {
    GLTFLoader
} from './GLTFLoader.js';
import {
    RGBELoader
} from './RGBELoader.js';

let camera, scene, renderer;

init();
render();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(20, 7, 2.7);
    scene = new THREE.Scene();
    new RGBELoader()
        .load('environment.hdr', function(texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
            render();

            // model
            const loader = new GLTFLoader();
            loader.load('myworld.gltf', function(gltf) {
                scene.add(gltf.scene);
                render();
            });
        });

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    //controls.enableDamping = true;   //damping 
    //controls.dampingFactor = 0.1;   //damping inertia
    controls.minDistance = 12;
    controls.maxDistance = 16;
    controls.target.set(0, 0, -0.2);
    controls.maxPolarAngle = 1.3;
    controls.minPolarAngle = 1.1;

    controls.keys = {
        LEFT: 'ArrowLeft', //left arrow
        UP: 'ArrowUp', // up arrow
        RIGHT: 'ArrowRight', // right arrow
        BOTTOM: 'ArrowDown' // down arrow
    }

    controls.update();
    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

//
function render() {
    renderer.render(scene, camera);
}