'use strict';

module.exports = /*@ngInject*/ function(HttpService, $q) {

  function processData(data) {
    //return the correct index - if mismatch give index = ''
    // assign arrays
    data.securitySettings.question1Id = checkQuestionId(data.securityQuestions.questions1,data.securitySettings.question1Id);
    data.securitySettings.question2Id = checkQuestionId(data.securityQuestions.questions2,data.securitySettings.question2Id);
    data.securitySettings.question3Id = checkQuestionId(data.securityQuestions.questions3,data.securitySettings.question3Id);

    function checkQuestionId(list,id) {
      var i, isFound = false;
      for (i in list) {
        if (list[i]) {
          if (id === list[i].questionId) {
            isFound = true;
            break;
          }
        }
      }
      if (isFound === false) {return '';}
      else {return id;}
    }

    return data;
  }

  function Payload() {
    return {
       'question1Id': 0,
       'answer1': '',
       'question2Id': 0,
       'answer2': '',
       'question3Id': 0,
       'answer3': ''
    };
  }

  function makePayload(data) {
    var payload = new Payload();
    for (var i in payload) {
      if (payload.hasOwnProperty(i)) {
        payload[i] = data[i];
      }
    }
    return payload;
  }

  return {
    getSecuritySettings : function() {
      var deferred = $q.defer();
      HttpService.get('/ccw/set/getSecuritySettings.do').success(function(data) {
        deferred.resolve(processData(data.result));
      });
      return deferred.promise;
    },
    setSecuritySettings : function(data) {
      return HttpService.post('/ccw/set/saveSecuritySettings.do', makePayload(data));
    }
  };
};
