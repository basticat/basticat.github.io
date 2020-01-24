paper.install(window);
//VARIABLES

console.log("hell");

//setup

function lerp(a,b,t){
	return new Point((1-t)*a.x+t*b.x,(1-t)*a.y+t*b.y);
}
function lerpNum(a,b,t){
	return (1-t)*a+t*b;
}

//ONLOAD
window.onload = function(){

	//setup
	var canvas = document.getElementById('myCanvas');
	paper.setup('myCanvas');
	paper.project.importSVG(document.getElementById('svg-import'),function(item, str){
		item.children[0].fillColor = "blue";
	});


	console.log("success?");

	function setup(){


		tool.onMouseMove = function(event) {

		}
	}
}
