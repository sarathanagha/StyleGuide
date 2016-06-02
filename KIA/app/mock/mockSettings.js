'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {
    // Alert Settings
		$httpBackend.whenGET(/\/ccw\/set\/getAlertsSettings\.do/).respond(function(method,url,data) {
			var returnData = {
                'status': 'Success',
                'statusCode': '200',
                'result': {
                    'userAlerts': {
                        'maintenance100': null,
                        'maintenance250': null,
                        'maintenance500': null,
                        'diagnosticAlert': null,
                        'uvoNotification': null
                    },
                    'psevAlerts': null,
                    'khAlerts': {
                        'healthReport': null,
                        'maint1': null,
                        'maint2': null,
                        'maint3': null,
                        'softwareUpdate': null,
                        'oilChange': null,
                        'immedEngClimReq': null,
                        'scheduleEngClimReq': null,
                        'immedChargeReq': null,
                        'scheduleChargeReq': null,
                        'lockUnlockReq': null,
                        'remoteDoorLock': '',
                        'remoteDoorUnlock': '',
                        'remoteHornLight': '',
                        'remoteStart': 'E',
                        'remoteStartTerminate': 'E',
                        'remoteControlStop': 'E',
                        'autoDTCNotif': '',
                        'alertOnOffSetNotif': '',
                        'curfewPrefSetNotif': 'S,E,P',
                        'geoFencePrefSetNotif': 'S,E,P',
                        'speedPrefSetNotif': 'S,E,P',
                        'maintenancePrefSetNotif': '',
                        'sendPOI': ''
                    }
                }
            };
			return [200, returnData, {}];
		});

		// Personal
		$httpBackend.whenGET(/\/ccw\/set\/getPersonalSettings\.do/).respond(function(method,url,data) {
			var returnData = {
                'status': 'Success',
                'statusCode': '200',
                'result':
                {
                    'firstName': 'Testing',
                    'lastName': 'Tester',
                    'address1': '111 Peters Canyon',
                    'address2': 'Bldg 1',
                    'city': 'Irvine',
                    'state': 'CA',
                    'zipCode': '92606',
                    'phone': '17348955294',
                    'password':'password' 
                }
            };

			return [200, returnData, {}];
		});

        $httpBackend.whenPOST(/\/ccw\/set\/savePersonalSettings\.do/).respond(function(method,url,data) {
            var returnData = {
                'status': 'Success',
                'statusCode': '204',
            };

            return [200, returnData, {}];
        });

    // Security
		$httpBackend.whenGET(/\/ccw\/set\/getSecuritySettings\.do/).respond(function(method,url,data) {
			var returnData = {
        	'status' : 'Success',
        	'statusCode' : '200',
        	'result' : {
        		'securityQuestions' : {
        			'questions2' : [{
        					'code' : null,
        					'name' : 'What was the name of the street you grew up on?',
        					'questionId' : 10
        				}, {
        					'code' : null,
        					'name' : 'What was the make of your first vehicle?',
        					'questionId' : 11
        				}, {
        					'code' : null,
        					'name' : 'What is the name of your favorite author?',
        					'questionId' : 12
        				}, {
        					'code' : null,
        					'name' : 'What state was your mother born in?',
        					'questionId' : 13
        				}
        			],
        			'questions1' : [{
        					'code' : null,
        					'name' : 'In what city was your high school?',
        					'questionId' : 6
        				}, {
        					'code' : null,
        					'name' : 'What is the name of your first dog?',
        					'questionId' : 7
        				}, {
        					'code' : null,
        					'name' : 'What was your high school mascot?',
        					'questionId' : 8
        				}, {
        					'code' : null,
        					'name' : 'What was your childhood nickname?',
        					'questionId' : 9
        				}
        			],
        			'questions3' : [{
        					'code' : null,
        					'name' : 'What is your mother\'s maiden name?',
        					'questionId' : 14
        				}, {
        					'code' : null,
        					'name' : 'What school did you attend for sixth grade?',
        					'questionId' : 15
        				}, {
        					'code' : null,
        					'name' : 'What city were you born in?',
        					'questionId' : 16
        				}, {
        					'code' : null,
        					'name' : 'What was the name of your first pet?',
        					'questionId' : 17
        				}
        			]
        		},
        		'securitySettings' : {
        			'question1Id' : 15,
        			'question1' : 'What school did you attend for sixth grade?',
        			'answer1' : null,
        			'question2Id' : 14,
        			'question2' : 'What is your mother\'s maiden name?',
        			'answer2' : null,
        			'question3Id' : 6,
        			'question3' : 'In what city was your high school?',
        			'answer3' : null
        		}
        	}
        };

        var goodData = {
            'status': 'Success',
            'statusCode': '200',
            'result': {
                'securityQuestions': {
                    'questions2': [{
                        'code': null,
                        'name': 'What was the name of the street you grew up on?',
                        'questionId': 10
                    }, {
                        'code': null,
                        'name': 'What was the make of your first vehicle?',
                        'questionId': 11
                    }, {
                        'code': null,
                        'name': 'What is the name of your favorite author?',
                        'questionId': 12
                    }, {
                        'code': null,
                        'name': 'What state was your mother born in?',
                        'questionId': 13
                    }],
                    'questions1': [{
                        'code': null,
                        'name': 'In what city was your high school?',
                        'questionId': 6
                    }, {
                        'code': null,
                        'name': 'What is the name of your first dog?',
                        'questionId': 7
                    }, {
                        'code': null,
                        'name': 'What was your high school mascot?',
                        'questionId': 8
                    }, {
                        'code': null,
                        'name': 'What was your childhood nickname?',
                        'questionId': 9
                    }],
                    'questions3': [{
                        'code': null,
                        'name': 'What is your mother\'s maiden name ? ',
                        'questionId': 14
                    }, {
                        'code': null,
                        'name': 'What school did you attend for sixth grade ? ',
                        'questionId': 15
                    }, {
                        'code': null,
                        'name': 'What city were you born in ? ',
                        'questionId': 16
                    }, {
                        'code': null,
                        'name': 'What was the name of your first pet ? ',
                        'questionId': 17
                    }]
                },
                'securitySettings': {
                    'question1Id': 6,
                    'question1': 'In what city was your high school ? ',
                    'answer1': 'answer ',
                    'question2Id': 11,
                    'question2': 'What was the make of your first vehicle ? ',
                    'answer2': 'answer ',
                    'question3Id': 15,
                    'question3': 'What school did you attend for sixth grade ? ',
                    'answer3': 'answer '
                }
            }
        };

        returnData = goodData;

      return [200, returnData, {}];
  });


});
