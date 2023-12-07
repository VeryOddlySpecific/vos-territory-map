<?php

class AFCT_Admin_Display {

    public function enqueue_styles_scripts() {

        $enqueue_items = json_decode( file_get_contents( AFCT_PATH . 'includes/assets/enqueue.json' ), true );

        foreach ( $enqueue_items as $item ) {

            $handle = $item['handle'];
            $src = $this->resolve_src( $item['src'] );
            $deps = $item['deps'];
            $ver = $item['ver'];

            if ( $item['type'] === 'style' ) {

                wp_enqueue_style( $handle, $src, $deps, $ver );

            } else {

                $in_footer = isset( $item['in_footer'] ) ? $item['in_footer'] : false;
                wp_enqueue_script( $handle, $src, $deps, $ver, $in_footer );

                if ( isset( $item['localize'] ) && $item['localize'] === true ) {

                    $obj = array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'regions' => get_option( '_afct_active_regions' ),
                        'subregions' => get_option( '_afct_active_subregions' ),
                        'apiBase' => rest_url( 'afct/v1' ),
                    );

                    wp_localize_script( $handle, 'admin', $obj );

                }

            }

        }

    }

    private function resolve_src( $src ) {
            
            if ( strpos( $src, 'http' ) === 0 ) {
    
                return $src;
    
            } else {
    
                return AFCT_URL . $src;
    
            }

    }

}