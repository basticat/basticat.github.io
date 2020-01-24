$(document).ready(function(){
  console.log("yes");
  //var target = ".displayBox-trigger";
  var target = ".displayBox";
  $(target).mouseenter(function(){
    //var cover = $(this).parent().find(".displayBox").find(".displayBox-cover");
    var cover = $(this).find(".displayBox-cover");
    cover.stop(true,false);
    cover.animate({left: "-100%"}, 500, function(){});

    console.log("mouseenter");
    //event.stopPropagation();
  });
  $(target).mouseleave(function(){
    //var cover = $(this).parent().find(".displayBox").find(".displayBox-cover");
    var cover = $(this).find(".displayBox-cover");
    cover.stop(true,false);
    cover.animate({left: "0px"}, 500, function(){});

    console.log("mouseleave");
    //event.stopPropagation();
  });
});
