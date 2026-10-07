<?php
/**
 * Castleford Community Food Pantry theme bootstrap.
 *
 * Sets up theme supports, loads the text domain, and wires in the
 * asset pipeline (inc/assets.php) and SEO output (inc/seo.php).
 *
 * @package Castleford_Community_Food_Pantry
 */

defined( 'ABSPATH' ) || exit;

/**
 * Register theme supports and load the text domain.
 *
 * Hooked on `after_setup_theme`.
 *
 * @return void
 */
function castleford_food_pantry_setup() {
	// Make the theme available for translation.
	load_theme_textdomain( 'castleford-food-pantry', get_template_directory() . '/languages' );

	// Core block-theme and HTML output supports.
	add_theme_support( 'title-tag' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'editor-styles' );

	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
		)
	);
}
add_action( 'after_setup_theme', 'castleford_food_pantry_setup' );

// Load the asset pipeline and SEO/structured-data output.
require get_template_directory() . '/inc/assets.php';
require get_template_directory() . '/inc/seo.php';
require get_template_directory() . '/inc/login.php';
require get_template_directory() . '/inc/media.php';
require get_template_directory() . '/inc/blocks.php';
require get_template_directory() . '/inc/setup.php';
