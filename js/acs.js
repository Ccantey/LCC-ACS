var censusData,
	payerChart,
	educationChart,
	raceChart,
	pieColors = d3.scale.ordinal()
		.domain([0,1,2,3,4])
		.range(["#ef9c73","#a990aa","#b0bfc8","#fae2a8","#a4c885"]);

function setupDemographics(data){
	console.log(data.countiesACS);
	censusData = data;

	var sidePanel = d3.select("#panel"),
		bars = sidePanel.append("div").attr("id","bar-charts"),
		pies = sidePanel.append("div").attr("id","pie-charts");

	// var ageContainer = bars.append("div").attr("class","chart-container");
	// ageContainer.append("h3").html("Age Breakdown");
	// var ageDiv = ageContainer
	// 				.append("div")
	// 				.attr("class","bar-chart");
	
	// ageChart = demographicBarChart()
	// 				.div(ageDiv)
	// 				.group(data)
	// 				.entity("27001");


	// var incomeContainer = bars.append("div").attr("class","chart-container");
	// incomeContainer.append("h3").html("Median Household Income");

	// var incomeDiv = incomeContainer
	// 				.append("div")
	// 				.attr("class","bar-chart")
	// 				.style("margin-bottom","40px");
	// incomeChart = demographicBarChart()
	// 				.div(incomeDiv)
	// 				.max(38)
	// 				.group(data["Median Household Income"])
	// 				.entity("104946");

	// d3.selectAll(".bar-chart")
	// 	.append("div")
	// 	.attr("class","chart-base");

	var race_svg = pieSVG("race","Race / Ethnicity");

	raceChart = demographicPieChart()
					.svg( race_svg )
					.group(data["Race / Ethnicity"])
					.entity("104946");

	var payer_svg = pieSVG("payer","Payer Mix");

	payerChart = demographicPieChart()
					.svg( payer_svg )
					.group(data.Payer)
					.entity("104946");

	var edu_svg = pieSVG("education","Education");

	educationChart = demographicPieChart()
					.svg( edu_svg )
					.group(data.Education)
					.entity("104946");

	var raceLegend = pieLegend( raceChart.group() )
						.container(d3.select("#race-container"));
	var payerLegend = pieLegend( payerChart.group() )
						.container(d3.select("#payer-container"));
	var eduLegend = pieLegend( educationChart.group() )
						.container(d3.select("#education-container"));

	d3.select("#statewide").on("click",clearSelectedEntity);
} 

// function loadZipCensus(county){
// 	d3.json("php/get_census.php?county=" + county, function(error,data){
// 		for ( var group in data ){
// 			for ( var measure in data[group] ){
// 				for ( var entity in data[group][measure] ){
// 					censusData[group][measure][entity] = data[group][measure][entity];
// 				}
// 			}
// 		}
// 		if ( selectedEntity && selectedEntity.zipCode ){
// 			var sel = d3.selectAll("path").filter( function(d){ return d.properties && d.properties.ZCTA5CE10 == selectedEntity.zipCode } );
// 			console.log(sel)
// 			selectEntity.call( sel.node(), sel.datum() );
// 		}
// 	});
// }

// function pieSVG(name,title){
// 	var container = d3.select("#pie-charts")
// 		.append("div").attr("class","chart-container");
// 	container.append("p").attr("class","prop-header").attr("id",name+"-prop").html("Map");
// 	container.append("h3").html(title);
// 	return container
// 			.append("div")
// 			.attr("id",name+"-container")
// 			.attr("class","pie-chart")
// 				.append( "svg" )
// 				.attr("id",name+"-pie")
// 				.attr("class","pie")
// 				.attr("width","80")
// 				.attr("height","80")
// 				.on("mouseleave",function(){
// 					// because the slice-clone thing is buggy, try to ensure it goes away on mouse out
// 					d3.selectAll(".slice-clone").remove();
// 				})
// 				.append("g")
// 					.attr("transform","translate(40,40)");
// }

// function updateCharts(entity){
// 	if (selectedEntity) return;
// 	updatePies(entity);
// 	updateBarCharts(entity);
// }

