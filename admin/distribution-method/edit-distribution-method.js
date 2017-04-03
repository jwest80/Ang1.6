// Edit Prospect Modal:

(function () {
    'use strict';

    app.component('editDistributionMethod', {
        templateUrl: '/content/js/app/admin/distribution-method/edit-distribution-method.html',
        controller: editDistributionMethodController,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    editDistributionMethodController.$inject = ['distributionMethodService', 'adminUtility'];
    function editDistributionMethodController(distributionMethodService, adminUtility) {
        var $ctrl = this;

        $ctrl.save = function () {
            adminUtility.validateForm($ctrl.addEditForm);
            if ($ctrl.working.id) {
                distributionMethodService.update($ctrl.working).then(function (response) {   // Update 
                    $ctrl.close({ $value: $ctrl.working });
                }, processErrors)
            } else {
                distributionMethodService.create($ctrl.working).then(function (response) {   // Create 
                    $ctrl.close({ $value: $ctrl.working });
                }, processErrors)
            }
        };

        function processErrors(error) {
            adminUtility.processErrors(error, $ctrl.addEditForm);
        }

        $ctrl.cancel = function () {
            $ctrl.dismiss({ $value: 'close' });
        };

        $ctrl.back = function () {
            if ($ctrl.selected.value == 0) {
                $ctrl.selected.value = $ctrl.items.length - 1;
            } else { $ctrl.selected.value--; }
            $ctrl.bindActiveItem();
        };

        $ctrl.forward = function () {
            if ($ctrl.selected.value == $ctrl.items.length - 1) {
                $ctrl.selected.value = 0;
            } else { $ctrl.selected.value++; }
            $ctrl.bindActiveItem();
        };

        $ctrl.pageMessage = function () {
            var page = $ctrl.selected.value + 1;
            return "Showing: " + page + ' of ' + $ctrl.items.length;
        };

        $ctrl.bindActiveItem = function () {
            $ctrl.working = angular.copy($ctrl.items[$ctrl.selected.value]);
        }

        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.items = $ctrl.resolve.items;
            $ctrl.selected = $ctrl.resolve.selected;

            if ($ctrl.selected.value >= 0) {
                $ctrl.bindActiveItem();
            } else {
                $ctrl.isNew = true;
                $ctrl.working = {};
            }

        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$onClosing = function () { };
    }

})();

