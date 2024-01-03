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

                $deps_string = "[<br>" . implode( ',<br>', $deps ) . "<br>]";

                $rendered_html_string = "wp_enqueue_style(<br>   $handle,<br>   $src,<br>   $deps_string,<br>   $ver <br>);";

            } else {

                if ( $item['in_footer'] === null ) {

                    wp_enqueue_script( $handle, $src, $deps, $ver );

                    $deps_string = "[<br>" . implode( ',<br>', $deps ) . "<br>]";

                    $rendered_html_string = "wp_enqueue_script(<br>   $handle,<br>   $src,<br>   $deps_string,<br>   $ver <br>);";

                } else {

                    $in_footer = $item['in_footer'];
                    wp_enqueue_script( $handle, $src, $deps, $ver, $in_footer );

                    $deps_string = "[<br>" . implode( ',<br>', $deps ) . "<br>]";

                    $rendered_html_string = "wp_enqueue_script(<br>   $handle,<br>   $src,<br>   $deps_string,<br>   $ver,<br>   $in_footer <br>);";
                }

                if ( isset( $item['localize'] ) && $item['localize'] === true ) {

                    $obj = array(
                        'ajax_url' => admin_url( 'admin-ajax.php' ),
                        'regions' => get_option( '_afct_active_regions' ),
                        'subregions' => get_option( '_afct_active_subregions' ),
                        'apiBase' => rest_url( 'afct/v1' ),
                        'mapData' => get_option( '_afct_map_data' ),
                    );

                    wp_localize_script( $handle, 'admin', $obj );

                }

            }

            
            //echo "<pre>";
            //echo $rendered_html_string;
            //echo "</pre>";
            

        }

        //exit;

    }

    private function resolve_src( $src ) {
            
            if ( strpos( $src, 'http' ) === 0 ) {
    
                return $src;
    
            } else {
    
                return AFCT_URL . $src;
    
            }

    }

}