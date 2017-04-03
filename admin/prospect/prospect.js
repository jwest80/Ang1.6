// Admin prospects Component:

(function () {
    'use strict';

    app.component('prospect', {
        templateUrl: '/content/js/app/admin/prospect/prospect.html',
        controller: prospectsController,
        bindings: {
        },
    });

    prospectsController.$inject = ['prospectService', 'settingsService', '$uibModal','messageService','adminUtility'];
    function prospectsController(prospectService, settingsService, $uibModal, messageService, adminUtility) {
        var $ctrl = this;
        $ctrl.itemsPerPage = settingsService.itemsPerPage();

        // Search
        $ctrl.predicates = prospectService.predicates();
        $ctrl.selectedPredicate = $ctrl.predicates[0];

        // Read 
        $ctrl.readItems = function () {
            prospectService.read().then(function (response) {
                $ctrl.items = response.data;
            }, function (error) {
                messageService.alertError(error);
            })
        }

        // Delete 
        $ctrl.deleteItem = function (id) {
            prospectService.delete(id).then(function (response) {
                $ctrl.readItems();
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
                component: 'editProspect',
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

        $ctrl.openUploadModel = function () {
            var modalInstance = $uibModal.open({
                component: 'uploadModal',
                resolve: {
                    items: function () {
                        return $ctrl.items;
                    },
                    selected: $ctrl.itemIndex
                },
                size: 'md-lg',
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                $ctrl.readItems();
            }, function () {
                // Dismiss
            });
        };

            // ContextMenu 
        $ctrl.menuOptions = adminUtility.adminContextMenu($ctrl.editModal, $ctrl.deleteItem);

            ////////////////

        $ctrl.$onInit = function () {
            $ctrl.readItems();
        };
        $ctrl.$onChanges = function (changesObj) {
        };
        $ctrl.$onDestroy = function () {
        };
    }

})();
