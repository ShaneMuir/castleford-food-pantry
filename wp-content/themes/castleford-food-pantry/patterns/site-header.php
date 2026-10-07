<?php
/**
 * Title: Site header
 * Slug: cfp/site-header
 * Categories: cfp
 * Inserter: no
 */
$nav_ref = cfp_menu_id( 'primary' );
$nav     = array(
	'layout'    => array(
		'type'           => 'flex',
		'justifyContent' => 'right',
	),
	'ariaLabel' => 'Primary',
);
if ( $nav_ref ) {
	$nav = array( 'ref' => $nav_ref ) + $nav;
}
?>
<!-- wp:group {"tagName":"header","className":"cfp-header","layout":{"type":"default"}} -->
<header class="wp-block-group cfp-header"><!-- wp:group {"className":"cfp-header__inner","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group cfp-header__inner"><!-- wp:site-logo {"width":240,"shouldSyncIcon":false,"className":"cfp-header__logo"} /-->

<!-- wp:navigation <?php echo wp_json_encode( $nav ); ?> /-->

<!-- wp:buttons {"className":"cfp-header__cta"} -->
<div class="wp-block-buttons cfp-header__cta"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/#donate">Support us</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></header>
<!-- /wp:group -->
