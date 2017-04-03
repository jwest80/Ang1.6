// Help Component:

(function () {
    'use strict';

    app.component('helpSection', {
        templateUrl: '/content/js/app/help/helpSection.html',
        controller: helpSectionController,
        transclude: true,
        bindings: {
        },
    });

    helpSectionController.$inject = [];
    function helpSectionController() {
        var $ctrl = this;

        ////////////////

        $ctrl.$onInit = function () {};
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
    }

})();


