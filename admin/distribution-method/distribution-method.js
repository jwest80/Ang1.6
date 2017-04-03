// Admin prospects Component:

(function () {
    'use strict';

    app.component('distributionMethod', {
        templateUrl: '/content/js/app/admin/distribution-method/distribution-method.html',
        controller: distributionMethodController,
        bindings: {
        },
    });

    distributionMethodController.$inject = ['distributionMethodService', 'settingsService', '$uibModal', 'messageService', 'adminUtility'];
    function distributionMethodController(distributionMethodService, settingsService, $uibModal, messageService, adminUtility) {
        var $ctrl = this;
        $ctrl.itemsPerPage = settingsService.itemsPerPage();

        // Read 
        $ctrl.readItems = function () {
            distributionMethodService.read().then(function (response) {
                $ctrl.items = response.data;
            }, function (error) {
                messageService.alertError(error);
            })
        }

        // Delete 
        $ctrl.deleteItem = function (id) {
            distributionMethodService.delete(id).then(function (response) {
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
                component: 'editDistributionMethod',
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

        // ContextMenu 
        $ctrl.menuOptions = function (locked) {
            if (locked) { return []; }
            return adminUtility.adminContextMenu($ctrl.editModal, $ctrl.deleteItem);
        };

        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.readItems();
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
    }

})();

