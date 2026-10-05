<?php
/**
 * Title: Contact
 * Slug: cfp/contact
 * Categories: cfp
 * Inserter: yes
 */
$cutsyke = rawurlencode( 'Cutsyke Christian Church, Cutsyke Rd, Castleford WF10 5HA' );
$airedale = rawurlencode( 'Airedale Gospel Hall, Royds Ave, Castleford WF10 3LQ' );
?>
<!-- wp:group {"tagName":"section","anchor":"contact","className":"cfp-section cfp-section--white","layout":{"type":"default"}} -->
<section id="contact" class="wp-block-group cfp-section cfp-section--white"><!-- wp:columns {"verticalAlignment":"stretch"} -->
<div class="wp-block-columns are-vertically-aligned-stretch"><!-- wp:column {"verticalAlignment":"stretch"} -->
<div class="wp-block-column is-vertically-aligned-stretch"><!-- wp:paragraph {"className":"cfp-eyebrow"} -->
<p class="cfp-eyebrow">Contact</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2 class="wp-block-heading">Say hello</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"className":"cfp-lead"} -->
<p class="cfp-lead">Questions about a session, volunteering or supporting us? Call or message any of the team.</p>
<!-- /wp:paragraph -->

<!-- wp:html -->
<ul class="cfp-contact-list">
	<li>Email: <a href="mailto:castlefordcommunityfoodpantry@gmail.com">castlefordcommunityfoodpantry@gmail.com</a></li>
	<li>Laura: <a href="tel:07912861156">07912 861156</a></li>
	<li>Kim: <a href="tel:07401001200">07401 001200</a></li>
	<li>Tracy: <a href="tel:07707572989">07707 572989</a></li>
</ul>
<!-- /wp:html -->

<!-- wp:heading {"level":3} -->
<h3 class="wp-block-heading">Where to find us</h3>
<!-- /wp:heading -->

<!-- wp:html -->
<ul class="cfp-contact-list">
	<li><strong>Airedale Gospel Hall</strong>, Royds Ave, Castleford, WF10 3LQ. <a href="https://www.google.com/maps/search/?api=1&amp;query=<?php echo $airedale; ?>">Directions<span class="screen-reader-text"> to Airedale Gospel Hall</span></a></li>
	<li><strong>Cutsyke Christian Church</strong>, Cutsyke Rd, Castleford, WF10 5HA. <a href="https://www.google.com/maps/search/?api=1&amp;query=<?php echo $cutsyke; ?>">Directions<span class="screen-reader-text"> to Cutsyke Christian Church</span></a></li>
</ul>
<!-- /wp:html --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"stretch"} -->
<div class="wp-block-column is-vertically-aligned-stretch"><!-- wp:html -->
<div class="cfp-map"><iframe title="Map showing Cutsyke Christian Church, Castleford" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=<?php echo $cutsyke; ?>&amp;output=embed"></iframe></div>
<!-- /wp:html --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></section>
<!-- /wp:group -->
