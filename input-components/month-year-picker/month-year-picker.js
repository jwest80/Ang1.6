// Month Year Picker Component:
// Dependency:

// Usage: 
//      <month-year-picker></month-year-picker>


(function () {
    'use strict';

    app.component('monthYearPicker', {
        templateUrl: '/content/js/app/input-components/month-year-picker/month-year-picker.html',
        controller: monthYearPickerController,
        bindings: {
            name: '@',
            ngModel: '=ngModel',
        },
    });

    monthYearPickerController.$inject = [];
    function monthYearPickerController() {
        var $ctrl = this;

        $ctrl.popup = { opened: false };

        $ctrl.dateOptions = {
            minMode: "month",
            datepickerMode: "'month'",
        };

        $ctrl.open = function () {
            $ctrl.popup.opened = true;
        };

        ////////////////

        $ctrl.$onInit = function () {
            if ($ctrl.ngModel == 'Invalid Date') { $ctrl.ngModel = ''; }
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
    }

})();


