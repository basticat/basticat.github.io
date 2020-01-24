var mouse = new THREE.Vector2();
var amouse = new THREE.Vector2();

var scene = new THREE.Scene();
//setting canvas size
var camera = new THREE.OrthographicCamera(window.innerWidth/ -2, window.innerWidth/2, window.innerHeight/2, window.innerHeight/ -2, .01, 1000);
//renderer.setSize(window.innerWidth, window.innerHeight);
var canvas = document.getElementById("boyCanvas");
var renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("boyContainer").appendChild(renderer.domElement);

var bodyMaterial = new THREE.MeshBasicMaterial({color: 0xAC885B});
var darkMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
function Boy(pos){
    var body = new THREE.Mesh(new THREE.SphereGeometry(50,32,32), bodyMaterial);
    var leftEye = new THREE.Mesh(new THREE.SphereGeometry(8,12,12), darkMaterial);
    leftEye.position.set(22.8,12.5,44);
    var rightEye = new THREE.Mesh(new THREE.SphereGeometry(8,12,12), darkMaterial);
    rightEye.position.set(-22.8,12.5,44);
    var mouth = new THREE.Mesh(new THREE.CylinderGeometry(16,16,64,16), darkMaterial);
    mouth.position.z += 18
    mouth.rotation.x += Math.PI/2;
    this.object = new THREE.Object3D();
    this.object.position.set(pos.x, pos.y, pos.z);
    this.position = this.object.position;

    this.object.add(body);
    this.object.add(leftEye);
    this.object.add(rightEye);
    this.object.add(mouth);

    this.time = 0;

    this.lookOffset = 0;

    this.update = function(){
        this.time += .02;
        this.object.position.y = this.position.y + Math.sin(this.time) * .2;
        this.object.lookAt(new THREE.Vector3(mouse.x, mouse.y, camera.position.z + this.lookOffset));
    }
}

scene.background = new THREE.Color(0xCCA669);
scene.fog = new THREE.Fog( 0xCCA669, 200, 1000);
camera.position.z += 750;

var boys = [];
boys.push(new Boy(new THREE.Vector3(0,-250,0)));
boys.push(new Boy(new THREE.Vector3(-600,256,0)));
boys.push(new Boy(new THREE.Vector3(512,0,0)));
boys[0].time = 1;
boys[0].lookOffset = -250;
boys[1].object.scale.set(9,9,9);
boys[2].object.scale.set(4,4,4);
for(var i = 0, len = boys.length; i < len; i++){
    scene.add(boys[i].object);
}
var geometry = new THREE.BoxGeometry(32,32,32);
var geometry2 = new THREE.BoxGeometry(24,24,24);
var material = new THREE.MeshNormalMaterial();
var box = new THREE.Mesh(geometry, material);
var box2 = new THREE.Mesh(geometry2, material);
var obj = new THREE.Object3D();
box2.position.x += 8;
scene.add(obj);

//update
var render = function(){
    requestAnimationFrame(render)
    renderer.render(scene, camera);
    mouse = lerp(mouse, amouse, .1)
    for(var i = 0, len = boys.length; i < len; i++){
        boys[i].update();
    }
    boys[0].update();
}

function onMouseMove( event ) {
	amouse.x = ( event.clientX) - window.innerWidth/2;
	amouse.y = - ( event.clientY) + window.innerHeight/2;
}

function onMouseDown( event ) {
    console.log("press");
	if(event.button == 0){
        camera.position.z += 2;
    }
    if(event.button == 2){
        camera.position.z -= 2;
    }
}

window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mousedown', onMouseDown, false );
render();

function lerp(i,f,t){
    return new THREE.Vector2(i.x + t * (f.x - i.x),i.y + t * (f.y - i.y));
}
