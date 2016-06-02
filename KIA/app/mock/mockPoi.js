'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {

  	$httpBackend.whenGET(/ccw\/ost\/sdc\/selectOldestPoi\.do/).respond(function(method,url,data) {
  		// true means it is over 25
  		// false means it is under 25, and Poi is allowed to be added.
  		var returnData = {'success':false};
  		return [200, returnData, {}];
  	});

  	$httpBackend.whenPOST(/ccw\/ost\/sdc\/addPoi\.do/).respond(function(method, url, data) {
        var returnData;
        returnData = {'tid':'47T-kN1XSTudtr6luHAuuA','statuscode':'204','success':true};

        return [200, returnData, {}];
    });

    $httpBackend.whenPOST(/ccw\/ost\/sdc\/updatePoi\.do/).respond(function(method, url, data) {
        var returnData;
        returnData = {'success':true};

        return [200, returnData, {}];
    });

  	$httpBackend.whenGET(/ccw\/kh\/poiStatus\.do/).respond(function(method,url,data) {
  		var returnData;
  		returnData = {
		    'poiStatus': 'Z',
		    'poiStatusCreatedTime': 1434550152,
		    'poiSeq': 0,
		    'poiDbSeq': 19,
		    'poiPendingObject': {
		        'poiInfoList': [{
		            'src': 'Google',
		            'lang': 0,
		            'phone': '19496601586',
		            'addr': '2180 Barranca Parkway #120,Irvine,CA',
		            'zip': '92606',
		            'name': 'Jollibee',
		            'note': '',
		            'coord': {
		                'lat': 33.699087,
		                'lon': -117.83656100000002,
		                'alt': 0,
		                'type': 0
		            },
		            'attributions': 'Data by owner'
		        }]
		    }
		};

  		return [200, returnData, {}];
  	});

    $httpBackend.whenGET(/ccw\/resp\/poi\/poiOverview\.do/).respond(function(method, url, data) {
        var returnData;
        //var poiData = {'status':'Success','statusCode':'200','result':[{'totCnt':4,'poiSeq':4,'poiSrcNm':'Google','poiCreDt':'Apr 28, 2015 09:44:25 AM','poiNm':'Red Apple Markets','stetNm':'6724 Kitsap Way','cityNm':'Bremerton','stNm':'WA','zip':'98312','lae':47.58028,'loc':-122.704475,'tn':'13603775708','rgstDtm':'2015-04-28 09:44:25.0','rgstId':'ccw','mdfyDtm':'2015-04-28 09:44:25.0','fvtYn':'N','rsnum':'2'},{'totCnt':4,'poiSeq':2,'poiSrcNm':'Google','poiCreDt':'Apr 28, 2015 09:41:05 AM','poiNm':'Starbucks','stetNm':'3711 Elmsley Court','cityNm':'Greensboro','stNm':'NC','zip':'27406','lae':36.00228,'loc':-79.79279,'tn':'13362734531','rgstDtm':'2015-04-28 09:41:05.0','rgstId':'ccw','mdfyDtm':'2015-04-28 09:41:05.0','fvtYn':'N','rsnum':'3'},{'totCnt':4,'poiSeq':1,'poiSrcNm':'Google','poiCreDt':'Apr 28, 2015 09:40:12 AM','poiNm':'Apple Store','stetNm':'3333 Bear Street','cityNm':'Costa Mesa','stNm':'CA','zip':'92626','lae':33.691963,'loc':-117.89309,'tn':'17144246331','rgstDtm':'2015-04-28 09:40:12.0','rgstId':'ccw','mdfyDtm':'2015-04-28 09:40:12.0','fvtYn':'N','rsnum':'4'}]};
        var poiData = {
			'status' : 'Success',
			'statusCode' : '200',
			'result' : [{
					'totCnt' : 12,
					'poiSeq' : 17,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 07, 2015 04:18:32 PM',
					'poiNm' : 'KIA Motors America Inc 3',
					'stetNm' : '111 Peters Canyon Road',
					'cityNm' : 'Irvine',
					'stNm' : 'CA',
					'zip' : '92606',
					'lae' : 33.715479,
					'loc' : -117.79421100000002,
					'tn' : '1(949)468-4800',
					'userNote' : 'Rtgfghh',
					'rgstDtm' : '2015-07-07 16:18:32',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-07 16:18:32',
					'fvtYn' : 'N',
					'rsnum' : '1'
				}, {
					'totCnt' : 12,
					'poiSeq' : 16,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 07, 2015 04:17:06 PM',
					'poiNm' : 'Cafe Lu',
					'stetNm' : '634 South Harbor Boulevard',
					'cityNm' : 'Santa Ana',
					'stNm' : 'CA',
					'zip' : '92704',
					'lae' : 33.739139,
					'loc' : -117.921065,
					'rgstDtm' : '2015-07-07 16:17:06',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-07 16:17:06',
					'fvtYn' : 'N',
					'rsnum' : '2'
				}, {
					'totCnt' : 12,
					'poiSeq' : 15,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 02, 2015 04:54:58 PM',
					'poiNm' : 'CVS Pharmacy - Photoasdffgffffffffffffffffffffffff',
					'stetNm' : '19121 Beach Boulevard',
					'cityNm' : 'Huntington Beach',
					'stNm' : 'CA',
					'zip' : '92648',
					'lae' : 33.68512,
					'loc' : -117.98939000000001,
					'tn' : '17148481522',
					'userNote' : 'asgfasgfasbgdfasgdfasdfasbfasbdafbadfbdxbadbndanfanana',
					'rgstDtm' : '2015-07-02 16:54:58',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-02 16:54:58',
					'fvtYn' : 'N',
					'rsnum' : '3'
				}, {
					'totCnt' : 12,
					'poiSeq' : 13,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 02, 2015 04:22:05 PM',
					'poiNm' : 'Taco Rosa',
					'stetNm' : '13792 Jamboree Road',
					'cityNm' : 'Irvine',
					'stNm' : 'CA',
					'zip' : '92602',
					'lae' : 33.722301,
					'loc' : -117.79165599999999,
					'tn' : '17145056080',
					'rgstDtm' : '2015-07-02 16:22:05',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-02 16:22:05',
					'fvtYn' : 'N',
					'rsnum' : '4'
				}, {
					'totCnt' : 12,
					'poiSeq' : 11,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 02, 2015 04:19:57 PM',
					'poiNm' : 'Dr. Ralph A. Highshaw, MD',
					'stetNm' : '18111 Brookhurt St Suite #6200',
					'cityNm' : 'Fountain Valley',
					'stNm' : 'CA',
					'zip' : '92708',
					'lae' : 33.700027,
					'loc' : -117.95488799999998,
					'tn' : '17147510100',
					'rgstDtm' : '2015-07-02 16:19:57',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-02 16:19:57',
					'fvtYn' : 'N',
					'rsnum' : '5'
				}, {
					'totCnt' : 12,
					'poiSeq' : 10,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 02, 2015 04:19:12 PM',
					'poiNm' : 'Costco Wholesale',
					'stetNm' : '115 Technology Drive',
					'cityNm' : 'Irvine',
					'stNm' : 'CA',
					'zip' : '92618',
					'lae' : 33.660192,
					'loc' : -117.74561799999998,
					'tn' : '19494530435',
					'userNote' : 'test',
					'rgstDtm' : '2015-07-02 16:19:12',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-02 16:19:12',
					'fvtYn' : 'N',
					'rsnum' : '6'
				}, {
					'totCnt' : 12,
					'poiSeq' : 9,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 02, 2015 04:18:20 PM',
					'poiNm' : 'Walmart Supercenter',
					'stetNm' : '3600 West McFadden Avenue',
					'cityNm' : 'Santa Ana',
					'stNm' : 'CA',
					'zip' : '92704',
					'lae' : 33.737276,
					'loc' : -117.91526899999997,
					'tn' : '17147751804',
					'rgstDtm' : '2015-07-02 16:18:20',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-02 16:18:20',
					'fvtYn' : 'N',
					'rsnum' : '7'
				}, {
					'totCnt' : 12,
					'poiSeq' : 8,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 02, 2015 04:17:59 PM',
					'poiNm' : 'Burger King',
					'stetNm' : '8695 Irvine Center Drive',
					'cityNm' : 'Irvine',
					'stNm' : 'CA',
					'zip' : '92618',
					'lae' : 33.643574,
					'loc' : -117.74372700000004,
					'tn' : '19497272150',
					'rgstDtm' : '2015-07-02 16:17:59',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-02 16:17:59',
					'fvtYn' : 'N',
					'rsnum' : '8'
				}, {
					'totCnt' : 12,
					'poiSeq' : 7,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 02, 2015 04:15:46 PM',
					'poiNm' : 'Walmart Supercenter',
					'stetNm' : '3600 West McFadden Avenue',
					'cityNm' : 'Santa Ana',
					'stNm' : 'CA',
					'zip' : '92704',
					'lae' : 33.737276,
					'loc' : -117.91526899999997,
					'tn' : '17147751804',
					'rgstDtm' : '2015-07-02 16:15:46',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-02 16:15:46',
					'fvtYn' : 'N',
					'rsnum' : '9'
				}, {
					'totCnt' : 12,
					'poiSeq' : 5,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 02, 2015 04:07:59 PM',
					'poiNm' : 'University of California Irvine',
					'cityNm' : 'Irvine',
					'stNm' : 'CA',
					'zip' : '92697',
					'lae' : 33.640495,
					'loc' : -117.84429599999999,
					'tn' : '19498245011',
					'rgstDtm' : '2015-07-02 16:07:59',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-02 16:07:59',
					'fvtYn' : 'N',
					'rsnum' : '10'
				}, {
					'totCnt' : 12,
					'poiSeq' : 4,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 02, 2015 03:52:20 PM',
					'poiNm' : 'Cha For Tea',
					'stetNm' : '4187 Campus Drive M173',
					'cityNm' : 'Irvine',
					'stNm' : 'CA',
					'zip' : '92612',
					'lae' : 33.650708,
					'loc' : -117.83894700000002,
					'tn' : '19497250301',
					'rgstDtm' : '2015-07-02 15:52:20',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-02 15:52:20',
					'fvtYn' : 'N',
					'rsnum' : '11'
				}, {
					'totCnt' : 12,
					'poiSeq' : 2,
					'poiSrcNm' : 'Google',
					'poiCreDt' : 'Jul 02, 2015 03:46:11 PM',
					'poiNm' : 'Target',
					'stetNm' : '13200 Jamboree Road',
					'cityNm' : 'Irvine',
					'stNm' : 'CA',
					'zip' : '92602',
					'lae' : 33.727068,
					'loc' : -117.78572200000002,
					'tn' : '17148381209',
					'rgstDtm' : '2015-07-02 15:46:11',
					'rgstId' : 'ccw',
					'mdfyDtm' : '2015-07-02 15:46:11',
					'fvtYn' : 'N',
					'rsnum' : '12'
				}
			]
		};
       
// 
        //var poiData = {'status':'Success','statusCode':'200','result':[{'totCnt':4,'poiSeq':4,'poiSrcNm':'Google','poiCreDt':'Apr 28, 2015 09:44:25 AM','poiNm':'Red Apple Markets','stetNm':'6724 Kitsap Way','cityNm':'Bremerton','stNm':'WA','zip':'98312','lae':47.58028,'loc':-122.704475,'tn':'13603775708','rgstDtm':'2015-04-28 09:44:25.0','rgstId':'ccw','mdfyDtm':'2015-04-28 09:44:25.0','fvtYn':'N','rsnum':'2','showDetail':false},{'totCnt':4,'poiSeq':2,'poiSrcNm':'Google','poiCreDt':'Apr 28, 2015 09:41:05 AM','poiNm':'Starbucks','stetNm':'3711 Elmsley Court','cityNm':'Greensboro','stNm':'NC','zip':'27406','lae':36.00228,'loc':-79.79279,'tn':'13362734531','rgstDtm':'2015-04-28 09:41:05.0','rgstId':'ccw','mdfyDtm':'2015-04-28 09:41:05.0','fvtYn':'N','rsnum':'3','showDetail':false},{'totCnt':4,'poiSeq':1,'poiSrcNm':'Google','poiCreDt':'Apr 28, 2015 09:40:12 AM','poiNm':'Apple Store','stetNm':'3333 Bear Street','cityNm':'Costa Mesa','stNm':'CA','zip':'92626','lae':33.691963,'loc':-117.89309,'tn':'17144246331','rgstDtm':'2015-04-28 09:40:12.0','rgstId':'ccw','mdfyDtm':'2015-04-28 09:40:12.0','fvtYn':'N','rsnum':'4','showDetail':false}]};
        returnData = poiData;
        return [200, returnData, {}];
    });
});
