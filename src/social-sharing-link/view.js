/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

const printLinks = document.querySelectorAll(
	'.outermost-social-sharing-link-print a'
);
const copyURLLinks = document.querySelectorAll(
	'.outermost-social-sharing-link-copy-url a'
);

// Print the current page when the Print icon is clicked.
printLinks.forEach( ( link ) => {
	link.addEventListener( 'click', ( e ) => {
		e.preventDefault();
		window.print();
	} );
} );

// Copy the current page's URL to clipboard with the Copy URL icon is clicked.
copyURLLinks.forEach( ( link ) => {
    const url = document.URL;
	link.addEventListener( 'click', ( e ) => {
		e.preventDefault();
        copyToClipboard( url );
	} );
} );

function copyToClipboard( url ) {
    // If user is on insecure domain, copy to clipboard will fail.
    if ( ! navigator.clipboard ) {
        console.error( __( 
            'Error copying URL to clipboard. Ensure this domain has a valid security certificate.', 
            'social-sharing-block'
        ) );
        return;
    }

    navigator.clipboard.writeText( url ).then( alert( 'copied') )
        .catch( ( error ) => console.error( `Error copying URL to clipboard: ${ error }` ) );
};
