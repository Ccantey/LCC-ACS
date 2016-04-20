
  var width = 400;
  var height = 450;
  var insetwidth = 250;
  var insetheight = 250;

function init(error, counties, congress){
    createMaps(counties, congress);    
    // });
}

function createMaps(counties, congress){

    //small map creation
    var smallProjection = d3.geo.albers()
      .center([0, 46.5]) //seem to move the x,y pixel location
      .rotate([94, 0, 0]) //centering it 94 degrees from center(0,46)
      .parallels([43.5, 49]) //standard parallels
      .scale(1200 * 1.8) //smaller = smaller
      .translate([insetwidth/2, insetheight/2]); // x/y location of display 

    var smallpath = d3.geo.path()
        .projection(smallProjection);

    var smallMN = d3.select("#small-map").append("svg")
        .attr("width", insetwidth)
        .attr("height", insetheight);
    
        //Bind data and create one path per GeoJSON feature
        smallMN.selectAll("path")
           .data(congress.features)
           .enter()
           .append("path")
           .attr("d", smallpath)
           .attr("fill","#ff6600");


  //Main Map creation
  var mainProjection = d3.geo.albers()
      .center([0, 46.5]) //seem to move the x,y pixel location
      .rotate([94, 0, 0]) //centering it 94 degrees from center(0,46)
      .parallels([43.5, 49]) //standard parallels
      .scale(3800) //smaller = smaller
      .translate([width/2, height/2]); // x/y location of display 

    var mainpath = d3.geo.path()
        .projection(mainProjection);

    var Minnesota = d3.select("#main-map").append("svg")
        .attr("width", width)
        .attr("height", height);
    
        //Bind data and create one path per GeoJSON feature
        Minnesota.selectAll("path")
           .data(counties.features)
           .enter()
           .append("path")
           .attr("d", mainpath)
           .attr("fill","#666666");



        $('#main').show();
        $('.loadingDiv').hide();
}

