$( document ).ready(function() {

	//get previous state of select box
	$('#geography-select').focus(function(){
        prevGeogState = this.value;
        console.log(prevGeogState)
    //the execute changes
	}).change(function(){
        active.classed("active", false);
        reset(geoMap[prevGeogState]);
        prevGeogState = this.value;
		switch($('#geography-select').val()) {
		    case 'Senate':
		        senateLayer.style("display","block");
		        houseLayer.style("display","none");
		        insetCountyLayer.style("display","none");
		        countyLayer.style("display","none");
		        congressionalLayer.style("display","none");
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
		        insetCountyLayer.style("display","none");
		}
    })


});