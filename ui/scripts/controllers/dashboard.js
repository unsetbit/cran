module.exports = function($scope, $http, $timeout, $route){
	'use strict';

	var REFRESH_INTERVAL = 2000;

	$scope.moment = moment;
	$scope.jobs = [];

	function update(){
		if($route.current.loadedTemplateUrl === 'template/dashboard.html'){
			$http.get('/info').then(function(result){
				$scope.jobs.length = 0;
				$scope.jobs = result.data.jobs;
			});
			$timeout(update, REFRESH_INTERVAL);
		}
	}

	update();
};

module.exports.$inject = ['$scope', '$http', '$timeout', '$route'];