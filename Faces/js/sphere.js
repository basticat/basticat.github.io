//testing groups
var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight,.1,1000);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var material = new THREE.MeshNormalMaterial();
var geometry = new THREE.BoxGeometry(1,1,1);
var sphere = new THREE.Mesh(geometry, material);
var group = new THREE.Object3D();
group.add(camera);
camera.position.set(0,0,10);
scene.add(sphere);
scene.add(group);
var i = 0;
var render = function () {
  requestAnimationFrame( render );
  i += .01;
  sphere.position.x = Math.sin(i)*3;
  //camera.position.z = Math.cos(i);
  sphere.lookAt(camera.position);
  renderer.render( scene, camera );
};

function lerp(a, b, t){
    return a + ((b - a) * t);
}

render();
