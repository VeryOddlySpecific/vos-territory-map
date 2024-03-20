<?php

class AFCT_Settings {

    public function register_settings() {

        register_setting( 'afct_settings', '_afct_active_states' );
        register_setting( 'afct_settings', '_aftc_active_counties' );

    }

    public function save_settings() {

        $counties = $_POST['_afct_active_counties'];
        $states = $_POST['_afct_active_states'];

        update_option( '_afct_active_counties', $counties );
        update_option( '_afct_active_states', $states );

        wp_redirect( admin_url( 'admin.php?page=afc-territory-map' ) );
        exit;

    }

    public function get_settings() {

        $settings = array(
            'states' => get_option( '_afct_active_states' ),
            'counties' => get_option( '_afct_active_counties' )
        );

        return $settings;

    }

    public function add_settings_sections() {

        add_settings_section(
            'afct_settings',
            'Territory Settings',
            array( $this, 'add_settings_fields' ),
            'afc-territory-map'
        );

    }

    public function add_settings_fields() {

        add_settings_field(
            'afct_territory_selection',
            'Territory Selection',
            array( $this, 'render_territory_selection' ),
            'afc-territory-map',
            'afct_settings'
        );

    }

    public function render_territory_selection() {

        $territory_container = '<div id="afc-territory-map"></div>';

        echo $territory_container;
        
    }

    public function render_settings_page() {

        $territory_container = '<div id="afc-territory-map"></div>';

        echo $territory_container;

    }

    public function add_settings_page() {

        add_menu_page(
            'AFC Territory Map',
            'Territory Map',
            'edit_afc_territory',
            'afc-territory-map',
            array( $this, 'render_settings_page' ),
            'dashicons-location-alt',
            6
        );

    }

    

    public function register_rest_routes() {

        register_rest_route(
            'afct/v1',
            '/state/(?P<id>\d+)',
            array(
                'methods' => 'GET',
                'callback' => array( $this, 'rest_get_state' )
            )
        );

        register_rest_route(
            'afct/v1',
            '/save',
            array(
                'methods' => 'POST',
                'callback' => array( $this, 'save_map_settings' ),
            )
        );

        register_rest_route(
            'afct/v1',
            '/save-branch-cities',
            array(
                'methods' => 'POST',
                'callback' => array( $this, 'save_branch_cities' ),
            )
        );

        register_rest_route(
            'afct/v1',
            '/get-branch-cities',
            array(
                'methods' => 'GET',
                'callback' => array( $this, 'get_branch_cities' ),
            )
        );

        register_rest_route(
            'afct/v1',
            '/get-service-cities',
            array(
                'methods' => 'GET',
                'callback' => array( $this, 'get_service_cities' ),
            )
        );

        register_rest_route(
            'afct/v1',
            '/get-cities',
            array(
                'methods' => 'GET',
                'callback' => array( $this, 'get_cities' )
            )
        );

    }

    public function get_cities() {
        $city_data = file_get_contents( AFCT_PATH . 'includes/assets/citydata.json' );

        return rest_ensure_response( $city_data );
    }

    public function save_branch_cities() {

        $payload = $request->get_json_params();
        $branch_cities = $payload['branch_cities'];

        update_option( '_afct_branch_cities', $branch_cities );

        return rest_ensure_response( array( 'success' => true ) );
        
    }

    public function get_branch_cities( $request ) {

        $payload            = $request->get_params();
        $site_url           = $payload['site_url'];

        $all_branch_cities  = json_decode( get_option( '_afct_branch_cities' ), true );
        $branch_id          = $this->get_branch_id( $site_url );
        $branch_cities_key  = array_search( $branch_id, array_column( $all_branch_cities, 'branch' ) );
        $branch_cities      = $all_branch_cities[$branch_cities_key]['cities'];

        return rest_ensure_response( $branch_cities );

    }

    public function get_service_cities( $request ) {
        
    }
    
    public function get_branch_id( $site_url ) {

        $branches   = json_decode( file_get_contents( AFCT_PATH . 'includes/assets/branches.json' ) );

        $branch     = array_search( $site_url, array_column( $branches, 'url' ) );
        $branch_id  = $branches[$branch]->value;

        return $branch_id;
    }

    public function save_map_settings( $request ) {

        
        $payload    = $request->get_json_params();
        $key        = $payload['id'];
        $data       = $payload['data'];
        $new_data   = array();
        

        if ( $key === '_afct_active_subregions' ) {
            $decoded_data = json_decode( $data, true );
            // for each subregion in $data
            //      get subregion name and state
            //      get zip codes from assets/zip_code_database.json
            //      where zip_code->state === state && zip_code->county === subregion_name + ' County'
            //      set subregion->zip_codes = zip_codes

            // update_option( $key, $data );
            // return rest_ensure_response( array( 'success' => true, 'key' => $key ) );
            $count = 0;
            foreach ( $decoded_data as $subregion ) {
                // subregion is an array:
                // [
                //      '_afct_id' => 'subregions-31',
                //      'branch' => '3',
                //      'geoid' => '31001',
                // ]
                $count++;
                $fips_data  = json_decode( file_get_contents( AFCT_PATH . 'includes/assets/fips.json' ), true );
                $counties   = json_decode( file_get_contents( AFCT_PATH . 'includes/assets/states/' . $state_id . '.geojson' ), true);
                $zip_codes  = json_decode( file_get_contents( AFCT_PATH . 'includes/assets/zip_code_database.json' ), true );
                
                $geoid      = $subregion['geoid'];
                $state_id   = substr( $geoid, 0, 2 );
                $county_id  = substr( $geoid, 2, 3 );

                update_option( 'subregion_stage', 'split the geoid' );
                

                $features   = $counties['features'];
                update_option( 'subregion_stage', $features );
                continue;
                $selection  = array_filter( $features, function( $feature ) use ( $geoid ) {
                    return $feature['properties']['GEOID'] === $geoid;
                } );
                update_option( 'subregion_stage', array('selected the feature', $selection) );
                
                
                $state_abbr = array_filter( $fips_data, function( $fips ) use ( $state_id ) {
                    return $fips['fips'] === $state_id;
                } );
                $feat_name  = $selection[0]['properties']['Name'] . ' County';

                $new_zips   = array_filter( $zip_codes, function( $code_obj ) use ( $state_abbr, $feat_name ) {
                    return $code_obj['state'] === $state_abbr && $code_obj['county'] === $feat_name;
                } );
                $raw_codes  = array_map( function( $code_obj ) {
                    return $code_obj['zip'];
                }, $new_zips );

                $subregion['zip_codes'] = $raw_codes;

                update_option( 'subregion_' . $count, $subregion );
            }

            update_option( $key, $data );
            $type_of_data = gettype( $data );
            update_option( $key . '_type', $type_of_data );
            return rest_ensure_response( array( 'success' => true, 'key' => $key ) );
        }

        update_option( $key, $data );

        /*
        foreach( $data as $key => $value ) {

            update_option( $key, $value );

        }
        */

        return rest_ensure_response( array( 'success' => true, 'key' => $key ) );

    }

    

    public function rest_get_state( $fips ) {

        $state = $fips['id'];

        $state_json = json_decode( file_get_contents( AFCT_PATH . 'includes/assets/states/' . $state . '.geojson' ) );

        return rest_ensure_response( $state_json );

    }

    public function register() {

        $this->register_settings();
        $this->add_settings_sections();

    }

}