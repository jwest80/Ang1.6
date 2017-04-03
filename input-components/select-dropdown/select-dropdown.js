// Type Ahead Component:
// Dependency:

// Usage: 
//      <select-dropdown></select-dropdown>


(function () {
    'use strict';

    app.component('selectDropdown', {
        templateUrl: '/content/js/app/input-components/select-dropdown/select-dropdown.html',
        controller: selectDropdownController,
        bindings: {
            ngModel: '<',
            items: '<',
            itemTemplate: '@',
            onUpdate: '&',
        },
    });

    selectDropdownController.$inject = ['$filter'];
    function selectDropdownController($filter) {
        var $ctrl = this;

        $ctrl.selectChanged = function () {
            $ctrl.onUpdate({
                $event: {
                    item: $ctrl.ngModel
                }
            });
        }

        ////////////////


        $ctrl.$onInit = function () {
            if (!$ctrl.itemTemplate) {
                $ctrl.itemTemplate = 'item.name'
            }
                
        };
        $ctrl.$onChanges = function (changesObj) {
            // Event is called when 1 way binding '<' items change in parent.
            // Note even though ngModel is 1 way bound, it still updates in parent 
            // because it is a complex object in javascript. (this is by design)
            // Learn more here: https://toddmotto.com/angular-1-5-lifecycle-hooks
            if ($ctrl.items && $ctrl.ngModel) {
                //$ctrl.ngModel = $ctrl.items.find(x => x.id === $ctrl.ngModel.id)
                $ctrl.ngModel = $ctrl.items.find(function (x) {
                  return x.id === $ctrl.ngModel.id;
                });
            }
        };
        $ctrl.$onDestroy = function () { };
    }

})();


