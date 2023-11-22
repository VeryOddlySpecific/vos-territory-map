<?php 

class AFCT_Admin_Display {

    private $action;

    public function __construct() {
        $this->action = esc_url( admin_url( 'admin-post.php' ) );
    }

    public function render() {
?>
    <div class="wrap">
        <form method="post" id='afct-admin-form' action="<?php echo $this->action; ?>">
            <?php do_settings_sections( 'afct-territory' ); ?>
            <input type="hidden" name="action" value="aft_save_territory">
            <input type="hidden" name="county-form-data" id="county-form-data">
            <?php submit_button(); ?>
        </form>
    </div>
<?php
    }

    public function enqueue_scripts() {
        /*
        wp_enqueue_style(
            'afct-admin-css',
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
            'afct-admin-js',
            AFCT_URL . 'build/main.js',
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
            'afct-admin-js',
            'admin',
            array(
                'states' => $this->get_states(),
                'servAreas' => $this->get_service_areas(),
                'apiBase' => get_rest_url( null, 'afct/v1/' ),
            )
        );

        global $wp_scripts;

        echo "<script>console.log(" . json_encode( $wp_scripts->registered ) . ");</script>";
    }

    public function get_states() {
        $states = get_option( 'afct_in_service_states' ) ?? array();
        return $states;
    }

    public function get_service_areas() {
        $counties = get_option( 'afct_in_service_counties' ) ?? array();
        return $counties;
    }
}