// function updatePies(entity){
// 	payerChart.entity(entity);
// 	educationChart.entity(entity);
// 	raceChart.entity(entity);
// }

// function updateBarCharts(entity){
// 	ageChart.entity(entity);
// 	incomeChart.entity(entity);
// }

// var arc = d3.svg.arc().outerRadius(35),
// 	pie = d3.layout.pie().sort(null);

// function demographicPieChart(){
// 	var _dataArray,
// 		_svg,
// 		_group,
// 		_entity,
// 		chart = {};

// 	chart.svg = function(svg){
// 		if ( !svg ) return _svg;
// 		_svg = svg;
// 		return updatePie();
// 	}

// 	chart.group = function(object){
// 		if ( !object ) return _group;
// 		_group = object;
// 		return updateData();
// 	}

// 	chart.entity = function(e){
// 		if ( !e ) return _entity;
// 		_entity = e;
// 		return updateData();
// 	}

// 	function updateData(){
// 		if ( !_group || !_entity ) return chart;
// 		var parent = _svg.node().parentNode.parentNode;

// 		_dataArray = [];
// 		for ( var i in _group ){
// 			if ( _group[i][_entity] == undefined ){
// 				d3.select( parent ).style( "opacity", .4 );
// 				return chart;
// 			}
// 			_dataArray.push( _group[i][_entity] );
// 		}
// 		d3.select( parent ).style( "opacity", 1 );
// 		return updatePie();
// 	}

// 	// see pie layout example at http://bl.ocks.org/mbostock/1346410
// 	function updatePie(){
// 		if ( !_svg || !_dataArray ) return chart;

// 		var path = _svg.datum( _dataArray )
// 			.selectAll("path")
// 			.data(pie);

// 		path.transition().duration(globalTweenLength).attrTween("d", arcTween);

// 		path.enter()	// new pie
// 			.append("path")
// 			.attr("fill", function(d, i) { return pieColors(i); })
// 			.attr("d",arc)
// 			.on("mouseover",function(d){
// 				// show highlight as a clone of the path rather than moving path to top,
// 				// because pie gets messed up if the order of slices is changed
// 				d3.selectAll(".slice-clone").remove();
// 				var clone = this.cloneNode();
// 				this.parentNode.appendChild(clone);
// 				d3.select(clone).attr("class","slice-clone")
// 					// .on("mousemove",function(){showProbe.call(this,d)}) //no probe yet
// 					.on("mouseout",function(){
// 						this.parentNode.removeChild(this);
// 						hideProbe();
// 					})
// 			})
// 			.each(function(d) { this._current = d; }); // store the initial angles;

// 		return chart;
// 	}
// 	return chart;
// }

// // Store the displayed angles in _current.
// // Then, interpolate from _current to the new angles.
// // During the transition, _current is updated in-place by d3.interpolate.
// function arcTween(a) {
//   var i = d3.interpolate(this._current, a);
//   this._current = i(0);
//   return function(t) {
//     return arc(i(t));
//   };
// }

// function demographicBarChart(){
// 	var _dataArray,
// 		_div,
// 		_group,
// 		_entity,
// 		_max = 30,
// 		axis = d3.svg.axis()
// 			.orient("left")
// 			.ticks( 3 )
// 			.tickFormat(function(d){ return d ? d + '%' : ''});
// 		chart = {};

// 	chart.div = function(div){
// 		_div = div;
// 		_div.append("svg").append("g").attr("transform","translate(22,0)");
// 		return updateChart();
// 	}

// 	chart.group = function(object){
// 		_group = object;
// 		return updateData();
// 	}

// 	chart.entity = function(e){
// 		_entity = e;
// 		return updateData();
// 	}

// 	chart.max = function(val){
// 		if ( !val ) return _max;
// 		_max = val;
// 		return updateChart();
// 	}

// 	function updateData(){
// 		if ( !_group || !_entity ) return chart;
// 		var parent = _div.node().parentNode;

