// Alert Component:
// Dependency:


(function () {
    'use strict';

    app.component('alert', {
        templateUrl: '/content/js/app/alert/alert.html',
        controller: alertController,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    alertController.$inject = [];
    function alertController() {
        var $ctrl = this;

        $ctrl.save = function () {
            $ctrl.close({ $value: 'save' });
        };

        $ctrl.discard = function () {
            $ctrl.close({ $value: 'discard' });
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({ $value: '' });
        };

        ////////////////

        $ctrl.$onInit = function () {
            
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () {  };
        $ctrl.$onClosing = function () {  };
    }

})();

