'use strict';

module.exports = function($scope, $location, $rootScope){
	$rootScope.$on("$routeChangeSuccess", function () {
		$scope.path = $location.path();
    });
};