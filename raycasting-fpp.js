// ******* Declarations ********

var render, scene, camera, controls;
var textureLoader, cubeTextures, gridTexture;
var gridHelper, gridGeometry;
var raycaster, mouse;
var geometry, material, plane;

var objects = [];
var grid = [], gridCnt = 30;
const cubeSide = 50, minHeight = 50, maxHeight = 150;
const origin = -(cubeSide * (gridCnt/2)) + (cubeSide / 2);
const minCameraHeight = 20;

// ***** Utility Functions *****

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomCubeTexture(cubeTextures) {
    return cubeTextures[Math.floor(Math.random() * cubeTextures.length)];
}

function addBuilding() {
    const cubeHeight = getRandomInteger(minHeight, maxHeight);
    var cubeGeometry = new THREE.BoxBufferGeometry(cubeSide, cubeHeight, cubeSide);
    var cubeMaterial = new THREE.MeshBasicMaterial({map: getRandomCubeTexture(cubeTextures)});
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    var x, y;
    do {
        x = getRandomInteger(0, gridCnt-1);
        y = getRandomInteger(0, gridCnt-1);
    } while(grid[x][y].material.color.equals(new THREE.Color(0x5c78bd)));
    
    grid[x][y].material.color.set(0x5c78bd);
        
    cube.position.x = origin + y * cubeSide;
    cube.position.y = 0.1 + cubeHeight / 2;
    cube.position.z = origin + x * cubeSide;

    scene.add(cube);
    objects.push(cube);
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

raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);
mouse = new THREE.Vector2();

// ------- Fire Building --------

for(var i=0 ; i<10 ; ++i)
    addBuilding();
console.log(objects);


// ----------- Plane ------------

geometry = new THREE.PlaneBufferGeometry(1500, 1500);
geometry.rotateX( - Math.PI/2 );
material = new THREE.MeshBasicMaterial({visible: false});

plane = new THREE.Mesh(geometry, material);

scene.add(plane);

// ---------- Camera ------------

camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 10000);
camera.position.x = 10;
camera.position.y = minCameraHeight + 10;

// --------- Controls -----------

controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());
controls.minPolarAngle = Math.PI/2;
controls.maxPolarAngle = Math.PI/2;


// ****** Event Listeners ******

addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

addEventListener('click', () => {
    controls.lock();
}, false);

addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'w': case 'ArrowUp': case 's': case 'ArrowDown': resetForward = false; break;
        case 'a': case 'ArrowLeft': case 'd': case 'ArrowRight': resetRight = false; break;
    }
    switch(event.key) {
        case 'w': case 'ArrowUp'   : moveForward = Math.min(5, Math.max(3, moveForward) + 0.1);  break;
        case 's': case 'ArrowDown' : moveForward = Math.max(-5, Math.min(-3, moveForward) - 0.1);  break;
        case 'd': case 'ArrowRight': moveRight = Math.min(5, Math.max(3, moveRight) + 0.1);  break;
        case 'a': case 'ArrowLeft' : moveRight = Math.max(-5, Math.min(-3, moveRight) - 0.1);  break;
        case ' ': if(!isJumped) dHeight = 50;
                    isJumped = true;
                    break;
    }
});

addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'w': case 'ArrowUp': if(moveForward > 0) resetForward = true; break;
        case 's': case 'ArrowDown': if(moveForward < 0) resetForward = true; break;
        case 'd': case 'ArrowRight': if(moveRight > 0) resetRight = true; break;
        case 'a': case 'ArrowLeft': if(moveRight < 0) resetRight = true; break;
    }
});

addEventListener('mousedown', (event) => {
    if(controls.isLocked) {
        switch(event.button) {
            case 0: case 2: resetForward = false; break;
        }
        switch(event.button) {
            case 0: moveForward = 10;  break;
            case 2: moveForward = -10; break;
        }
    }
});

addEventListener('mouseup', (event) => {
    switch(event.button) {
        case 0: if(moveForward > 0) resetForward = true; break;
        case 2: if(moveForward < 0) resetForward = true; break;
    }
});

addEventListener('mousemove', (event) => {
    mouse.set((event.clientX / window.innerWidth) * 2 - 1,
                - (event.clientY / window.innerHeight) * 2 + 1);
    
    isLocked = false;
    console.log(camera.rotation);
});

// ------ Movement Physics ------

var moveForward = 0;
var moveRight = 0;
var resetForward = false;
var resetRight = false;

const gravity = -10;
const friction = 0.25;
var isJumped = false;
var dHeight = 0;

var prev_time = 0;
var cur_time = (new Date()).getTime();

var isLocked = false;

function updateHeight() {
    prev_time = cur_time;
    cur_time = (new Date()).getTime();
    
    var dt = Math.min(0.15, cur_time - prev_time);
    
    camera.position.y += dHeight * dt + 0.5 * gravity * dt * dt;
    dHeight += gravity * dt;
}

// ------ Animate Function ------

var counter = -1;
function animate() {
    counter++;
    requestAnimationFrame( animate );
    
    raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObjects(objects);
    
    if(!isJumped && resetForward){
        if(moveForward > 0) moveForward = Math.max(0, moveForward - friction);
        else if(moveForward < 0) moveForward = Math.min(0, moveForward + friction);
        else resetForward = false;
    }
    if(!isJumped && resetRight){
        if(moveRight > 0) moveRight = Math.max(0, moveRight - friction);
        else if(moveRight < 0) moveRight = Math.min(0, moveRight + friction);
        else resetRight = false;
    }
    
    if(intersects.length == 0 && !isLocked){
        controls.moveForward(moveForward / (1 + 1.5 * isJumped));
        controls.moveRight(moveRight / (1 + 1.5 * isJumped));
    }
    else
        console.log(intersects);
    
    updateHeight();
    
        
    if(camera.position.y < minCameraHeight) {
        camera.position.y = minCameraHeight;
        dHeight = 0;
        isJumped = false;
    }

	renderer.render(scene, camera);
}

animate();