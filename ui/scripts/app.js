'use strict';

var cranModule = angular.module('cran', ['ngRoute', 'ui.ace']);

cranModule.controller('dashboard', require('./controllers/dashboard.js'));
cranModule.controller('editJob', require('./controllers/editJob.js'));
cranModule.controller('navigation', require('./controllers/navigation.js'));

cranModule.provider('cran', require('./cranProvider.js'));
cranModule.provider('currentJob', require('./currentJobProvider.js'));

cranModule.config(
	function($routeProvider) {
		$routeProvider.when('/dashboard', {
			controller: 'dashboard',
			templateUrl:'template/dashboard.html'
		}).when('/edit-job/:jobId', {
			controller: 'editJob',
			templateUrl:'template/edit-job.html',
			resolve: {'currentJob': 'currentJob'}
		}).when('/create-job', {
			controller: 'editJob',
			templateUrl:'template/edit-job.html',
			resolve: {'currentJob': 'currentJob'}
		}).otherwise({redirectTo:'/dashboard'});
	}
);