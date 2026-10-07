<?php
/**
 * Title: Hero
 * Slug: cfp/hero
 * Categories: cfp
 * Inserter: yes
 */
?>
<!-- wp:group {"tagName":"section","anchor":"home","className":"cfp-hero","layout":{"type":"default"}} -->
<section id="home" class="wp-block-group cfp-hero"><!-- wp:group {"className":"cfp-hero__grid","layout":{"type":"default"}} -->
<div class="wp-block-group cfp-hero__grid"><!-- wp:group {"className":"cfp-hero__copy","layout":{"type":"default"}} -->
<div class="wp-block-group cfp-hero__copy"><!-- wp:paragraph {"className":"is-style-cfp-eyebrow"} -->
<p class="is-style-cfp-eyebrow">Castleford Community Food Pantry</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">Good food, <em>not food waste.</em> Just £1.</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We rescue surplus food that would otherwise go to landfill and share it with our community. No referral needed. Everyone is welcome.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"className":"cfp-hero__ctas"} -->
<div class="wp-block-buttons cfp-hero__ctas"><!-- wp:button {"className":"is-style-cfp-gold"} -->
<div class="wp-block-button is-style-cfp-gold"><a class="wp-block-button__link wp-element-button" href="#get-help">Find a session</a></div>
<!-- /wp:button -->

<!-- wp:button {"className":"is-style-cfp-outline"} -->
<div class="wp-block-button is-style-cfp-outline"><a class="wp-block-button__link wp-element-button" href="#donate">Support us</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons -->

<!-- wp:group {"className":"cfp-glowpill","layout":{"type":"default"}} -->
<div class="wp-block-group cfp-glowpill"><?php echo cfp_glow_block(); ?></div>
<!-- /wp:group --></div>
<!-- /wp:group -->

<!-- wp:group {"className":"cfp-hero__media","layout":{"type":"default"}} -->
<div class="wp-block-group cfp-hero__media"><?php echo cfp_video_block( 'hero-video', 'poster', 'cfp-hero__frame' ); ?>

<?php echo cfp_image_block( 'logo-badge', 'cfp-hero__badge', 'full' ); ?></div>
<!-- /wp:group --></div>
<!-- /wp:group --></section>
<!-- /wp:group -->
