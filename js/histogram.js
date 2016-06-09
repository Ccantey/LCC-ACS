var histogramScale = d3.scale.quantize().range( d3.range(25) ),
	histogram,
	maxBarHeight = 150,
	maxBarValue,
	yAxis,
	xAxis,
	bars;

function drawHistogram(){
	var vals = countyValues.values().map( function(d){ return d.value } ).sort( function(a,b){return a-b} ),
		q3 = d3.quantile(vals,.75), 
		iqr = q3 - d3.quantile(vals,.25);
	//if ( q3 != iqr )	// don't weed out outliers for the ridiculously skewed distributions where q3 == iqr
	//	vals = countyValues.values().filter( function(d){ return d.value < q3 + 2.5*iqr });
	//else
		vals = countyValues.values();
	histogramScale.domain( d3.extent( vals, function(d){ return d.value } ) );
	var bins = [];
	for ( var i=0; i < histogramScale.range().length; i++ ){ bins[i] = 0; }
	countyLayer.selectAll("path").each( function(d){
		if ( d.properties.value ){
		//	if ( q3 == iqr || d.properties.value.value < q3 + 2.5*iqr ){
				var b = histogramScale( d.properties.value.value );
				bins[b]++;
		//	}
		}
	});

	maxBarValue = d3.max( bins );

	histogram = d3.select("#histogram");

	bars = histogram.select("#bars").selectAll("div").data( bins );

	bars.enter()
		.append("div")
		.attr("id",function(d,i){ return "bar" + i })
		.on("mouseover",function(d,i){
			var e = histogramScale.invertExtent(i);
			countyLayer.selectAll("path")
				.filter( function (d){ return d.properties.value && d.properties.value.value >= e[0] && d.properties.value.value <= e[1] } )
				.classed("histogram-highlight",true)
				.attr("stroke-width",2/mapScale)
				.each(function(){
					this.parentNode.appendChild(this);
				})
		})
		.on("mouseout",function(){
			d3.selectAll(".histogram-highlight").classed("histogram-highlight", false).attr("stroke-width",1/mapScale);
			hideProbe();
		})
		.on("mousemove",showProbe)
		.style("margin-top",maxBarHeight + "px")


	bars
		.attr("class",function(d,i){
			// color according to midpoint of the bin range
			var e = histogramScale.invertExtent(i),
				mid = e[0] + ( e[1] - e[0] ) / 2;
			return "histogram-bar " + "q" + choroplethScale( percentileScale(mid) ) + "-5";
		})
		.transition()
		.duration(globalTweenLength)	// init.js
		.style("height",function(d){
			return (maxBarHeight * d / maxBarValue) + "px";
		})
		.style("margin-top",function(d){
			return ( maxBarHeight - (maxBarHeight * d / maxBarValue) ) + "px";
		})


	// Axes

	if ( !yAxis ){
		yAxis = d3.svg.axis()
			.orient("left")
			.ticks( 5 )
			.tickSize(-360,0)
			.tickFormat(function(d){ return d || ''});
		xAxis = d3.svg.axis()
			.orient("bottom")
			.tickSize(15);
	}
	yAxis.scale( d3.scale.linear().domain([maxBarValue,0]).range([0,maxBarHeight]) );
	var xValues = [ percentileScale.invertExtent(25)[0], 
			percentileScale.invertExtent(50)[0],
			percentileScale.invertExtent(75)[0],
			percentileScale.invertExtent(95)[0] ];

	// remove some ticks if they're way too close to each other
	while( ( xValues[1] - xValues[0] ) / histogramScale.domain()[1] < .02 ){
		xValues.shift();
	}
	xAxis.scale( d3.scale.linear().domain( histogramScale.domain() ).range( [0,350] ) )
		.tickFormat( function(d){ return percentileScale(d) })
		.tickValues( xValues );

	var start = 0,
		end,
		percentiles = [25,50,75,95,100],
		s = xAxis.scale();
	for ( i=0; i < percentiles.length; i++ ){
		end = Math.min( s( percentileScale.invertExtent( percentiles[i] )[0] ), s.range()[1] );
		if ( isNaN(end) ) end = s.range()[1];	// 100% returns NaN
		d3.select("#axes rect.q" + i + "-5")
			.attr("x",start)
			.attr("width",end-start);

		start = end;
	}

	d3.select("#axes #legend")
		.attr("transform","translate(25," + (maxBarHeight+16) + ")")

	d3.select("#axes g#yAxis")
		.attr("transform","translate(20,15)")
		.call(yAxis);

	d3.select("#axes g#xAxis")
		.attr("transform","translate(25," + (maxBarHeight+15) + ")")
		.call(xAxis);

	d3.select("#legend").style("visibility","visible");
	d3.select("#filter").style("visibility","visible");
	d3.select("#xAxis").style("display","block");
	d3.select("#x-label").style("display","block");
	d3.select("#deviation-labels").style("display","none");

	// stagger the percentile labels vertically
	d3.selectAll( "#xAxis .tick:nth-child(even) text" ).attr( "y","30" );
	d3.selectAll( "#xAxis .tick:nth-child(even) line" ).attr( "y2","27" );
}

