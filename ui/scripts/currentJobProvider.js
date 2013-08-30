module.exports = function($route, $http){
	'use strict';
		
	return function(){
		if('jobId' in $route.current.params){
			return $http.get('/get/' + $route.current.params.jobId).then(function(result){
				return result.data;
			});
		}
	};
};
