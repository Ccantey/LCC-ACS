$( document ).ready(function() {
	// $('#small-map').hide()
	console.log('insidechange')
    $('#geography-select').change(function(){

		switch($('#geography-select').val()) {
		    case 'Senate':
		        senateLayer.style("display","block");
		        houseLayer.style("display","none");
		        insetCountyLayer.style("display","none");
		        countyLayer.style("display","none");
		        congressionalLayer.style("display","none");
		        //WILL USE!! senateLayer.style("display","block"); to toggle
		        break;
		    case 'House':
		        houseLayer.style("display","block");
		        senateLayer.style("display","none");
		        insetCountyLayer.style("display","none");
		        congressionalLayer.style("display","none");
		        countyLayer.style("display","none");
		        break;
		    case 'Congress':
		        congressionalLayer.style("display","block");
		        houseLayer.style("display","none");
		        senateLayer.style("display","none");
		        insetCountyLayer.style("display","block");
		        countyLayer.style("display","none");
		        break;
		    case 'County':
		        houseLayer.style("display","none");
		        senateLayer.style("display","none");
		        insetCountyLayer.style("display","none");
		        congressionalLayer.style("display","none");
		        countyLayer.style("display","block");
		        break;
		    default:
		        // $('#small-map').hide();
		        insetCountyLayer.style("display","none");
		}
    })


});