// 		_dataArray = [];
// 		for ( var i in _group ){
// 			if ( _group[i][_entity] == undefined ){
// 				d3.select( parent ).style( "opacity", .4 );
// 				return chart;
// 			}
// 			_dataArray.push( {name:_group[i].name, value:_group[i][_entity]} );
// 		}
// 		d3.select( parent ).style( "opacity", 1 );
// 		return updateChart();
// 	}

// 	function updateChart(){
// 		if ( !_div || !_dataArray ) return chart;

// 		var max = Math.max( _max, d3.max( _dataArray, function(d){ return d.value } ) );

// 		var bars = _div.selectAll("div")
// 			.data(_dataArray)

// 		var h = _div.style("height");
// 			h = parseFloat( h.substr(0, h.indexOf("px")) ) - 10;
// 		var w = _div.style("width");
// 			w = parseFloat( w.substr(0, w.indexOf("px")) ) - 30;
// 		var barWidth = ((w-10)/_dataArray.length - 12);

// 		bars.transition().duration(globalTweenLength)
// 			.style("height", function(d){ return (h*d.value/max) + "px" })
// 			.style("margin-top", function(d){ return (h-h*d.value/max) + "px" });

// 		bars.enter()
// 			.append("div")
// 			.attr("class","bar")
// 			.style("width", function(d) { return barWidth + "px"; })
// 			.style("height", function(d){ return (h*d.value/max) + "px" })
// 			.style("margin-top", function(d){ return (h-h*d.value/max) + "px" })
// 			.on("mousemove",showProbe)
// 			.on("mouseout",hideProbe);

// 		_div.select(".bar").style("margin-left","25px");	// push things right 5px

// 		axis.tickSize(-w,0)
// 			.scale( d3.scale.linear().domain([.8*max,0]).range([.2*h,h]) );
// 		_div.select("g").call(axis);

// 		// dumb to do this here; should only do it once at the outset
// 		_div.select("svg")
// 			.attr("width",w+10)
// 			.attr("height",h);

// 		_div.selectAll("p").remove();
// 		bars.each( function(d,i){
// 			_div.append( "p" )
// 				.attr("class","bar-label")
// 				.text( d.name )
// 				.style("left",((barWidth+12)*i + .5*barWidth - 25) + "px");
// 		});

// 		return chart;
// 	}
// 	return chart;
// }

// function pieLegend(group){
// 	var legend = {},
// 		_group = group,
// 		_container;

// 	legend.container = function(c){
// 		_container = c;
// 		var i = 0
// 			div = _container.append("div").attr("class","pie-legend");
// 		for ( var g in _group ){
// 			var row = div.append("div").attr("class","pie-legend-row");
// 			row.append("div").style("background-color",pieColors(i));
// 			row.append("p").html(_group[g].name);
// 			row.append("div").attr("class","pie-check")
// 				.datum( _group[g] )
// 				.on("click",function(d){
// 					d3.selectAll(".pie-check.selected").classed("selected",false);
// 					if ( selectedCensusMeasure != d ){
// 						d3.select(this).classed("selected",true);
// 						proportionalMap(d);
// 					} else {
// 						proportionalMap(null);
// 					}
// 				});
// 			i++;
// 		}
// 		return legend;
// 	}
// 	return legend;
// }

// var selectedCensusMeasure,
// 	maxCircleRadius = 20;

// function proportionalMap(data){
// 	var selection = censusLayer.selectAll("circle");
// 	selection.remove();
// 	selectedCensusMeasure = data;
// 	if ( data ){
// 		var max = 0;
// 		for ( var i in data ){
// 			if ( i != "id" && i != "name" && data[i] > max ) max = data[i];
// 		}
// 		countyLayer.selectAll("path").each(function(d){
// 			var centroid = path.centroid(d);
// 			censusLayer.append("circle")
// 				.attr("cx",centroid[0])
// 				.attr("cy",centroid[1])
// 				.attr("r",function(dd){return Math.sqrt(data[d.id]/max)*maxCircleRadius})
// 				.attr("pointer-events","none")
// 				.attr("vector-effect","non-scaling-stroke");
// 		});
// 	}
// }