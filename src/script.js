import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';

// Scene
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

// Vertex Shader
let vertexShader = `
 varying vec2 vUv;

 void main() {
     vUv = uv;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`;

// Fragment Shader
let fragmentShader = `
 uniform float uTime;
 varying vec2 vUv;

 void main() {
     vec3 color = vec3(0.0);

     // Different colors for each face based on uv.x
     color.r = abs(sin(uTime + vUv.x * 3.14));
     color.g = abs(sin(uTime + vUv.x * 3.14 + 1.57)); // Offset for green
     color.b = abs(sin(uTime + vUv.x * 3.14 + 3.14)); // Offset for blue

     gl_FragColor = vec4(color, 1.0);
 }
`;

// Mesh
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0.0 } // Time uniform
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
});

const cubeMesh = new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
);

scene.add(cubeMesh);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
scene.add(camera);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Controls
const control = new OrbitControls(camera, canvas);
control.enableDamping = true;

const clock = new THREE.Clock();

const renderLoop = () => {
    cubeMaterial.uniforms.uTime.value += 0.05;

    cubeMesh.rotation.x += 0.01;
    cubeMesh.rotation.y += 0.01;

    window.requestAnimationFrame(renderLoop);
    renderer.render(scene, camera);

    control.update();
};

renderLoop();
