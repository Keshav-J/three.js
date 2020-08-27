var scene = new THREE.Scene();
var PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1000);
// var StereoCamera = new THREE.StereoCamera();

var camera = PerspectiveCamera;
camera.position.set(0, 25, 100);

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
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

var lonSpeed = 0, latSpeed = 0;
addEventListener('keydown', (event) => {
    if(event.key == "a") lonSpeed = 1;
    else if(event.key == "d") lonSpeed = -1;
    else if(event.key == "w") latSpeed = 1;
    else if(event.key == "s") latSpeed = -1;
});
addEventListener('keyup', (event) => {
    if(event.key == "a" || event.key == "d") lonSpeed = 0;
    else if(event.key == "w" || event.key == "s") latSpeed = 0;
});


// Camera movement

var lon = 0, lat = 0;
var phi = 0, theta = 0;
cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 256, {
    format: THREE.RGBFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
    encoding: THREE.sRGBEncoding // temporary -- to prevent the material's shader from recompiling every frame
} );
cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('wheel', onDocumentMouseWheel, false);

function onDocumentMouseDown(event) {
    event.preventDefault();
    
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    
    onPointerDownLon = lon;
    onPointerDownLat = lat;
    
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
}
function onDocumentMouseMove(event) {
    lon = (event.clientX - onPointerDownPointerX) * 0.1 + onPointerDownLon;
    lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
}
function onDocumentMouseUp() {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
}
function onDocumentMouseWheel(event) {
    var fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.MathUtils.clamp( fov, 10, 75 );
    camera.updateProjectionMatrix();
}

// Utility

const surfaceDimensions = {height: 100, width: 100};
var geometry = new THREE.PlaneGeometry(100, 100, 20, 30);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide});
var surface = new THREE.Mesh(geometry, material);
surface.rotation.x = -1.57;

scene.add(surface);

var gridHelper = new THREE.GridHelper(100, 20);
scene.add(gridHelper);

function updateCameraPosition() {
    lon += lonSpeed;
    lat += latSpeed;
}

function animate() {
    requestAnimationFrame(animate);

    updateCameraPosition();

    // lon += .15;

    lat = Math.max( - 85, Math.min( 85, lat ) );
    phi = THREE.MathUtils.degToRad( 90 - lat );
    theta = THREE.MathUtils.degToRad( lon );

    camera.position.x = 100 * Math.sin( phi ) * Math.cos( theta );
    camera.position.y = 100 * Math.cos( phi );
    camera.position.z = 100 * Math.sin( phi ) * Math.sin( theta );

    camera.lookAt(cubeCamera.position);

    renderer.render(scene, camera);
}

animate();

document.body.appendChild(renderer.domElement);