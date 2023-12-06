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

        $territory_container = '<div id="state-selector"></div>';
        $territory_container .= '<div id="county-card"></div>';
        $territory_container .= '<div id="afc-territory-map" style="height:600px;"></div>';

        echo $territory_container;
        
    }

    public function render_settings_page() {

        $form = '<form method="post" id="afc-territory-settings" action="' . admin_url( 'admin-post.php' ) . '">';
        // <input type="hidden" id="action" name="action" value="save_afct_settings" />
        $form .= wp_nonce_field( 'save_afct_settings', 'action', true, false );
        do_settings_sections( 'afc-territory-map' );
        submit_button( 'Save Settings' );
        $form .= '</form>';

        echo $form;

    }

    public function add_settings_page() {

        add_menu_page(
            'AFC Territory Map',
            'Territory Map',
            'manage_options',
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

    }

    public function save_map_settings( $request ) {

        $payload    = $request->get_json_params();
        $key        = $payload['id'];
        $data       = $payload['data'];

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