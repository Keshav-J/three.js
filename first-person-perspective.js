// Renderer

var renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene

var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xcceeff );
scene.fog = new THREE.Fog(0xffffff, 0, 750);

// Textures

var textureLoader = new THREE.TextureLoader();

var cubeTexture = textureLoader.load( 'textures/building.jpg' );

var surfaceTexture = textureLoader.load('textures/ground.png');
surfaceTexture.wrapS = surfaceTexture.wrapT = THREE.RepeatWrapping;
surfaceTexture.repeat.set(20, 20);
surfaceTexture.anisotropy = Math.max(1, renderer.getMaxAnisotropy());

// Surface

const surfaceDimensions = {height: 100, width: 100};
var geometry = new THREE.PlaneGeometry(surfaceDimensions.height, surfaceDimensions.width);
var material = new THREE.MeshBasicMaterial({map: surfaceTexture});

var surface = new THREE.Mesh(geometry, material);
surface.rotation.x = -(Math.PI / 2);
surface.receiveShadow = true;

var gridHelper = new THREE.GridHelper(100, 20, 0x5c78bd, 0x5c78bd);
gridHelper.position.z = 0;
gridHelper.rotation.x = -(Math.PI / 2);

surface.add(gridHelper);

// Cube

const cubeDimensions = {side: 5, height: 10}
var cubeGeometry = new THREE.BoxGeometry(cubeDimensions.side, cubeDimensions.side, cubeDimensions.height);
var cubeMaterial = new THREE.MeshBasicMaterial({map: cubeTexture});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// cube.position.set(-47.5, 47.5, 5.001);
cube.position.set(2.5, 2.5, 5.001);

surface.add(cube);

scene.add(surface);

// Outer Sphere

var sphereGeometry = new THREE.SphereGeometry(1000, 64, 64);
var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

scene.add(sphere);

// Camera

var camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 10000);
// var controls = new THREE.OrbitControls(camera, renderer.domElement);
// var controls = new THREE.FirstPersonControls(camera, renderer.domElement);
var controls = new THREE.PointerLockControls(camera, document.body);

var moveForward = 0;
var moveRight = 0;
var resetForward = false;
var resetRight = false;

camera.position.y = 2;

scene.add(controls.getObject());

// Event Listeners

addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // controls.handleResize();
});

addEventListener('click', () => {
    controls.lock();
}, false);


// addEventListener

addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'w': case 'ArrowUp': case 's': case 'ArrowDown': resetForward = false; break;
        case 'a': case 'ArrowLeft': case 'd': case 'ArrowRight': resetRight = false; break;
    }
    switch(event.key) {
        case 'w': case 'ArrowUp'   : moveForward = 0.2;  break;
        case 's': case 'ArrowDown' : moveForward = -0.2; break;
        case 'd': case 'ArrowRight': moveRight = 0.2;    break;
        case 'a': case 'ArrowLeft' : moveRight = -0.2;   break;
        case ' ': dHeight = 0.5; break;
    }
});

addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'w': case 'ArrowUp': case 's': case 'ArrowDown': resetForward = true; break;
        case 'a': case 'ArrowLeft': case 'd': case 'ArrowRight': resetRight = true; break;
    }
});

// Animate Function

function animate() {
	requestAnimationFrame( animate );

    // controls.update();
    
    if(resetForward){
        if(moveForward > 0) moveForward = Math.max(0, moveForward-0.01);
        else if(moveForward < 0) moveForward = Math.min(0, moveForward+0.01);
        else resetForward = false;
    }
    if(resetRight){
        if(moveRight > 0) moveRight = Math.max(0, moveRight-0.01);
        else if(moveRight < 0) moveRight = Math.min(0, moveRight+0.01);
        else resetRight = false;
    }
    
    controls.moveForward(moveForward);
    controls.moveRight(moveRight);
    
	renderer.render(scene, camera);
}

animate();