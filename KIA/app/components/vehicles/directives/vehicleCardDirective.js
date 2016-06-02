'use strict';

module.exports = /*@ngInject*/ function() {
  	return {
  		restrict : 'A', 
  		replace : true, 
  		templateUrl: function(elem,attrs) {
  			return 'views/components/vehicles/templates/'+ attrs.type +'-card.html';
        }
  	}; 
};