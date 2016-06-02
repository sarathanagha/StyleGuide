'use strict';

module.exports = /*@ngInject*/ function () {

    var SpringUtilService = this;

    var r20 = /%20/g,
        rbracket = /\[\]$/;

    SpringUtilService.encodeObjParams = function( rsvInfo, a ) {
        if(angular.isObject(a))
            return rsvInfo + '=' + JSON.stringify(a);
    };

    SpringUtilService.encodeParams = function( a ) {
        var s = [],
        add = function( key, value ) {
            // If value is a function, invoke it and return its value

            value = angular.isFunction( value ) || (value === null) ? '' : value;
            s[ s.length ] = encodeURIComponent( key ) + '=' + encodeURIComponent( value );

        };

        // If an array was passed in, assume that it is an array of form elements.
        if ( angular.isArray( a ) ) {
            // Serialize the form elements
            angular.forEach(a, function(value, key){
                add(value.name, value.value);
            });

        } else {
            for ( var prefix in a ) {
            	if (a.hasOwnProperty(prefix)) {
	                SpringUtilService.buildParams( prefix, a[ prefix ], add );
            	}
            }
        }

        // Return the resulting serialization
        return s.join( '&' ).replace( r20, '+' );
    };

    SpringUtilService.buildParams = function( prefix, obj, add ) {
        if ( angular.isArray( obj ) ) {
            // Serialize array item.
            angular.forEach(obj, function(v, i){
                if (rbracket.test( prefix ) ) {
                    // Treat each array item as a scalar.
                    add( prefix, v );

                } else {
                    var brackets = ( typeof v === 'object' || angular.isArray(v) ? '[' + i + ']': '' );
                    SpringUtilService.buildParams( prefix + brackets, v, add );
                }     
            });

        } else if (obj != null && typeof obj === 'object' ) {
            // Serialize object item.
            for ( var name in obj ) {
            	if (obj.hasOwnProperty(name)) {
                	SpringUtilService.buildParams( prefix + '.' + name, obj[ name ], add );
            	}
            }

        } else {
            // Serialize scalar item.
            add( prefix, obj );
        }
    };
};