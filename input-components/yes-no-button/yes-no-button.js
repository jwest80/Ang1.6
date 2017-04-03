// PCS Type Selection Component:
// Dependency:

// Usage: 
//      <yes-no-button></yes-no-button>
// Attributes:
//      name: Label name
//      selected: currently selected item in list
//      items: list of items

(function () {
    'use strict';

    app.component('yesNoButton', {
        templateUrl: '/content/js/app/input-components/yes-no-button/yes-no-button.html',
        controller: yesNoButtonController,
            bindings: {
                name: '@',
                ngModel: '=ngModel',
                hideLabel: '=?',
                labelClass: '@',
                inputClass: '@',
                isRequired: '<',
                updated: '&',
            },
        });

    yesNoButtonController.$inject = [];
    function yesNoButtonController() {
        var $ctrl = this;
        $ctrl.hideLabel = angular.isDefined($ctrl.hideLabel) ? $ctrl.hideLabel : false;

        $ctrl.selectItem = function (item) {
            $ctrl.ngModel = item;
            $ctrl.updated();
        }

        $ctrl.isSelected = function (item) {
            return $ctrl.ngModel === item;
        }

        ////////////////

        $ctrl.$onInit = function () { };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
    }

})();


