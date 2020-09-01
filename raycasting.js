// ******* Declarations ********

var render, scene, camera, controls;
var textureLoader, cubeTextures, gridHelper;
var raycaster, mouse;
var geometry, material, plane;

var objects = [];                                   // Contains all objects
var mousePos = {x: undefined, y: undefined};        // Mouse (browser) coordintes

// ***** Utility Functions *****

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomCubeTexture(cubeTextures) {
    return cubeTextures[Math.floor(Math.random() * cubeTextures.length)];
}

function isSamePosition(x1, y1, x2, y2) {
    return (x1 == x2) && (y1 == y2);
}

// ---------- Renderer ----------

renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ----------- Scene ------------

scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf0f0f0 );

// ---------- Textures ----------

textureLoader = new THREE.TextureLoader();
cubeTextures = [
    textureLoader.load('textures/building.jpg'),
    textureLoader.load('textures/building2.jpg'),
    textureLoader.load('textures/building3.jpg')
];

// ------------ Grid ------------

gridHelper = new THREE.GridHelper(1500, 30);
scene.add(gridHelper);

// ---------- RayCaster ---------

raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

// ----------- Plane ------------

geometry = new THREE.PlaneBufferGeometry(1500, 1500);
geometry.rotateX( - Math.PI/2 );
material = new THREE.MeshBasicMaterial({visible: false});

plane = new THREE.Mesh(geometry, material);

scene.add(plane);
objects.push(plane);

// ---------- Camera ------------

camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 10000);
camera.position.set(500, 800, 1500);
camera.lookAt(0, 0, 0);

// --------- Controls -----------

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;      // Smooth release

// ****** Event Listeners ******

addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

addEventListener('mousemove', () => {
    mousePos.x = event.clientX;
    mousePos.y = event.clientY;
});

addEventListener('click', (event) => {
    event.preventDefault();

    mouse.set((event.clientX / window.innerWidth) * 2 -1,
                - (event.clientY / window.innerHeight) * 2 + 1);
    
    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(objects);

    if(intersects.length > 0 && isSamePosition(mousePos.x, mousePos.y, event.clientX, event.clientY)) {
        var intersect = intersects[0];

        if(intersect.object !== plane) {
            // Clearing existing Cube/Building

            scene.remove(intersect.object);
            objects.splice(objects.indexOf(intersect.object), 1);
        }
        else {
            // Creating new Cube/Building
            
            const minHeight = 50, maxHeight = 150;
            const cubeDimensions = {side: 50, height: getRandomInteger(minHeight, maxHeight)};
            
            var cubeGeometry = new THREE.BoxBufferGeometry(cubeDimensions.side, cubeDimensions.height, cubeDimensions.side);
            var cubeMaterial = new THREE.MeshBasicMaterial({map: getRandomCubeTexture(cubeTextures)});
            var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.position.copy(intersect.point).add(intersect.face.normal);
            cube.position.divideScalar(cubeDimensions.side).floor().multiplyScalar(cubeDimensions.side);

            cube.position.x += cubeDimensions.side / 2;
            cube.position.y += cubeDimensions.height / 2;
            cube.position.z += cubeDimensions.side / 2;

            scene.add(cube);
            objects.push(cube);
        }
    }
});

// ------ Animate Function ------

function animate() {
	requestAnimationFrame(animate);

	controls.update();

	renderer.render(scene, camera);
}

animate();