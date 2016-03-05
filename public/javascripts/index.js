var app = angular.module('NeevAccountApp', ['ngRoute', "ui.bootstrap","NeevAccountApp.services","NeevAccountApp.directive","angularUtils.directives.dirPagination","highcharts-ng"]).run(function($http,$rootScope,$location){
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
			templateUrl: 'dashboard.html',
			controller: 'DashboardController'
		})
        .when('/account', {
			templateUrl: 'accountentry.html',
			controller: 'AccountEntryController'
		})
          .when('/search', {
			templateUrl: 'search.html',
			controller: 'SearchController'
            
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
		});
});
