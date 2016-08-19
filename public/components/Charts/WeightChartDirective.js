 /*jshint globals: true, undef: true, browser: true, node: true*/
 /* globals angular */

 angular.module('geckoTracker')
     .directive('weightChart', function () {
         return {
             restrict: 'E',
             scope: {
                 'geckoId': '=',
             },
             templateUrl: "components/Charts/WeightChartTemplate.htm",
             controller: function ($scope, $http, $log, geckoService, $location) {

                 $log.debug("Weight chart directive's controller instantiated");

                 $scope.x_dates = [];
                 $scope.y_weights = [];


                 var weightGraph = document.getElementById('weight');

                 $scope.populateChart = function () {
                     console.log("populating chart...");
                     console.log($scope.geckoId);
                     geckoService.getGeckoEvents($scope.geckoId).then(function (events) {
                         $scope.events = events;
                         for (var i = 0; i < $scope.events.length; i++) {
                             if ($scope.events[i].type == "weight") {
                                 $scope.x_dates.push(new Date($scope.events[i].date));
                                 $scope.y_weights.push($scope.events[i].info.weight);
                             }
                         }
                         console.log($scope.x_dates);
                         console.log($scope.y_weights);

                         var now = Date.now();
                         var year = now - 31536000000;

                         var trace1 = {
                             x: $scope.x_dates,
                             y: $scope.y_weights,
                             mode: 'lines+markers',
                             type: 'scatter',
                             line: {
                                 color: "rgb(44, 160, 44)"
                             }


                         };

                         var data = [trace1];
                         var layout = {
                             title: "Gecko Weight Chart",
                             font: {
                                 family: "Roboto, sans-serif"
                             },
                             yaxis: {
                                 title: "Weight",
                                 autorange: true,
                                 showline:true,
                                 linecolor:"#DCEDC8"
                             },
                             xaxis: {
                                 type: "date",
                                 title: "Date",
                                 tickformat: "%m/%d/%y",
                                 showline:true,
                                 linecolor:"#DCEDC8",
                                 tickangle:-50,
                                 nticks:12,
                                 range: [year, now] /* range from today to one year */
                             }
                         };

                         Plotly.newPlot(weightGraph, data, layout, {

                         });
                         console.log("chart displayed");
                     });


                 };

                 $scope.populateChart();



             }
         };
     });
