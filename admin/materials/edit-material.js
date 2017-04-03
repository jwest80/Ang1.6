// Edit Presenter Modal:

(function () {
    'use strict';

    app.component('editMaterial', {
        templateUrl: '/content/js/app/admin/materials/edit-material.html',
        controller: editMaterial,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    editMaterial.$inject = ['materialsService', 'adminUtility'];
    function editMaterial(materialsService, adminUtility) {
        var $ctrl = this;

        materialsService.readMaterialType().then(function (response) {
            $ctrl.materialTypes = response.data;
        })

        $ctrl.save = function () {
            adminUtility.validateForm($ctrl.addEditForm);
            if ($ctrl.working.id) {
                materialsService.update($ctrl.working).then(function (response) {   // Update 
                    $ctrl.close({ $value: $ctrl.working });
                }, processErrors)
            } else {
                materialsService.create($ctrl.working).then(function (response) {   // Create 
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
            $ctrl.category = $ctrl.resolve.category;

            if ($ctrl.selected.value >= 0) {
                $ctrl.bindActiveItem();
            } else {
                $ctrl.isNew = true;
                $ctrl.working = { materialCategoryId: $ctrl.category.id };
            }

        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$onClosing = function () { };
    }

})();

