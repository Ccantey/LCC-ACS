$( document ).ready(function() {

    $('#main').hide();
    var selects = document.getElementById('category-select').value;
    queue()
	    .defer(d3.json, 'php/getSenateAsGeoJSON.php')	    
	    // .defer(d3.json, 'php/getHouseAsGeoJSON.php')
	    .defer(d3.json, 'php/getCongressAsGeoJSON.php')
	    // .defer(d3.json, 'php/demographics.php')
	    // .defer(d3.json, 'php/demographics.php')
	    .defer(d3.json, 'php/getACSJSON.php?selects='+selects)

	    .await(init);

	    //init will receive all the defers as parameters ie: init(error, counties, senate, house, so on so forth)
		//pass all defers into init
		function init(error, senate, congress, acs){
		    createMaps(senate, congress);
		    setupMeasures(acs);
		    // setupDemographics(acs);
		    $('#main').show();
			$('.loadingDiv').hide();  
		    // });
		}

});