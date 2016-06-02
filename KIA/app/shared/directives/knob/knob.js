 
 'use strict';

module.exports = /*@ngInject*/ function($timeout) {
    return {
        restrict: 'EA',
        replace: true,
template: '<input value="{{ knobData }}"/>',
        scope: {
            knobData: '=',
            knobStatus: '=',
            knobOptions: '&'
        },
        link: function($scope, $element) {
            var knobInit = $scope.knobOptions() || {};

            knobInit.release = function(newValue) {
                $timeout(function() {
                    $scope.knobData = newValue;
                    $scope.$apply();
                });
            };

            $scope.$watch('knobData', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $($element).val(newValue).change();
                }
            });
            
            $($element).val($scope.knobStatus).knob(knobInit);
            $($element).val($scope.knobData);
           
            if($($element).val() == '--'){


$($element).css('color','red');
            }
        }
    };
};


/*

 angular.module('uvo').directive('knob', ['$timeout', function($timeout) {
    'use strict';

    return {
        restrict: 'EA',
        replace: true,
template: '<input value="{{ knobData }}"/>',
        scope: {
            knobData: '=',
            knobOptions: '&amp;'
        },
        link: function($scope, $element) {
            var knobInit = $scope.knobOptions() || {};

            knobInit.release = function(newValue) {
                $timeout(function() {
                    $scope.knobData = newValue;
                    $scope.$apply();
                });
            };

            $scope.$watch('knobData', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $($element).val(newValue).change();
                }
            });

            $($element).val($scope.knobData).knob(knobInit);
        }
    };
}]);*/