var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// Event Listeners
addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
});

addEventListener('mousewheel', function(event) {
    if(event.deltaY == 100)
        camera.position.z = Math.min(100, camera.position.z*1.2);
    else if(event.deltaY == -100)
        camera.position.z = Math.max(1, camera.position.z*0.8);
});

// Utility

var geometry = new THREE.BoxGeometry();
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 20;

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

document.body.appendChild(renderer.domElement);