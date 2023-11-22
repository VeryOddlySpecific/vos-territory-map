<?php 

class AFCT {

    private $admin;
    private $public;
    private $general;

    public function __construct() {
        $this->load_dependencies();
        $this->set_controllers();
    }

    private function load_dependencies() {
        require_once AFCT_PATH . 'includes/admin/class-afc-territory-admin.php';
        require_once AFCT_PATH . 'includes/public/class-afc-territory-public.php';
        //require_once AFCT_PATH . 'includes/general/class-afct-general.php';
    }

    private function set_controllers() {
        $this->admin = new AFCT_Admin();
        $this->public = new AFCT_Public();
        //$this->general = new AFCT_General();
    }

    public function run() {
        $this->admin->run();
        $this->public->run();
        //$this->general->run();
    }
}