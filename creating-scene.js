var scene = new THREE.Scene();
var PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// var StereoCamera = new THREE.StereoCamera();

var camera = PerspectiveCamera;
var cameraSpeed = {x: 0, y: 0};

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Utillity Math functions
function max(a, b) {return Math.max(a, b)};
function min(a, b) {return Math.min(a, b)};

// Event Listeners
addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
});

addEventListener('mousewheel', (event) => {
    if(event.deltaY == 100)
        camera.position.z = Math.min(1000, camera.position.z*1.2);
    else if(event.deltaY == -100)
        camera.position.z = Math.max(1, camera.position.z*0.8);
});

addEventListener('keydown', (event) => {
    if(event.key == "ArrowLeft") cameraSpeed.x = -0.5;
    else if(event.key == "ArrowRight") cameraSpeed.x = 0.5;
    else if(event.key == "ArrowUp") cameraSpeed.y = 0.5;
    else if(event.key == "ArrowDown") cameraSpeed.y = -0.5;
});
addEventListener('keyup', (event)=>{
    if(event.key == "ArrowLeft" || event.key == "ArrowRight")
        cameraSpeed.x = 0;
    else if(event.key == "ArrowUp" || event.key == "ArrowDown")
        cameraSpeed.y = 0;
});

// Utility

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 20;

function updateCameraPosition() {
    camera.position.x += cameraSpeed.x;
    camera.position.y += cameraSpeed.y;
}


function animate() {
    requestAnimationFrame(animate);

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    updateCameraPosition();

    renderer.render(scene, camera);
}

animate();

document.body.appendChild(renderer.domElement);