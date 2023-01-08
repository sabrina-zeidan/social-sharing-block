<?php
/**
 * Plugin Name:       Social Sharing Block
 * Description:       Effortlessly add social share icons to the WordPress block editor.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Nick Diego
 * Author URI:        https://www.nickdiego.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       social-sharing-block
 *
 * @package           Social Sharing Block
 */

/**
 * Registers the Social Sharing block using the metadata loaded from `block.json`.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 */
function outermost_social_sharing_init() {
	$blocks = array( 'social-sharing', 'social-sharing-link' );

	foreach( $blocks as $block ) {
		register_block_type( __DIR__ . '/build/' . $block . '/' );
	}
}
add_action( 'init', 'outermost_social_sharing_init' );
