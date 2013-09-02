module.exports = function($scope, $http, $location, $window, currentJob){
	'use strict';
	
	if(typeof currentJob === "function"){
		$scope.job = {
			name: "",
			schedule: "",
			script: ""
		};
	} else {
		$scope.job = currentJob;
	}

	$scope.save = function(){
		$http.post('/save', $scope.job).then(function(){
			$location.path('/dashboard').replace();
		}, function(){
			alert('An error occurred');
		});
	};

	$scope.delete = function(){
		var confirmed = $window.confirm("Are you sure you want to delete this job?");
		if(confirmed){
			$http.get('/delete/' + $scope.job.id).then(function(result){
				$location.path('/dashboard').replace();
			}, function(){
				alert('An error occurred');	
			});
		}
	}

	$scope.aceLoaded = function(editor){
		editor.setShowPrintMargin(false);
	};
};

module.exports.$inject = ['$scope', '$http', '$location', '$window', 'currentJob'];