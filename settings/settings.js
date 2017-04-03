// Edit Prospect Modal:

(function () {
    'use strict';

    app.component('settings', {
        template: '<a href="" ng-click="$ctrl.openSettings()" ng-transclude><i class="fa fa-cog" aria-hidden="true"></i></a>',
        controller: settingsController,
        transclude: true,
    });

    settingsController.$inject = ['$uibModal'];
    function settingsController($uibModal) {
        var $ctrl = this;

        $ctrl.openSettings = function () {
            var modalInstance = $uibModal.open({
                component: 'settingsModal',
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                // Settings Saved
            }, function () {
                // Modal Dismiss
            });
        }

        ////////////////

        $ctrl.$onInit = function () {};
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$onClosing = function () { };
    }

})();

