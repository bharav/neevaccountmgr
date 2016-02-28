var app = angular.module('NeevAccountApp', ['ngRoute', "ui.bootstrap","NeevAccountApp.services","NeevAccountApp.directive","angularUtils.directives.dirPagination"]).run(function($http,$rootScope,$location){
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
    $rootScope.signout = function(){
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = 'Guest';
        $location.path('#/login');
	};
});

app.config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: 'accountentry.html',
			controller: 'AccountEntryController'
		})
		//the login display
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'AuthController'
		})
		//the signup display
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'AuthController'
		})
        .when('/:id/:state', {
			templateUrl: 'accountentry.html',
			controller: 'AccountEntryController'
		})
        .when('/dashboard', {
			templateUrl: 'dashboard.html',
			controller: 'DashboardController'
            
		});
});
