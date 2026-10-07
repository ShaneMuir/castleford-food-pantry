<?php
/**
 * Admin and site clean-up: comments switched off completely, plus admin bar,
 * footer and version tweaks.
 *
 * @package Castleford_Community_Food_Pantry
 */
defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * Comments: removed completely
 * ---------------------------------------------------------------------- */

// Comments and pings are closed everywhere, and nothing is ever returned for display.
add_filter( 'comments_open', '__return_false', 20, 2 );
add_filter( 'pings_open', '__return_false', 20, 2 );
add_filter( 'comments_array', '__return_empty_array', 10, 2 );
add_filter( 'feed_links_show_comments_feed', '__return_false' );

/** Remove comment and trackback support from every post type (hides the editor Discussion panel). */
function cfp_remove_comment_support(): void {
	foreach ( get_post_types() as $post_type ) {
		if ( post_type_supports( $post_type, 'comments' ) ) {
			remove_post_type_support( $post_type, 'comments' );
		}
		if ( post_type_supports( $post_type, 'trackbacks' ) ) {
			remove_post_type_support( $post_type, 'trackbacks' );
		}
	}
}
add_action( 'init', 'cfp_remove_comment_support', 100 );

/** Remove the Comments and Discussion screens from the admin menu. */
function cfp_remove_comment_menus(): void {
	remove_menu_page( 'edit-comments.php' );
	remove_submenu_page( 'options-general.php', 'options-discussion.php' );
}
add_action( 'admin_menu', 'cfp_remove_comment_menus' );

/** Send anyone who lands on a comments screen straight to the dashboard. */
function cfp_block_comment_screens(): void {
	global $pagenow;
	if ( in_array( $pagenow, array( 'edit-comments.php', 'comment.php', 'options-discussion.php' ), true ) ) {
		wp_safe_redirect( admin_url() );
		exit;
	}
}
add_action( 'admin_init', 'cfp_block_comment_screens' );

/** Remove the comments bubble from the admin bar. */
function cfp_remove_comments_admin_bar(): void {
	global $wp_admin_bar;
	if ( $wp_admin_bar ) {
		$wp_admin_bar->remove_menu( 'comments' );
	}
}
add_action( 'wp_before_admin_bar_render', 'cfp_remove_comments_admin_bar', 0 );

/** Remove the Recent Comments dashboard widget. */
function cfp_remove_comment_dashboard_widget(): void {
	remove_meta_box( 'dashboard_recent_comments', 'dashboard', 'normal' );
}
add_action( 'wp_dashboard_setup', 'cfp_remove_comment_dashboard_widget' );

/** Remove the comments REST API routes. */
function cfp_remove_comment_rest_routes( array $endpoints ): array {
	foreach ( array_keys( $endpoints ) as $route ) {
		if ( 0 === strpos( $route, '/wp/v2/comments' ) ) {
			unset( $endpoints[ $route ] );
		}
	}
	return $endpoints;
}
add_filter( 'rest_endpoints', 'cfp_remove_comment_rest_routes' );

/**
 * Remove the comment blocks from the editor inserter.
 *
 * @param bool|string[]           $allowed Allowed block types (true = all).
 * @param WP_Block_Editor_Context $context Editor context.
 * @return bool|string[]
 */
function cfp_remove_comment_blocks( $allowed, $context ) {
	$names = array_keys( WP_Block_Type_Registry::get_instance()->get_all_registered() );
	if ( is_array( $allowed ) ) {
		$names = array_values( array_intersect( $names, $allowed ) );
	}
	return array_values(
		array_filter(
			$names,
			static function ( string $name ): bool {
				return 0 !== strpos( $name, 'core/' ) || false === strpos( $name, 'comment' );
			}
		)
	);
}
add_filter( 'allowed_block_types_all', 'cfp_remove_comment_blocks', 10, 2 );

/** Turn off comment and ping defaults and close anything already open. */
function cfp_disable_comment_settings(): void {
	global $wpdb;
	update_option( 'default_comment_status', 'closed' );
	update_option( 'default_ping_status', 'closed' );
	update_option( 'default_pingback_flag', 0 );
	$wpdb->query( "UPDATE {$wpdb->posts} SET comment_status = 'closed', ping_status = 'closed' WHERE comment_status <> 'closed' OR ping_status <> 'closed'" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery
}

/* -------------------------------------------------------------------------
 * Admin bar, footer and version clean-up
 * ---------------------------------------------------------------------- */

/** Remove the WP logo and its links from the admin bar. */
function cfp_remove_admin_wp_logo(): void {
	global $wp_admin_bar;
	if ( $wp_admin_bar ) {
		$wp_admin_bar->remove_menu( 'wp-logo' );
	}
}
add_action( 'wp_before_admin_bar_render', 'cfp_remove_admin_wp_logo', 0 );

/** Replace the admin footer message with a copyright line for this site. */
function cfp_change_admin_footer(): void {
	echo '&copy; ' . esc_html( gmdate( 'Y' ) ) . ' <a class="site-info" href="' . esc_url( home_url() ) . '">' . esc_html( get_bloginfo( 'name' ) ) . '</a>';
}
add_filter( 'admin_footer_text', 'cfp_change_admin_footer' );

/** Hide the WordPress version in the admin footer unless the user can update core. */
function cfp_remove_version_from_admin_footer(): void {
	if ( ! current_user_can( 'update_core' ) ) {
		remove_filter( 'update_footer', 'core_update_footer' );
	}
}
add_action( 'admin_menu', 'cfp_remove_version_from_admin_footer' );
