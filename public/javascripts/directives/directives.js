angular.module('NeevAccountApp.directive', [])
.directive('typeahead', function ($timeout) {
    return {
      restrict: 'AEC',
      scope: {
        items: '=',
        prompt: '@',
        title: '@',
        subtitle: '@',
        itemid:'@',
        model: '=',
        onSelect: '&'
      },
      link: function (scope, elem, attrs) {
        scope.handleSelection = function (selectedItem) {
          scope.model = selectedItem;
          scope.current = 0;
          scope.selected = true;
          $timeout(function () {
            scope.onSelect();
          }, 200);
        };
        scope.current = 0;
        scope.selected = true;
        scope.isCurrent = function (index) {
          return scope.current == index;
        };
        scope.setCurrent = function (index) {
          scope.current = index;
        };
      },
      templateUrl: 'templates/templateurl.html'
    }
  })
  .directive('datepicker', function() {
         return {
            restrict: 'A',
            require: 'ngModel',
            compile: function() {
               return {
                  pre: function(scope, element, attrs, ngModelCtrl) {
                     var format, dateObj;
                     format = (!attrs.dpFormat) ? 'yyyy/mm/dd' : attrs.dpFormat;
                     if (!attrs.initDate && !attrs.dpFormat) {
                        // If there is no initDate attribute than we will get todays date as the default
                        dateObj = new Date();
                        scope[attrs.ngModel] = dateObj.getFullYear() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getDate();
                     } else if (!attrs.initDate) {
                        // Otherwise set as the init date
                        scope[attrs.ngModel] = attrs.initDate;
                     } else {
                        // I could put some complex logic that changes the order of the date string I
                        // create from the dateObj based on the format, but I'll leave that for now
                        // Or I could switch case and limit the types of formats...
                     }
                     // Initialize the date-picker
                     $(element).datepicker({
                        format: 'yyyy/mm/dd',
                     }).on('changeDate', function(ev) {
                        // To me this looks cleaner than adding $apply(); after everything.
                        scope.$apply(function () {
                           ngModelCtrl.$setViewValue(ev.format(format));
                        });
                     });
                  }
               }
            }
         }
      });

