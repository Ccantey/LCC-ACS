<!-- Remove the scripts from top2012.inc so that we have acces to them later -->
<!DOCTYPE html>
<html lang="en">
<head>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
	<script src="//d3js.org/topojson.v1.min.js"></script>
	<script src="//d3js.org/queue.v1.min.js"></script>
	<script src="js/helper.js"></script>
	<script src="js/map.js"></script>
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
                <div class="graphicsHeader">Select a geography:</div>
		        <select id="geography-select">
		        	<option value="House">House</option>
		        	<option value="Senate">Senate</option>
		        	<option value="Congress">Congress</option>
		        	<option value="County">County</option>
		        </select>
		    </li>
            <li>
                <div class="graphicsHeader">Select a category:</div>
		        <select id="category-select">
		        	<option value="dp05">Demographic</option>
		        	<option value="dp02">Social</option>
		        	<option value="dp03">Economic</option>
		        	<option value="dp04">Housing</option>
		        </select>
		    </li>
<!--             <li>
                <div class="graphicsHeader">Select a metric:</div>
		        <select id="metric-select">
		        	<option>Demographic</option>
		        	<option>Social</option>
		        	<option>Economic</option>
		        	<option>Housing</option>
		        </select>
		    </li> -->
		    <li>
		        <div class="graphicsHeader">Search by:</div>
				    <input type="text" class="form-control" id="geoSearch" placeholder="zipcode or county">				
			
		    </li>

		</ul>
		<div id="metricsDiv">
		    <div class="graphicsHeader">Select a metric:</div><select id="metric-select"></select>
		</div>
    </div>

	<div class="panel">
		<div class="graphicsHeader"> Household by type</div>
		<div class="graphicsSubHeader"> Average Household Size</div>
		<div class="graphicsDataPoint"> 2.5</div>
		<div class="graphicsSubHeader"> Average Family Size</div>
		<div class="graphicsDataPoint"> 3.0</div>
<!-- 		<div class="graphics" id="race"> Race graphic</div>
		<div class="graphics" id="education"> Education graphic</div> -->
	</div>
	<div id="main-map"></div>
	<div id="small-map"></div>
</div>
<!-- End page specific content (leg_Col4of4-First)-->


<?
    include(INCLUDEPATH."footer2012.inc");
?> 