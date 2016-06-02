'use strict';

module.exports = /*@ngInject*/ function($q) {
  return {
    resolveMultiple : function(funcs) {
      var deferred = $q.defer();
      var promises = [];
      for (var i in funcs) {
        if (funcs[i]) {
          promises.push(funcs[i]());
        }
      }

      $q.all(promises).then(function(data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    }
  };
};
