// Admin prospects Component:

(function () {
    'use strict';

    app.component('presentationSection', {
        templateUrl: '/content/js/app/admin/presentation-section/presentation-section.html',
        controller: presentationSectionController,
        bindings: {
        },
    });

    presentationSectionController.$inject = ['presentationSectionService', 'productService', 'settingsService', '$uibModal', 'messageService', 'adminUtility'];
    function presentationSectionController(presentationSectionService, productService, settingsService, $uibModal, messageService, adminUtility) {
        var $ctrl = this;
        $ctrl.itemsPerPage = settingsService.itemsPerPage();

        // Select Group
        $ctrl.selectSection = function (item) {
            $ctrl.selectedSection = item;
            //$ctrl.readDetails(item);
            $ctrl.readProducts(item);
        }

        // Read //
        // Items
        $ctrl.readItems = function () {
            presentationSectionService.read().then(function (response) {
                $ctrl.items = response.data;
            }, function (error) {
                messageService.alertError(error);
            })
        }
        // Old Unique Details
        $ctrl.readDetails = function (item) {
            presentationSectionService.readDetail(item.id).then(function (response) {
                $ctrl.details = response.data;
            }, function (error) {
                messageService.alertError(error);
            })
        }
        // Products
        $ctrl.readProducts = function (item) {
            console.log(item);
            if (item.showAdvertised && item.showNonAdvertised) {
                productService.read().then(function (response) {
                    $ctrl.details = response.data;
                }, function (error) {
                    messageService.alertError(error);
                })
            } else if (item.showAdvertised) {
                productService.readAdvertised().then(function (response) {
                    $ctrl.details = response.data;
                }, function (error) {
                    messageService.alertError(error);
                })
            } else if (item.showNonAdvertised) {
                productService.readNonAdvertised().then(function (response) {
                    $ctrl.details = response.data;
                }, function (error) {
                    messageService.alertError(error);
                })
            } else {
                $ctrl.details = null;
            }
        }


        // Delete 
        $ctrl.deleteItem = function (id) {
            presentationSectionService.delete(id).then(function (response) {
                $ctrl.readItems();
            }, function (error) {
                messageService.alertError(error);
            })
        }
        $ctrl.deleteDetail = function (id) {
            presentationSectionService.deleteDetail(id).then(function (response) {
                $ctrl.readDetails($ctrl.selectedSection);
            }, function (error) {
                messageService.alertError(error);
            })
        }
        $ctrl.deleteProduct = function (id) {
            productService.delete(id).then(function (response) {
                $ctrl.readProducts($ctrl.selectedSection);
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
                component: 'editPresentationSection',
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
        $ctrl.editDetailModal = function (id) {
            var index = $ctrl.details.findIndex(function (x) {
                return x.id == id;
            });
            $ctrl.selected = { value: index };
            var modalInstance = $uibModal.open({
                component: 'editSectionDetail',
                resolve: {
                    items: function () {
                        return $ctrl.details;
                    },
                    selected: $ctrl.selected,
                    section: $ctrl.selectedSection
                },
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                $ctrl.readDetails($ctrl.selectedSection);
            }, function () {
                // Dismiss
            });
        };
        $ctrl.editProductModal = function (id) {
            var index = $ctrl.details.findIndex(function (x) {
                return x.id == id;
            });
            var selected = { value: index }
            var modalInstance = $uibModal.open({
                component: 'editProduct',
                resolve: {
                    items: function () {
                        return $ctrl.details;
                    },
                    selected: selected,
                    category: $ctrl.selectedSection
                },
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                $ctrl.readProducts($ctrl.selectedSection);
            }, function () {
                // Dismiss
            });
        };

        // ContextMenu 
        $ctrl.menuOptions = function (locked) {
            if (locked) { return []; }
            return adminUtility.adminContextMenu($ctrl.editModal, $ctrl.deleteItem);
        };
        $ctrl.menuOptions2 = adminUtility.adminContextMenu($ctrl.editDetailModal, $ctrl.deleteDetail);

        $ctrl.getOrder = function (order) {
            if (order == 0) {
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
