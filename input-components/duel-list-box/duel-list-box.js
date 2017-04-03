// Type Ahead Component:
// Dependency:

// Usage: 
//      <duel-list-box></duel-list-box>


(function () {
    'use strict';

    app.component('duelListBox', {
        templateUrl: '/content/js/app/input-components/duel-list-box/duel-list-box.html',
        controller: duelListBoxController,
        bindings: {
            inputName: '@',
            selected: '=',
            items: '<',
            leftLabel: '@',
            rightLabel: '@',
            options: '@',
            rightStyle: '@',
            onUpdate: '&',
        },
    });

    duelListBoxController.$inject = [];
    function duelListBoxController() {
        var $ctrl = this;

        $ctrl.currentItemsLeft = [];

        if (typeof $ctrl.selected == 'undefined')
            $ctrl.selected = [];

        $ctrl.selectChanged = function () {
            $ctrl.onUpdate({
                $event: {
                    item: $ctrl.selected
                }
            });
        }

        $ctrl.remove = function () {
            while (0 < $ctrl.currentItemsRight.length) {

                var item = $ctrl.selected.find(function (x) {
                    return x.id == $ctrl.currentItemsRight[0];
                });

                //var item = $ctrl.currentItemsRight[0];
                $ctrl.currentItemsRight.splice(0, 1);        

                $ctrl.items.push(item);                  

                var index = $ctrl.selected.indexOf(item);      
                $ctrl.selected.splice(index, 1);
            }
            $ctrl.selectChanged();
        }
        $ctrl.add = function () {
            if ($ctrl.currentItemsLeft) {
                while (0 < $ctrl.currentItemsLeft.length) {

                    var item = $ctrl.items.find(function (x) {
                        return x.id == $ctrl.currentItemsLeft[0];;
                    });

                    //var item = $ctrl.currentItemsLeft[0];
                    $ctrl.currentItemsLeft.splice(0, 1);        // Remove from Current

                    $ctrl.selected.push(item);                  // Add Right

                    var index = $ctrl.items.indexOf(item);      // Remove Left
                    $ctrl.items.splice(index, 1);
                }
            }
            $ctrl.selectChanged();
        }
        $ctrl.removeAll = function () {
            while (0 < $ctrl.selected.length) {
                var item = $ctrl.selected[0];
                $ctrl.selected.splice(0, 1);                // Remove from Selected
                $ctrl.items.push(item);                     // Add Left
            }
            $ctrl.selectChanged();
        }
        $ctrl.addAll = function () {
            while (0 < $ctrl.items.length) {
                var item = $ctrl.items[0];
                $ctrl.items.splice(0, 1);                   // Remove from items
                $ctrl.selected.push(item);                  // Add to selected
            }
            $ctrl.selectChanged();
        }

        $ctrl.displayName = function (item) {
            return item.name;
        }

        ////////////////

        $ctrl.$onInit = function () {
            if (!$ctrl.options) $ctrl.options = 'item.name for item in $ctrl.selected';
            if (!$ctrl.leftLabel) $ctrl.leftLabel = 'Available';
            if (!$ctrl.rightLabel) $ctrl.rightLabel = 'Selected';
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { $ctrl.removeAll(); };
    }

})();


