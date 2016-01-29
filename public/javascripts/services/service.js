angular.module('NeevAccountApp.services', [])
  .factory('AccountService', function ($http, $q) {
    // Might use a resource here that returns a JSON array
    // Some fake testing data
    var currentaccountId;
   
    //Get list of orders from server
    function getAccounts() {
      var deferred = $q.defer();
      $http.get("/api/accounts")
        .success(function (data) {
          deferred.resolve(data);
        })
        .error(function () {
          console.log("Error in http call.");
          deferred.reject();
        });
      return deferred.promise;
    }
    //Set order details in server
    function setAccounts(account) {
      var deferred = $q.defer();
      var req = {
        method: 'POST',
        url: '/api/accounts',
        headers: {
          'Content-Type': "application/json"
        },
        data: account
      }
      $http(req).success(function (data, status) {
        console.log("Posted order from HTTP", data, status);
        deferred.resolve(data);
      })
        .error(function () {
          console.log("Error in http call.");
          deferred.reject();
        });
      return deferred.promise;
    }
    //Update order details in server
    function updateAccount(account) {
      var deferred = $q.defer();
      var req = {
        method: 'PUT',
        url: '/api/account/' + currentaccountId,
        headers: {
          'Content-Type': "application/json"
        },
        data: account
      }
      $http(req).success(function (data, status) {
        console.log("Updated order from HTTP", data, status);
        deferred.resolve(data);
      })
        .error(function () {
          console.log("Error in http call.");
          deferred.reject();
        });
      return deferred.promise;
    }
    //Get order details from server "Parameter" orderId
    function getAccountbyId() {
      var deferred = $q.defer();
      $http.get("/api/account/" + currentaccountId)
        .success(function (data, status) {
          console.log("Received order from HTTP", data, status);
          deferred.resolve(data);
        })
        .error(function () {
          console.log("Error in http call.");
          deferred.reject();
        });
      return deferred.promise;
    }

    // Set order id in local variable
    function setAccountId(accountId) {
      currentaccountId = accountId;
    }
    return {
      setAccountId: setAccountId,
      getAccounts: getAccounts,
      setAccounts: setAccounts,
      updateAccount: updateAccount,
      getAccountbyId: getAccountbyId,
    }

  })
   