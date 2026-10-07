<?php
/**
 * Media library support: SVG uploads, and theme media imported into the library
 * so logos and photos are editable (replaceable) in the CMS.
 *
 * @package Castleford_Community_Food_Pantry
 */
defined( 'ABSPATH' ) || exit;

/* -------------------------------------------------------------------------
 * SVG as an accepted upload type
 * ---------------------------------------------------------------------- */

/** Allow .svg uploads for anyone who can upload files. */
function cfp_allow_svg_mime( $mimes ) {
	$mimes['svg'] = 'image/svg+xml';
	return $mimes;
}
add_filter( 'upload_mimes', 'cfp_allow_svg_mime' );

/** WordPress cannot sniff SVG reliably; trust the extension once the mime is allowed. */
function cfp_fix_svg_filetype( $data, $file, $filename ) {
	if ( empty( $data['type'] ) && preg_match( '/\.svg$/i', (string) $filename ) ) {
		$data['ext']  = 'svg';
		$data['type'] = 'image/svg+xml';
	}
	return $data;
}
add_filter( 'wp_check_filetype_and_ext', 'cfp_fix_svg_filetype', 10, 3 );

/**
 * True when an SVG string contains script-capable content.
 *
 * @param string $svg SVG source.
 * @return bool
 */
function cfp_svg_is_unsafe( $svg ) {
	return (bool) preg_match( '/<\s*script|<\s*foreignObject|<!ENTITY|<!DOCTYPE[^>]*\[|javascript\s*:|data\s*:\s*text\/html|\son[a-z]+\s*=/i', $svg );
}

/** Reject SVG uploads that contain scripts or event handlers. */
function cfp_svg_upload_prefilter( $file ) {
	if ( isset( $file['name'], $file['tmp_name'] ) && preg_match( '/\.svg$/i', $file['name'] ) && is_readable( $file['tmp_name'] ) ) {
		if ( cfp_svg_is_unsafe( (string) file_get_contents( $file['tmp_name'] ) ) ) {
			$file['error'] = __( 'This SVG contains scripts or unsafe markup and cannot be uploaded.', 'castleford-food-pantry' );
		}
	}
	return $file;
}
add_filter( 'wp_handle_upload_prefilter', 'cfp_svg_upload_prefilter' );

/**
 * Width and height of an SVG file from its width/height attributes or viewBox.
 *
 * @param string $path File path.
 * @return array{0:int,1:int}
 */
function cfp_svg_dimensions( $path ) {
	$svg = is_readable( $path ) ? (string) file_get_contents( $path, false, null, 0, 4096 ) : '';
	$w   = 0;
	$h   = 0;
	if ( preg_match( '/<svg[^>]*\swidth="([\d.]+)(?:px)?"/i', $svg, $mw ) && preg_match( '/<svg[^>]*\sheight="([\d.]+)(?:px)?"/i', $svg, $mh ) ) {
		$w = (float) $mw[1];
		$h = (float) $mh[1];
	} elseif ( preg_match( '/viewBox="[\d.\-]+[ ,]+[\d.\-]+[ ,]+([\d.]+)[ ,]+([\d.]+)"/i', $svg, $vb ) ) {
		$w = (float) $vb[1];
		$h = (float) $vb[2];
	}
	return array( (int) round( $w ?: 300 ), (int) round( $h ?: 300 ) );
}

/** Give SVG attachments width/height metadata so blocks can size them. */
function cfp_svg_metadata( $metadata, $attachment_id ) {
	if ( 'image/svg+xml' === get_post_mime_type( $attachment_id ) ) {
		$file = get_attached_file( $attachment_id );
		list( $w, $h ) = cfp_svg_dimensions( (string) $file );
		$metadata = array(
			'width'  => $w,
			'height' => $h,
			'file'   => _wp_relative_upload_path( (string) $file ),
			'sizes'  => array(),
		);
	}
	return is_array( $metadata ) ? $metadata : array();
}
add_filter( 'wp_generate_attachment_metadata', 'cfp_svg_metadata', 10, 2 );

/** Show SVG thumbnails in the media library grid and block pickers. */
function cfp_svg_for_js( $response, $attachment ) {
	if ( isset( $response['mime'] ) && 'image/svg+xml' === $response['mime'] ) {
		$meta = wp_get_attachment_metadata( $attachment->ID );
		$w    = isset( $meta['width'] ) ? (int) $meta['width'] : 300;
		$h    = isset( $meta['height'] ) ? (int) $meta['height'] : 300;
		$response['width']  = $w;
		$response['height'] = $h;
		$response['sizes']  = array(
			'full' => array(
				'url'         => $response['url'],
				'width'       => $w,
				'height'      => $h,
				'orientation' => $w >= $h ? 'landscape' : 'portrait',
			),
		);
	}
	return $response;
}
add_filter( 'wp_prepare_attachment_for_js', 'cfp_svg_for_js', 10, 2 );

