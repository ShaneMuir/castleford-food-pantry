<?php
/**
 * Branded login screen (wp-login.php): site logo, brand colours and fonts.
 *
 * @package Castleford_Community_Food_Pantry
 */
defined( 'ABSPATH' ) || exit;

/** Load the login stylesheet. */
function cfp_login_styles() {
	$path = get_theme_file_path( 'assets/css/login.css' );
	wp_enqueue_style( 'cfp-login', get_theme_file_uri( 'assets/css/login.css' ), array( 'login' ), file_exists( $path ) ? filemtime( $path ) : null );
}
add_action( 'login_enqueue_scripts', 'cfp_login_styles' );

/** Logo links to the site, not wordpress.org. */
function cfp_login_href(): string {
	return esc_url( site_url( '/' ) );
}
add_filter( 'login_headerurl', 'cfp_login_href' );

/** Logo link text for assistive tech. */
function cfp_login_header_text() {
	return get_bloginfo( 'name' );
}
add_filter( 'login_headertext', 'cfp_login_header_text' );
