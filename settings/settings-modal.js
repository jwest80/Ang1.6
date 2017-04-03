// Edit Prospect Modal:

(function () {
    'use strict';

    app.component('settingsModal', {
        templateUrl: '/content/js/app/settings/settings-modal.html',
        controller: settingsModalController,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    settingsModalController.$inject = ['settingsService', 'growl', '$templateCache'];
    function settingsModalController(settingsService, growl, $templateCache) {
        var $ctrl = this;

        $ctrl.save = function () {
            settingsService.update($ctrl.settings);
            $ctrl.growlSuccess('Your settings have been saved.');
            $ctrl.close({ $value: $ctrl.settings });
        };

        $ctrl.cancel = function () {
            $ctrl.dismiss({ $value: 'close' });
        };

        $ctrl.growlSuccess = function (msg) {
            growl.success(msg, { title: 'Settings Updated' });
        }

        $ctrl.reset = function () {
            settingsService.reset();
            $ctrl.growlSuccess('Default settings restored.');
            $ctrl.close({ $value: $ctrl.settings });
        }

        $ctrl.clearCache = function () {
            $templateCache.removeAll();
            growl.success("Website cache has been cleared", { title: 'Cache Cleared' });
            window.location.reload(true);
        }

        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.settings = angular.copy(settingsService.read());
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$onClosing = function () { };
    }

})();

