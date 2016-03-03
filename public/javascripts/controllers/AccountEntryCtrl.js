angular.module("NeevAccountApp").controller("AccountEntryController", ['$scope', '$rootScope', '$location', '$routeParams', 'AccountService', AccountEntryController]);


function AccountEntryController($scope, $rootScope, $location, $routeParams, AccountService) {
    $scope.customerSelected = [];
    $scope.dealerSelected = [];
    $scope.customer = [];
    if ($rootScope.authenticated === false)
        $location.path('/login')
    AccountService.getCustomers().then(function (data) {
        $scope.customers = data;
        console.log(data);
    });
    AccountService.getDealers().then(function (data) {
        $scope.dealers = data;
        console.log(data);
    }); 
            
    //  AccountService.getDealers().then(function (data) {
    // $scope.dealers=data;
    // console.log(data);
    //});  
    //initialize product
    $scope.products = [];
    $scope.read = false;
    $scope.billedamount = 0;
    if (typeof $routeParams.id !== 'undefined' && $routeParams.state !== 'undefined') {
        AccountService.setAccountId($routeParams.id);
        AccountService.getAccountbyId($scope.account).then(function (data) {
            $scope.account = data;
            var dateObj = new Date($scope.account.created);
            $scope.account.created = dateObj.getFullYear() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getDate();
            $scope.customerSelected = $scope.account.customer[0];
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
        if (typeof $scope.dealerSelected.dealerId !== 'undefined' && $scope.dealerSelected.dealerId !== 'undefined') {
            $scope.newProduct.dealerId = $scope.dealerSelected.dealerId;
        }
        $scope.newProduct.dealer = $scope.dealerSelected.name;
        $scope.newProduct.dealercontact = $scope.dealerSelected.contact;
        $scope.products.push($scope.newProduct);
        $scope.billedamount += ($scope.newProduct.sellingprice * $scope.newProduct.units)
        $scope.newProduct = null;
        $scope.dealerSelected = [];

    }
    
    //edit already added products
    $scope.productedit = function (product, index) {
        $scope.billedamount -= (product.sellingprice * product.units)
        $scope.newProduct = product;
        if (typeof product.dealerId !== 'undefined' && product.dealerId !== 'undefined') {
              $scope.dealerSelected.dealerId = product.dealerId;
        }
        $scope.dealerSelected.name = product.dealer;
        $scope.dealerSelected.contact = product.dealercontact;
        $scope.products.splice(index, 1);
    }
    
    //Delete product already added
    $scope.productdelete = function (product, index) {
        $scope.billedamount -= (product.sellingprice * product.units)
        $scope.products.splice(index, 1);
    } 
    
    // reset product fields
    $scope.ResetProduct = function () {
        $scope.products.push($scope.newProduct);
        $scope.newProduct = null;
    } 
    
    //submit account entry
    $scope.submitaccount = function () {
        if ($scope.customerSelected._id === null || typeof ($scope.customerSelected._id) === "undefined") {
            var customernew =
                {
                    "name": $scope.customerSelected.name,
                    "connectedfrom": $scope.customerSelected.connectedfrom,
                    "contact": $scope.customerSelected.contact,
                    "address": $scope.customerSelected.address,
                };
            $scope.customer.push(customernew);
        }
        else {
            $scope.customer.push($scope.customerSelected);
        }
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

