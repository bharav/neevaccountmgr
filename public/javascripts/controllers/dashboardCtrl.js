angular.module("NeevAccountApp").controller("DashboardController",['$scope','$rootScope','$location','AccountService',DashboardController]);


function DashboardController($scope,$rootScope,$location,AccountService){
    
    if($rootScope.authenticated===false)
        $location.path('/login')
        AccountService.getAccounts().then(function (data) {
          $scope.accounts=data;    
        });
        
      $scope.goto=function(accountid){
          $location.path('/'+accountid+"/read");
      }  
}