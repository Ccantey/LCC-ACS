<!-- Remove the scripts from top2012.inc so that we have acces to them later -->
<!DOCTYPE html>
<html lang="en">
<head>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
	<script src="//d3js.org/topojson.v1.min.js"></script>
	<script src="//d3js.org/queue.v1.min.js"></script>
	<script src="js/app.js"></script>
	<script src="js/data.js"></script>
	<script src="js/init.js"></script>
	<!-- load the header -->
	<?
	    define('INCLUDEPATH',"views/");
	    include(INCLUDEPATH."top2012.inc");

	?>
	<!-- Bring over the core js from top.inc -->
	<script type="text/javascript" src="../../css/leg_core_20.js"></script>
	<script type="text/javascript"  src="../../css/leg_mobile_20.js"></script>
	<script type="text/javascript" src="../../css/js/hideshow2.js"></script>
    <link rel="stylesheet" href="css/app.css" />
</head>

<div class='leg_Col4of4-First'> <!-- Closes in footer - so leave this openended -->
	<h2 id='map_title'>Minnesota ACS Demographics</h2>
	<div class='loadingDiv'>
	    <div class="loaderHelper">Loading Minnesota ...</div>
        <div class="loader"></div>
    </div>


    <div id="selects">
        
        <ul class="inline">
            <li>
                <h2>Select a geography:</h2>
		        <select id="geography-select">
		        	<option value="dp05">House</option>
		        	<option value="dp02">Senate</option>
		        	<option value="dp03">Congress</option>
		        	<option value="dp04">County</option>
		        </select>
		    </li>
            <li>
                <h2>Select a category:</h2>
		        <select id="category-select">
		        	<option value="dp05">Demographic</option>
		        	<option value="dp02">Social</option>
		        	<option value="dp03">Economic</option>
		        	<option value="dp04">Housing</option>
		        </select>
		    </li>
            <li>
                <h2>Select a metric:</h2>
		        <select id="category-select">
		        	<option>Demographic</option>
		        	<option>Social</option>
		        	<option>Economic</option>
		        	<option>Housing</option>
		        </select>
		    </li>
		    <li>
		        <h2>Search by:</h2>
				    <input type="text" class="form-control" id="geoSearch" placeholder="zipcode or county">				
			
		    </li>

		</ul>
    </div>

	<div class="panel">
	<!-- 	    	<div class="graphics" id="age"> Age graphic</div>
		<div class="graphics" id="income"> Income graphic</div>
		<div class="graphics" id="race"> Race graphic</div>
		<div class="graphics" id="education"> Education graphic</div> -->
	</div>
	<div id="main-map"></div>
	<div id="small-map"></div>
</div>
<!-- End page specific content (leg_Col4of4-First)-->


<?
    include(INCLUDEPATH."footer2012.inc");
?> 