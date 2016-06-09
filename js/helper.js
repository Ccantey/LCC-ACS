$( document ).ready(function() {
	// $('#small-map').hide()
	console.log('insidechange')
    $('#geography-select').change(function(){

		switch($('#geography-select').val()) {
		    case 'Senate':
		        // $('#small-map').hide()
		        insetCountyLayer.style("display","none");
		        //WILL USE!! senateLayer.style("display","block"); to toggle
		        break;
		    case 'House':
		        // $('#small-map').hide();
		        insetCountyLayer.style("display","none");
		        break;
		    case 'Congress':
		        // $('#small-map').show();
		        insetCountyLayer.style("display","block");
		        break;
		    case 'County':
		        // $('#small-map').hide();
		        insetCountyLayer.style("display","none");
		        break;
		    default:
		        // $('#small-map').hide();
		        insetCountyLayer.style("display","none");
		}
    })


});