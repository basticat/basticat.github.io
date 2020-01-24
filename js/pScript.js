//LAYERS
var background = new Layer();
var shadows = new Layer();
//shadows.visible = false;
var forground = new Layer();

var ctx = document.getElementById("myCanvas");
//ctx.canvas.width = window.innerWidth;
var rect = new Rectangle(new Point(0,0), new Point(ctx.width, ctx.height));
background.activate();
var bg = new Path.Rectangle(rect);
//env physiscs
var wind = new Point(0,0);
bg.fillColor = {
    gradient:{
        stops: ["#8F9D6A", "#8F9D6A"]
    },
    origin: new Point(0,ctx.height),
    destination: new Point(0,ctx.height/2)
};
forground.activate();
function Tree(pos ,tw, th, lw, lh){
    var trunk = new Path({
        strokeWidth: tw,
        strokeColor: "brown"
    });
    trunk.add(pos.clone());
    trunk.add(new Point(pos.x, pos.y - th/2));
    trunk.add(new Point(pos.x,pos.y - th));
    //trunk.fullySelected = true;
    var leaves = new Path.Rectangle({
        position: new Point(pos.x,pos.y - lh + 5),
        width: lw,
        height: lh,
        radius: lw/2,
        fillColor: "pink"
    });
}

function Bulb(point, h, r){
    this.bulbRadius = r;
    this.stemHeight = h;
    this.stemPos = point;
    this.bulbPos = new Point(point.x, point.y - h);
    this.mass = 10;
    this.k = 5;
    this.damp = .9;
    this.force = new Point();
    this.accel = new Point();
    this.vel = new Point();
    this.stem = new Path({
        strokeColor: "brown",
        strokeWidth: 4
    });
    this.points = 3;
    for(var i = 0; i <= this.points; i++){
        this.stem.add(new Point(point.x,point.y - h/this.points * i));
    }
    //this.stem.selected = true;
    this.bulb = new Path.Circle({
        center: this.bulbPos,
        radius: r,
    });
    this.num = 0;
    this.wind = new Point;
    this.stem.smooth();
    this.mouseOver = false;
    this.mouseForce = new Point(0,0);
}

Bulb.prototype = {
    check: function(p){
        var r = (this.bulb.position - this.bulb.segments[0].point).length;
        if((p - this.bulb.position).length < r){
            //this.vel += new Point(this.bulb.position - p) * 1;
            this.mouseOver = true;
            this.mouseForce = (p - this.bulb.position) * 2;
        }
        else
        {
            if (this.mouseOver) {
                this.vel += (p - this.bulb.position) *.5;
            }
            this.mouseOver = false;
            this.mouseForce = new Point(0,0);
        }
    },
    update: function(e) {
        //TODO spring physic
        this.force = new Point(this.bulbPos - this.bulb.position) * this.k;
        this.wind = new Point(0,0) +  new Point(16 * 6.28 + Math.sin(e.count/20 + this.num) * 16, 0);
        this.force += this.wind + this.mouseForce;
        this.accel = this.force/this.mass;
        this.vel = new Point(this.vel + this.accel) * this.damp;
        this.bulb.position = this.bulb.position + this.vel;
        this.stem.segments[this.points].point = this.bulb.position;
        //update stem
        for(var i = this.points - 1; i > 0; i--){
            this.stem.segments[i].interpolate(this.stem.segments[i],this.stem.segments[i + 1], .5);
        }
    },
    createShadows: function(){
        this.stemShadow = new Path({
            strokeColor: "#718551",
            strokeWidth: 4,
            //opacity: .5,
            blendMode: "normal"
        });
        for(var i = 0; i <= this.points; i++){
            this.stemShadow.add(new Point(this.stemPos.x,this.stemPos.y + this.stemHeight/this.points * i));
        }
        this.bulbShadow = new Path.Circle({
            fillColor: "#718551",
            //opacity: .5,
            blendMode: "normal",
            radius: this.bulbRadius
        });
    },
    updateShadows: function(){
        var temp = (this.stemPos - this.bulb.position);
        this.bulbShadow.position = new Point(this.bulb.position.x, temp.y + this.stemPos.y);
        this.stemShadow.segments[this.points].point = this.bulbShadow.position;
        for(var i = this.points - 1; i > 0; i--){
            this.stemShadow.segments[i].interpolate(this.stemShadow.segments[i],this.stemShadow.segments[i + 1], .7);
        }
    }
};

var itchBox = new Path.Circle();
var twitterBox;


//create icons
var iconSize = 50;
var iconDistance = 60;
//itch
var itchBox = new Path.Circle(view.center + [-iconDistance,0], iconSize);
itchBox.fillColor = "#fa7070"
var itchLogo = new Raster({
    source: "https://basticat.github.io/icon_itch.png",
    position: itchBox.position
});
itchLogo.scale(.15);
//twitter
var twitterIcon = new Path.Circle(view.center + [iconDistance,0], iconSize);
twitterIcon.fillColor = "#6faedc"
var twitterLogo = new Raster({
    source: "https://basticat.github.io/icon_twitter.png",
    position: twitterIcon.position
});
twitterLogo.scale(.15);

//add bulbs
var bulbs = [];
for(var i = 0; i < 18; i++){
    bulbs.push(new Bulb(new Point(view.size.width,view.size.height) * Point.random(), 50 + 20 * Math.random(),20 + 15 * Math.random()));
    bulbs[i].num = Math.random() * 25
    if(Math.random() < .5){
        bulbs[i].bulb.fillColor = "#edeaa0";
    }
    else
    {
        bulbs[i].bulb.fillColor = "pink";
    }
}
shadows.activate();
for (var i = 0; i < bulbs.length; i++) {
    bulbs[i].createShadows();
}
//animation
function onFrame(event){

    for (var i = 0; i < bulbs.length; i++) {

        bulbs[i].update(event);
        bulbs[i].updateShadows();
    }
}
function onMouseMove(event){
    for (var i = 0; i < bulbs.length; i++) {
        bulbs[i].check(event.point);
    }
}
function onMouseDown(event){

    if((event.point - itchBox.position).length < iconSize){
        OpenInNewTab("https://bombasticat.itch.io/");
    }
    if((event.point - twitterIcon.position).length < iconSize){
        OpenInNewTab("https://twitter.com/_basticat");
    }

}
/*
function onResize(){
    itchBox.position = view.center + [-iconDistance, 0];
    itchLogo.position = itchBox.position;
    //twiter
    twitterIcon.position = view.center + [iconDistance, 0];
    twitterLogo.position = twitterIcon.position
}*/

function OpenInNewTab ( url )
{
    var win = window.open(url,'_blank');
    win.focus();
}
