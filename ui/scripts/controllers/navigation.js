module.exports = function($scope, $location, $rootScope){
	'use strict';
	
	$rootScope.$on("$routeChangeSuccess", function () {
		$scope.path = $location.path();
    });
};

module.exports.$inject = ['$scope', '$location', '$rootScope'];