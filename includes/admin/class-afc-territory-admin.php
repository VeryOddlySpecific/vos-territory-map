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

        add_action('admin_init', array( $this->settings, 'register_settings' ) );
        add_action('admin_init', array( $this->settings, 'add_settings_sections' ) );

        add_action('admin_menu', array( $this->settings, 'add_settings_page' ) );

        add_action('admin_enqueue_scripts', array( $this->display, 'enqueue_styles_scripts' ) );
    }

}