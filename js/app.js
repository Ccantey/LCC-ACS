
  var width = 960,
      height = 620;

function init(error, counties,senate, house, congress){
    var mainProjection = d3.geo.albers()
    	.center([-3, 45.5]) //seem to move the x,y pixel location
    	.rotate([94, 0, 0]) //centering it 94 degrees from center(0,46)
    	.parallels([43.5, 49]) //standard parallels
    	.scale(3800) //smaller = smaller
    	.translate([width/2, height/2]); // x/y location of display 

    var mainpath = d3.geo.path()
        .projection(mainProjection);

    var Minnesota = d3.select("#main").append("svg")
        .attr("width", width)
        .attr("height", height);
    
    // d3.json("php/getOverlayLayersAsGeoJSON.php", function(error, data) {
        // console.log(data)
        //Bind data and create one path per GeoJSON feature
        Minnesota.selectAll("path")
           .data(counties.features)
           .enter()
           .append("path")
           .attr("d", mainpath)
           .attr("fill","#666666");

        $('#main').show();
        $('.loader').hide();
    // });
}

