'use strict';

module.exports = function($scope, cran){
	$scope.jobs = cran.getJobs();
	console.log($scope.jobs);
	cran.on('update', function(jobs){
		console.log('UPDATE', jobs);
		$scope.$apply(function(){
			$scope.jobs = jobs;
		});
	});
};