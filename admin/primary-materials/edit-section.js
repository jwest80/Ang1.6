// Edit Presenter Modal:

(function () {
    'use strict';

    app.component('editSection', {
        templateUrl: '/content/js/app/admin/primary-materials/edit-section.html',
        controller: editSectionController,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    editSectionController.$inject = ['materialDefaultSectionMapService', 'presentationSectionService', 'adminUtility'];
    function editSectionController(materialDefaultSectionMapService, presentationSectionService, adminUtility) {
        var $ctrl = this;

        $ctrl.save = function () {
            adminUtility.validateForm($ctrl.addEditForm);
            if ($ctrl.working.id) {
                materialDefaultSectionMapService.update($ctrl.working).then(function (response) {   // Update 
                    $ctrl.close({ $value: $ctrl.working });
                }, processErrors)
            } else {
                materialDefaultSectionMapService.create($ctrl.working).then(function (response) {   // Create 
                    $ctrl.close({ $value: $ctrl.working });
                }, processErrors)
            }
        };

        function processErrors(error) {
            adminUtility.processErrors(error, $ctrl.addEditForm);
        }

        function readSections() {
            presentationSectionService.read().then(function (response) {
                $ctrl.sections = response.data;
                $ctrl.sections.find(function (x) { return x.name == "Products" }).disabled = true;
                $ctrl.sections.find(function (x) { return x.name == "Products - Non-advertised" }).disabled = true;
            }, function (error) {
                messageService.alertError(error);
            });
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

        $ctrl.updateSection = function (event) {
            $ctrl.working.presentationSection = event.item;
            if ($ctrl.working.presentationSection.name == 'Appendix') {
                $ctrl.working.order = 999;
            }
        };

        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.items = $ctrl.resolve.items;
            $ctrl.selected = $ctrl.resolve.selected;
            $ctrl.primaryMaterial = $ctrl.resolve.selectedMaterial;

            readSections();

            if ($ctrl.selected.value >= 0) {
                $ctrl.bindActiveItem();
            } else {
                $ctrl.isNew = true;
                $ctrl.working = { primaryMaterial: $ctrl.primaryMaterial };
            }

        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () {  };
        $ctrl.$onClosing = function () {  };
    }

})();

