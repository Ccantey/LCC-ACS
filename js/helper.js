$( document ).ready(function() {
	$('#small-map').hide()
    $('#geography-select').change(function(){
		switch($('#geography-select').val()) {
		    case 'Senate':
		        $('#small-map').hide()
		        break;
		    case 'House':
		        $('#small-map').hide()
		        break;
		    case 'Congress':
		        $('#small-map').show()
		        break;
		    case 'County':
		        $('#small-map').hide()
		        break;
		    default:
		        $('#small-map').hide()
		}
    })


});