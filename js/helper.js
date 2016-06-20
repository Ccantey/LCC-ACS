$( document ).ready(function() {

	//get previous state of select box
	$('#geography-select').focus(function(){
        prevGeogState = this.value;
    //then execute changes
	}).change(function(){
        active.classed("active", false);
        reset(geoMap[prevGeogState]);
        prevGeogState = this.value;
		switch(prevGeogState) {
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
    });


   $('#category-select').focus(function(){
        prevCatState = this.value;
    //then execute changes
	}).change(function(){
		switch($('#category-select').val()) {
		    case 'dp05':
		        console.log('demographic')
		        break;
	        case 'dp02':
		        console.log('social')
		        break;
	        case 'dp03':
		        console.log('economic')
		        break;
	        case 'dp04':
		        console.log('housing')
		        break;

	    }
    });

});