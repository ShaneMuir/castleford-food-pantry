<?php
/**
 * Asset pipeline: styles, hero script, preloads, skip link.
 *
 * @package Castleford_Community_Food_Pantry
 */

defined( 'ABSPATH' ) || exit;

require_once get_template_directory() . '/inc/helpers.php';

/**
 * Enqueue theme CSS and the hero progressive-enhancement script.
 */
function cfp_enqueue_assets() {
	$ver = wp_get_theme()->get( 'Version' );
	wp_enqueue_style( 'cfp-theme', get_theme_file_uri( 'assets/css/theme.css' ), array(), filemtime( get_theme_file_path( 'assets/css/theme.css' ) ) ?: $ver );
	if ( is_front_page() ) {
		wp_enqueue_script( 'cfp-hero', get_theme_file_uri( 'assets/js/hero.js' ), array(), filemtime( get_theme_file_path( 'assets/js/hero.js' ) ) ?: $ver, array( 'strategy' => 'defer', 'in_footer' => true ) );
	}
}
add_action( 'wp_enqueue_scripts', 'cfp_enqueue_assets' );

/** Same stylesheet inside the editor so patterns look right while editing. */
function cfp_editor_assets() {
	add_editor_style( 'assets/css/theme.css' );
}
add_action( 'after_setup_theme', 'cfp_editor_assets' );

/** Replace core's skip link with ours (header pattern), avoiding duplicates. */
remove_action( 'wp_footer', 'the_block_template_skip_link' );

/** Preload the hero poster and the heading font (LCP + font swap, Req 14). */
function cfp_preloads() {
	if ( ! is_front_page() ) {
		return;
	}
	printf( '<link rel="preload" as="image" href="%s" fetchpriority="high" />' . "\n", esc_url( get_theme_file_uri( 'assets/images/poster.webp' ) ) );
	printf( '<link rel="preload" as="font" type="font/woff2" href="%s" crossorigin />' . "\n", esc_url( get_theme_file_uri( 'assets/fonts/poppins-700.woff2' ) ) );
}
add_action( 'wp_head', 'cfp_preloads', 1 );

/** Pattern category for the site sections. */
function cfp_pattern_category() {
	register_block_pattern_category( 'cfp', array( 'label' => __( 'Castleford Food Pantry', 'castleford-food-pantry' ) ) );
}
add_action( 'init', 'cfp_pattern_category' );
