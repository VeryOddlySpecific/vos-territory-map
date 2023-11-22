<?php 

class AFCT_Public {

    public function __construct() {
        include_once ( AFCT_PATH . '/includes/helper-functions.php' );
    }

    public function enqueue_scripts() {
        /*
        wp_enqueue_style(
            'afct-public-css',
            AFCT_URL . 'admin.css'
        );
        */

        wp_enqueue_style( 
            'leaflet-css', 
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css'
        );

        wp_enqueue_script(
            'leaflet-js',
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            array(),
            false,
            true
        );

        wp_enqueue_script(
            'turf-js',
            'https://unpkg.com/@turf/turf@latest'
        );

        wp_enqueue_script(
            'afct-public-js',
            AFCT_URL . 'build/public.js',
            array( 
                'wp-components',
                'wp-element',
                'react',
                'react-dom',
                'leaflet-js',
                'jquery' 
            ),
            false,
            true
        );

        wp_localize_script(
            'afct-public-js',
            'publicData',
            array(
                'states' => $this->get_states(),
                'serviceAreas' => $this->get_service_areas(),
                'apiRoute' => get_rest_url( null, 'afct/v1/' )
            )
        );
    }

    public function get_states() {
        $states = get_option( 'afct_in_service_states' ) ?? array();
        return $states;
    }

    public function get_service_areas() {
        $counties = get_option( 'afct_in_service_counties' ) ?? array();
        return $counties;
    }

    public function run() {
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
        //add_shortcode( 'afct_territory_map', array( $this, 'render_territory_map' ) );
    }
}