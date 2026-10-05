<?php
/**
 * Template helpers used by block patterns: GLOW wordmark and responsive images.
 *
 * @package Castleford_Community_Food_Pantry
 */

defined( 'ABSPATH' ) || exit;

/**
 * Multicolour GLOW wordmark (Req 2.6, 10.1, 10.2; wording per owner: GLOW supports, but does not run, the pantry).
 *
 * Each letter uses its own colour token. The group is exposed to assistive tech
 * as a single image labelled "supported by GLOW".
 *
 * @param string $class Extra class names.
 * @return string
 */
function cfp_glow_wordmark( $class = '' ) {
	return '<p class="cfp-glow ' . esc_attr( $class ) . '" role="img" aria-label="supported by GLOW">'
		. '<span class="cfp-glow__by" aria-hidden="true">supported by</span> '
		. '<span class="cfp-glow__word" aria-hidden="true">'
		. '<span class="glow glow--g">G</span><span class="glow glow--l">L</span>'
		. '<span class="glow glow--o">O</span><span class="glow glow--w">W</span>'
		. '</span></p>';
}

/**
 * URL of a file in the theme's assets directory.
 *
 * @param string $path Path relative to assets/.
 * @return string
 */
function cfp_asset( $path ) {
	return esc_url( get_theme_file_uri( 'assets/' . ltrim( $path, '/' ) ) );
}

/**
 * Responsive <img> built from the image manifest (Req 13.4, 14.3, 14.4).
 *
 * @param string $source   Source file name in manifest (e.g. "pic.jpeg").
 * @param string $alt      Alt text ('' marks the image decorative).
 * @param string $sizes    sizes attribute.
 * @param string $class    Class names.
 * @param bool   $eager    Load eagerly (above the fold) instead of lazy.
 * @return string
 */
function cfp_img( $source, $alt, $sizes = '(max-width: 782px) 100vw, 720px', $class = '', $eager = false ) {
	static $manifest = null;
	if ( null === $manifest ) {
		$file     = get_theme_file_path( 'assets/images/manifest.json' );
		$decoded  = is_readable( $file ) ? json_decode( (string) file_get_contents( $file ), true ) : array();
		$manifest = isset( $decoded['images'] ) ? $decoded['images'] : ( is_array( $decoded ) ? $decoded : array() );
	}
	if ( empty( $manifest[ $source ] ) ) {
		return '';
	}
	$m      = $manifest[ $source ];
	$base   = trailingslashit( get_theme_file_uri( 'assets/images' ) );
	$srcset = array();
	foreach ( (array) $m['variants'] as $v ) {
		$srcset[] = esc_url( $base . basename( $v['file'] ) ) . ' ' . (int) $v['width'] . 'w';
	}
	return sprintf(
		'<img src="%s" srcset="%s" sizes="%s" width="%d" height="%d" alt="%s" class="%s" loading="%s" decoding="async"%s />',
		esc_url( $base . basename( $m['webp'] ) ),
		esc_attr( implode( ', ', $srcset ) ),
		esc_attr( $sizes ),
		(int) $m['width'],
		(int) $m['height'],
		esc_attr( $alt ),
		esc_attr( $class ),
		$eager ? 'eager' : 'lazy',
		$eager ? ' fetchpriority="high"' : ''
	);
}
