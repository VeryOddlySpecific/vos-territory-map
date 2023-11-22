<?php 

class AFCT_Settings {

    public function state_select_callback() {
        echo '';
    }

    public function state_selection_callback() {
        /*
        $state_data = json_decode( file_get_contents( AFCT_PATH . 'includes/admin/fips.json' ), true );
        $html = '<div class="afct-state-select">';

        foreach ( $state_data as $fips => $name ) {
            $current_selection = get_option( 'afct_in_service_states' ) ? get_option( 'afct_in_service_states' ) : array();
            $checked = in_array( $fips, $current_selection ) ? 'checked' : '';
            $html .= '<div id="state-' . $fips . '" class="afct-state-select__item admin-state-' . sanitize_title( $name ) . '">';
            $html .= '<input type="checkbox" name="selectedStates[]" value="' . $fips . '" ' . $checked . '>';
            $html .= '<label>' . $name . '</label>';
            $html .= '</div>';
        }

        $html .= '</div>';
        */
        $html = '<div id="afct-state-select"></div>';

        echo $html;
    }
    
    public function county_selection_section_callback() {
        echo '';
    }

    public function county_selection_field_callback() {
        echo '<div id="county-card"></div>';
        echo '<div id="territory-map" style="height: 600px"></div>';
    }

    public function register_settings() {
        register_setting( 'afct_settings', 'afct_state_selection' );
        register_setting( 'afct_settings', 'afct_county_selection' );
    }

    public function add_settings_sections() {
        add_settings_section(
            'afct_state_selection_section',
            'Select State(s)',
            array( $this, 'state_select_callback' ),
            'afct-territory'
        );

        add_settings_section(
            'afct_county_selection_section',
            'Select County(s)',
            array( $this, 'county_selection_section_callback' ),
            'afct-territory'
        );
    }

    public function add_settings_fields() {
        add_settings_field(
            'afct_state_selection_field',
            'State(s)',
            array( $this, 'state_selection_callback' ),
            'afct-territory',
            'afct_state_selection_section'
        );

        add_settings_field(
            'afct_county_selection_field',
            'County(s)',
            array( $this, 'county_selection_field_callback' ),
            'afct-territory',
            'afct_county_selection_section'
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
            '/public',
            array(
                'methods' => 'GET',
                'callback' => array( $this, 'rest_get_public' )
            )
        );

        register_rest_route(
            'afct/v1',
            '/fips',
            array(
                'methods' => 'GET',
                'callback' => array( $this, 'rest_get_fips' )
            )
        );
    }

    public function rest_get_fips() {
        $fips_json = json_decode( file_get_contents( AFCT_PATH . 'includes/admin/fips.json' ), true );
        return rest_ensure_response( $fips_json );
    }

    public function rest_get_public() {
        $public = json_decode( get_option( 'afct_public_map' ) ) ?? '';
        return rest_ensure_response( $public );
    }

    public function rest_get_state( $data ) {
        $state = $data['id'];
        $state_json = json_decode( file_get_contents( AFCT_PATH . 'states/' . $state . '.geojson' ) );
        return rest_ensure_response( $state_json );
    }

    public function register() {
        $this->register_settings();
        $this->add_settings_sections();
        $this->add_settings_fields();
    }
}