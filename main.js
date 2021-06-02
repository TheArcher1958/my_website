import './style.css'

import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'


const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 200);
const controls = new OrbitControls(camera, renderer.domElement);


controls.enableZoom = false;
controls.autoRotateSpeed = 5;
controls.autoRotate = true;
camera.position.setZ(-0.5);
camera.position.setX(-1.5);
camera.position.setY(1.5)
controls.update();



renderer.render(scene, camera);


const loader = new GLTFLoader();

loader.load( '/model/cafe/scene.gltf', function ( gltf ) {
gltf.scene.position.x = 1
    gltf.scene.position.z = 0.95
    scene.add( gltf.scene );

    animate();

}, undefined, function ( error ) {

    console.error( error );

} );

var mixer;
function _LoadAnimatedModel() {
    const loader = new FBXLoader();
    loader.setPath('model/');
    loader.load('malcolm.fbx', (fbx) => {
        fbx.scale.setScalar(0.0045);
        fbx.traverse(c => {
            c.castShadow = true;
        });

        const anim = new FBXLoader();
        anim.setPath('model/');
        anim.load('dance.fbx', (anim) => {
            const m = new THREE.AnimationMixer(fbx);
            mixer = m;
            const idle = m.clipAction(anim.animations[0]);
            idle.play();
        });
        scene.add(fbx);
        fbx.position.x = 0
        fbx.position.y = 0.06
        fbx.position.z = 0
        fbx.rotation.y = -2.9


    });
}
_LoadAnimatedModel();


const citygeo = new THREE.PlaneGeometry( 7, 7, 62 );
const cityTexture = new THREE.TextureLoader().load('model/bgim.jpg')
const materialcity = new THREE.MeshStandardMaterial( {map: cityTexture, side: THREE.DoubleSide} );
const city = new THREE.Mesh( citygeo, materialcity );
scene.add(city);
city.position.x = 3
city.position.z = 0.35
city.position.y = 1.5
city.rotation.y = -1.57


const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);



const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

scene.add(pointLight);

document.body.onscroll = () => {
    animate()
}



function animate() {

    controls.update();

    renderer.render( scene, camera );
}

function animateothers() {

    requestAnimationFrame( animateothers );

    mixer.update(0.015)

    renderer.render( scene, camera );
}

animateothers()

