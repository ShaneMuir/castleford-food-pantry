<?php
/**
 * One-time (idempotent) content setup so everything is editable in the CMS:
 *  - starter images/logo/video imported into the media library
 *  - Primary and Footer navigation menus (wp_navigation posts)
 *  - the Site Logo
 *  - a "Home" page built from the section patterns, set as the static front page
 *
 * Runs on theme activation, and once on the first wp-admin load after an update.
 * Existing content is never overwritten unless --reset-home is passed to WP-CLI.
 *
 * @package Castleford_Community_Food_Pantry
 */
defined( 'ABSPATH' ) || exit;

/** Bump to re-run setup (media/menus/logo/home) on the next admin load. */
const CFP_SETUP_VERSION = '1';

/** Section patterns that make up the Home page, in order. */
function cfp_home_sections() {
	return array( 'hero', 'about', 'get-help', 'donate', 'volunteer', 'sponsors', 'contact' );
}

/**
 * Render a theme pattern file to a block-markup string.
 *
 * @param string $name File name in patterns/ without extension.
 * @return string
 */
function cfp_pattern_markup( $name ) {
	$file = get_theme_file_path( 'patterns/' . $name . '.php' );
	if ( ! is_readable( $file ) ) {
		return '';
	}
	ob_start();
	include $file;
	return trim( (string) ob_get_clean() );
}

/**
 * Create (or find) a navigation menu post.
 *
 * @param string   $key   Option key suffix: primary|footer.
 * @param string   $title Post title.
 * @param string[] $items Label => URL.
 * @return int Post ID.
 */
function cfp_ensure_menu( $key, $title, $items ) {
	$opt = 'cfp_menu_' . $key;
	$id  = (int) get_option( $opt );
	if ( $id && 'wp_navigation' === get_post_type( $id ) && 'trash' !== get_post_status( $id ) ) {
		return $id;
	}
	$content = '';
	foreach ( $items as $label => $url ) {
		$content .= '<!-- wp:navigation-link ' . wp_json_encode(
			array(
				'label'          => $label,
				'type'           => 'custom',
				'url'            => $url,
				'kind'           => 'custom',
				'isTopLevelLink' => true,
			),
			JSON_UNESCAPED_SLASHES
		) . " /-->\n";
	}
	$id = wp_insert_post(
		array(
			'post_type'    => 'wp_navigation',
			'post_status'  => 'publish',
			'post_title'   => $title,
			'post_name'    => sanitize_title( $title ),
			'post_content' => trim( $content ),
		)
	);
	if ( $id && ! is_wp_error( $id ) ) {
		update_option( $opt, (int) $id, false );
		return (int) $id;
	}
	return 0;
}

/** ID of the Primary or Footer menu (0 if not created yet). */
function cfp_menu_id( $key ) {
	$id = (int) get_option( 'cfp_menu_' . $key );
	return ( $id && 'wp_navigation' === get_post_type( $id ) ) ? $id : 0;
}

/**
 * Run the setup.
 *
 * @param bool $reset_home Rebuild the Home page content from the patterns.
 * @return array<string,mixed> Summary of what happened.
 */
function cfp_run_setup( $reset_home = false ) {
	$summary = array();

	// 1. Media.
	$media            = cfp_import_starter_media();
	$summary['media'] = count( $media );

	// 2. Menus.
	$sections = array(
		'About'    => '/#about',
		'Get help' => '/#get-help',
		'Support us' => '/#donate',
		'Volunteer' => '/#volunteer',
		'Partners' => '/#sponsors',
		'Contact'  => '/#contact',
	);
	$summary['menu_primary'] = cfp_ensure_menu( 'primary', 'Primary navigation', $sections );
	$summary['menu_footer']  = cfp_ensure_menu( 'footer', 'Footer navigation', $sections );

	// 3. Site logo.
	if ( ! get_option( 'site_logo' ) && ! empty( $media['logo'] ) ) {
		update_option( 'site_logo', (int) $media['logo'] );
		$summary['site_logo'] = (int) $media['logo'];
	}

	// 4. Home page.
	$home_id = (int) get_option( 'cfp_home_page' );
	$exists  = $home_id && 'page' === get_post_type( $home_id ) && 'trash' !== get_post_status( $home_id );
	if ( ! $exists || $reset_home ) {
		$content = '';
		foreach ( cfp_home_sections() as $section ) {
			$content .= cfp_pattern_markup( $section ) . "\n\n";
		}
		$args = array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => 'Home',
			'post_name'    => 'home',
			'post_content' => trim( $content ),
		);
		// Setup content is trusted theme markup (it includes the map iframe), so skip
		// KSES filtering, which would strip it when run from WP-CLI (no user).
		kses_remove_filters();
		if ( $exists ) {
			$args['ID'] = $home_id;
			wp_update_post( wp_slash( $args ) );
		} else {
			$home_id = (int) wp_insert_post( wp_slash( $args ) );
		}
		kses_init_filters();
		update_option( 'cfp_home_page', $home_id, false );
	}
	if ( $home_id ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', $home_id );
	}
	$summary['home_page'] = $home_id;

	update_option( 'cfp_setup_version', CFP_SETUP_VERSION, false );
	return $summary;
}

/** Run once per version, for administrators, on the first wp-admin load. */
function cfp_maybe_run_setup() {
	if ( get_option( 'cfp_setup_version' ) === CFP_SETUP_VERSION || ! current_user_can( 'manage_options' ) || wp_doing_ajax() ) {
		return;
	}
	cfp_run_setup();
	set_transient( 'cfp_setup_notice', 1, 60 );
}
add_action( 'admin_init', 'cfp_maybe_run_setup' );
add_action( 'after_switch_theme', function () {
	cfp_run_setup();
} );

/** Tell the administrator what just happened. */
function cfp_setup_notice() {
	if ( get_transient( 'cfp_setup_notice' ) ) {
		delete_transient( 'cfp_setup_notice' );
		printf(
			'<div class="notice notice-success is-dismissible"><p>%s</p></div>',
			esc_html__( 'Castleford theme setup complete: the Home page, menus, logo and images are now editable. Edit the Home page under Pages; edit the header and footer under Appearance > Editor.', 'castleford-food-pantry' )
		);
	}
}
add_action( 'admin_notices', 'cfp_setup_notice' );

/** WP-CLI: wp cfp setup [--reset-home] */
if ( defined( 'WP_CLI' ) && WP_CLI ) {
	WP_CLI::add_command(
		'cfp setup',
		function ( $args, $assoc ) {
			$summary = cfp_run_setup( ! empty( $assoc['reset-home'] ) );
			WP_CLI::success( 'Setup complete: ' . wp_json_encode( $summary ) );
		}
	);
}
