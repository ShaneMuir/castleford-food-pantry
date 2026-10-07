<?php
/**
 * Title: Site footer
 * Slug: cfp/site-footer
 * Categories: cfp
 * Inserter: no
 */
$nav_ref = cfp_menu_id( 'footer' );
$nav     = array(
	'overlayMenu' => 'never',
	'layout'      => array(
		'type'        => 'flex',
		'orientation' => 'vertical',
	),
	'ariaLabel'   => 'Footer',
);
if ( $nav_ref ) {
	$nav = array( 'ref' => $nav_ref ) + $nav;
}
?>
<!-- wp:group {"tagName":"footer","className":"cfp-footer","layout":{"type":"default"}} -->
<footer class="wp-block-group cfp-footer"><!-- wp:group {"className":"cfp-footer__inner","layout":{"type":"default"}} -->
<div class="wp-block-group cfp-footer__inner"><!-- wp:group {"layout":{"type":"default"}} -->
<div class="wp-block-group"><?php echo cfp_image_block( 'logo-banner', 'cfp-footer__logo', 'full' ); ?>

<!-- wp:paragraph -->
<p>Together we can reduce waste, feed people, build community.</p>
<!-- /wp:paragraph -->

<?php echo cfp_glow_block(); ?></div>
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Explore</h2>
<!-- /wp:heading -->

<!-- wp:navigation <?php echo wp_json_encode( $nav ); ?> /--></div>
<!-- /wp:group -->

<!-- wp:group {"layout":{"type":"default"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Get in touch</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul class="wp-block-list"><!-- wp:list-item -->
<li><a href="mailto:castlefordcommunityfoodpantry@gmail.com">castlefordcommunityfoodpantry@gmail.com</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Laura: <a href="tel:07912861156">07912 861156</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Kim: <a href="tel:07401001200">07401 001200</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>Tracy: <a href="tel:07707572989">07707 572989</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:paragraph {"className":"cfp-footer__legal"} -->
<p class="cfp-footer__legal">© <?php echo esc_html( gmdate( 'Y' ) ); ?> Castleford Community Food Pantry. The pantry is supported by GLOW, who kindly provide space in their churches. GLOW does not run the pantry.</p>
<!-- /wp:paragraph --></footer>
<!-- /wp:group -->
