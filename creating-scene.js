var renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var scene = new THREE.Scene();

const surfaceDimensions = {height: 100, width: 100};
var geometry = new THREE.PlaneGeometry(100, 100, 20, 30);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
var surface = new THREE.Mesh(geometry, material);
surface.rotation.x = -1.57;

var cubeGeometry = new THREE.BoxGeometry(5, 5, 10);
var cubeMaterial = new THREE.MeshBasicMaterial({color: 0xff00000});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0, 5.001);
surface.add(cube);

var gridHelper = new THREE.GridHelper(100, 20);
gridHelper.rotation.x = -1.57;
surface.add(gridHelper);

scene.add(surface);


var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

var controls = new THREE.OrbitControls( camera, renderer.domElement );

//controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();

function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();
	cube.rotation.z += 0.05;

	renderer.render( scene, camera );

}

animate();