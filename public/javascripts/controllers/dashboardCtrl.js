(function () {
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

                AccountService.getAccountbyDate($scope.searchinput).then(function (data) {
                    $scope.accounts = data;
                })

            }
            //Get value based on statement by type searchdate
            else {
                var date = new Date();
                var firstDay = new Date(date.getFullYear(), $scope.statementmonth, 1);
                var lastDay = new Date(date.getFullYear(), $scope.statementmonth + 1, 0);

                $scope.monthinput = {};
                $scope.monthinput.startdate = firstDay;
                $scope.monthinput.enddate = lastDay;
                AccountService.getAccountbyDate($scope.monthinput).then(function (data) {
                    $scope.accounts = data;
                });
            }
        }
    }
})();

