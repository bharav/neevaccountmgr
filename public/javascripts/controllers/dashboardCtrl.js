var totalCustomerPending = 0;
var totalDealerPending=0;
angular.module("NeevAccountApp").controller("DashboardController", ['$scope', '$rootScope', '$location', 'AccountService', DashboardController]);
function DashboardController($scope, $rootScope, $location, AccountService) {
    if ($rootScope.authenticated === false)
        $location.path('/login')


    AccountService.getRevenueProfit().then(function(revenue) {
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

    AccountService.getCustomerDue().then(function(customer) {
        $scope.chartCustomerSeries = GetCustomerDues(customer);
        $scope.chartCustConfig = {
            options: {
                chart: {
                    type: 'pie'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                }
            },
            title: {
                text: 'Customer pending amounnt as of now Rs:' + totalCustomerPending
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'name',
                colorByPoint: true,
                data: $scope.chartCustomerSeries
            }]
        }

        // Sample options for first chart
    })
     AccountService.getDealerDue().then(function(dealer) {
        $scope.chartDealerSeries = GetDealerDues(dealer);
        $scope.chartDealerConfig = {
            options: {
                chart: {
                    type: 'pie'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                }
            },
            title: {
                text: 'Dealer amounnt pending as of now Rs:'+totalDealerPending
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.y}</b>'
            },
            series: [{
                name: 'name',
                colorByPoint: true,
                data: $scope.chartDealerSeries
            }]
        }

        // Sample options for first chart
    })

}
//Get value based on statement by type searchdate
function GetRevenueData(data) {
    var revenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 12; i++) {
        var month = data[i].month;
        revenue[month - 1] = data[i].revenue;
    }
    return revenue;
}
function GetProfitData(data) {
    var profit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 12; i++) {
        var month = data[i].month;
        profit[month - 1] = data[i].profit;
    }
    return profit;
}

function GetCustomerDues(data) {
    var dues = [];
    totalCustomerPending = 0;
    for (var i = 0; i < data.length; i++) {
        totalCustomerPending += data[i].paymentdue;
    }
    for (var i = 0; i < data.length; i++) {
        var due = {
            name: data[i].name,
            y: ((data[i].paymentdue / totalCustomerPending).toFixed(2)) * 100
        }
        dues.push(due);
    }
    return dues;
}
function GetDealerDues(data) {
    var dues = [];
    totalDealerPending = 0;
    for (var i = 0; i < data.length; i++) {
        totalDealerPending += data[i].paymentdue;
    }
    for (var i = 0; i < data.length; i++) {
        var due = {
            name: data[i].name,
            y: ((data[i].paymentdue / totalDealerPending).toFixed(2)) * 100
        }
        dues.push(due);
    }
    return dues;
}



