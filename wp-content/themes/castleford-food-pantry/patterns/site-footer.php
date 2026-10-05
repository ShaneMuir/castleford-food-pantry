<?php
/**
 * Title: Site footer
 * Slug: cfp/site-footer
 * Categories: cfp
 * Inserter: no
 */
$home = esc_url( home_url( '/' ) );
?>
<!-- wp:group {"className":"cfp-footer","tagName":"footer","layout":{"type":"default"}} -->
<footer class="wp-block-group cfp-footer"><!-- wp:html -->
<div class="cfp-glowbar" aria-hidden="true"></div>
<div class="cfp-footer__inner">
	<div>
		<img src="<?php echo cfp_asset( 'images/logo-banner.svg' ); ?>" width="260" height="130" alt="Castleford Community Food Pantry, supported by GLOW" style="max-width:260px;height:auto;border-radius:1rem" loading="lazy" />
		<p style="margin-top:1.25rem"><?php esc_html_e( 'Together we can reduce waste, feed people, build community.', 'castleford-food-pantry' ); ?></p>
		<?php echo cfp_glow_wordmark( 'cfp-glow--on-dark' ); ?>
	</div>
	<nav aria-label="Footer">
		<h2><?php esc_html_e( 'Explore', 'castleford-food-pantry' ); ?></h2>
		<ul>
			<li><a href="<?php echo $home; ?>#about">About</a></li>
			<li><a href="<?php echo $home; ?>#get-help">Get help</a></li>
			<li><a href="<?php echo $home; ?>#donate">Support us</a></li>
			<li><a href="<?php echo $home; ?>#volunteer">Volunteer</a></li>
			<li><a href="<?php echo $home; ?>#sponsors">Partners</a></li>
			<li><a href="<?php echo $home; ?>#contact">Contact</a></li>
		</ul>
	</nav>
	<div>
		<h2><?php esc_html_e( 'Get in touch', 'castleford-food-pantry' ); ?></h2>
		<ul>
			<li><a href="mailto:castlefordcommunityfoodpantry@gmail.com">castlefordcommunityfoodpantry@gmail.com</a></li>
			<li>Laura: <a href="tel:07912861156">07912 861156</a></li>
			<li>Kim: <a href="tel:07401001200">07401 001200</a></li>
			<li>Tracy: <a href="tel:07707572989">07707 572989</a></li>
		</ul>
	</div>
</div>
<p class="cfp-footer__legal">&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> Castleford Community Food Pantry. The pantry is supported by GLOW, who kindly provide space in their churches. GLOW does not run the pantry.</p>
<!-- /wp:html --></footer>
<!-- /wp:group -->
