/*jshint globals: true, undef: true, browser: true, node: true*/
/* globals angular */

angular.module('geckoTracker')
    .directive('geckoMetrics', function () {
        return {
            restrict: 'E',
            templateUrl: "components/GeckoMetrics/GeckoMetricsTemplate.htm",
            controller: function ($scope, $http, $log, geckoService) {
                $scope.metrics = [];
                geckoService.getMetrics().then(function (metrics) {
                    $scope.metrics = metrics;
                    $scope.$apply();
                    addPieChart($scope.metrics.males, $scope.metrics.females, 'pie-gender');
                    addPieChart(1, 0, 'pie-age');
                });



                function addPieChart(val1, val2, element) {
                    var myData = [{
                        labels: ['Females', 'Males'],
                        type: 'pie',
                        values: [val1, val2],
                        textfont: 'Roboto',
                        textinfo: 'none',
                        hole: 0.75,
                        textposition: 'outside',
                        rotation: 45,
                        marker: {
                            colors: ['white', 'rgba(138, 194, 74, 1)']
                        }
    }];
                    var myLayout = {
                        height: 150,
                        width: 150,
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        showlegend: false,
                        font: {
                            color: 'white'
                        },
                        margin: {
                            l: 10,
                            r: 10,
                            t: 0,
                            b: 0,
                        }
                    };

                    Plotly.newPlot(element, myData, myLayout, {
                        displayModeBar: false
                    });
                }
            }
        };


    });
