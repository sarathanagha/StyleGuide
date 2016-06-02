'use strict';

module.exports = /*@ngInject*/ function($modalInstance, data) {
	var vm = this;
	vm.currentMilestone = data.currentMilestone;
	vm.intervalDetail = data.intervalDetail;
	vm.currentMilestone.ignored = data.currentMilestone.ignored;
	vm.showNotesDetails = data.showNotesDetails;
	vm.complete = function(form) {
		//if (!form.$invalid) {
		if (!form.$invalid || (vm.currentMilestone.ignored && !form.notes.$invalid)) {
			$modalInstance.close('complete');
		}else {
			vm.toggleMesssage2 = true;
			vm.currentMilestone.insMilg = "";
			if (form['insMilg'].$error.pattern) {
				vm.invalidMilage = true;
			}else {
				vm.invalidMilage = false;
			}
			if (form['insDt'].$invalid) {
				vm.toggleMesssage = true;
				vm.currentMilestone.insDt = null;}
				if (form['plOfWk'].$invalid) {
					vm.toggleMesssage1 = true;
					vm.currentMilestone.plOfWk = "";}

				}};

	vm.delete = function() {
		$modalInstance.close('delete');
	};
}; 