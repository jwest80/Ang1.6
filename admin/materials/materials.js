// Admin Primary Materials Component:

(function () {
    'use strict';

    app.component('materials', {
        templateUrl: '/content/js/app/admin/materials/materials.html',
        controller: materialsController,
        bindings: {
        },
    });

    materialsController.$inject = ['materialsService', 'pcsTypeService', 'productService', 'settingsService', '$uibModal', 'messageService', 'adminUtility'];
    function materialsController(materialsService, pcsTypeService, productService, settingsService, $uibModal, messageService, adminUtility) {
        var $ctrl = this;
        $ctrl.itemsPerPage = settingsService.itemsPerPage();

        // Group Materials
        // Read Group 
        $ctrl.readGroupItems = function () {
            materialsService.groupRead().then(function (response) {
                $ctrl.groupItems = response.data;
            }, function (error) {
                messageService.alertError(error);
            })
        }
        // Delete Group
        $ctrl.deleteGroupItem = function (id) {
            materialsService.groupDelete(id).then(function (response) {
                $ctrl.readGroupItems();
            }, function (error) {
                messageService.alertError(error);
            })
        }
        // Add Edit Group Modal
        $ctrl.editGroupModal = function (id) {
            var index = $ctrl.groupItems.findIndex(function (x) {
                return x.id == id;
            });
            var selected = {value: index}
            var modalInstance = $uibModal.open({
                component: 'editGroupMaterial',
                resolve: {
                    items: function () {
                        return $ctrl.groupItems;
                    },
                    selected: selected
                },
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                $ctrl.readGroupItems();
            }, function () {
                // Dismiss
            });
        };
        // Select Group
        $ctrl.selectGroup = function (item) {
            $ctrl.selectedGroup = item;
            $ctrl.selectedCategory = null;
            $ctrl.readCategoryItems(item);
        }


        // Category Materials
        // Read Category 
        $ctrl.readCategoryItems = function (group) {
            materialsService.categoryRead(group.id).then(function (response) {
                $ctrl.categoryItems = response.data;
            }, function (error) {
                messageService.alertError(error);
            })
        }
        // Delete Category
        $ctrl.deleteCategoryItem = function (id) {
            materialsService.categoryDelete(id).then(function (response) {
                $ctrl.readCategoryItems($ctrl.selectedGroup);
            }, function (error) {
                messageService.alertError(error);
            })
        }
        // Add Edit Category Modal
        $ctrl.editCategoryModal = function (id) {
            var index = $ctrl.categoryItems.findIndex(function (x) {
                return x.id == id;
            });
            $ctrl.selectedCategory = $ctrl.categoryItems[index];
            var selected = { value: index }
            var modalInstance = $uibModal.open({
                component: 'editCategoryMaterial',
                resolve: {
                    items: function () {
                        return $ctrl.categoryItems;
                    },
                    selected: selected,
                    group: $ctrl.selectedGroup,
                },
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                $ctrl.readCategoryItems($ctrl.selectedGroup);
                $ctrl.selectCategory(response);
            }, function () {
                // Dismiss
            });
        };
        // Select Category
        $ctrl.selectCategory = function (item) {
            $ctrl.selectedCategory = item;

            if (item.showVersions) { $ctrl.readItems(item); }
            if (item.showAdvertised || item.showNonAdvertised) { $ctrl.readProducts(item); }

        }


        // Material  (VERSIONS)
        // Read  
        $ctrl.readItems = function (category) {
            materialsService.read(category.id).then(function (response) {
                $ctrl.items = response.data;
            }, function (error) {
                messageService.alertError(error);
            })
        }
        // Delete 
        $ctrl.deleteItem = function (id) {
            materialsService.delete(id).then(function (response) {
                $ctrl.readItems($ctrl.selectedCategory);
            }, function (error) {
                messageService.alertError(error);
            })
        }
        // Add Edit Material Modal
        $ctrl.editModal = function (id) {
            var index = $ctrl.items.findIndex(function (x) {
                return x.id == id;
            });
            var selected = { value: index }
            var modalInstance = $uibModal.open({
                component: 'editMaterial',
                resolve: {
                    items: function () {
                        return $ctrl.items;
                    },
                    selected: selected,
                    category: $ctrl.selectedCategory
                },
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                $ctrl.readItems($ctrl.selectedCategory);
            }, function () {
                // Dismiss
            });
        };


        // Products
        // Read
        $ctrl.readProducts = function (category) {
            if (category.showAdvertised && category.showNonAdvertised) {
                productService.read().then(function (response) {
                    $ctrl.products = response.data;
                }, function (error) {
                    messageService.alertError(error);
                })
            } else if (category.showAdvertised) {
                productService.readAdvertised().then(function (response) {
                    $ctrl.products = response.data;
                }, function (error) {
                    messageService.alertError(error);
                })
            } else if (category.showNonAdvertised) {
                productService.readNonAdvertised().then(function (response) {
                    $ctrl.products = response.data;
                }, function (error) {
                    messageService.alertError(error);
                })
            }
        }
        // Delete 
        $ctrl.deleteProduct = function (id) {
            productService.delete(id).then(function (response) {
                $ctrl.readProducts($ctrl.selectedCategory);
            }, function (error) {
                messageService.alertError(error);
            })
        }
        // Add Edit Material Modal
        $ctrl.editProductModal = function (id) {
            var index = $ctrl.products.findIndex(function (x) {
                return x.id == id;
            });
            var selected = { value: index }
            var modalInstance = $uibModal.open({
                component: 'editProduct',
                resolve: {
                    items: function () {
                        return $ctrl.products;
                    },
                    selected: selected,
                    category: $ctrl.selectedCategory
                },
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                $ctrl.readProducts($ctrl.selectedCategory);
            }, function () {
                // Dismiss
            });
        };


        // ContextMenu 
        $ctrl.menuOptions1 = adminUtility.adminContextMenu($ctrl.editGroupModal, $ctrl.deleteGroupItem);
        $ctrl.menuOptions2 = adminUtility.adminContextMenu($ctrl.editCategoryModal, $ctrl.deleteCategoryItem);
        $ctrl.menuOptions3 = adminUtility.adminContextMenu($ctrl.editModal, $ctrl.deleteItem);

        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.readGroupItems();
        };
        $ctrl.$onChanges = function (changesObj) {};
        $ctrl.$onDestroy = function () { };
    }

})();