function histogramSubset(d){
	if ( deviationMode ) return;
	bars.classed("region",true);
	var bins = [];
	for ( var i=0; i < histogramScale.range().length; i++ ){ bins[i] = 0; }
	countyLayer.selectAll("path").each( function(dd){
		if ( dd.properties.value && dd.properties.PARENT_ID == d.properties.ENTITY_ID ){
			var b = histogramScale( dd.properties.value.value );
			bins[b]++;
		}
	});
	d3.select("#histogram").append("div").attr("id","temp-bars")
		.selectAll("div")
		.data( bins )
		.enter()
		.append("div")
		.attr("class",function(dd,i){
			// color according to midpoint of the bin range
			var e = histogramScale.invertExtent(i),
				mid = e[0] + ( e[1] - e[0] ) / 2;
			return "histogram-bar " + "q" + choroplethScale( percentileScale(mid) ) + "-5";
		})
		.style("height",function(dd){
			return (maxBarHeight * dd / maxBarValue) + "px";
		})
		.style("margin-top",function(dd){
			return ( maxBarHeight - (maxBarHeight * dd / maxBarValue) ) + "px";
		})
}

function removeHistogramSubset(){
	d3.select("#temp-bars").remove();
	bars.classed("region",false);
}

function highlightBarValue(val){
	var bin = histogramScale(val) + 1;
	d3.select(".histogram-bar:nth-child(" + bin + ")").classed("highlight",true);
}
function removeBarHighlight(){
	d3.selectAll(".histogram-bar.highlight").classed("highlight",false);
}

function drawDeviationHistogram(){
	var bins = [0,0,0];
	countyLayer.selectAll("path").each( function(d){
		if ( d.properties.value ){
			if ( d.properties.value.sig != undefined )
			bins[d.properties.value.sig+1]++;
		}
	});
	bars.remove();

	maxBarValue = d3.max( bins );

	bars = histogram.select("#bars").selectAll("div").data( bins );

	bars.enter()
		.append("div")
		.attr("id",function(d,i){ return "bar" + i })
		.attr("class",function(d,i){return "histogram-bar " + "s" + i})
		.on("mousemove",showProbe)
		.on("mouseout",hideProbe);


	bars
		.style("height",function(d){
			return (maxBarHeight * d / maxBarValue) + "px";
		})
		.style("margin-top",function(d){
			return ( maxBarHeight - (maxBarHeight * d / maxBarValue) ) + "px";
		})
		.style("margin-left","50px")
		.style("margin-right","50px")

	yAxis.scale( d3.scale.linear().domain([maxBarValue,0]).range([0,maxBarHeight]) );
	
	d3.select("#xAxis").style("display","none");
	d3.select("#x-label").style("display","none");
	d3.select("#deviation-labels").style("display","block");

	d3.select("#axes g#yAxis")
		.attr("transform","translate(20,15)")
		.call(yAxis);

	d3.select("#axes g#xAxis")
		.attr("transform","translate(25," + (maxBarHeight+15) + ")")
		.call(xAxis);
	
	d3.select("#legend").style("visibility","hidden");
	d3.select("#filter").style("visibility","hidden");
}

//// Filtering

var filterClickOrigin,
	handleOrigin,
	handlePositions,
	handleRange,
	filteredValues;

