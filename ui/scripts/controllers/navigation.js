'use strict';

module.exports = function($scope, $location, $rootScope){
	$rootScope.$on("$routeChangeSuccess", function () {
		console.log($location.path());
		$scope.path = $location.path();
    });
};