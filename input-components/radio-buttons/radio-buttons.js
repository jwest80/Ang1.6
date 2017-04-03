// PCS Type Selection Component:
// Dependency:

// Usage: 
//      <radio-buttons></radio-buttons>
// Attributes:
//      name: Label name
//      selected: currently selected item in list
//      items: list of items

(function () {
    'use strict';

    app.component('radioButtons', {
        templateUrl: '/content/js/app/input-components/radio-buttons/radio-buttons.html',
            controller: radioButtonsController,
            bindings: {
                name: '@',      //Strings
                selected: '=',  //Two-way binding
                items: '<',     //One way binding
                changed: '&',   //Callback
            },
        });

    radioButtonsController.$inject = [];
    function radioButtonsController() {
        var $ctrl = this;

        $ctrl.isDisabled = function (item) {
            if (item.name == 'Other')
                return true;
            return false;
        }

        $ctrl.selectItem = function (item) {
            if (!$ctrl.isDisabled(item)) {
                $ctrl.selected = item;
                $ctrl.changed({ $value: item });
            }
        }

        $ctrl.isSelected = function (item) {
            return $ctrl.selected === item;
        }

        ////////////////

        $ctrl.$onInit = function () { };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
    }

})();


