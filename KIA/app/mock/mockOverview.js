'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {

    // Overview
		$httpBackend.whenGET(/\/ccw\/kh\/overviewInfo\.do/).respond(function(method, url, data) {

			var returnData;

			var khData = {'serviceResponse':
      { 'weatherImage':'cloudy.png',
        'tempC':18.6,
        'monthlyStat':[
          {'vin':'KNALU4D33F6023403',
           'csmrId':'MUV0000000000000000088588',
           'year':2015,'month':3,'startOdometer':0,
           'endOdometer':0,'idleTime':1081,
           'efficientScore':99,'inefficientScore':1,
           'aveSpeed':5,'awardCount':'1',
           'aveAccel':388,'secsDriven':813,
           'minsDriven':13.549999,'hrsDriven':0.22583333,
           'hrsDrivenDisp':'0','milesDriven':1,
           'aveMph':0,'dayCount':2}
        ],
        'numOfIssues':6,
        'weather':'Mostly Cloudy','currentMileage':1550,
        'milesTillNextMaint':5950,'tempF':65.4
      },
        'success':true};

 			returnData = khData;

	        return [200, returnData, {}];
	    });

		$httpBackend.whenGET(/\/ccw\/ev\/vehicleStatusCached\.do/).respond(function(method, url, data) {

			var returnData;

			var psevData = {'airCtrlOn':'false','engine':'false','doorLock':'false','doorOpen':{'frontLeft':'0','frontRight':'0','backLeft':'0','backRight':'0'},'trunkOpen':'false','airTemp':{'unit':1,'value':{'hexValue':'01'}},'defrost':'false','acc':'false','eVStatus':{'batteryCharge':false,'drvDistance':[{'type':2,'distanceType':{'value':103.0,'unit':3}}],'batteryStatus':90,'batteryPlugin':2,'remainTime':[{'value':0,'unit':1}]},'userTempPref':1};

			returnData = psevData;

					return [200, returnData, {}];
			});
$httpBackend.whenGET(/\/ccw\/vehicle\/overViewResponsive\.do/).respond(function(method, url, data) {

      var returnData;

      var gen1plus = {
    "status": "Success",
    "statusCode": "200",
    "result": {
        "status": null,
        "monthlyStat": [
            {
                "vin": null,
                "csmrId": null,
                "year": 2015,
                "month": 5,
                "day":16,
                "startOdometer": null,
                "endOdometer": null,
                "idleTime": null,
                "efficientScore": null,
                "inefficientScore": null,
                "aveSpeed": null,
                "awardCount": null,
                "aveAccel": null,
                "secsDriven": null,
                "minsDriven": null,
                "hrsDriven": null,
                "hrsDrivenDisp": null,
                "milesDriven": null,
                "aveMph": null,
                "dayCount": null
            }
        ],
        "currentMileage": 6721,
        "numAwards": 4,
        'numOfIssues':0,
        "vihiDiagList": [
            {
                "totCnt": 0,
                "bkdwSysNm": "Chassis",
                "cnt": "0",
                "rqRcpmDtm": "Nov 26, 2014"
            }
        ],
        "dtcDetails": 0,
        "violCntList": [
            {
                "pageIndex": 1,
                "pageUnit": 10,
                "pageSize": 10,
                "firstIndex": 1,
                "lastIndex": 1,
                "recordCountPerPage": 10,
                "searchType": null,
                "vin": null,
                "flag": "curf",
                "trscId": null,
                "trscSeq": null,
                "violSeq": null,
                "violCnt": 0,
                "orderBy": null,
                "csmrId": null,
                "lastUpdated": 1436552514000,
                "dateRange": 1262304000000
            }
        ],
        "send2CarList": [
            {
                "totCnt": 18,
                "poiSeq": 18,
                "poiSrcNm": "Google",
                "poiCreDt": "Jun 17, 2015 12:29:44 PM",
                "poiNm": "Crevier BMW",
                "stetNm": "1500 Auto Mall Dr",
                "cityNm": "Santa Ana",
                "stNm": "CA",
                "zip": "92705",
                "lae": 33.727302,
                "loc": -117.838662,
                "tn": "16572315000",
                "rgstDtm": "2015-06-17 12:29:44.0",
                "rgstId": "ccm",
                "mdfyDtm": "2015-06-17 12:29:44.0",
                "fvtYn": "N",
                "rsnum": "1"
            }
        ],
        "tripInfo": null,
        "awardType": null,
        "lastAwardType": 2,
        "awardsCount": 4,
        "tripSearchVO": null,
        "trscId": null,
        "prefDealInfo": {
            "dlrCd": "CA273",
            "dlrNm": "Kia Of Irvine",
            "dlrTn": "(949)777-2300",
            "zip": "92618",
            "dlrAdr": "45 Oldfield",
            "dlrAdrCity": "Irvine",
            "dlrAdrSt": "CA",
            "dlrLocLae": "33.6355267",
            "dlrLocLoe": "-117.7215253",
            "cretDtm": null,
            "mdfyDtm": null,
            "dlrWebsite": "http://WWW.KIAOFIRVINE.COM",
            "requestType": null,
            "vin": null,
            "userId": null,
            "offset": null,
            "k900Dealer": false,
            "formatedDlrTn": "(949)777-2300"
        },
        "bkdwInfo": []
    }
}

      returnData = gen1plus;

          return [200, returnData, {}];
      });


    /*// Overview gen 1
    $httpBackend.whenGET(/\/ccw\/carInfo\.do/).respond(function(method, url, data) {

      var returnData;
        var gen1Data = {
            actVin: "N"
            acumTrvgDist: 1357
            acumTrvgDistMile: 843
            apptCnt: "0"
            cgdsCnt: "0"
            checkNameNull: "123456"
            dtcCnt: "0"
            dtcKh: 0
            endDate: 1669795200000
            endMile: 100000
            enrVin: "C"
            enrVinKh: "0"
            fuelType: "0"
            khVehicle: "0"
            mdlNm: "SORENTO"
            mdlYr: "2012"
            nextServiceMile: 0
            odoUpdate: "Apr 07, 2015 10:48 AM"
            odometer: "000843"
            originImgFileNm: "Sorento_SatinMetal.PNG"
            poi: "6"
            realImgFileNm: "Sorento_SatinMetal.PNG"
            securityPin: "Not Available"
            unreadCnt: "0"
            uvoCnt: "0"
            vehNick: "123456"
            vehicleCd: "XM"
            vehicleStatus: "notexists"
            vin: "5XYKUCA64EG387574"
            violCnt: "0"
            wrrtEndMile: false
            xrclCd: "STM"
            },
        'success':true};

      returnData = gen1Data;

          return [200, returnData, {}];*/
      });
