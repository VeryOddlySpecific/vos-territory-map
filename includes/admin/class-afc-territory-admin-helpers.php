<?php 

class AFCT_Admin_Helpers {

    public function get_zip_codes( $subregion ) {
            
        echo "<pre>";
        print_r( $subregion );
        echo "</pre>";
        exit;
    }

    public function save_zip_codes( $subregions ) {

        $zip_codes = array();

        foreach( $subregions as $subregion ) {

            $subregion_zip_codes = $this->get_zip_codes( $subregion );

            $zip_codes = array_merge( $zip_codes, $subregion_zip_codes );

        }

        update_option( '_afct_zip_codes', $zip_codes );

    }
}