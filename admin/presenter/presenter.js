// Admin Presenters Component:

(function () {
    'use strict';

    app.component('presenter', {
        templateUrl: '/content/js/app/admin/presenter/presenter.html',
        controller: presenterController,
        bindings: {
        },
    });

    presenterController.$inject = ['presenterService', 'settingsService', '$uibModal','messageService','adminUtility'];
    function presenterController(presenterService, settingsService, $uibModal, messageService, adminUtility) {
        var $ctrl = this;
        $ctrl.itemsPerPage = settingsService.itemsPerPage();

        // Read 
        $ctrl.readItems = function () {
            presenterService.read().then(function (response) {
                $ctrl.items = response.data;
            }, function (error) {
                messageService.alertError(error);
            })
        }

        // Delete 
        $ctrl.deleteItem = function (id) {
            presenterService.delete(id).then(function (response) {
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
                component: 'editPresenter',
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
        $ctrl.menuOptions = adminUtility.adminContextMenu($ctrl.editModal, $ctrl.deleteItem);

        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.readItems();
        };
        $ctrl.$onChanges = function (changesObj) {};
        $ctrl.$onDestroy = function () { };
    }

})();


