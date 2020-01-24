var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight,.1,1000);
var material = new THREE.LineDashedMaterial( {
	color: 0x00ffff,
	linewidth: 1,
	scale: 1,
	dashSize: 3,
	gapSize: 1,
} );
var geometry = new THREE.Geometry();

geometry.vertices.push(new THREE.Vector3(-30, 0, 0));
geometry.vertices.push(new THREE.Vector3(0, 30, 0));
geometry.vertices.push(new THREE.Vector3(30, 0, 0));
geometry.vertices.push(new THREE.Vector3(-30, 0, 0));

var line = new THREE.Line(geometry, material);

document.body.appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0,0,100);
camera.lookAt(new THREE.Vector3(0,0,0));

scene.add(line);

scene.background = new THREE.Color( 0xff0000 );

var render = function () {
  requestAnimationFrame( render );
  line.rotation.y += .01;
  line.rotation.x += .01;
  renderer.render( scene, camera );
};

render();
