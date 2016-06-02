'use strict';

module.exports = /*@ngInject*/ function(HttpService, MapService, SpringUtilsService, ResolveService, $q, $cookies) {

  function PoiModel() {
    return {
      cityNm: '',
      lae: 0,
      loc: 0,
      poiNm: '',
      poiSeq: 0,
      stNm: '',
      stetNm: '',
      tn: '',
      userNote:'',
      zip: ''
    };    
  }

  function processPois(data) {
    var poiList = data;
    var poi;
    for (var i = 0; i <= poiList.length-1; i++) {
      poi = poiList[i];
      poi['poiSelected'] = false;

      // format display address
      poi['formattedAddress'] = formatAddress(poi); 

      // assign markerIds
      poi['markerId'] = i;
    }

    return poiList;
  }  

  function formatAddress(poi) {
    var address = ((poi.cityNm) ? poi.cityNm : '') +
                    ((poi.stNm) ? ' ' + poi.stNm : '') +
                    ((poi.zip) ? ' , ' + poi.zip : '');
    return address; 
  }

  function getPois() {
    var deferred = $q.defer();
    if ($cookies['gen'] === 'kh') {
      HttpService.get('/ccw/kh/poiStatus.do').success(function(statusData) {
        HttpService.get('/ccw/resp/poi/poiOverview.do').success(function(poiData) {
          deferred.resolve({'poiStatus':statusData, 'poiList': processPois(poiData.result)});
        });
      });
    } else {
      HttpService.get('/ccw/resp/poi/poiOverview.do').success(function(data) {
        deferred.resolve({'poiList': processPois(data.result)});
      });
    }
    return deferred.promise;
  }

  // KH only feature
  // If status returns 'E' or 'P', module should be locked
  function getPoiStatus() {
    return HttpService.get('/ccw/kh/poiStatus.do');
  }

  function makePayload(data) {
     var payload = new PoiModel();
     var prop;
     for (prop in payload) {
      if (payload.hasOwnProperty(prop)) {
        payload[prop] = data[prop];
      }
     }
     return payload;
  }

  function savePois(data, type, notesOnly) {
    var deferred = $q.defer();

    if (!notesOnly) { notesOnly = false; }
    else { notesOnly = true;}

    var suffix = type === 'edit' ? 'updatePoi.do?notesOnly=' + notesOnly : 'addPoi.do';
    var url = '/ccw/ost/sdc/'+suffix;
    var payload = SpringUtilsService.encodeParams(makePayload(data));
    var headers = {
      'Content-Type':'application/x-www-form-urlencoded'
    };

    if (type === 'edit') {
      HttpService.post(url,payload,headers).then(function() {
        deferred.resolve();
      });
    } else if (type === 'add') {
      selectOldestPoi().then(function(data) {
        if (data.data.success) {
          deferred.reject();
        } else {
          HttpService.post(url,payload,headers).then(function() {
            deferred.resolve();
          });
        }
      });
    }   

    return deferred.promise; 
  }

  // Used for figuring out if the POI has exceeded the 25 poi limit
  function selectOldestPoi() {
    return HttpService.get('/ccw/ost/sdc/selectOldestPoi.do');
  }

  function deletePois(data) {
    var payload = [];
    // if array, push elements
    if (data.length) {
      for (var i = 0; i < data.length; i++) {
        payload.push(data[i]);
      }
    // else push element assuming it is an integer
    } else {
      payload.push(data);
    }
    return HttpService.post('/ccw/ost/sdc/deletePois.do?poiSeqList='+payload.join(','),{});
  }

  function createPoiModel() {
    return new PoiModel();
  }

  // Used for Places API, in converting response data to PoiModel
  function googleDetailToPoiModel(response) {

    var poi = new PoiModel();
    poi.cityNm = response.city;
    poi.stNm = response.state;
    poi.stetNm = response.street;
    poi.zip = response.zip;
    poi.poiNm = response.name;
    poi.lae = response.location.lat();
    
    poi.loc = response.location.lng();
    poi.tn = response.phone;

    // for displaying
    var secondLine = poi.cityNm + ' ' + poi.stNm;      
    if (poi.zip) { secondLine = secondLine + ', ' + poi.zip; }
    poi.addressSecondLine = $.trim(secondLine);    

    return poi;
  }

  return{
    processPois : processPois,
    formatAddress: formatAddress,
    createPoiModel: createPoiModel,
    getPois : getPois,
    savePois : savePois,
    selectOldestPoi : selectOldestPoi,
    deletePois : deletePois,
    googleDetailToPoiModel: googleDetailToPoiModel
  };

};
