angular.module("NeevAccountApp").controller("AccountEntryController", ['$scope', '$rootScope', '$location', '$routeParams', 'AccountService', AccountEntryController]);


function AccountEntryController($scope, $rootScope, $location, $routeParams, AccountService) {

    if ($rootScope.authenticated === false)
        $location.path('/login')
    //initialize product
    $scope.products = [];
    $scope.read = false;
    $scope.billedamount = 0;
    if (typeof $routeParams.id !== 'undefined' && typeof $routeParams.state !== 'undefined') {
        AccountService.setAccountId($routeParams.id);
        AccountService.getAccountbyId($scope.account).then(function (data) {
            $scope.account = data;
            var dateObj = new Date($scope.account.created);
            $scope.account.created = dateObj.getFullYear() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getDate();
            $scope.customer = $scope.account.customer[0];
            $scope.billedamount = $scope.account.billedamount
            console.log($scope.customer);
            $scope.products = $scope.account.products
            console.log(data);
        })
        if ($routeParams.state === "read") {
            $scope.read = true;
        }
    }
    
    // add products
    $scope.AddProduct = function () {
        $scope.products.push($scope.newProduct);
        $scope.billedamount += ($scope.newProduct.sellingprice * $scope.newProduct.units)
        $scope.newProduct = null;

    }
    
    //edit already added products
    $scope.productedit = function (product, index) {
        $scope.billedamount -= (product.sellingprice * product.units)
        $scope.newProduct = product;
        $scope.products.splice(index, 1);
    }
    
    //Delete product already added
    $scope.productdelete = function (product, index) {
        $scope.billedamount -= (product.sellingprice * product.units)
        $scope.products.splice(index, 1);
    } 
    
    // reset product fields
    $scope.ResetProduct = function () {
        $scope.newProduct = null;
    } 
    
    //submit account entry
    $scope.submitaccount = function () {
        $scope.account.customer = $scope.customer;
        $scope.account.products = $scope.products
        $scope.account.billedamount = $scope.billedamount;
        if (typeof $routeParams.id !== 'undefined' && typeof $routeParams.state !== 'undefined') {
            AccountService.updateAccount($scope.account).then(function (data) {
                console.log(data);
                $location.path('/' + data._id + "/read");
            })
        }
        else {
            AccountService.setAccounts($scope.account).then(function (data) {
                console.log(data);
                $location.path('/' + data._id + "/read");
            })
        }
    }
    $scope.updateaccount = function () {
        $location.path('/' + $routeParams.id + "/edit");
    }
}

