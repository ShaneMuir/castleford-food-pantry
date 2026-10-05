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

/**
 * Default favicon / app icons.
 *
 * Supplies the theme's castle mark as the Site Icon when none is set in
 * Appearance > Customize > Site Identity. WordPress then prints the usual
 * icon and apple-touch-icon links and redirects /favicon.ico to the 32px PNG.
 * A Site Icon chosen by the site owner always takes precedence.
 *
 * @param string $url     Site icon URL (empty when none is set).
 * @param int    $size    Requested icon size in pixels.
 * @return string
 */
function cfp_default_site_icon( $url, $size ) {
	if ( ! empty( $url ) ) {
		return $url;
	}
	$size = (int) $size;
	if ( $size <= 32 ) {
		$file = 'favicon-32.png';
	} elseif ( 180 === $size ) {
		$file = 'apple-touch-icon.png';
	} elseif ( $size <= 192 ) {
		$file = 'favicon-192.png';
	} else {
		$file = 'favicon-512.png';
	}
	return get_theme_file_uri( 'assets/images/favicon/' . $file );
}
add_filter( 'get_site_icon_url', 'cfp_default_site_icon', 10, 2 );

/** Crisp scalable icon for modern browsers (only when no Site Icon is set). */
function cfp_favicon_svg() {
	if ( get_option( 'site_icon' ) ) {
		return;
	}
	printf(
		'<link rel="icon" href="%s" type="image/svg+xml" sizes="any" />' . "\n",
		esc_url( get_theme_file_uri( 'assets/images/favicon/favicon.svg' ) )
	);
}
add_action( 'wp_head', 'cfp_favicon_svg', 2 );
