<?php 

class AFCT_Public {

    public function enqueue_styles_scripts() {

        $enqueue_items = json_decode( file_get_contents( AFCT_PATH . 'includes/assets/enqueue.json' ), true );

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

    public function custom_rewrite_rules() {

        add_rewrite_rule( '^city/([^/]+)/?', 'index.php?city=$matches[1]', 'top' );
    }

    public function add_query_vars( $vars ) {

        $vars[] = 'city';
        return $vars;

    }

    public function handle_city_url() {
        require_once AFCT_PATH . 'includes/public/class-afc-territory-city.php';

        global $wp_query;

        $city = $wp_query->query['attachment'];
        $post = get_page_by_title( $city, OBJECT, 'city' );

        if (!$post) {
            // $city_name and $state are split from $city, formatted as 'city-name-state'
            $city_data = explode( '-', $city );
            $state = strtoupper( array_pop( $city_data ) );
            $city_name = ucwords( str_replace( '-', ' ', implode( '-', $city_data ) ) );

            $city_data = json_decode( file_get_contents( AFCT_PATH . 'includes/assets/citydata.json' ), true )['features'];

           

            $matching_city = array_filter( 
                $city_data, 
                function( $city ) use ( $city_name, $state ) {
                    $check_name = $city['properties']['city'];
                    $check_state = $city['properties']['state'];

                    return $check_name === $city_name && $check_state === $state; 
                } 
            );

            if ($matching_city) {

                echo "<pre>";
                print_r( $matching_city[0] );
                echo "</pre>";
                exit;
                
                $new_city = new AFCT_City( $matching_city );

                // check if city has branch
                // if so, set content based on branch data
                // else, set content to default
            }
        }
    }

    public function run() {

       add_action( 'init', array( $this, 'custom_rewrite_rules' ) );
       add_action( 'query_vars', array( $this, 'add_query_vars' ) );
       add_action( 'template_redirect', array( $this, 'handle_city_url' ) );

    }

}