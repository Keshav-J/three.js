var scene = new THREE.Scene();
var PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
// var StereoCamera = new THREE.StereoCamera();

var camera = PerspectiveCamera;
camera.position.y = 25;
camera.position.z = 100;

var cameraSpeed = {x: 0, y: 0};

// Renderer
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

var geometry = new THREE.PlaneGeometry(100, 100);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
var surface = new THREE.Mesh(geometry, material);
surface.rotation.x = -1.57;

scene.add(surface);

function updateCameraPosition() {
    camera.position.x += cameraSpeed.x;
    camera.position.y += cameraSpeed.y;
}


function animate() {
    requestAnimationFrame(animate);

    updateCameraPosition();

    renderer.render(scene, camera);
}

animate();

document.body.appendChild(renderer.domElement);