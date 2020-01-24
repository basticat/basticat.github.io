//scale of lines
var scale = 3;
//radius
var curveSize = 5;
var sectionWidth = curveSize*4;
//default strokeColor
var stroke = 'white';
var strokeWidth = 1;
var circleSpacing = 3;

//colors
var colorAwake = "#FDA959";
var colorSleep = "#81DEFB"

//setup
var width = data.length * sectionWidth + data.length * curveSize;
var height = 0;
for(var i = 0; i < data.length-1; i++){
	height += data[i]['wakeTime']*scale;
	height -= data[i]['sleepTime']*scale;
}
height += 200;
//start point
var startPoint = new Point(50,height)
var currentPoint = startPoint;

paper.view.viewSize = [width, height];
document.getElementById("myCanvas").width = width;
document.getElementById("myCanvas").height = height;


// Create a Paper.js Path to draw a line into it:
var path = new Path();
segs = [];

for(var i = 0; i < data.length; i++){
	//upline
	var nextPoint = new Point(currentPoint.x, currentPoint.y - data[i]['wakeTime']*scale);
	var ln = new Path.Line(currentPoint,nextPoint);
	ln.strokeColor = colorAwake;
	ln.strokeWidth = strokeWidth;
	segs.push(ln);
	currentPoint = nextPoint;
	//up curve
	var nextPoint = new Point(currentPoint.x+curveSize*2, currentPoint.y);
	ln = new Path.Arc(currentPoint, new Point(currentPoint.x+curveSize, currentPoint.y-curveSize),nextPoint);
	ln.strokeColor = {
        gradient: {
            stops: [colorAwake, colorSleep]
        },
        origin: currentPoint,
        destination: nextPoint
    }
	ln.strokeWidth = strokeWidth;
	segs.push(ln);
	currentPoint = nextPoint;

	//gym cicle
	ln = Path.Circle([currentPoint.x-curveSize,currentPoint.y],curveSize-circleSpacing);
	ln.strokeColor = 'white';
	ln.strokeWidth = strokeWidth;
	if(data[i]['gym'] == "TRUE"){
		ln.fillColor = 'white';
	}
	//segs.add(ls);

	//down line
	nextPoint = new Point(currentPoint.x, currentPoint.y + data[i]['sleepTime']*scale);
	ln = new Path.Line(currentPoint,nextPoint);
	ln.strokeColor = colorSleep;
	ln.strokeWidth = strokeWidth;
	segs.push(ln);
	currentPoint = nextPoint;
	//down curve
	var nextPoint = new Point(currentPoint.x+curveSize*2, currentPoint.y);
	ln = new Path.Arc(currentPoint, new Point(currentPoint.x+curveSize, currentPoint.y+curveSize),nextPoint);
	ln.strokeColor = {
        gradient: {
            stops: [colorSleep, colorAwake]
        },
        origin: currentPoint,
        destination: nextPoint
    }
	ln.strokeWidth = strokeWidth;
	segs.push(ln);
	currentPoint = nextPoint;
}
var nextPoint = new Point(currentPoint.x, 0);
var ln = new Path.Line(currentPoint,nextPoint);
ln.strokeColor = colorAwake;
ln.strokeWidth = strokeWidth;
segs.push(ln);


var mouse = new Point(0,0);

var mouseLine = new Path();
mouseLine.strokeColor = 'white';
var mouseLineTop = new Point(100,0)
var mouseLineBottom = new Point(100,height)
mouseLine.add(mouseLineTop);
mouseLine.add(mouseLineBottom);

//text
var textData = new PointText([120, 50]);
textData.content = 'date';
textData.style = {
    fontFamily: 'Montserrat',
    fontWeight: '200',
    fontSize: 20,
    fillColor: 'white',
    justification: 'left',
		leading: this.fontSize * 1.8
};
var textGym = new PointText([120, 75]);
textGym.content = 'gym';
textGym.style = {
    fontFamily: 'Montserrat',
    fontWeight: '200',
    fontSize: 20,
    fillColor: 'white',
    justification: 'left',
		leading: this.fontSize * 1.8
};
var textAwake = new PointText([120, 75]);
textAwake.content = 'awake';
textAwake.style = {
    fontFamily: 'Montserrat',
    fontWeight: '200',
    fontSize: 20,
    fillColor: 'white',
    justification: 'left',
		leading: this.fontSize * 1.8
};
var textSleep = new PointText([120, 75]);
textSleep.content = 'sleep';
textSleep.style = {
    fontFamily: 'Montserrat',
    fontWeight: '200',
    fontSize: 20,
    fillColor: 'white',
    justification: 'left',
		leading: this.fontSize * 1.8
};

//highlight square
var highlight = new Path()
highlight.fillColor = 'purple';
highlight.add(new Point(0, 0));
highlight.add(mouseLineTop);
highlight.add(mouseLineBottom);
highlight.add(new Point(0, height));
highlight.closed = true;
highlight.opacity = 0.7;

function onFrame(event){
	mouseLine.segments[0].point.x = mouse.x;
	mouseLine.segments[1].point.x = mouse.x;
	highlight.segments[1].point.x = mouse.x;
	highlight.segments[2].point.x = mouse.x;
	console.log(mouseLine.segments[0].x);

}

function onMouseMove(event){
	mouse = event.point;
	if(mouse.x == 0) mouse.x = 1;
	var lineIndex = Math.floor((mouse.x-startPoint.x)/sectionWidth);

	//text
	textData.content = data[lineIndex]["data"];
	textData.point = [mouse.x+20,mouse.y+25];
	textGym.content = 'Gym: ' + data[lineIndex]["gym"];
	textGym.point = [mouse.x+20,mouse.y+50];
	textAwake.content = 'Time Awake: ' + data[lineIndex]["wakeTime"];
	textAwake.point = [mouse.x+20,mouse.y+75];
	textSleep.content = 'Time Sleeping: ' + data[lineIndex]["sleepTime"];
	textSleep.point = [mouse.x+20,mouse.y+100];
}
