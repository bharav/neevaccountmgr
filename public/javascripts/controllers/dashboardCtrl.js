angular.module("NeevAccountApp").controller("DashboardController", ['$scope', '$rootScope', '$location', 'AccountService', DashboardController]);


function DashboardController($scope, $rootScope, $location, AccountService) {

    if ($rootScope.authenticated === false)
        $location.path('/login')


    $scope.goto = function (accountid) {
        $location.path('/' + accountid + "/read");
    }
    //set statement type as statementbydate
    $scope.statementtype = "monthly";
    AccountService.getAccounts().then(function (data) {
        $scope.accounts = data;
    });
    $scope.search = function () {
        //Get value based on statement by type monthly
        if ($scope.statementtype !== "monthly") {
            AccountService.getAccounts().then(function (data) {
                $scope.accounts = data;
            });
        }
        //Get value based on statement by type searchdate
        else {
            AccountService.getAccountbyDate($scope.search).then(function (data) {
                $scope.accounts = data;
            })
        }
    }
}