// Preview Component:
// Dependency:


(function () {
    'use strict';

    app.component('debugPanel', {
        templateUrl: '/content/js/app/debug-panel/debug-panel.html',
        controller: debugPanelController,
        bindings: {
            data: '<'
        },
    });

    debugPanelController.$inject = ['settingsService'];
    function debugPanelController(settingsService) {
        var $ctrl = this;

        $ctrl.showDebug = settingsService.showDebug();
        $ctrl.showPreview = false;

        ////////////////

        $ctrl.$onInit = function () {};
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () {  };
        $ctrl.$onClosing = function () {  };
    }

})();

