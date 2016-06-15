<?php
# Connect to PostgreSQL database
$conn = new PDO('pgsql:host=###;dbname=###','###','###');

$selected = $_GET["selects"];

if ($selected == 'dp05') {
  $title = "Demographic";
  $hcXX_vcXX = array('hc03_vc79', 'hc03_vc80', 'hc03_vc81' ,'hc03_vc88', 'hc03_vc49'); //fields
};

if ($selected == 'dp02') {
  $title = "Social";
  $hcXX_vcXX = array('hc01_vc03', 'hc01_vc04', 'hc01_vc05', 'hc01_vc06', 'hc01_vc07');
}
if ($selected == 'dp03') {
  $title = "Economic";
}
if ($selected == 'dp04') {
  $title = "Housing";
}


$geography = $_GET['geography'];

if ($geography == 'House') {
  $unit = "house";
  $fields = "geo_id as houseId, geo_display";
};
if ($geography == 'Senate') {
  $unit = "senate";
  $fields = "geo_id as senateId, geo_display";
};
if ($geography == 'Congress') {
  $unit = "Congress";
  $fields = "geo_id as scongresId, geo_display";
};
if ($geography == 'County') {
  $unit = "cty";
  $fields = "geo_id2 as countyId, geo_display";
};


//functions to create queries using ^ ifs from above
$hcvc = createQuery($hcXX_vcXX);
function createQuery($fieldsArray){
    $queryArray = "";
    foreach ($fieldsArray as $field) {
      $queryString = "a.".$field.", b.".$field." " .$field."_description,";
      $pivotString = "MAX (CASE WHEN name = '".$field."' then description END) ".$field.",";
      $pivotArray .= $pivotString;
      $queryArray .= $queryString;
    }
    return rtrim($queryArray, ",");
}

$pivot = createPivot($hcXX_vcXX);
function createPivot($fieldsArray){
    $pivotArray = "";
    foreach ($fieldsArray as $field) {
      $pivotString = "MAX (CASE WHEN name = '".$field."' then description END) ".$field.",";
      $pivotArray .= $pivotString;
    }
    return rtrim($pivotArray, ",");
}
// $sql = 'SELECT '.$fields.', '.$hcvc.' FROM acs_14_5yr_'.$selected.'_'.$unit;

$sql = "SELECT ".$fields.", ".$hcvc." FROM public.acs_14_5yr_".$selected."_".$unit." a, (SELECT " .$pivot. " FROM public.acs_14_5yr_".$selected."_metadata) b";

// returns this: 
// $sql = 
// SELECT 
//   geo_id as senateId, geo_display,
//   a.hc03_vc79, b.hc03_vc79 hc03_vc79_description, 
//   a.hc03_vc80, b.hc03_vc80 hc03_vc80_description, 
//   a.hc03_vc81, b.hc03_vc81 hc03_vc81_description, 
//   a.hc03_vc88, b.hc03_vc88 hc03_vc88_description, 
//   a.hc03_vc49, b.hc03_vc49 hc03_vc49_description
// FROM
//       public.acs_14_5yr_dp05_senate a, 
//       (
//       SELECT 
//       MAX (CASE WHEN name = 'hc03_vc79' then description END) hc03_vc79, 
//       MAX (CASE WHEN name = 'hc03_vc80' then description END) hc03_vc80, 
//       MAX (CASE WHEN name = 'hc03_vc81' then description END) hc03_vc81, 
//       MAX (CASE WHEN name = 'hc03_vc88' then description END) hc03_vc88, 
//       MAX (CASE WHEN name = 'hc03_vc49' then description END) hc03_vc49 
//       FROM
//         public.acs_14_5yr_dp05_metadata
//       ) b

# Try query or error
$rs = $conn->query($sql);
if (!$rs) {
    echo 'An SQL error occured.\n' .$sql;
    exit;
}

# Build GeoJSON feature collection array
$acsjson = array(
   // 'type'      => 'FeatureCollection',
   'ACSdata'  => array()
);

// # Loop through rows to build feature arrays
while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
    $properties = $row;
    $feature = array(
         'geographicProfile' => $properties
    );
    # Add feature arrays to feature collection array
    array_push($acsjson['ACSdata'], $feature);
}

header('Content-type: application/json');
echo json_encode($acsjson, JSON_NUMERIC_CHECK);
$conn = NULL;
?>