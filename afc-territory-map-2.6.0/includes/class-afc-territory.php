<?php 

class AFCT {

    private $admin;
    private $public;

    public function __construct() {

        $this->load_deps();
        $this->set_controls();

    }

    private function load_deps() {

        require_once AFCT_PATH . 'includes/admin/class-afc-territory-admin.php';
        require_once AFCT_PATH . 'includes/public/class-afc-territory-public.php';

    }

    private function set_controls() {

        $this->admin = new AFCT_Admin();
        $this->public = new AFCT_Public();

    }

    public function run() {

        $this->admin->run();
        $this->public->run();

    }
}