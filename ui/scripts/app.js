'use strict';

var cranModule = angular.module('cran', ['ngRoute', 'ui.ace', 'ui.bootstrap']);

cranModule.controller('dashboard', require('./controllers/dashboard.js'));
cranModule.controller('editJob', require('./controllers/editJob.js'));
cranModule.controller('navigation', require('./controllers/navigation.js'));

cranModule.factory('currentJob', require('./currentJobProvider.js'));

cranModule.config(
	['$routeProvider', function($routeProvider) {
		$routeProvider.when('/dashboard', {
			controller: 'dashboard',
			templateUrl:'template/dashboard.html'
		}).when('/edit-job/:jobId', {
			controller: 'editJob',
			templateUrl:'template/edit-job.html',
			resolve: {'currentJob': ['currentJob', function(currentJob){ return currentJob(); }]}
		}).when('/create-job', {
			controller: 'editJob',
			templateUrl:'template/edit-job.html'
		}).otherwise({redirectTo:'/dashboard'});
	}]
);