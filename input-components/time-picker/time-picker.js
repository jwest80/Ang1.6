// time Picker Component:
// Dependency:

// Usage: 
//      <time-picker></time-picker>


(function () {
    'use strict';

    app.component('timePicker', {
        templateUrl: '/content/js/app/input-components/time-picker/time-picker.html',
        controller: timePickerController,
        bindings: {
            name: '@',
            dt: '=',
        },
    });

    timePickerController.$inject = [];
    function timePickerController() {
        var $ctrl = this;

        if (!$ctrl.dt) {
            $ctrl.dt = new Date();
        } 

        $ctrl.hstep = 1;
        $ctrl.mstep = 1;

        $ctrl.ismeridian = true;

        $ctrl.changed = function () {
            //$log.log('Time changed to: ' + $ctrl.dt);
        };

        $ctrl.clear = function() {
            $ctrl.dt = null;
        };
        
        ////////////////

        $ctrl.$onInit = function () { };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
    }

})();


