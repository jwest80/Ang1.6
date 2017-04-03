// Date Picker Component:
// Dependency:

// Usage: 
//      <date-picker></date-picker>


(function () {
    'use strict';

    app.component('datePicker', {
        templateUrl: '/content/js/app/input-components/date-picker/date-picker.html',
        controller: datePickerController,
        bindings: {
            name: '@',
            ngModel: '<ngModel',
            onUpdate: '&',
        },
    });

    datePickerController.$inject = [];
    function datePickerController() {
        var $ctrl = this;
       
        $ctrl.popup = { opened: false };

        $ctrl.dateOptions = {
            maxDate: new Date(2027, 5, 22),
            minDate: new Date(),
            startingDay: 1,
        };

        $ctrl.open = function () {
            $ctrl.popup.opened = true;
        };

        ////////////////
        $ctrl.onChange = function () {
            $ctrl.onUpdate({
                $event: {
                    item: $ctrl.ngModel
                }
            });
        }

        $ctrl.$onInit = function () {
            
        };
        $ctrl.$onChanges = function (changesObj) {
            if ($ctrl.ngModel) {
                $ctrl.ngModel = new Date($ctrl.ngModel);
            }
        };
        $ctrl.$onDestory = function () { };
    }

})();


