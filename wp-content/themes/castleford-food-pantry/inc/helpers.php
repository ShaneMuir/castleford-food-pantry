<?php
/**
 * Template helpers used by block patterns: GLOW wordmark and responsive images.
 *
 * @package Castleford_Community_Food_Pantry
 */

defined( 'ABSPATH' ) || exit;

/**
 * URL of a file in the theme's assets directory.
 *
 * @param string $path Path relative to assets/.
 * @return string
 */
function cfp_asset( $path ) {
	return esc_url( get_theme_file_uri( 'assets/' . ltrim( $path, '/' ) ) );
}

/* -------------------------------------------------------------------------
 * Block-markup helpers for patterns (output matches what the editor saves).
 * ---------------------------------------------------------------------- */

/**
 * core/image block for a starter-media item.
 *
 * @param string $key   Key from cfp_starter_media().
 * @param string $class Extra class name(s).
 * @param string $size  Image size slug.
 * @return string
 */
function cfp_image_block( $key, $class = '', $size = 'large' ) {
	$m    = cfp_media( $key );
	$attr = array();
	if ( $m['id'] ) {
		$attr['id'] = $m['id'];
	}
	$attr['sizeSlug']        = $size;
	$attr['linkDestination'] = 'none';
	if ( $class ) {
		$attr['className'] = $class;
	}
	$src = $m['id'] ? ( wp_get_attachment_image_url( $m['id'], $size ) ?: $m['url'] ) : $m['url'];
	return '<!-- wp:image ' . wp_json_encode( $attr, JSON_UNESCAPED_SLASHES ) . " -->\n"
		. '<figure class="wp-block-image size-' . esc_attr( $size ) . ( $class ? ' ' . esc_attr( $class ) : '' ) . '">'
		. '<img src="' . esc_url( $src ) . '" alt="' . esc_attr( $m['alt'] ) . '"' . ( $m['id'] ? ' class="wp-image-' . (int) $m['id'] . '"' : '' ) . '/></figure>'
		. "\n<!-- /wp:image -->";
}

/**
 * core/video block (muted, looping, no controls; JS starts playback when allowed).
 *
 * @param string $video_key  Media key for the video file.
 * @param string $poster_key Media key for the poster image.
 * @param string $class      Extra class name(s).
 * @return string
 */
function cfp_video_block( $video_key, $poster_key, $class = '' ) {
	$v    = cfp_media( $video_key );
	$p    = cfp_media( $poster_key );
	$attr = array();
	if ( $v['id'] ) {
		$attr['id'] = $v['id'];
	}
	if ( $class ) {
		$attr['className'] = $class;
	}
	return '<!-- wp:video' . ( $attr ? ' ' . wp_json_encode( $attr, JSON_UNESCAPED_SLASHES ) : '' ) . " -->\n"
		. '<figure class="wp-block-video' . ( $class ? ' ' . esc_attr( $class ) : '' ) . '">'
		. '<video loop muted poster="' . esc_url( $p['url'] ) . '" preload="none" src="' . esc_url( $v['url'] ) . '" playsinline></video></figure>'
		. "\n<!-- /wp:video -->";
}

/**
 * The multicolour GLOW wordmark as an editable paragraph (inline text colours
 * come from the glow-g/l/o/w palette entries).
 *
 * @param string $label Text before the letters.
 * @return string
 */
function cfp_glow_block( $label = 'supported by' ) {
	$letters = '';
	foreach ( array( 'G' => 'glow-g', 'L' => 'glow-l', 'O' => 'glow-o', 'W' => 'glow-w' ) as $ch => $slug ) {
		$letters .= '<mark style="background-color:rgba(0, 0, 0, 0)" class="has-inline-color has-' . $slug . '-color">' . $ch . '</mark>';
	}
	return "<!-- wp:paragraph {\"className\":\"cfp-glow\"} -->\n"
		. '<p class="cfp-glow">' . esc_html( $label ) . ' ' . $letters . "</p>\n"
		. '<!-- /wp:paragraph -->';
}
