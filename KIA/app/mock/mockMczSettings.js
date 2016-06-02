'use strict';

/*@ngInject*/
angular.module('uvo')
.run(function($httpBackend) {

	$httpBackend.whenGET(/\/ccw\/kh\/geoFenceAlertSettings\.do/).respond(function(method,url,data) {
		var responseData = 
			{
				'serviceResponse' : {
					'Active' : 'A',
					'MCZStatus' : {
						'SPEEDONOFF' : 0,
						'SPEEDCONFIG' : 0,
						'CURFEWONOFF' : 0,
						'CURFEWCONFIG' : 0
					},
					'TmuStatus' : 'I',
					'GeoFenceAlertList' : [{
							'geoFenceConfigId' : 3443,
							'vin' : 'KNALW4D46F6023401',
							'csmrId' : 'MUV0000000000000000089185',
							'geoFenceId' : 1,
							'active' : 'A',
							'geoFenceTime' : 5,
							'geoFenceTimeUom' : '1',
							'rectLeftLat' : '',
							'rectLeftLon' : '',
							'rectLeftAlt' : '',
							'rectLeftType' : '',
							'rectRightLat' : '',
							'rectRightLon' : '',
							'rectRightAlt' : '',
							'rectRightType' : '',
							'rectFenceType' : '0',
							'rectWidth' : '0.0',
							'rectHeight' : '0.0',
							'circleCenterLat' : '33.7162582',
							'circleCenterLon' : '-117.7924443',
							'circleCenterAlt' : '0',
							'circleCenterType' : '1',
							'radius' : '5000',
							'radiusUom' : '2',
							'circleFenceType' : '2',
							'createdUser' : 'WGPCCWUSR',
							'createdDate' : 1437686391000,
							'modifiedUser' : 'WGPCCWUSR',
							'modifiedDate' : 1437686391000,
							'status' : 'S',
							'action' : null,
							'geoFenceName' : 'Geo Fence Entry'
						}, {
							'geoFenceConfigId' : 3444,
							'vin' : 'KNALW4D46F6023401',
							'csmrId' : 'MUV0000000000000000089185',
							'geoFenceId' : 2,
							'active' : 'A',
							'geoFenceTime' : 5,
							'geoFenceTimeUom' : '1',
							'rectLeftLat' : '',
							'rectLeftLon' : '',
							'rectLeftAlt' : '',
							'rectLeftType' : '',
							'rectRightLat' : '',
							'rectRightLon' : '',
							'rectRightAlt' : '',
							'rectRightType' : '',
							'rectFenceType' : '0',
							'rectWidth' : '0.0',
							'rectHeight' : '0.0',
							'circleCenterLat' : '33.749049541013456',
							'circleCenterLon' : '-117.88112023371781',
							'circleCenterAlt' : '0',
							'circleCenterType' : '1',
							'radius' : '5000',
							'radiusUom' : '2',
							'circleFenceType' : '1',
							'createdUser' : 'WGPCCWUSR',
							'createdDate' : 1437686391000,
							'modifiedUser' : 'WGPCCWUSR',
							'modifiedDate' : 1437686391000,
							'status' : 'S',
							'action' : null,
							'geoFenceName' : 'Geo Fence Exit'
						}, {
							'geoFenceConfigId' : 3445,
							'vin' : 'KNALW4D46F6023401',
							'csmrId' : 'MUV0000000000000000089185',
							'geoFenceId' : 3,
							'active' : 'A',
							'geoFenceTime' : 5,
							'geoFenceTimeUom' : '1',
							'rectLeftLat' : '',
							'rectLeftLon' : '',
							'rectLeftAlt' : '',
							'rectLeftType' : '',
							'rectRightLat' : '',
							'rectRightLon' : '',
							'rectRightAlt' : '',
							'rectRightType' : '',
							'rectFenceType' : '0',
							'rectWidth' : '0.0',
							'rectHeight' : '0.0',
							'circleCenterLat' : '33.70026256381619',
							'circleCenterLon' : '-117.84498468638776',
							'circleCenterAlt' : '0',
							'circleCenterType' : '1',
							'radius' : '2615',
							'radiusUom' : '2',
							'circleFenceType' : '2',
							'createdUser' : 'WGPCCWUSR',
							'createdDate' : 1437686391000,
							'modifiedUser' : 'WGPCCWUSR',
							'modifiedDate' : 1437686391000,
							'status' : 'S',
							'action' : null,
							'geoFenceName' : 'Geo Fence Entry 2'
						}, {
							'geoFenceConfigId' : 3446,
							'vin' : 'KNALW4D46F6023401',
							'csmrId' : 'MUV0000000000000000089185',
							'geoFenceId' : 4,
							'active' : 'A',
							'geoFenceTime' : 5,
							'geoFenceTimeUom' : '1',
							'rectLeftLat' : '33.76118526420597',
							'rectLeftLon' : '-117.84638250114409',
							'rectLeftAlt' : '0',
							'rectLeftType' : '0',
							'rectRightLat' : '33.67135373579402',
							'rectRightLon' : '-117.73838549885596',
							'rectRightAlt' : '0',
							'rectRightType' : '0',
							'rectFenceType' : '2',
							'rectWidth' : '6.203211563375506',
							'rectHeight' : '6.206460298048618',
							'circleCenterLat' : '',
							'circleCenterLon' : '',
							'circleCenterAlt' : '0',
							'circleCenterType' : '1',
							'radius' : '1',
							'radiusUom' : '2',
							'circleFenceType' : '0',
							'createdUser' : 'WGPCCWUSR',
							'createdDate' : 1437686391000,
							'modifiedUser' : 'WGPCCWUSR',
							'modifiedDate' : 1437686391000,
							'status' : 'S',
							'action' : null,
							'geoFenceName' : 'Geo Fence EntryR'
						}
					],
					'LatestConfig' : true
				},
				'statuscode' : '200',
				'success' : true
			};

	return [200, responseData, {}];
	});

	$httpBackend.whenGET(/\/ccw\/kh\/curfewAlertSettings\.do/).respond(function(method,url,data) {
		var responseData = 
		{
		    'serviceResponse': {
		        'Active': 'A',
		        'MCZStatus': {
		            'GEOONOFF': 0,
		            'GEOCONFIG': 0,
		            'SPEEDONOFF': 0,
		            'SPEEDCONFIG': 0
		        },
		        'TmuStatus': 'A',
		        'CurfewAlertList': [{
		            'curfewConfigId': 13742,
		            'vin': 'KNALW4D46F6023401',
		            'csmrId': 'MUV0000000000000000089185',
		            'curfewId': 2,
		            'active': 'A',
		            'startTime': 1200,
		            'endTime': 1300,
		            'startDay': '1',
		            'endDay': '1',
		            'createdUser': 'WGPCCWUSR',
		            'createdDate': 1435870052000,
		            'modifiedUser': 'UVODS',
		            'modifiedDate': 1435870092000,
		            'status': 'C',
		            'curfewTime': 10,
		            'curfewTimeUom': '1',
		            'action': null,
		            'parentId': 1,
		            'curfewName': 'Curfew 1'
		        }, {
		            'curfewConfigId': 13743,
		            'vin': 'KNALW4D46F6023401',
		            'csmrId': 'MUV0000000000000000089185',
		            'curfewId': 10,
		            'active': 'A',
		            'startTime': 600,
		            'endTime': 1300,
		            'startDay': '2',
		            'endDay': '2',
		            'createdUser': 'WGPCCWUSR',
		            'createdDate': 1435870052000,
		            'modifiedUser': 'UVODS',
		            'modifiedDate': 1435870092000,
		            'status': 'C',
		            'curfewTime': 10,
		            'curfewTimeUom': '1',
		            'action': null,
		            'parentId': 2,
		            'curfewName': 'Curfew 2'
		        }, {
		            'curfewConfigId': 13744,
		            'vin': 'KNALW4D46F6023401',
		            'csmrId': 'MUV0000000000000000089185',
		            'curfewId': 11,
		            'active': 'A',
		            'startTime': 600,
		            'endTime': 1300,
		            'startDay': '3',
		            'endDay': '3',
		            'createdUser': 'WGPCCWUSR',
		            'createdDate': 1435870052000,
		            'modifiedUser': 'UVODS',
		            'modifiedDate': 1435870092000,
		            'status': 'C',
		            'curfewTime': 10,
		            'curfewTimeUom': '1',
		            'action': null,
		            'parentId': 2,
		            'curfewName': 'Curfew 2'
		        }],
		        'LatestConfig': true
		    },
		    'statuscode': '200',
		    'success': true
		};


		return [200,responseData,{}];
	});
});
