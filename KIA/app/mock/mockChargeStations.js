'use strict';

/*@ngInject*/
angular.module('uvo')
  .run(function($httpBackend) {
	$httpBackend.whenGET(/ccw\/fcs\/fcs01\.do/).respond(function(method, url) {
        var returnData = [
							   {
							      "geometry":{
							         "type":"Point",
							         "coordinates":[33.6796991199764,-117.83868365945511]
							      },
							      "chargingstation":{
							         "id":null,
							         "csseq":"386078",
							         "csregion":"810",
							         "csuid":"537",
							         "ver":"12",
							         "brand":"ChargePoint Network",
							         "cslogo":"2",
							         "name":"IRVINE CO OFC",
							         "ldesc":"Pakeing Rates Apply: Enter 2A parking garage and proceed to L3, stations are near the elevator.",
							         "address":"2 Park Plaza",
							         "city":"Irvine",
							         "state":"CA",
							         "zip":"92614",
							         "phone":"(949)313-2200",
							         "lat":"33.732254",
							         "lon":"-117.850416",
							         "status":[
											            {
										               "chtype":"2",
										               "numavail":"4",
										               "numoff":"0",
										               "numinuse":"1",
										               "tnum":"5"
											            }
												        ],
							         "amen1":"UAAABBUU",
							         "amen2":"UUUUUUUU",
							         "distance":"0.581"
							      }
							   },
							   {
							      "geometry":{
							         "type":"Point",
							         "coordinates":[33.8665381,-117.9608866]
							      },
							      	 "chargingstation":{
							         "id":null,
							         "csseq":"385832",
							         "csregion":"810",
							         "csuid":"228",
							         "ver":"9",
							         "brand":"Blink",
							         "cslogo":"0",
							         "name":"Southern California Edison - North Orange County",
							         "ldesc":"",
							         "address":"1851 W Valencia Dr",
							         "city":"Fullerton",
							         "state":"CA",
							         "zip":"92633",
							         "phone":"",
							         "lat":"33.8665381",
							         "lon":"-117.9608866",
							         "status":[],
							         "amen1":null,
							         "amen2":null,
							         "distance":3.00
							        }
						       },
						          {
							      "geometry":{
							         "type":"Point",
							         "coordinates":[
							            33.698512,
							            -117.844663
							         ]
							      },
							      "chargingstation":{
							         "id":null,
							         "csseq":"385984",
							         "csregion":"810",
							         "csuid":"426",
							         "ver":"13",
							         "brand":null,
							         "cslogo":"0",
							         "name":"Alton Corporate Plaza",
							         "ldesc":"",
							         "address":"1733 Alton Pkwy",
							         "city":"Irvine",
							         "state":"CA",
							         "zip":"92606",
							         "phone":"(949)313-2200",
							         "lat":"33.698512",
							         "lon":"-117.844663",
							         "status":[],
							         "amen1":null,
							         "amen2":null,
							         "distance":null
							      }
							   },
							      {
							      "geometry":{
							         "type":"Point",
							         "coordinates":[
							            33.700072,
							            -117.84298
							         ]
							      },
							      "chargingstation":{
							         "id":null,
							         "csseq":"385983",
							         "csregion":"810",
							         "csuid":"425",
							         "ver":"13",
							         "brand":null,
							         "cslogo":"0",
							         "name":"Bay Technology Center Acquisitions Partners",
							         "ldesc":"",
							         "address":"16800 Ashton",
							         "city":"Irvine",
							         "state":"CA",
							         "zip":"92606",
							         "phone":"(949)313-2200",
							         "lat":"33.700072",
							         "lon":"-117.84298",
							         "status":[],
							         "amen1":null,
							         "amen2":null,
							         "distance":null
							      }
							   },
							   {
							      "geometry":{
							         "type":"Point",
							         "coordinates":[33.6778338135,-117.836537004]
							      },
							      "chargingstation":{
							         "id":null,
							         "csseq":"386251",
							         "csregion":"810",
							         "csuid":"727",
							         "ver":"13",
							         "brand":"OpConnect",
							         "cslogo":"0",
							         "name":"4 Park Plaza",
							         "ldesc":"",
							         "address":"4 Park Plaza",
							         "city":"Irvine",
							         "state":"CA",
							         "zip":"92614",
							         "phone":"(714)983-2450",
							         "lat":"33.6778338135",
							         "lon":"-117.836537004",
							         "status":[],
							         "amen1":null,
							         "amen2":null,
							         "distance":null
							      }
							   }]

        return [200, returnData, {}];
    });

	$httpBackend.whenGET(/ccw\/ev\/isUSRegion\.do/).respond(function(method, url, data) {
        var zipValidation = {"uszipcode":"false"};

        return [200, zipValidation, {}];
    });
});
