<?php
/**
 * Title: Site header
 * Slug: cfp/site-header
 * Categories: cfp
 * Inserter: no
 */
$home = esc_url( home_url( '/' ) );
?>
<!-- wp:html -->
<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to main content', 'castleford-food-pantry' ); ?></a>
<!-- /wp:html -->

<!-- wp:group {"className":"cfp-header","tagName":"header","layout":{"type":"default"}} -->
<header class="wp-block-group cfp-header"><!-- wp:group {"className":"cfp-header__inner","layout":{"type":"default"}} -->
<div class="wp-block-group cfp-header__inner"><!-- wp:html -->
<a class="cfp-header__logo" href="<?php echo $home; ?>" aria-label="Castleford Community Food Pantry, supported by GLOW - home"><img src="<?php echo cfp_asset( 'images/logo-horizontal.svg' ); ?>" width="450" height="200" alt="Castleford Community Food Pantry, supported by GLOW" /></a>
<!-- /wp:html -->

<!-- wp:navigation {"overlayMenu":"mobile","ariaLabel":"Primary","layout":{"type":"flex","justifyContent":"right"}} -->
<!-- wp:navigation-link {"label":"About","url":"<?php echo $home; ?>#about","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Get help","url":"<?php echo $home; ?>#get-help","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Support us","url":"<?php echo $home; ?>#donate","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Volunteer","url":"<?php echo $home; ?>#volunteer","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Partners","url":"<?php echo $home; ?>#sponsors","kind":"custom","isTopLevelLink":true} /-->
<!-- wp:navigation-link {"label":"Contact","url":"<?php echo $home; ?>#contact","kind":"custom","isTopLevelLink":true} /-->
<!-- /wp:navigation -->

<!-- wp:html -->
<a class="cfp-header__cta" href="<?php echo $home; ?>#donate"><?php esc_html_e( 'Support us', 'castleford-food-pantry' ); ?></a>
<!-- /wp:html --></div>
<!-- /wp:group --></header>
<!-- /wp:group -->
