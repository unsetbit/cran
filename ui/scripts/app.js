'use strict';

var cranModule = angular.module('cran', ['ngRoute', 'ui.ace']);

cranModule.controller('dashboard', require('./controllers/dashboard.js'));
cranModule.controller('createJob', require('./controllers/createJob.js'));
cranModule.controller('navigation', require('./controllers/navigation.js'));

cranModule.provider('cran', require('./cranProvider.js'));

cranModule.config(
	function($routeProvider) {
		$routeProvider.when('/dashboard', {
			controller: 'dashboard',
			templateUrl:'template/dashboard.html'
		}).when('/create-job', {
			controller: 'createJob',
			templateUrl:'template/create-job.html'
		}).otherwise({redirectTo:'/dashboard'});
	}
);