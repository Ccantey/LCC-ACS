$( document ).ready(function() {

   $('#main').hide();

    queue()
	    .defer(d3.json, 'php/getCountiesAsGeoJSON.php')	    
	    // .defer(d3.json, 'php/getHouseAsGeoJSON.php')
	    .defer(d3.json, 'php/getCongressAsGeoJSON.php')
	    // .defer(d3.json, 'php/demographics.php')
	    // .defer(d3.json, 'php/demographics.php')
	    .defer(d3.json, 'php/getACSJSON.php')
	    .await(init);

	    //init will receive all the defers as parameters ie: init(error, counties, senate, house, so on so forth)


});