/* -------------------------------------------------------------------------
 * Theme media -> media library
 * ---------------------------------------------------------------------- */

/**
 * The theme's starter media. Key => file (relative to the theme), alt text, title.
 *
 * @return array<string,array{file:string,alt:string,title:string}>
 */
function cfp_starter_media() {
	$brand = 'Castleford Community Food Pantry, supported by GLOW';
	return array(
		'logo'        => array( 'file' => 'assets/images/logo-horizontal.svg', 'alt' => $brand, 'title' => 'Castleford Food Pantry logo (horizontal)' ),
		'logo-badge'  => array( 'file' => 'assets/images/logo-badge.svg', 'alt' => $brand, 'title' => 'Castleford Food Pantry badge' ),
		'logo-banner' => array( 'file' => 'assets/images/logo-banner.svg', 'alt' => $brand, 'title' => 'Castleford Food Pantry banner' ),
		'poster'      => array( 'file' => 'assets/images/poster.webp', 'alt' => '', 'title' => 'Hero video poster' ),
		'hero-video'  => array( 'file' => 'assets/video/castleford-food-pantry-video.mp4', 'alt' => '', 'title' => 'Hero video' ),
		'about-photo' => array( 'file' => 'assets/images/pic-of-food-bank-packages.webp', 'alt' => 'A green crate stacked with ready-made meals in clear containers, topped with cheese, rescued and ready to share at the pantry', 'title' => 'Rescued meals at the pantry' ),
		'sponsors'    => array( 'file' => 'assets/images/brands-that-work-with-food-bank.webp', 'alt' => "Logos of brands that work with the pantry: Lidl, M&S, Booker Wholesale, Nando's, KFC, Asda, Aldi, Warburtons and Tesco", 'title' => 'Brands that work with the pantry' ),
	);
}

/**
 * Look up (or fall back to) a piece of starter media.
 *
 * @param string $key Key from cfp_starter_media().
 * @return array{id:int,url:string,alt:string,width:int,height:int}
 */
function cfp_media( $key ) {
	$starter = cfp_starter_media();
	$map     = (array) get_option( 'cfp_media', array() );
	$alt     = isset( $starter[ $key ]['alt'] ) ? $starter[ $key ]['alt'] : '';
	$id      = isset( $map[ $key ] ) ? (int) $map[ $key ] : 0;
	if ( $id && 'attachment' === get_post_type( $id ) ) {
		$meta = wp_get_attachment_metadata( $id );
		return array(
			'id'     => $id,
			'url'    => (string) wp_get_attachment_url( $id ),
			'alt'    => (string) get_post_meta( $id, '_wp_attachment_image_alt', true ),
			'width'  => isset( $meta['width'] ) ? (int) $meta['width'] : 0,
			'height' => isset( $meta['height'] ) ? (int) $meta['height'] : 0,
		);
	}
	// Not imported yet: point straight at the theme file so the front end still works.
	$file = isset( $starter[ $key ]['file'] ) ? $starter[ $key ]['file'] : '';
	return array(
		'id'     => 0,
		'url'    => $file ? get_theme_file_uri( $file ) : '',
		'alt'    => $alt,
		'width'  => 0,
		'height' => 0,
	);
}

/**
 * Copy the starter media into the media library (once per key).
 *
 * @return array<string,int> Map of key => attachment ID.
 */
function cfp_import_starter_media() {
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';

	$map = (array) get_option( 'cfp_media', array() );
	foreach ( cfp_starter_media() as $key => $item ) {
		if ( ! empty( $map[ $key ] ) && 'attachment' === get_post_type( (int) $map[ $key ] ) ) {
			continue;
		}
		$source = get_theme_file_path( $item['file'] );
		if ( ! is_readable( $source ) ) {
			continue;
		}
		$tmp = wp_tempnam( basename( $source ) );
		if ( ! $tmp || ! copy( $source, $tmp ) ) {
			continue;
		}
		$id = media_handle_sideload(
			array(
				'name'     => basename( $source ),
				'tmp_name' => $tmp,
			),
			0,
			$item['title'],
			array( 'post_title' => $item['title'] )
		);
		if ( is_wp_error( $id ) ) {
			@unlink( $tmp ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
			continue;
		}
		update_post_meta( $id, '_wp_attachment_image_alt', $item['alt'] );
		update_post_meta( $id, '_cfp_asset_key', $key );
		$map[ $key ] = (int) $id;
	}
	update_option( 'cfp_media', $map, false );
	return $map;
}
