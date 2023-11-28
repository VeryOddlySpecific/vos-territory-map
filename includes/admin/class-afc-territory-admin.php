<?php 

class AFCT_Admin {

    protected $display;
    protected $settings;

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

    public function run() {

        add_action('admin_init', array( $this->settings, 'register' ) );

        add_action('admin_menu', array( $this->settings, 'add_settings_page' ) );

        add_action('admin_enqueue_scripts', array( $this->display, 'enqueue_styles_scripts' ) );

        add_action('admin_post_save_afct_settings', array( $this->settings, 'save_settings' ) );

        add_action('rest_api_init', array( $this->settings, 'register_rest_routes' ) );

    }

}