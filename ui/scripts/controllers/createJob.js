module.exports = function($scope, cran){
	$scope.job = {
		name: "",
		intervalType: "minutes",
		interval: 2,
		fuzz: 0,
		fuzzType: "seconds",
		script: ""
	};

	$scope.createJob = function(){
		cran.create($scope.job);
	};
};