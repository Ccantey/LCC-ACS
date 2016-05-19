


//pass all defers into init
function init(error, counties, congress, acs){
    createMaps(counties, congress);  
    $('#main').show();
	$('.loadingDiv').hide();  
    // });
}

function createMaps(counties, congress){
  var width = 400;
  var height = 450;
  var insetwidth = 250;
  var insetheight = 250;
    //small map creation
    var smallProjection = d3.geo.albers()
      .center([0, 46.5]) //seem to move the x,y pixel location
      .rotate([94, 0, 0]) //centering it 94 degrees from center(0,46)
      .parallels([43.5, 49]) //standard parallels
      .scale(1200 * 1.8) //smaller = smaller
      .translate([insetwidth/2, insetheight/2]); // x/y location of display 

    var smallpath = d3.geo.path()
        .projection(smallProjection);

    var smallMNcanvassSVG = d3.select("#small-map").append("svg")
        .attr("width", insetwidth)
        .attr("height", insetheight);

	smallMNcanvassSVG.append("rect")
	    .attr("width",insetwidth)
	    .attr("height",insetheight)
	    .style("fill","#fff")
	    .style("stroke","#333"); //don't really need this but I want to see the canvasses
    
    congressionalLayer = smallMNcanvassSVG.append("g")
        .attr("id","region-layer")
        .attr("class","map-layer");    //Bind data and create one path per GeoJSON feature

    congressionalLayer.selectAll("path")
           .data(congress.features)
           .enter()
           .append("path")
           .attr("d", smallpath)
           .attr("stroke","#ff6600");

  //Main Map creation
  var mainProjection = d3.geo.albers()
      .center([1, 46.5]) //seem to move the x,y pixel location
      .rotate([94, 0, 0]) //centering it 94 degrees from center(0,46)
      .parallels([43.5, 49]) //standard parallels
      .scale(3800) //smaller = smaller
      .translate([width/2, height/2]); // x/y location of display 

    var mainpath = d3.geo.path()
        .projection(mainProjection);

    var MnCanvassSVG = d3.select("#main-map").append("svg")
        .attr("width", width)
        .attr("height", height);
   

    MnCanvassSVG.append("rect")
	    .attr("width",width)
	    .attr("height",height)
	    .style("fill","#fff")
	    .style("stroke","#333");
	    //.on("mouseover",mapMouseOut); //not there yet

    countyLayer = MnCanvassSVG.append("g")
      .attr("id","county-layer")
      .attr("class","map-layer");

    //Bind data and create one path per GeoJSON feature
    countyLayer.selectAll("path")
       .data(counties.features)
       .enter()
	       .append("path")
	       .attr("id",function(d){return "e" + d.properties.countyid})
	       .attr("d", mainpath)
	       .attr("stroke","#666666"); //will be removed later
	       // .on("mouseover",countyMouseOverHandler) //not there yet
        //    .on("mousemove",showProbe)
        //    .on("click",selectEntity);

}

