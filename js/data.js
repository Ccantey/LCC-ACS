var measureData,
	categories,
	measures,
	selectedMeasure,
	countyValues,
	otherEntityValues,
	hasZipData,
	stateGroups = {};

function setupMeasures(data){
	// console.log(data.ACS);
	measureData = {};
	// metric-select
    categories = d3.select( "#metric-select" );

    // for (i in data.ACSdata){
    // 	console.log(data.ACSdata[i])
    // }

    





	// categories = d3.select( "#selects" ).append( "select" ).attr( "id", "category-select" );

	var subCategories
	for ( var i in measureData ){

		if ( i == "ACS" ) continue;
		var group = categories.append( "optgroup" )
			.attr( "label", i )
			.datum( measureData[i] );
		subCategories = {};
		subCategories["All " + i + " Measures" ] = measureData[i];
		for ( var j in measureData[i] ){
			if ( measureData[i][j].category != "" ){
				if ( !subCategories[ i + "-" + measureData[i][j].category ] )
					subCategories[ i + "-" + measureData[i][j].category ] = [];
				subCategories[ i + "-" + measureData[i][j].category ].push( measureData[i][j] );

				// presence of state_rate means this category gets that extra little chart
				if ( measureData[i][j].state_rate ){
					if ( !stateGroups[ i + "-" + measureData[i][j].category ] )
						stateGroups[ i + "-" + measureData[i][j].category ] = [];
					stateGroups[ i + "-" + measureData[i][j].category ].push( parseInt(measureData[i][j].measure_id) );
				}
			}
		}
		for ( j in subCategories ){
			group.append( "option" )
				.text( j.replace( /^.*?-/g, "" ) )
				.datum( subCategories[j] );
		}
	}	
	// categories.on( "change", function(){ 
	// 	var sel = this;
	// 	var grp = this.options[ this.selectedIndex ].parentNode.label;
	// 	selectCategory(
	// 		d3.selectAll("option")
	// 			.filter( function( d )
	// 			{
	// 				return this.parentNode.label + "-" + this.innerHTML == grp + "-" + sel.value
	// 			})
	// 			.datum()
	// 	);
	// });

	// measures = d3.select( "#selects" ).append( "select" )
	// 				.attr( "id", "measure-select" )
	// 				.on( "change", function(){ var sel = this; selectMeasure( d3.selectAll("option").filter(function(d){ return d.name == sel.value} ).datum() ) } );

	// // select first category and measure
	// selectCategory( categories.select("option").datum() );
	// //selectMeasure( measures.select("option:nth-child(2)").datum() );	// second option; first is the "select a measure" prompt
}

function equivilant(a,b){
	for (i in a){
		var aProps = Object.getOwnPropertyNames(a);
		console.log(aProps)
	}
	
    var bProps = Object.getOwnPropertyNames(b);
    
    // If number of properties is different,
    // objects are not equivalent
    // if (aProps.length != bProps.length) {
    //     return false;
    // }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        console.log(propName)
        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}
function selectCategory( c ){
	measures.selectAll( "option" ).remove();

	//measures.append( "option" ).text( "Select a measure... ");	// prompt just for when category is changed and no measure yet selected
	for ( var i in c ){
		measures.append( "option" )
			.text( c[i].name )
			.datum( c[i] );
	}
	selectMeasure( measures.select("option").datum() );
}

function selectMeasure( m ){
	if ( measures.select("option").text() == "Select a measure... " ) measures.select("option").remove();	// remove prompt once a measure is selected
	d3.select( "#about" ).html( m.description );

	selectedMeasure = m;
	getMeasureValues(m.measure_id);

	d3.select("#csv-link").attr("href","php/make_csv.php?id=" + m.measure_id);
	if ( initialized ){
		var loader = d3.select("body").append("div").attr("id","loading");
		loader.append("img").attr("src","images/ajax-loader.gif");
		loader.append("p").html("Loading...")
	}
}

var hasMetroData = false,
	hasSig = false;
	
