<?php
/**
 * Title: Contact
 * Slug: cfp/contact
 * Categories: cfp
 * Inserter: yes
 */
$cutsyke  = rawurlencode( 'Cutsyke Christian Church, Cutsyke Rd, Castleford WF10 5HA' );
$airedale = rawurlencode( 'Airedale Gospel Hall, Royds Ave, Castleford WF10 3LQ' );
?>
<!-- wp:group {"tagName":"section","anchor":"contact","className":"cfp-section is-style-cfp-white","layout":{"type":"default"}} -->
<section id="contact" class="wp-block-group cfp-section is-style-cfp-white"><!-- wp:columns {"verticalAlignment":"stretch"} -->
<div class="wp-block-columns are-vertically-aligned-stretch"><!-- wp:column {"verticalAlignment":"stretch"} -->
<div class="wp-block-column is-vertically-aligned-stretch"><!-- wp:paragraph {"className":"is-style-cfp-eyebrow"} -->
<p class="is-style-cfp-eyebrow">Contact</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2 class="wp-block-heading">Say hello</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"is-style-cfp-lead"} -->
<p class="is-style-cfp-lead">Questions about a session, volunteering or supporting us? Call or message any of the team.</p>
<!-- /wp:paragraph -->

<!-- wp:list {"className":"cfp-contact-list"} -->
<ul class="wp-block-list cfp-contact-list"><!-- wp:list-item -->
<li>Email: <a href="mailto:castlefordcommunityfoodpantry@gmail.com">castlefordcommunityfoodpantry@gmail.com</a></li>
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
<!-- /wp:list -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Where to find us</h3>
<!-- /wp:heading -->

<!-- wp:list {"className":"cfp-contact-list"} -->
<ul class="wp-block-list cfp-contact-list"><!-- wp:list-item -->
<li><strong>Airedale Gospel Hall</strong>, Royds Ave, Castleford, WF10 3LQ. <a href="https://www.google.com/maps/search/?api=1&amp;query=<?php echo esc_attr( $airedale ); ?>">Directions to Airedale Gospel Hall</a></li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li><strong>Cutsyke Christian Church</strong>, Cutsyke Rd, Castleford, WF10 5HA. <a href="https://www.google.com/maps/search/?api=1&amp;query=<?php echo esc_attr( $cutsyke ); ?>">Directions to Cutsyke Christian Church</a></li>
<!-- /wp:list-item --></ul>
<!-- /wp:list --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"stretch"} -->
<div class="wp-block-column is-vertically-aligned-stretch"><!-- wp:html -->
<div class="cfp-map"><iframe title="Map showing Cutsyke Christian Church, Castleford" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=<?php echo esc_attr( $cutsyke ); ?>&amp;output=embed"></iframe></div>
<!-- /wp:html --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->
