'use strict';

require('./mockCommon');
require('./mockSettings');
require('./mockOverview');
require('./mockVehicles');
require('./mockDrivingActivity');
require('./mockDealer');
require('./mockAwards');
require('./mockMaintenance');
require('./mockPoi');
require('./mockTripInfo');
require('./mockConnectInfo');
require('./mockScheduledInfo');
require('./mockMczSettings');
require('./mockSpeed');
require('./mockGeofence');
require('./mockMCZ');
require('./mockcarlocation');
require('./mockChargeStations');
require('./mockClimate');
require('./mockspeedsetting');
require('./mockCommandLog');
require('./mockFindMyCar');






// Fixes conflict for static files
angular.module('uvo')
  .run(function($httpBackend) {

    // Lets all *.html requests pass through, else 'cannot repeat another request' error occurs
	  $httpBackend.whenGET(/\.html/).passThrough();
});
