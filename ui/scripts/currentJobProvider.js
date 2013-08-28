module.exports = function(){
	'use strict';

	this.$get = function($q, $route, cran){
		if($route.current.params.jobId){
			return $q.when(cran.get($route.current.params.jobId));	
		}

		return $q.when();
	};
};
