<?php 

class AFCT_Admin {
    
    private $display;
    private $settings;

    public function __construct() {
        $this->load_dependencies();
        $this->set_controllers();
    }

    private function load_dependencies() {
        require_once AFCT_PATH . 'includes/admin/class-afc-territory-admin-display.php';
        require_once AFCT_PATH . 'includes/admin/class-afc-territory-settings.php';
    }

    private function set_controllers() {
        $this->display = new AFCT_Admin_Display();
        $this->settings = new AFCT_Settings();
    }

    public function add_admin_page() {
        add_menu_page(
            'AFCT Territory',
            'AFCT Territory',
            'manage_options',
            'afct-territory',
            array( $this->display, 'render' ),
            'dashicons-location-alt',
            6
        );
    }

    /**
     * Save the territory settings
     * Retrieve the selected counties and states from the $_POST array
     * Save the states to the database
     * Process through the counties and save active counties to the database with their values
     * Saved county data should have the GEOID and the service area, which is in the value attribute, with the following structure
     * <input type="checkbox" name="selectedCounties[]" id="GEOID" value="service-area-GEOID">
     * 
     */
    public function save_territory() {

        $branches = json_decode( file_get_contents( AFCT_PATH . 'includes/admin/branches.json' ) );

        $counties = array();
        foreach ( $branches as $branch ) {
            $area = $branch->value;
            $counties[$area] = $_POST[$area];
        }

        update_option( 'afct_in_service_counties', $counties );

        update_option( 'afct_in_service_states', $_POST['stateSelection'] );

        wp_redirect( admin_url( 'admin.php?page=afct-territory' ) );
        exit;

    }

    public function run() {
        add_action( 'admin_init', array( $this->settings, 'register' ) );
        add_action( 'admin_menu', array( $this, 'add_admin_page' ) );
        add_action( 'rest_api_init', array( $this->settings, 'register_rest_routes' ) );
        add_action( 'admin_enqueue_scripts', array( $this->display, 'enqueue_scripts' ) );
        add_action( 'admin_post_aft_save_territory', array( $this, 'save_territory' ) );
    }
}