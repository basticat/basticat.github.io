paper.install(window);
//VARIABLES
//scale of lines
var scale = 8;
//radius
var curveSize = 10;
var sectionWidth = curveSize*4;
//default strokeColor
var stroke = 'white';
var strokeWidth = 3;
var circleSpacing = 14;

//colors
var colorAwake = "#FDA959";
var colorSleep = "#81DEFB"

//symbols
var eyeOpen;
var eyeClosed;
var testSymbol;
var ts;

//setup
var width = data.length * sectionWidth + data.length * curveSize;
var height = 0;
for(var i = 0; i < data.length-1; i++){
	height += data[i]['wakeTime']*scale;
	height -= data[i]['sleepTime']*scale;
}
height += scale*50;

//start point
var startPoint = new Point(100,height)
var currentPoint = startPoint;

var sections = [];
//contains all parts of a day
class Section{
	constructor(start, dataObject){
		this.active = false;
		this.points = [];
		this.newSegments = [];
		this.awakeHours = dataObject['wakeTime'];
		this.asleepHours = dataObject['sleepTime'];
		this.startPoint = new Point(start);
		let nextPoint = new Point(currentPoint.x, currentPoint.y - this.awakeHours*scale);
		//awakePath
		this.awakePath = new Path.Line(this.startPoint,nextPoint)
		this.awakePath.style = {
			strokeColor: colorAwake,
			strokeWidth: strokeWidth
		}
		currentPoint = nextPoint;
		//upCurve
		nextPoint = new Point(currentPoint.x+curveSize*2, currentPoint.y);
		let arcMidPoint = new Point(currentPoint.x+curveSize, currentPoint.y-curveSize);
		this.upCurve = new Path.Arc(currentPoint, arcMidPoint ,nextPoint)
		this.upCurve.style = {
			strokeColor:{
	        gradient: {
	            stops: [colorAwake, colorSleep]
	        },
	        origin: currentPoint,
	        destination: nextPoint
		  },
			strokeWidth:strokeWidth
		};
		currentPoint = nextPoint;
		//gym cicle
		// this.gym = new Path.Circle([currentPoint.x-curveSize,currentPoint.y],curveSize-circleSpacing);
		// this.gym.style = {
		// 	strokeColor:'purple',
		// 	strokeWidth:strokeWidth
		// };
		// if(dataObject['gym'] == "TRUE"){
		// 	this.gym.fillColor = 'purple';
		// }
		//sleepPath
		nextPoint = new Point(currentPoint.x, currentPoint.y + this.asleepHours*scale);
		this.sleepPath = new Path.Line(currentPoint,nextPoint)
		this.sleepPath.style = {
			strokeColor:colorSleep,
			strokeWidth:strokeWidth
		};
		currentPoint = nextPoint;
		//downCurve
		nextPoint = new Point(currentPoint.x+curveSize*2, currentPoint.y);
		arcMidPoint = new Point(currentPoint.x+curveSize, currentPoint.y+curveSize);
		this.downCurve = new Path.Arc(currentPoint,arcMidPoint,nextPoint);
		this.downCurve.style = {
			strokeColor: {
	        gradient: {
	            stops: [colorSleep, colorAwake]
	        },
        origin: currentPoint,
        destination: nextPoint
	    },
			strokeWidth: strokeWidth
		}
		currentPoint = nextPoint;

		this.textStyle = {
			fontFamily: 'Montserrat',
			fontWeight: '200',
			fontSize: 16,
			fillColor: 'white',
			leading: this.fontSize * 1.8
		}

		this.awakeIcon = eyeOpen.clone();
		this.awakeIcon.position = new Point(this.awakePath.segments[1].point.add([-20,0]));
		this.awakeText = new PointText();
		this.awakeText.position = this.awakeIcon.position.add([-20,8]);
		this.awakeText.style = this.textStyle;
		this.awakeText.justification = "right";
		this.awakeText.content = this.awakeHours + " hrs";
		this.sleepIcon = eyeClosed.clone();
		this.sleepIcon.position = new Point(this.sleepPath.segments[0].point.add([20,2]));
		this.sleepText = new PointText();
		this.sleepText.point = this.sleepIcon.position.add([20,5]);
		this.sleepText.style = this.textStyle;
		this.sleepText.justification = "left";
		this.sleepText.content = this.asleepHours + " hrs";

		this.endPoint = new Point(nextPoint);

		this.group = new Group();
		this.group.addChild(this.awakePath);
		this.group.addChild(this.sleepPath);
		this.group.addChild(this.upCurve);
		this.group.addChild(this.downCurve);
		this.group.addChild(this.awakeIcon);
		this.group.addChild(this.sleepIcon);
		//this.group.addChild(this.awakeText);
		//this.group.addChild(this.sleepText);
		this.textPosition = [];
		this.textPosition.push(new Point(this.awakeText.point));
		this.textPosition.push(this.sleepText.point);

		this.oPos = new Point(this.group.position);
		//this.oPos = new Point(0,0);

		this.opacity = 0;
		this.SetOpacity = function(opacity){
			this.opacity = opacity;
			this.awakeIcon.opacity = this.opacity;
			this.sleepIcon.opacity = this.opacity;
			this.awakeText.fillColor.alpha = this.opacity;
			this.sleepText.fillColor.alpha = this.opacity;
		}
		this.SetOpacity(0);

	}
	update(){

	}
	offset(amount){
		if(this.active){
			let t = .2;
			this.SetOpacity(lerpNum(this.opacity,1,.1));
			this.group.position = lerp(this.group.position,this.oPos.add(amount),t);
			this.awakeText.point = lerp(this.awakeText.point,this.textPosition[0].add(amount),t);
			this.sleepText.point = lerp(this.sleepText.point,this.textPosition[1].add(amount),t);
		}else{

			this.active = true;
		}
	}
	onset(amount){
		if(!this.active){
			let t = .2;
			this.SetOpacity(lerpNum(this.opacity,0,.1));
			this.group.position = lerp(this.group.position,this.oPos,t);
			this.awakeText.point = lerp(this.awakeText.point,this.textPosition[0],t);
			this.sleepText.point = lerp(this.sleepText.point,this.textPosition[1],t);
		}else{

			this.active = false;
		}
	}
}

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

	//eye.position = eye.position.add(new Point(100,0));
	var lineIndex = 0;

	paper.view.viewSize = [width, height];
	document.getElementById("myCanvas").width = width;
	document.getElementById("myCanvas").height = height;

	let eyeScale = .2;
	eyeClosed = new Raster(document.getElementById("eyeClosed"));
	eyeClosed.scale(eyeScale);
	eyeOpen = new Raster(document.getElementById("eyeOpen"));
	eyeOpen.scale(eyeScale);
	setup();
	eyeOpen.remove();
	eyeClosed.remove();

	function setup(){
		//GENERATE CHART
		for(var i = 0; i < data.length; i++){
			sections.push(new Section(currentPoint,data[i]));
		}

		// Create a Paper.js Path to draw a line into it:
		var path = new Path();
		segs = [];


		var nextPoint = new Point(currentPoint.x, 0);
		var ln = new Path.Line(currentPoint,nextPoint);
		ln.strokeColor = colorAwake;
		ln.strokeWidth = strokeWidth;
		segs.push(ln);


		var mouse = new Point(0,0);

		// var mouseLine = new Path();
		// mouseLine.strokeColor = 'white';
		// mouseLine.opacity = .5;
		// var mouseLineTop = new Point(100,0)
		// var mouseLineBottom = new Point(100,height)
		// mouseLine.add(mouseLineTop);
		// mouseLine.add(mouseLineBottom);

		//text
		//default text style
		let textStyle = {
			fontFamily: 'Montserrat',
			fontWeight: '200',
			fontSize: 20,
			fillColor: 'white',
			justification: 'left',
			leading: this.fontSize * 1.8
		}

		var textData = new PointText([120, 50]);
		textData.content = 'date';
		textData.style = textStyle;

		var tool = new Tool();

		view.onFrame = function(event){
			// mouseLine.segments[0].point.x = mouse.x;
			// mouseLine.segments[1].point.x = mouse.x;
			//highlight.segments[1].point.x = mouse.x;
			//highlight.segments[2].point.x = mouse.x;
			for (var i = 0; i < sections.length; i++) {
				if(i == lineIndex){
					sections[i].offset(new Point(0,-scale*30));
				}else {
					sections[i].onset(new Point(0,scale*30));
				}
			}
		}

		tool.onMouseMove = function(event) {
			mouse = event.point;
			if(mouse.x == 0) mouse.x = 1;
			lineIndex = Math.max(0,Math.floor((mouse.x-startPoint.x)/sectionWidth));

			//text
			textData.content = data[lineIndex]["data"];
			textData.point = [mouse.x+20,mouse.y+25];
		}
	}
}