function init_filter(){
	d3.selectAll(".filter-handle").on("mousedown",filterMouseDown);
	// need to be able to read these styles
	d3.select("#filter-left").style("left","-9px");
	d3.select("#filter-right").style("left","341px");
}

function filterMouseDown(){
	var side = d3.select(this).attr("id") == "filter-left" ? "left" : "right",
		leftPos = d3.select("#filter-left").style("left"),
		rightPos = d3.select("#filter-right").style("left");
	leftPos = parseFloat( leftPos.substring( 0, leftPos.indexOf("px") ) );
	rightPos = parseFloat( rightPos.substring( 0, rightPos.indexOf("px") ) );
	if ( side == "left" ){
		handleRange = [0,rightPos];
	} else {
		handleRange = [leftPos + 18,350];
	}
	filterClickOrigin = d3.event.clientX;
	handleOrigin = (side == "left" ? leftPos : rightPos) + 9;
	var handle = this;
	d3.select(document)
		.on("mousemove",function(){
			filterMove( d3.select(handle), side );
		})
		.on("mouseup",function(){
			d3.select(document).on("mousemove",null);
		});
}
function filterMove(handle, side){
	var pos = handleOrigin + (d3.event.clientX - filterClickOrigin);
	pos = Math.min( handleRange[1], Math.max( pos, handleRange[0] ) ) - 9;	// 9 = half handle width
	handle.style("left",pos + "px");
	if ( side == "left" ){
		handlePositions = [ pos + 9, handleRange[1] + 9 ];
	} else {
		handlePositions = [ handleRange[0]-9, pos + 9 ];
	}
	updateFilterValues();
}

function updateFilterValues(){
	filteredValues = [ xAxis.scale().invert(handlePositions[0]), xAxis.scale().invert(handlePositions[1]) ];
	countyLayer.selectAll("path").each(function(d){
		if (!d.properties.value) return;
		if ( d.properties.value && d.properties.value.value < filteredValues[0] || d.properties.value.value > filteredValues[1] )
			d3.select(this).classed("filtered",true);
		else
			d3.select(this).classed("filtered",false);
	});
	zipcodeLayer.selectAll("path").each(function(d){
		if (!d.properties.value) return;
		if ( d.properties.value.value < filteredValues[0] || d.properties.value.value > filteredValues[1] )
			d3.select(this).classed("filtered",true);
		else
			d3.select(this).classed("filtered",false);
	})
	bars.each(function(d,i){
		if ( handlePositions[0] > i*14 + 7 || handlePositions[1] < i*14 + 7 ){
			d3.select(this).classed("filtered",true)
		} else {
			d3.select(this).classed("filtered",false)
		}
	});
}
function resetFilters(){
	d3.select("#filter-left").style("left","-9px");
	d3.select("#filter-right").style("left","341px");
	d3.selectAll(".filtered").classed("filtered",false);
}

function drawStateChart(group){
	d3.select( "#state-chart" ).style("display","block");
	d3.select( "#about" ).classed("short",true);

	var data = [];
	for ( var i in group ){
		data.push( getMeasureById( group[i] ) );
	}

	var maxHeight = 75,
		maxValue = d3.max( data, function(d){ return parseFloat(d.state_rate) } );
	var bars = d3.select("#state-chart-inner").selectAll( ".state-bar" )
		.data( data )
	bars.enter()
		.append( "div" )
		.on("mousemove",showProbe)
		.on("mouseout",hideProbe);

	bars
		.style("height",function(d){
			return (maxHeight * parseFloat(d.state_rate) / maxValue) + "px";
		})
		.style("margin-top",function(d){
			return ( maxHeight - (maxHeight * parseFloat(d.state_rate) / maxValue) ) + "px";
		})
		.attr("class",function(d){ return "state-bar q" + choroplethScale( parseFloat(d.state_rate) ) + "-5" } );

	var axis = d3.svg.axis()
			.orient("left")
			.ticks( 5 )
			.tickSize(-180,0)
			.tickFormat(function(d){ return d || ''});
	axis.scale( d3.scale.linear().domain([maxValue,0]).range([0,maxHeight]) );
	d3.select("#state-axis g")
		.attr("transform","translate(30,0)")
		.call(axis);
}