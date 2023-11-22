<?php

class AFCT_Admin_Display {

    public function enqueue_styles_scripts() {

        $enqueue_items = json_decode( file_get_contents( AFCT_PATH . 'assets/enqueue.json' ), true );

        foreach ( $enqueue_items as $item ) {

            $handle = $item['handle'];
            $src = $item['src'];
            $deps = $item['deps'];
            $ver = $item['ver'];

            if ( $item['type'] !== 'style' ) {

                wp_enqueue_style( $handle, $src, $deps, $ver );

            } else {

                $in_footer = $item['in_footer'];
                wp_enqueue_script( $handle, $src, $deps, $ver, $in_footer );

                if ( isset( $item['localize'] ) && $item['localize'] === true ) {

                    $obj = array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'states' => get_option( '_afct_active_states' ),
                        'counties' => get_option( '_afct_active_counties' )
                    );

                    wp_localize_script( $handle, 'afct', $obj );

                }

            }

        }

    }

}