<?php
/**
 * SEO: meta description, Open Graph, Twitter Card, JSON-LD (Req 15).
 * Skips output when a known SEO plugin is active to avoid duplicates.
 *
 * @package Castleford_Community_Food_Pantry
 */

defined( 'ABSPATH' ) || exit;

/** Whether a major SEO plugin is handling metadata. */
function cfp_seo_plugin_active() {
	return defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) || defined( 'AIOSEO_VERSION' ) || defined( 'SEOPRESS_VERSION' );
}

/** Front-page title: descriptive, under ~60 chars. */
function cfp_document_title_parts( $parts ) {
	if ( is_front_page() ) {
		$parts['title'] = 'Castleford Community Food Pantry | Surplus food for just £1';
		unset( $parts['tagline'], $parts['site'] );
	}
	return $parts;
}
add_filter( 'document_title_parts', 'cfp_document_title_parts' );

/** Output meta tags and structured data. */
function cfp_seo_head() {
	if ( cfp_seo_plugin_active() || ! is_front_page() ) {
		return;
	}
	$desc  = 'Castleford Community Food Pantry rescues surplus food from landfill and shares it with the community for £1. No referral needed. Sessions on Sundays and Fridays. Hosted by GLOW.';
	$title = 'Castleford Community Food Pantry | Surplus food for just £1';
	$url   = home_url( '/' );
	$image = get_theme_file_uri( 'assets/images/og-image.png' );

	printf( '<meta name="description" content="%s" />' . "\n", esc_attr( $desc ) );
	printf( '<link rel="canonical" href="%s" />' . "\n", esc_url( $url ) );
	$og = array(
		'og:type'         => 'website',
		'og:site_name'    => 'Castleford Community Food Pantry',
		'og:title'        => $title,
		'og:description'  => $desc,
		'og:url'          => $url,
		'og:image'        => $image,
		'og:image:width'  => '1200',
		'og:image:height' => '630',
		'og:image:alt'    => 'Castleford Community Food Pantry, hosted by GLOW',
		'og:locale'       => 'en_GB',
	);
	foreach ( $og as $k => $v ) {
		printf( '<meta property="%s" content="%s" />' . "\n", esc_attr( $k ), esc_attr( $v ) );
	}
	$tw = array(
		'twitter:card'        => 'summary_large_image',
		'twitter:title'       => $title,
		'twitter:description' => $desc,
		'twitter:image'       => $image,
	);
	foreach ( $tw as $k => $v ) {
		printf( '<meta name="%s" content="%s" />' . "\n", esc_attr( $k ), esc_attr( $v ) );
	}

	$ld = array(
		'@context'    => 'https://schema.org',
		'@type'       => 'NGO',
		'name'        => 'Castleford Community Food Pantry',
		'description' => $desc,
		'url'         => $url,
		'logo'        => get_theme_file_uri( 'assets/images/logo-badge.svg' ),
		'image'       => $image,
		'email'       => 'castlefordcommunityfoodpantry@gmail.com',
		'telephone'   => '+447912861156',
		'contactPoint' => array(
			array( '@type' => 'ContactPoint', 'name' => 'Laura', 'telephone' => '+447912861156', 'contactType' => 'customer support' ),
			array( '@type' => 'ContactPoint', 'name' => 'Kim', 'telephone' => '+447401001200', 'contactType' => 'customer support' ),
			array( '@type' => 'ContactPoint', 'name' => 'Tracy', 'telephone' => '+447707572989', 'contactType' => 'customer support' ),
		),
		'areaServed'  => 'Castleford',
		'location'    => array(
			array(
				'@type'   => 'Place',
				'name'    => 'Airedale Gospel Hall',
				'address' => array( '@type' => 'PostalAddress', 'streetAddress' => 'Royds Ave', 'addressLocality' => 'Castleford', 'postalCode' => 'WF10 3LQ', 'addressCountry' => 'GB' ),
			),
			array(
				'@type'   => 'Place',
				'name'    => 'Cutsyke Christian Church',
				'address' => array( '@type' => 'PostalAddress', 'streetAddress' => 'Cutsyke Rd', 'addressLocality' => 'Castleford', 'postalCode' => 'WF10 5HA', 'addressCountry' => 'GB' ),
			),
		),
	);
	echo '<script type="application/ld+json">' . wp_json_encode( $ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . "</script>\n";
}
add_action( 'wp_head', 'cfp_seo_head', 5 );

/**
 * Virtual robots.txt: allow indexing and point to the core XML sitemap (Req 15.4).
 *
 * Uses WordPress's `robots_txt` filter so the Sitemap URL always matches the
 * current domain (local, staging, production). Only applies when the site is
 * public and no physical robots.txt file exists at the web root.
 *
 * @param string $output Existing robots.txt output.
 * @param bool   $public Whether the site is visible to search engines.
 * @return string
 */
function cfp_robots_txt( $output, $public ) {
	if ( ! $public ) {
		return $output;
	}
	$lines   = array(
		'User-agent: *',
		'Allow: /',
		'Disallow: /wp-admin/',
		'Allow: /wp-admin/admin-ajax.php',
		'',
		'Sitemap: ' . home_url( '/wp-sitemap.xml' ),
	);
	return implode( "\n", $lines ) . "\n";
}
add_filter( 'robots_txt', 'cfp_robots_txt', 10, 2 );
