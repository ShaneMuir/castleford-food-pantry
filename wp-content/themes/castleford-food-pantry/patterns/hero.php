<?php
/**
 * Title: Hero
 * Slug: cfp/hero
 * Categories: cfp
 * Inserter: yes
 */
$home = esc_url( home_url( '/' ) );
?>
<!-- wp:html -->
<section class="cfp-hero" id="home" aria-labelledby="hero-title">
	<div class="cfp-hero__grid">
		<div class="cfp-hero__copy">
			<p class="cfp-eyebrow"><?php esc_html_e( 'Castleford Community Food Pantry', 'castleford-food-pantry' ); ?></p>
			<h1 id="hero-title"><?php echo wp_kses( __( 'Good food, <em>not food waste.</em> Just &pound;1.', 'castleford-food-pantry' ), array( 'em' => array() ) ); ?></h1>
			<p><?php esc_html_e( 'We rescue surplus food that would otherwise go to landfill and share it with our community. No referral needed. Everyone is welcome.', 'castleford-food-pantry' ); ?></p>
			<div class="cfp-hero__ctas">
				<div class="wp-block-buttons">
					<div class="wp-block-button is-style-cfp-gold"><a class="wp-block-button__link wp-element-button" href="#get-help"><?php esc_html_e( 'Find a session', 'castleford-food-pantry' ); ?></a></div>
					<div class="wp-block-button is-style-cfp-outline"><a class="wp-block-button__link wp-element-button" href="#donate"><?php esc_html_e( 'Support us', 'castleford-food-pantry' ); ?></a></div>
				</div>
			</div>
			<div class="cfp-glowpill"><?php echo cfp_glow_wordmark(); ?></div>
		</div>
		<div class="cfp-hero__media">
			<div class="cfp-hero__frame" data-cfp-hero-video>
				<img src="<?php echo cfp_asset( 'images/poster.webp' ); ?>" width="480" height="848" alt="" fetchpriority="high" decoding="async" />
				<video muted playsinline autoplay loop preload="metadata" poster="<?php echo cfp_asset( 'images/poster.webp' ); ?>" aria-hidden="true" tabindex="-1">
					<source src="<?php echo cfp_asset( 'video/castleford-food-pantry-video.mp4' ); ?>" type="video/mp4" />
				</video>
			</div>
			<div class="cfp-hero__badge"><img src="<?php echo cfp_asset( 'images/logo-badge.svg' ); ?>" width="400" height="400" alt="Castleford Community Food Pantry, supported by GLOW" /></div>
		</div>
	</div>
</section>
<div class="cfp-glowbar" aria-hidden="true"></div>
<!-- /wp:html -->
