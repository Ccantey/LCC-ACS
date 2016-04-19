<!-- Remove the scripts from top2012.inc so that we have acces to them later -->
<!DOCTYPE html>
<html lang="en">
<head>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
	<script src="//d3js.org/topojson.v1.min.js"></script>
	<script src="js/app.js"></script>
	<script src="js/helper.js"></script>
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
    <div class="loader"></div>
    <div id='main'>
    	<div class="graphics" id="age"> Age graphic</div>
    	<div class="graphics" id="income"> Income graphic</div>
    	<div class="graphics" id="race"> Race graphic</div>
    	<div class="graphics" id="education"> Education graphic</div>
    </div>

<?
    include(INCLUDEPATH."footer2012.inc");
?>