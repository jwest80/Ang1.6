// Help Component:

(function () {
    'use strict';

    app.component('help', {
        templateUrl: '/content/js/app/help/help.html',
        controller: helpController,
        bindings: {
        },
    });

    helpController.$inject = [];
    function helpController() {
        var $ctrl = this;

        ////////////////

        $ctrl.selectedType = { name: 'Show All' };

        $ctrl.types = [{ name: 'Show All' }, { name: 'Client' }, { name: 'Consultant' }, { name: 'Prospect' }];

        $ctrl.typeChange = function (value) {
            $ctrl.selectedType = value;
            console.log(value);
        }

        $ctrl.$onInit = function () {
            $ctrl.oneAtATime = false;
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
    }

})();


