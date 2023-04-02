<?php
/**
 * Server-side rendering of the `outermost/social-sharing-link` block.
 *
 * @package Social Sharing Block
 */

defined( 'ABSPATH' ) || exit;

// Include utility functions.
require_once dirname( __FILE__ ) . '/utils.php';

$service     = ( isset( $attributes['service'] ) ) ? esc_attr( $attributes['service'] ) : 'mail';
$label       = ( isset( $attributes['label'] ) ) ? $attributes['label'] : outermost_social_sharing_link_get_label( $service );
$class_name  = ( isset( $attributes['className'] ) ) ? ' ' . esc_attr( $attributes['className'] ) : false;
$show_labels = array_key_exists( 'showLabels', $block->context ) ? $block->context['showLabels'] : false;
$url         = outermost_social_sharing_link_get_url( $service );

// Set the icon color class if a theme color is selected.
$icon_color = array_key_exists( 'iconColor', $block->context ) ? $block->context['iconColor'] : '';
$icon_color = $icon_color ? ' has-' . esc_attr( $icon_color ) . '-color' : '';

// Set the icon background color class if a theme color is selected.
$icon_background_color = array_key_exists( 'iconBackgroundColor', $block->context ) ? $block->context['iconBackgroundColor'] : '';
$icon_background_color = $icon_background_color ? ' has-' . esc_attr( $icon_background_color ) . '-background-color' : '';

$rel_target_attributes = '';

if ( 'print' !== $service && 'mail' !== $service ) {
	$rel_target_attributes = 'rel="noopener nofollow" target="_blank"';
}

$icon               = outermost_social_sharing_link_get_icon( $service );
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'outermost-social-sharing-link outermost-social-sharing-link-' . $service . $icon_color . $icon_background_color . $class_name,
		'style' => outermost_social_sharing_link_get_color_styles( $block->context ),
	)
);

$icon_link  = '<li ' . $wrapper_attributes . '>';
$icon_link .= '<a href="' . $url . '" aria-label="' . esc_attr( $label ) . '" ' . $rel_target_attributes . ' class="wp-block-outermost-social-sharing-link-anchor">';
$icon_link .= $icon;
$icon_link .= '<span class="wp-block-outermost-social-sharing-link-label' . ( $show_labels ? '' : ' screen-reader-text' ) . '">';
$icon_link .= esc_html( $label );
$icon_link .= '</span>';
$icon_link .= 'copy-url' === $service ? '<span class="wp-block-outermost-social-sharing-link-tooltip">' . __( 'Copy URL', 'social-sharing-block' ) . '</span>' : '';
$icon_link .= '</a></li>';

echo $icon_link;
