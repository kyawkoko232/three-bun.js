import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import './style.css';


// Scene
 const canvas = document.querySelector('canvas.webgl');

 const scene = new THREE.Scene();


let fragmentShader = `
 uniform float uTime;
 varying vec3 vPosition;

 void main() {
     vec3 color = vec3(0.0);

     // Rainbow colors based on time
     color.r = abs(sin(uTime));
     color.g = abs(sin(uTime + 1.57)); // Offset for green
     color.b = abs(sin(uTime + 3.14)); // Offset for blue

     gl_FragColor = vec4(color, 1.0);
 }
`;

// Define the vertex shader
let vertexShader = `
 varying vec3 vPosition;

 void main() {
     vPosition = position;
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
 }
`;



//Mesh
const cubeGeometry = new THREE.BoxGeometry(1,1,1);
var cubeMaterial = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0.0 } // Time uniform
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
});

const cubeMesh = new THREE.Mesh(
    cubeGeometry,
    cubeMaterial
)

scene.add(cubeMesh);


//camera
const camera = new THREE.PerspectiveCamera(75, 
 window.innerWidth / window.innerHeight,
 0.1,
 100
);
scene.add(camera)
camera.position.z = 5;

//render
const renderer = new THREE.WebGLRenderer({
    canvas : canvas
});
renderer.setSize(window.innerWidth , window.innerHeight )


window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth , window.innerHeight );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})



//control
const control = new OrbitControls(camera,canvas);
control.enableDamping;

const clock = new THREE.Clock()
let currentTime = 0;


const renderLoop = () => {
 
    cubeMaterial.uniforms.uTime.value += 0.08;
    
    cubeMesh.rotation.x += 0.01;
    cubeMesh.rotation.y += 0.01;
    const elapsedTime = clock.getElapsedTime()
    let time2  = currentTime / elapsedTime;
    // console.log(time2)
    window.requestAnimationFrame(renderLoop);
    renderer.render(scene, camera)

    control.update()
    
}

renderLoop()





