// Type Ahead Component:
// Dependency:

// Usage: 
//      <material-request-box></material-request-box>


(function () {
    'use strict';

    app.component('materialRequestBox', {
        templateUrl: '/content/js/app/input-components/material-request-box/material-request-box.html',
        controller: materialRequestBoxController,
        bindings: {
            selected: '=',
            rightStyle: '@',
        },
    });

    materialRequestBoxController.$inject = ['materialsService', 'productService'];
    function materialRequestBoxController(materialsService, productService) {
        var $ctrl = this;

        if (!$ctrl.selected) {
            $ctrl.selected = [];
        }

        // READ
        $ctrl.readGroups = function() {
            materialsService.groupRead().then(function (response) {
                $ctrl.groups = response.data;
            });
        }
        $ctrl.readCategories = function(groupId) {
            materialsService.categoryRead(groupId).then(function (response) {
                $ctrl.categories = response.data;
                removeSelectedCategories();
            });
        }
        $ctrl.readVersions = function (categoryId) {
            var catItem = $ctrl.categories.find(function (x) {
                return x.id == categoryId;
            });
            if (catItem.showVersions) {
                materialsService.read(categoryId).then(function (response) {
                    $ctrl.versions = response.data;
                    removeSelectedVersions();
                });
            } else if (catItem.showAdvertised) {
                productService.readAdvertised().then(function (response) {
                    $ctrl.versions = response.data;
                    removeSelectedVersions();
                });
            } else if (catItem.showNonAdvertised) {
                productService.readNonAdvertised().then(function (response) {
                    $ctrl.versions = response.data;
                    removeSelectedVersions();
                });
            } else {
                $ctrl.versions = [];
            }

        }

        // Removes Items that have already been selected from the version list.
        function removeSelectedVersions() {
            for (var x = $ctrl.versions.length - 1; x >= 0; x--) {
                var id = $ctrl.versions[x].id;
                var item = $ctrl.selected.find(function (x) {
                    return x.id == id;
                });
                if (item) {
                    $ctrl.versions.splice(x, 1);
                }
            }
        }
        // Removes Items that have already been selected from the Categories list.
        function removeSelectedCategories() {
            for (var x = $ctrl.categories.length - 1; x >= 0; x--) {
                var id = $ctrl.categories[x].id;
                var item = $ctrl.selected.find(function (x) {
                    return (x.id == 0 && x.materialCategoryId == id);
                });
                if (item) {
                    $ctrl.categories.splice(x, 1);
                }
            }
        }

        // SELECT EVENTS
        $ctrl.groupSelectedEvent = function() {
            $ctrl.readCategories($ctrl.selectedGroupId);
            $ctrl.versions = [];
        }
        $ctrl.categorySelectedEvent = function () {
            $ctrl.readVersions($ctrl.selectedCategoryId);
        }

        // MOVE EVENTS
        $ctrl.remove = function () {
            while (0 < $ctrl.selectedSelected.length) {
                var item = {};
                var selectedId = $ctrl.selectedSelected[0].split('~')[0];
                var selectedName = $ctrl.selectedSelected[0].split('~')[1];

                if (selectedId == 0) {
                    item = $ctrl.selected.find(function (x) {
                        return (x.id == 0 && x.name == selectedName);
                    });
                } else {
                    item = $ctrl.selected.find(function (x) {
                        return x.id == selectedId;
                    });
                }

                $ctrl.selectedSelected.splice(0, 1);

                // Remove item
                var index = $ctrl.selected.indexOf(item);
                $ctrl.selected.splice(index, 1);

                if ($ctrl.selectedCategoryId) {
                    $ctrl.readVersions($ctrl.selectedCategoryId);
                }

                if ($ctrl.selectedGroupId) {
                    $ctrl.readCategories($ctrl.selectedGroupId);
                }
                                  
            }
        }
        $ctrl.add = function () {
            var catItem = $ctrl.categories.find(function (x) {
                return x.id == $ctrl.selectedCategoryId;
            });

            if ($ctrl.selectedVersion) {
                // Move Versions ->
                while (0 < $ctrl.selectedVersion.length) {

                    var item = $ctrl.versions.find(function (x) {
                        return x.id == $ctrl.selectedVersion[0];
                    });

                    $ctrl.selectedVersion.splice(0, 1);             // Remove from Current

                    item.presentationSectionId = catItem.id;
                    item.materialCategoryName = catItem.name;
                    item.materialType = item.type ? 'Product' : 'Version';

                    $ctrl.selected.push(item);                      // Add Right

                    var index = $ctrl.versions.indexOf(item);       // Remove Left
                    $ctrl.versions.splice(index, 1);
                }
                $ctrl.selectedVersion = null;
            } else if ($ctrl.selectedCategoryId && !$ctrl.versions.length) {
                // move category ->
                var item = {
                    id: 0,
                    materialGroupId: $ctrl.selectedGroupId,
                    materialCategoryId: catItem.id,
                    materialCategoryName: catItem.name,
                    materialType: 'None',
                    name: catItem.name
                };
                $ctrl.selected.push(item);

                var index = $ctrl.categories.indexOf(catItem);
                $ctrl.categories.splice(index, 1);
            }
        }
        $ctrl.removeAll = function () {
            while (0 < $ctrl.selected.length) {
                var item = $ctrl.selected[0];
                $ctrl.selected.splice(0, 1);                // Remove from Selected
            }
            if ($ctrl.selectedCategoryId) {
                $ctrl.readVersions($ctrl.selectedCategoryId);
            }
            if ($ctrl.selectedGroupId) {
                $ctrl.readCategories($ctrl.selectedGroupId);
            }
        }
        $ctrl.addAll = function () {

            var catItem = $ctrl.categories.find(function (x) {
                return x.id == $ctrl.selectedCategoryId;
            });

            while (0 < $ctrl.versions.length) {
                var item = $ctrl.versions[0];

                item.materialCategoryId = catItem.id;
                item.materialCategoryName = catItem.name;
                item.materialType = item.type ? 'Product' : 'Version';

                $ctrl.versions.splice(0, 1);                // Remove from items
                $ctrl.selected.push(item);                  // Add to selected
            }
        }

        // DISPLAY
        $ctrl.displayName = function (item) {
            return (item.materialCategoryName + ' - ' + item.name);
        }


        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.readGroups();
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { $ctrl.removeAll(); };
    }

})();


