export default function() {

	'use strict';

	// Used to store registered topics
	var topics = [];

	/**
	 * Check name and if the function exists
	 */
	function validate( name, trigger ) {
		if( typeof name !== 'string'  ) {
			throw( 'Function name need to be a string' );
		}
		return true;
	}

	/**
	 * Subscribing topic on object topics
	 */
	function sub( name, fn ) {
		if( validate( name ) && ( fn && fn.call ) ) {
			( topics[ name ] = topics[ name ] || [] ).push( fn );
		}
	}

	/**
	 * Publishing the registered topics
	 */
	function pub( name ) {
		var	tpc = topics[ name ] || [],
			len = tpc.length,
			i=0;

		if( validate( name ) ) {
			for( ; i < len ; i+=1 ) {
				tpc[ i ].apply( this, Array.prototype.slice.call( arguments, 1 ) );
			}
		}
	}

	/**
	 * Removing the registered function
	 */
	function unsub( name ) {
		if( validate( name ) ) {
			delete topics[ name ];
		}
	}

	return {
		on: sub,
		emit: pub,
		off: unsub,
	}
}