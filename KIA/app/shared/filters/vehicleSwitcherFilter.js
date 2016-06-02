'use strict';

module.exports = /*@ngInject*/ function() {
	return function(input) {		
        return getSwitcherVehiclesData(input);
	};
	function getSwitcherVehiclesData(data){
		var filteredVehicles = [];		
             angular.forEach(data,function(val,key){
                         if(val.actVin === "N" && (val.type === "gen1plus" || val.type === "gen1")){
							filteredVehicles.push(val);
                         }else if(val.enrVin === "A"  && val.type === "psev"){
							filteredVehicles.push(val);
                         }else if(val.enrVinKh === "4" && val.type === "kh"){
							filteredVehicles.push(val);
                         }
             });
      return filteredVehicles;

	}
};