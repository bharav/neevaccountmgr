angular.module("NeevAccountApp").controller("DashboardController", ['$scope', '$rootScope', '$location', 'AccountService', DashboardController]);
function DashboardController($scope, $rootScope, $location, AccountService) {
    if ($rootScope.authenticated === false)
        $location.path('/login')
    
   
    AccountService.getRevenueProfit().then(function (revenue) {
        $scope.revenue = revenue;
         $scope.chartSeries = [
        { "name": "Revenue", "data": GetRevenueData(revenue), type: "column" },
        { "name": "Profit", "data": GetProfitData(revenue), type: "column" }
    ];
        //$scope.chartSeries = [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        $scope.chartConfig = {
        options: {
            chart: {
                type: 'areaspline'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        xAxis: {
				        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
				            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
				    },
        series: $scope.chartSeries,
        title: {
            text: 'Month wise Revenue and Profit'
        },
        credits: {
            enabled: true
        },
        loading: false,
        size: {}
    }
        // Sample options for first chart
    })
}
//Get value based on statement by type searchdate
function GetRevenueData(data) {
    var revenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 12; i++) {
        var month = data[0].month;
        revenue[month] = data[i].revenue;
    }
    return revenue;
}
function GetProfitData(data) {
    var profit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 12; i++) {
        var month = data[0].month;
        profit[month] = data[i].profit;
    }
    return profit;
}


