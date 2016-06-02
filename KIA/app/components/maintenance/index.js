'use strict';

angular.module('uvo.maintenance',[])
  .factory('MaintenanceService', require('./maintenanceService'))
  .controller('MaintenanceController', require('./maintenanceController'))
  .controller('NotesDetailsModalController', require('./notesDetailsController'))
  .directive('milestones', require('./directives/milestonesDirective'))
  .directive('diagnostics', require('./directives/diagnosticsDirective'))
  .directive('oilChange', require('./directives/oilChangeDirective'))
  .directive('currentAppointment', require('./directives/currentAppointmentDirective'))
  .directive('requestAppointment', require('./directives/requestAppointmentDirective'))
  .directive('confirmGen1Request', require('./directives/confirmGen1RequestDirective'))
  ;
