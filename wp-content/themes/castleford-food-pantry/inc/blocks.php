<?php
/**
 * Block styles: the colour/look options editors can pick in the CMS.
 *
 * Select a block, then use Styles in the sidebar. Colours come from the brand
 * palette in theme.json (also available in each block's Color panel).
 *
 * @package Castleford_Community_Food_Pantry
 */
defined( 'ABSPATH' ) || exit;

function cfp_register_block_styles() {
	$styles = array(
		'core/group'     => array(
			'cfp-cream'       => __( 'Section: Cream', 'castleford-food-pantry' ),
			'cfp-white'       => __( 'Section: White', 'castleford-food-pantry' ),
			'cfp-green'       => __( 'Section: Green', 'castleford-food-pantry' ),
			'cfp-navy'        => __( 'Section: Navy', 'castleford-food-pantry' ),
			'cfp-card-green'  => __( 'Card: Green', 'castleford-food-pantry' ),
			'cfp-card-red'    => __( 'Card: Red', 'castleford-food-pantry' ),
			'cfp-card-blue'   => __( 'Card: Blue', 'castleford-food-pantry' ),
			'cfp-card-gold'   => __( 'Card: Gold', 'castleford-food-pantry' ),
			'cfp-card-purple' => __( 'Card: Purple', 'castleford-food-pantry' ),
		),
		'core/paragraph' => array(
			'cfp-eyebrow' => __( 'Eyebrow label', 'castleford-food-pantry' ),
			'cfp-lead'    => __( 'Lead text', 'castleford-food-pantry' ),
		),
		'core/button'    => array(
			'cfp-btn-green' => __( 'Green', 'castleford-food-pantry' ),
			'cfp-gold'    => __( 'Gold', 'castleford-food-pantry' ),
			'cfp-outline' => __( 'Outline', 'castleford-food-pantry' ),
		),
	);
	foreach ( $styles as $block => $list ) {
		foreach ( $list as $name => $label ) {
			register_block_style( $block, array( 'name' => $name, 'label' => $label ) );
		}
	}
}
add_action( 'init', 'cfp_register_block_styles' );
