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

    public function add_user_roles() {

        remove_role( 'territory-manager' );
        
        add_role( 
            'afc_territory_manager', 
            'Territory Manager',
            array(
                'edit_afc_territory' => true,
                'read' => true,
            )
        );

        $all_roles = wp_roles()->roles;

        foreach ( $all_roles as $role_name => $role_info ) {

            if ( $role_name !== 'afc_territory_manager' ) {

                $role = get_role( $role_name );

                $role->add_cap( 'edit_afc_territory' );

            }

        }

    }

    public function run() {

        add_action('init', array( $this, 'add_user_roles' ) );

        add_action('admin_init', array( $this->settings, 'register' ) );

        add_action('admin_menu', array( $this->settings, 'add_settings_page' ) );

        add_action('admin_enqueue_scripts', array( $this->display, 'enqueue_styles_scripts' ) );

        add_action('wp_enqueue_scripts', array( $this->display, 'enqueue_styles_scripts' ) );

        add_action('admin_post_save_afct_settings', array( $this->settings, 'save_settings' ) );

        add_action('rest_api_init', array( $this->settings, 'register_rest_routes' ) );

    }

}