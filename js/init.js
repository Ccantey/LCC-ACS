$( document ).ready(function() {

    $('#main').hide();
    var selects = document.getElementById('category-select').value;
    var geography = document.getElementById('geography-select').value;

    queue()
	    .defer(d3.json, 'php/getSenateAsGeoJSON.php')	    
	    .defer(d3.json, 'php/getHouseAsGeoJSON.php')
	    .defer(d3.json, 'php/getCongressAsGeoJSON.php')
	    .defer(d3.json, 'php/getCountiesAsGeoJSON.php')
	    // .defer(d3.json, 'php/demographics.php')
	    // .defer(d3.json, 'php/demographics.php')
	    .defer(d3.json, 'php/getACSJSON.php?selects='+selects+'&geography='+geography)

	    .await(init);

	    //init will receive all the defers as parameters ie: init(error, counties, senate, house, so on so forth)
		//pass all defers into init
		function init(error, senate, house, congress, counties, acs){
		    createMaps(senate, house, congress, counties);
		    setupMeasures(acs);

		    // helper.geography()
		    // setupDemographics(acs);
		    $('#main').show();
			$('.loadingDiv').hide();  
		    // });
		}

});