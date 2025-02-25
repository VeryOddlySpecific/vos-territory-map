<?php
/**
 * Plugin Name: American Fence Territory
 * Description: Territory map for American Fence
 * Version: 2.6.0
 * Author: Eugene Bates
 * Contributors: Alexander Steadman, Vannesa Kasun
 * License: GPL2
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

// Define plugin constants
define( 'AFCT_PATH', plugin_dir_path( __FILE__ ) );
define( 'AFCT_URL', plugin_dir_url( __FILE__ ) );
define( 'AFCT_VERSION', '2.6.0' );

// Include plugin files
require_once AFCT_PATH . 'includes/class-afc-territory.php';

$plugin = new AFCT();
$plugin->run();