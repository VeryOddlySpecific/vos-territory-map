<?php 

include_once (AFCT_PATH . 'vendor/phayes/geophp/geoPHP.inc');
function get_state_shape($state) {

    $state_json = json_decode( file_get_contents( AFCT_PATH . "states/$state.geojson" ), true );

    $geojson_reader = new GeoJSON();

    $geometry = geoPHP::load( $state_json['features'][0]['geometry'], 'geojson' );

    echo "<pre>";
    print_r( $geometry );
    echo "</pre>";
    exit;

}


//get_state_shape(31);