function getMeasureValues(id){
	d3.json( "php/get_values.php?id=" + id, function(error,data){
		countyValues = d3.map();
		otherEntityValues = d3.map();

		hasSig = false;
		for ( var i = 0; i < data.county.length; i++ ){
			if ( data.county[i].sig != undefined ) hasSig = true;
			countyValues.set( data.county[i].id, { value: data.county[i].value, zips: data.county[i].zips, sig: data.county[i].sig, dates: data.county[i].dates } );
		}
		if ( data.idph_region ){
			for ( i = 0; i < data.idph_region.length; i++ ){
				otherEntityValues.set( data.idph_region[i].id, { value: data.idph_region[i].value, dates: data.idph_region[i].dates } );
			}
		}
		hasZipData = false;
		if ( data.zip ){
			hasZipData = true;
			for ( i = 0; i < data.zip.length; i++ ){
				otherEntityValues.set( data.zip[i].id, { value: data.zip[i].value, dates: data.zip[i].dates } );
			}
		}
		hasMetroData = false;
		if ( data.idph_metro_region ){
			hasMetroData = true;
			for ( i = 0; i < data.idph_metro_region.length; i++ ){
				otherEntityValues.set( data.idph_metro_region[i].id, { value: data.idph_metro_region[i].value, dates: data.idph_metro_region[i].dates } );
			}
		}

		if ( data.state ){
			otherEntityValues.set( data.state[0].id, { value: data.state[0].value, dates: data.state[0].dates } );
		}

		if ( !deviationMode || !hasSig ){
			if ( deviationMode ){
				deviationMode = false;
				bars.remove();
				document.getElementById("show-rate").checked = true;
			}

			updateMapData();	// map.js

			drawHistogram();	// histogram.js
		} else if ( hasSig && deviationMode ) {
			showDeviationMap();
    		drawDeviationHistogram();
		}

		if ( !hasZipData && !hasMetroData ){
			if ( zoomedFeature ) d3.select("#zoom-note").style("visibility","hidden");
		} else if ( zoomedFeature ){
			d3.select("#zoom-note")
			  		.style("visibility", "visible" )
			  		.html("<img src='images/zoom.jpg' /> Click to explore Cook County")
			  		.on( "click", function()
			  		{
				  		zoomToBounds( d3.select( "#e150196" ).data()[ 0 ] );
			  		})
		}
			

		if (!hasSig) d3.select("#radio-container").style("visibility","hidden");
		else d3.select("#radio-container").style("visibility","visible");

		resetFilters();

		d3.select("#statewide-rate").html("Statewide:<br/>" + (data.state ? formatNumber(data.state[0].value,selectedMeasure.default_unit) : "No data") );
		d3.select( "#about" ).append( "span" ).attr("id","dates");
		
		if ( data.state && data.state[0].dates && data.state[0].dates[0] && data.state[0].dates[1] ){
			d3.select( "#dates" ).html( "<br/><br/>Reporting date range: " + data.state[0].dates[0] + " - " + data.state[0].dates[1] );
		}
		if ( !initialized ){
			d3.select("#splash").remove();
			initialized = true;
		} else {
			d3.select("#loading").remove();
		}

		for ( i in stateGroups ){
			if ( stateGroups[i].indexOf( parseInt(id) ) != -1 ){
				d3.selectAll(".state-chart-label").style("font-weight","normal");
				d3.select(".state-chart-label:nth-child(" + (stateGroups[i].indexOf( parseInt(id) ) + 1 ) + ")").style("font-weight","bold");
				drawStateChart( stateGroups[i] );
				return;
			}
		}
		d3.select( "#state-chart" ).style("display","none");
		d3.select( "#about" ).classed("short",false);
	});
}

function getMeasureById(id){
	for ( var g in measureData ){
		for ( var i in measureData[g] ){
			if ( measureData[g][i].measure_id == id ) return measureData[g][i];
		}
	}
	return null;
}

//var stateGroups = [ [12131,12132,12133,12130], [12135,12136,12137,12129], [12146,12147,12148,12145] ];