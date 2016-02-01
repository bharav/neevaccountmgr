var app = angular.module('NeevAccountApp', ['ngRoute',"NeevAccountApp.services","angularUtils.directives.dirPagination"]).run(function($http,$rootScope,$location){
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

 app.directive('datepicker', function() {
         return {
            restrict: 'A',
            require: 'ngModel',
            compile: function() {
               return {
                  pre: function(scope, element, attrs, ngModelCtrl) {
                     var format, dateObj;
                     format = (!attrs.dpFormat) ? 'd/m/yyyy' : attrs.dpFormat;
                     if (!attrs.initDate && !attrs.dpFormat) {
                        // If there is no initDate attribute than we will get todays date as the default
                        dateObj = new Date();
                        scope[attrs.ngModel] = dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear();
                     } else if (!attrs.initDate) {
                        // Otherwise set as the init date
                        scope[attrs.ngModel] = attrs.initDate;
                     } else {
                        // I could put some complex logic that changes the order of the date string I
                        // create from the dateObj based on the format, but I'll leave that for now
                        // Or I could switch case and limit the types of formats...
                     }
                     // Initialize the date-picker
                     $(element).datepicker({
                        format: format,
                     }).on('changeDate', function(ev) {
                        // To me this looks cleaner than adding $apply(); after everything.
                        scope.$apply(function () {
                           ngModelCtrl.$setViewValue(ev.format(format));
                        });
                     });
                  }
               }
            }
         }
      });