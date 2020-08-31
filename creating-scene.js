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
surface.rotation.x = -1.57;
surface.receiveShadow = true;

var gridHelper = new THREE.GridHelper(100, 20, 0x5c78bd, 0x5c78bd);
gridHelper.position.z = 0.04;
gridHelper.rotation.x = -1.57;

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
var controls = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.set(0, 150, 0);
controls.update();
controls.enableDamping = true;      // Smooth release


function animate() {
	requestAnimationFrame( animate );

	controls.update();

	renderer.render(scene, camera);
}

animate();