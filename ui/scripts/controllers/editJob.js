module.exports = function($scope, cran, currentJob){
	$scope.job = currentJob || {
		name: "",
		rawSchedule: "",
		script: ""
	};

	console.log(currentJob);

	$scope.save = function(){
		console.log($scope.job);
		cran.create($scope.job);
	};

	$scope.aceLoaded = function(editor){
		editor.setShowPrintMargin(false);
	};
};