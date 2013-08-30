'use strict';

module.exports = function($scope, $http, $timeout, $route){
	var REFRESH_INTERVAL = 2000;

	$scope.moment = moment;
	$scope.jobs = [];

	function update(){
		if($route.current.loadedTemplateUrl === 'template/dashboard.html'){
			$http.get('/get').then(function(result){
				$scope.jobs.length = 0;
				$scope.jobs = result.data;
			});
			$timeout(update, REFRESH_INTERVAL);
		}
	}

	update();
};