// Admin Primary Materials Component:

(function () {
    'use strict';

    app.component('primaryMaterials', {
        templateUrl: '/content/js/app/admin/primary-materials/primary-materials.html',
        controller: primaryMaterialsController,
        bindings: {
        },
    });

    primaryMaterialsController.$inject = ['primaryMaterialsService', 'pcsTypeService', 'settingsService', 'materialDefaultSectionMapService', '$uibModal', 'messageService', 'adminUtility'];
    function primaryMaterialsController(primaryMaterialsService, pcsTypeService, settingsService, materialDefaultSectionMapService, $uibModal, messageService, adminUtility) {
        var $ctrl = this;
        $ctrl.itemsPerPage = settingsService.itemsPerPage();

        // Search
        $ctrl.predicates = primaryMaterialsService.predicates();
        $ctrl.selectedPredicate = $ctrl.predicates[0];

        // Read 
        $ctrl.readItems = function () {
            primaryMaterialsService.read().then(function (response) {
                $ctrl.items = response.data;
            }, function (error) {
                messageService.alertError(error);
            })
        }
        $ctrl.readSections = function (id) {
            materialDefaultSectionMapService.read(id).then(function (response) {
                $ctrl.sections = response.data;
            }, function (error) {
                messageService.alertError(error);
            });
        }

        // Delete 
        $ctrl.deleteItem = function (id) {
            primaryMaterialsService.delete(id).then(function (response) {
                $ctrl.readItems();
            }, function (error) {
                messageService.alertError(error);
            })
        }
        $ctrl.deleteSection = function (id) {
            materialDefaultSectionMapService.delete(id).then(function (response) {
                $ctrl.readSections($ctrl.selectedItem.id);
            }, function (error) {
                messageService.alertError(error);
            })
        }

        // Add Edit Modal
        $ctrl.editModal = function (id) {
            var index = $ctrl.items.findIndex(function (x) {
                return x.id == id;
            });
            $ctrl.itemIndex = { value: index };
            var modalInstance = $uibModal.open({
                component: 'editPrimaryMaterial',
                resolve: {
                    items: function () {
                        return $ctrl.items;
                    },
                    selected: $ctrl.itemIndex
                },
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                $ctrl.readItems();
            }, function () {
                // Dismiss
            });
        };
        $ctrl.editSectionModal = function (id) {
            var index = $ctrl.sections.findIndex(function (x) {
                return x.id == id;
            });
            $ctrl.itemIndex = { value: index };
            var modalInstance = $uibModal.open({
                component: 'editSection',
                resolve: {
                    items: function () {
                        return $ctrl.sections;
                    },
                    selected: $ctrl.itemIndex,
                    selectedMaterial: $ctrl.selectedItem
                },
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                $ctrl.readSections($ctrl.selectedItem.id);
            }, function () {
                // Dismiss
            });
        };

        // ContextMenu 
        $ctrl.menuOptions = adminUtility.adminContextMenu($ctrl.editModal, $ctrl.deleteItem);

        // 
        $ctrl.selectItem = function (item) {
            $ctrl.selectedItem = item;
            $ctrl.readSections(item.id);
        }

        $ctrl.getOrder = function (order) {
            if (!order) {
                return '';
            }
            if (order == 999) {
                return 'Last';
            }
            return order;
        }

        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.readItems();
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
    }

})();



