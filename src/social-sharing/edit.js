/**
 * External dependencies
 */
import classNames from 'classnames';

/**
 * WordPress dependencies
 */
import { getBlockSupport } from '@wordpress/blocks';
import { Fragment, useEffect } from '@wordpress/element';
import {
	BlockControls,
	useInnerBlocksProps,
	useBlockProps,
	InspectorControls,
	ContrastChecker,
	withColors,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown, //eslint-disable-line
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients, //eslint-disable-line
} from '@wordpress/block-editor';
import {
	MenuGroup,
	MenuItem,
	PanelBody,
	ToggleControl,
	ToolbarDropdownMenu,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { check } from '@wordpress/icons';

/**
 * Import editor-only block styles.
 */
import './editor.scss';

const ALLOWED_BLOCKS = [ 'outermost/social-sharing-link' ];

const sizeOptions = [
	{
		name: __( 'Small', 'social-sharing-block' ),
		value: 'has-small-icon-size',
	},
	{
		name: __( 'Normal', 'social-sharing-block' ),
		value: 'has-normal-icon-size',
	},
	{
		name: __( 'Large', 'social-sharing-block' ),
		value: 'has-large-icon-size',
	},
	{ name: __( 'Huge', 'social-sharing-block' ), value: 'has-huge-icon-size' },
];

const getDefaultBlockLayout = ( blockTypeOrName ) => {
	const layoutBlockSupportConfig = getBlockSupport(
		blockTypeOrName,
		'__experimentalLayout'
	);
	return layoutBlockSupportConfig?.default;
};

export function SocialSharingEdit( props ) {
	const {
		clientId,
		name,
		attributes,
		iconBackgroundColor,
		iconColor,
		isSelected,
		setAttributes,
		setIconBackgroundColor,
		setIconColor,
	} = props;

	const {
		iconBackgroundColorValue,
		iconColorValue,
		layout,
		showLabels,
		size,
	} = attributes;
	const usedLayout = layout || getDefaultBlockLayout( name );

	// Remove icon background color if logos only style selected.
	const logosOnly = attributes.className?.includes( 'is-style-logos-only' );

	useEffect( () => {
		if ( logosOnly ) {
			setAttributes( {
				iconBackgroundColor: undefined,
				customIconBackgroundColor: undefined,
				iconBackgroundColorValue: undefined,
			} );
		}
	}, [ logosOnly, setAttributes ] );

	const SocialPlaceholder = (
		<li className="wp-block-outermost-social-sharing__social-placeholder">
			<div className="wp-block-outermost-social-sharing__social-placeholder-icons">
				<div className="outermost-social-sharing-link outermost-social-sharing-link-facebook"></div>
				<div className="outermost-social-sharing-link outermost-social-sharing-link-twitter"></div>
				<div className="outermost-social-sharing-link outermost-social-sharing-link-linkedin"></div>
			</div>
		</li>
	);

	const SelectedSocialPlaceholder = (
		<li className="wp-block-outermost-social-sharing__social-prompt">
			{ __( 'Click plus to add', 'social-sharing-block' ) }
		</li>
	);

	// Fallback color values are used maintain selections in case switching
	// themes and named colors in palette do not match.
	const className = classNames( size, {
		'has-icon-color': iconColor.color || iconColorValue,
		'has-icon-background-color':
			iconBackgroundColor.color || iconBackgroundColorValue,
	} );

	const blockProps = useBlockProps( { className } );
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		placeholder: isSelected ? SelectedSocialPlaceholder : SocialPlaceholder,
		templateLock: false,
		__experimentalAppenderTagName: 'li',
		__experimentalLayout: usedLayout,
	} );

	const POPOVER_PROPS = {
		position: 'bottom right',
	};

	const colorSettings = [
		{
			// Use custom attribute as fallback to prevent loss of named color selection when
			// switching themes to a new theme that does not have a matching named color.
			value: iconColor.color || iconColorValue,
			onChange: ( colorValue ) => {
				setIconColor( colorValue );
				setAttributes( { iconColorValue: colorValue } );
			},
			label: __( 'Icon color', 'social-sharing-block' ),
			resetAllFilter: () => {
				setIconColor( undefined );
				setAttributes( { iconColorValue: undefined } );
			},
		},
	];

	if ( ! logosOnly ) {
		colorSettings.push( {
			// Use custom attribute as fallback to prevent loss of named color selection when
			// switching themes to a new theme that does not have a matching named color.
			value: iconBackgroundColor.color || iconBackgroundColorValue,
			onChange: ( colorValue ) => {
				setIconBackgroundColor( colorValue );
				setAttributes( {
					iconBackgroundColorValue: colorValue,
				} );
			},
			label: __( 'Icon background', 'social-sharing-block' ),
			resetAllFilter: () => {
				setIconBackgroundColor( undefined );
				setAttributes( { iconBackgroundColorValue: undefined } );
			},
		} );
	}

	const colorGradientSettings = useMultipleOriginColorsAndGradients();

	return (
		<Fragment>
			<BlockControls group="other">
				<ToolbarDropdownMenu
					label={ __( 'Size', 'social-sharing-block' ) }
					text={ __( 'Size', 'social-sharing-block' ) }
					icon={ null }
					popoverProps={ POPOVER_PROPS }
				>
					{ ( { onClose } ) => (
						<MenuGroup>
							{ sizeOptions.map( ( entry ) => {
								return (
									<MenuItem
										icon={
											( size === entry.value ||
												( ! size &&
													entry.value ===
														'has-normal-icon-size' ) ) &&
											check
										}
										isSelected={ size === entry.value }
										key={ entry.value }
										onClick={ () => {
											setAttributes( {
												size: entry.value,
											} );
										} }
										onClose={ onClose }
										role="menuitemradio"
									>
										{ entry.name }
									</MenuItem>
								);
							} ) }
						</MenuGroup>
					) }
				</ToolbarDropdownMenu>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Share settings', 'social-sharing-block' ) }
				>
					<ToggleControl
						checked={ showLabels }
						label={ __( 'Show labels', 'social-sharing-block' ) }
						onChange={ () =>
							setAttributes( { showLabels: ! showLabels } )
						}
					/>
				</PanelBody>
			</InspectorControls>
			<InspectorControls __experimentalGroup="color">
				{ colorSettings.map(
					( { onChange, label, value, resetAllFilter } ) => (
						<ColorGradientSettingsDropdown
							key={ `social-links-color-${ label }` }
							__experimentalIsRenderedInSidebar
							__experimentalHasMultipleOrigins // Need for 6.1 compatibility.
							settings={ [
								{
									colorValue: value,
									label,
									onColorChange: onChange,
									isShownByDefault: true,
									resetAllFilter,
									enableAlpha: true,
								},
							] }
							panelId={ clientId }
							{ ...colorGradientSettings }
						/>
					)
				) }
				{ ! logosOnly && (
					<ContrastChecker
						{ ...{
							textColor: iconColorValue,
							backgroundColor: iconBackgroundColorValue,
						} }
						isLargeText={ false }
					/>
				) }
			</InspectorControls>
			<ul { ...innerBlocksProps } />
		</Fragment>
	);
}

const iconColorAttributes = {
	iconBackgroundColor: 'icon-background-color',
	iconColor: 'icon-color',
};

export default withColors( iconColorAttributes )( SocialSharingEdit );
