'use strict';

module.exports = /*@ngInject*/ function(){
	function getDay(obj){


var date1 = new Date(obj);
var date2 = new Date();
var timeDiff = Math.abs(date2.getTime() - date1.getTime());
var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));



return diffDays;
}

return function (items, name) {
var sortDay,diffDayes;
if(name != undefined || name != ""){
sortDay = Number(name.split(" ")[1]);
}
if(isNaN(sortDay)){
sortDay = 1;
}
var data = [];
angular.forEach(items, function (val, key) {
diffDayes = Number(getDay(val.alertDateTime));
if (diffDayes <= sortDay) {
data.push(val);
}
});
return data;

}


		};

