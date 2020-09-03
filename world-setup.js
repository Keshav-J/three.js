// ******* Declarations ********

var render, scene, camera, controls;
var textureLoader, cubeTextures, gridTexture;
var gridHelper, gridGeometry;
var raycaster, mouse;
var geometry, material, plane;

var objects = [];                                   // Contains all objects
var grid = [], gridCnt = 30;
const cubeSide = 50, minHeight = 50, maxHeight = 150;
const origin = -(cubeSide * (gridCnt/2)) + (cubeSide / 2);

var prev_pos = {x: -1, z: -1};
var isClicked = false;

// ***** Utility Functions *****

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomCubeTexture(cubeTextures) {
    return cubeTextures[Math.floor(Math.random() * cubeTextures.length)];
}

function getDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function toggleCell() {
    if(!isClicked) return;
    
    raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObjects(objects);
    
    if(intersects.length > 0) {
        var intersect = intersects[0];
        
        var cur = new THREE.Vector3(0, 0, 0);
    
        if(intersect.object !== plane) cur.copy(intersect.object.position).add(intersect.face.normal);
        else                           cur.copy(intersect.point).add(intersect.face.normal);
        
        cur.divideScalar(cubeSide).floor().multiplyScalar(cubeSide);
        
        // If current position is not previous position
        if(prev_pos.z != (gridCnt/2 + cur.z/cubeSide) || prev_pos.x != (gridCnt/2 + cur.x/cubeSide)) {
            if(intersect.object !== plane) {
                // Clearing existing Cube/Building
        
                grid[gridCnt/2 + cur.z/cubeSide][gridCnt/2 + cur.x/cubeSide]
                    .material.color.set(0xffffff);
                
                intersect.object.material.side = 0;
                
                scene.remove(intersect.object);
                objects.splice(objects.indexOf(intersect.object), 1);
            }
            else {
                // Creating new Cube/Building
                
                const cubeHeight = getRandomInteger(minHeight, maxHeight);
                var cubeGeometry = new THREE.BoxBufferGeometry(cubeSide, cubeHeight, cubeSide);
                var cubeMaterial = new THREE.MeshBasicMaterial({map: getRandomCubeTexture(cubeTextures)});
                var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        
                grid[gridCnt/2 + cur.z/cubeSide][gridCnt/2 + cur.x/cubeSide]
                    .material.color.set(0xffffff);
                
                cube.position.copy(cur);
        
                cube.position.x += cubeSide / 2;
                cube.position.y += cubeHeight / 2;
                cube.position.z += cubeSide / 2;
        
                scene.add(cube);
                objects.push(cube);
            }
            prev_pos = {x: gridCnt/2 + cur.x/cubeSide, z: gridCnt/2 + cur.z/cubeSide};
        }
    }
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
    textureLoader.load('./textures/building.jpg'),
    textureLoader.load('./textures/building2.jpg'),
    textureLoader.load('./textures/building3.jpg')
];
gridTexture = textureLoader.load('./textures/ground.png');

// --------- Grid Helper --------

gridHelper = new THREE.GridHelper(1500, gridCnt, 0x5c78bd, 0x5c78bd);
scene.add(gridHelper);
gridHelper.position.y = 0.2; // 0.15;

// ------------ Grid ------------

gridGeometry = new THREE.PlaneBufferGeometry(cubeSide, cubeSide);

for(var row=0 ; row<gridCnt ; ++row) {
    grid.push([]);
    for(var col=0 ; col<gridCnt ; ++col) {
        var cell = new THREE.Mesh(gridGeometry, new THREE.MeshBasicMaterial({color: 0xffffff, map: gridTexture}));
        
        cell.rotateX( - Math.PI/2 );
        cell.position.set(origin + col*cubeSide, 0, origin + row*cubeSide);
        
        grid[row].push(cell);
        scene.add(cell);
    }
}

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
camera.position.set(0, 2000, 0);
camera.lookAt(0, 0, 0);

// ****** Event Listeners ******

addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

addEventListener('mousemove', () => {
    mouse.set((event.clientX / window.innerWidth) * 2 - 1,
                - (event.clientY / window.innerHeight) * 2 + 1);
});

addEventListener('mousedown', (event) => {
    event.preventDefault();

    isClicked = true;
});

addEventListener('mouseup', (event) => {
    event.preventDefault();

    isClicked = false;
    prev_pos = {x: -1, z: -1};
});

// ------ Animate Function ------

function animate() {
    requestAnimationFrame( animate );
    
    toggleCell();
    
	renderer.render(scene, camera);
}

animate();