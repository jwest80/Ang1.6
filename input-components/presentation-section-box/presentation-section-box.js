// Dependency:

// Usage: 
//      <presentation-section-box></presentation-section-box>


(function () {
    'use strict';

    app.component('presentationSectionBox', {
        templateUrl: '/content/js/app/input-components/presentation-section-box/presentation-section-box.html',
        controller: presentationSectionBoxController,
        bindings: {
            inputName: '@',
            selected: '<',
            options: '@',
        },
    });

    presentationSectionBoxController.$inject = ['presentationSectionService', 'productService'];
    function presentationSectionBoxController(presentationSectionService, productService) {

        var $ctrl = this;

        if (!$ctrl.selected) {
            $ctrl.selected = [];
        }

        // READ
        $ctrl.readSections = function () {
            presentationSectionService.read().then(function (response) {
                $ctrl.sections = response.data;
                removeSelectedSections();
            });
        }
        $ctrl.readDetails = function (sectionId) {
            var catItem = $ctrl.sections.find(function (x) {
                return x.id == sectionId;
            });
            if (catItem.showAdvertised) {
                productService.readAdvertised().then(function (response) {
                    $ctrl.details = response.data;
                    removeSelectedDetails();
                });
            } else if (catItem.showNonAdvertised) {
                productService.readNonAdvertised().then(function (response) {
                    $ctrl.details = response.data;
                    removeSelectedDetails();
                });
            } else {
                $ctrl.details = [];
            }

            //presentationSectionService.readDetail(sectionId).then(function (response) {
            //    $ctrl.details = response.data;
            //    removeSelectedDetails();
            //});
        }

        $ctrl.notSelected = function (items) {
            if (items) {
                for (var i = items.length - 1; i >= 0; i--) {
                    for (var j = 0; j < $ctrl.selected.length; j++) {
                        if (items[i] && (items[i].id === $ctrl.selected[j].id)) {
                            items.splice(i, 1);
                        }
                    }
                }
            }
            return items;
        }

        // Removes Items that have already been selected from the version list.
        function removeSelectedDetails() {
            for (var x = $ctrl.details.length - 1; x >= 0; x--) {
                var id = $ctrl.details[x].id;
                var item = $ctrl.selected.find(function (x) {
                    return x.id == id;
                });
                if (item) {
                    $ctrl.details.splice(x, 1);
                }
            }
        }
        function removeSelectedSections() {

            for (var x = $ctrl.sections.length - 1; x >= 0; x--) {
                var id = $ctrl.sections[x].id;
                var item = $ctrl.selected.find(function (x) {
                    return (x.id == 0 && x.presentationSectionId == id);
                });
                if (item) {
                    $ctrl.sections.splice(x, 1);
                }
            }
            applyAppendixRules();
        }


        // SELECT EVENTS
        $ctrl.sectionSelectedEvent = function () {
            $ctrl.readDetails($ctrl.selectedSectionId);
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

            }
            if ($ctrl.selectedSectionId) {
                $ctrl.readDetails($ctrl.selectedSectionId);
            }
            $ctrl.readSections();
        }
        $ctrl.add = function () {

            var catItem = $ctrl.sections.find(function (x) {
                return x.id == $ctrl.selectedSectionId;
            });

            if ($ctrl.selectedDetail) {
                // Move Detail -> Sequence
                while (0 < $ctrl.selectedDetail.length) {

                    var item = $ctrl.details.find(function (x) {
                        return x.id == $ctrl.selectedDetail[0];
                    });

                    $ctrl.selectedDetail.splice(0, 1);             // Remove from Current

                    item.presentationSectionId = catItem.id;
                    item.materialCategoryName = catItem.name;
                    $ctrl.selected.push(item);                      // Add Right

                    var index = $ctrl.details.indexOf(item);       // Remove Left
                    $ctrl.details.splice(index, 1);
                }
                $ctrl.selectedDetail = null;
            } else if ($ctrl.selectedSectionId && !$ctrl.details.length) {
                // Move Section -> Sequence
                var sectionItem = $ctrl.sections.find(function (x) {
                    return x.id == $ctrl.selectedSectionId;
                });
                var item = {
                    id: 0,
                    presentationSectionId: sectionItem.id,
                    name: sectionItem.name,
                    order: sectionItem.order
                };
                $ctrl.selected.push(item);

                var index = $ctrl.sections.indexOf(sectionItem);
                $ctrl.sections.splice(index, 1);
            }
            applyAppendixRules();
        }
        $ctrl.removeAll = function () {
            while (0 < $ctrl.selected.length) {
                var item = $ctrl.selected[0];
                $ctrl.selected.splice(0, 1);                // Remove from Selected
            }
            if ($ctrl.selectedSectionId) {
                $ctrl.readDetails($ctrl.selectedSectionId);
            }
            $ctrl.readSections();
        }
        $ctrl.addAll = function () {

            var catItem = $ctrl.sections.find(function (x) {
                return x.id == $ctrl.selectedSectionId;
            });

            while (0 < $ctrl.details.length) {
                var item = $ctrl.details[0];
                $ctrl.details.splice(0, 1);                // Remove from items

                item.presentationSectionId = catItem.id;
                item.materialCategoryName = catItem.name;
                $ctrl.selected.push(item);                  // Add to selected
            }
            applyAppendixRules();
        }

        // UPDATE ORDER - SORTING
        $ctrl.up = function () {
            var length = $ctrl.selectedSelected.length;

            var itemId = $ctrl.selectedSelected[0].split('~')[0];
            var itemName = $ctrl.selectedSelected[0].split('~')[1];

            var item = $ctrl.selected.find(function (x) { return x.id == itemId && x.name == itemName; });
            var index = $ctrl.selected.indexOf(item);
            if (index > 0) {
                for (var x = 0; x < length; x++) {
                    var temp = $ctrl.selected[index + x];
                    $ctrl.selected[index + x] = $ctrl.selected[index + x - 1];
                    $ctrl.selected[index + x - 1] = temp;
                }
            }
            updateOrder();

            applyAppendixRules();
        }
        $ctrl.down = function () {

            var length = $ctrl.selectedSelected.length;

            var itemId = $ctrl.selectedSelected[0].split('~')[0];
            var itemName = $ctrl.selectedSelected[0].split('~')[1];

            var item = $ctrl.selected.find(function (x) { return x.id == itemId && x.name == itemName; });
            var index = $ctrl.selected.indexOf(item);
            if (index < $ctrl.selected.length - 1 && index >= 0) {
                for (var x = 0; x < length; x++) {
                    var temp = $ctrl.selected[index - x];
                    $ctrl.selected[index - x] = $ctrl.selected[index - x + 1];
                    $ctrl.selected[index - x + 1] = temp;
                }
            }

            updateOrder();

            applyAppendixRules();
        }
        var updateOrder = function () {
            // Sets the order param to index + 1, should be called every-time selected list changes.
            for (var x = 0; x < $ctrl.selected.length; x++) {
                $ctrl.selected[x].order = x+1; 
            }
        }

        // Display Name - Add Roman Numerals
        $ctrl.romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII',
            'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI',
            'XXVII', 'XXVIII', 'XXIX', 'XXX'];
        $ctrl.displayName = function (item) {
            var prefix = '';
            prefix = $ctrl.romanNumerals[$ctrl.selected.indexOf(item)] + '. '; 
            return prefix + item.name;
        }


        // Force appendix to always be at the bottom.
        var applyAppendixRules = function () {

            // If Appendix is not Last, move it to the end.
            var index = $ctrl.selected.findIndex(function (x) {
                return x.name === 'Appendix';
            });
            if (index >= 0) {
                if (index != $ctrl.selected.length - 1) {
                    var temp = $ctrl.selected[index];
                    $ctrl.selected.splice(index, 1);
                    $ctrl.selected.push(temp);
                }
            }
        }

        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.readSections();
        };
        this.$onChanges = function (changesObj) { $ctrl.readSections(); };
        $ctrl.$onDestroy = function () { $ctrl.removeAll(); };
    }

})();


