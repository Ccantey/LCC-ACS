var mainProjection,
    smallProjection,
    mainpath,
    smallpath;

var MnCongressContainer,
    MnCountiesContainer,
    congressionalLayer,
    countyLayer;
    // insetCountyLayer,
    // zipcodeLayer,
    // censusLayer,
    // citiesLayer;

var mapScale = 1;

var zoomedFeature,
    zoomedRegion;

var percentileScale = d3.scale.quantile().range( d3.range(0,100) ); // to map data values to percentiles
    choroplethScale = d3.scale.threshold().domain([25,50,75,95]).range([0,1,2,3,4]);  // to map percentiles to our classification

var selectedEntity;
var hoverFeature;

function createMaps(counties, congress){
  var width = 400;
  var height = 450;
  var insetwidth = 250;
  var insetheight = 250;
    //small map creation
    smallProjection = d3.geo.albers()
      .center([0, 46.5]) //seem to move the x,y pixel location
      .rotate([94, 0, 0]) //centering it 94 degrees from center(0,46)
      .parallels([43.5, 49]) //standard parallels
      .scale(1200 * 1.8) //smaller = smaller
      .translate([insetwidth/2, insetheight/2]); // x/y location of display 

    smallpath = d3.geo.path()
        .projection(smallProjection);

    MnCongressContainer = d3.select("#small-map").append("svg")
        .attr("width", insetwidth)
        .attr("height", insetheight);

	MnCongressContainer.append("rect")
	    .attr("width",insetwidth)
	    .attr("height",insetheight)
	    .style("fill","#fff")
	    .style("stroke","#333"); //don't really need this but I want to see the canvasses
    
    congressionalLayer = MnCongressContainer.append("g")
        .attr("id","region-layer")
        .attr("class","map-layer");    //Bind data and create one path per GeoJSON feature

    congressionalLayer.selectAll("path")
           .data(congress.features)
           .enter()
	           .append("path")
	           .attr("d", smallpath)
	           .attr("stroke","#ff6600");

  //Main Map creation
    mainProjection = d3.geo.albers()
      .center([1, 46.5]) //seem to move the x,y pixel location
      .rotate([94, 0, 0]) //centering it 94 degrees from center(0,46)
      .parallels([43.5, 49]) //standard parallels
      .scale(3800) //smaller = smaller
      .translate([width/2, height/2]); // x/y location of display 

    mainpath = d3.geo.path()
        .projection(mainProjection);

    MnCountiesContainer = d3.select("#main-map").append("svg")
        .attr("width", width)
        .attr("height", height);   

    MnCountiesContainer.append("rect")
	    .attr("width",width)
	    .attr("height",height)
	    .style("fill","#fff")
	    .style("stroke","#333")
	    .on("mouseover",mapMouseOut); //not there yet

    countyLayer = MnCountiesContainer.append("g")
      .attr("id","county-layer")
      .attr("class","map-layer");

    //Bind data and create one path per GeoJSON feature
    countyLayer.selectAll("path")
       .data(counties.features)
       .enter()
	       .append("path")
	       .attr("id",function(d){return "e" + d.properties.district}) //prepend path id with e, presumably for a join with data
	       .attr("d", mainpath)
	       .attr("stroke","#666666") //will be removed later
	       .on("mouseover",countyMouseOverHandler) //not there yet
           // .on("mousemove",showProbe)
        //    .on("click",selectEntity);

}

function countyMouseOverHandler(d){
  // removeBarHighlight();
  mapMouseOut();
  //this the county 'path'
  hoverFeature = this;
  polygonMouseover.call(this, d);
  // if ( d.properties.value ){
  //   highlightBarValue( d.properties.value.value )
  //   d3.select( "#dates" ).html( "<br/><br/>Reporting date range: " + d.properties.value.dates[0] + " - " + d.properties.value.dates[1] );
  // }else {
	 //  d3.select( "#dates" ).html( "" );  
  // }
  // d3.select(this).on("mouseover",null);
  // d3.select(this).on("mouseout",function(){ 
  //   removeBarHighlight();
  //   mapMouseOut();

  //   d3.select(this).on("mouseover",countyMouseOverHandler)
  // } )
}
function polygonMouseover(d){
  // move element to top so the stroke isn't underneath adjacent polygons
  this.parentNode.appendChild(this);
  d3.select(this).classed("hover",true).attr("stroke","#ff6600"); //2/mapScale
  if ( selectedEntity ) document.getElementById( "e"+selectedEntity.id ).parentNode.appendChild( document.getElementById( "e"+selectedEntity.id ) );
  if ( selectedEntity ) return;
  // var name = d.properties.NAME || d.properties.ZCTA5CE10;
  // d3.select("#right-column h3").text(name.toUpperCase() + " DEMOGRAPHICS");
  // updateCharts(d.id);
}

function mapMouseOut(d){
  // if ( !selectedEntity && (!d3.event.toElement || !d3.event.toElement.__data__) ){
  //   updateCharts("104946");
  //   d3.select("#right-column h3").text("ILLINOIS DEMOGRAPHICS");
  //   d3.select("#statewide").style("visibility","hidden");
  //   if ( otherEntityValues.get("104946") && otherEntityValues.get("104946").dates && otherEntityValues.get("104946").dates[0] ) 
  //     d3.select( "#dates" ).html( "<br/><br/>Reporting date range: " + otherEntityValues.get("104946").dates[0] + " - " + otherEntityValues.get("104946").dates[1] );
  // } else if ( selectedEntity &&  selectedEntity.properties.value.dates && selectedEntity.properties.value.dates[0] ){
  //   d3.select( "#dates" ).html( "<br/><br/>Reporting date range: " + selectedEntity.properties.value.dates[0] + " - " + selectedEntity.properties.value.dates[1] );
  // }
  // else{
	 //  d3.select( "#dates" ).html( " " );  
  // }
  // hideProbe();
  d3.selectAll(".hover").classed("hover",false).attr("stroke","#666");;
}