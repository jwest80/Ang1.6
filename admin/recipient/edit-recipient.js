// Edit Prospect Modal:

(function () {
    'use strict';

    app.component('editRecipient', {
        templateUrl: '/content/js/app/admin/recipient/edit-recipient.html',
        controller: editRecipientController,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    editRecipientController.$inject = ['recipientService', 'adminUtility'];
    function editRecipientController(recipientService, adminUtility) {
        var $ctrl = this;

        $ctrl.save = function () {
            adminUtility.validateForm($ctrl.addEditForm);
            if ($ctrl.working.id) {
                recipientService.update($ctrl.working).then(function (response) {   // Update 
                    $ctrl.close({ $value: $ctrl.working });
                }, processErrors)
            } else {
                recipientService.create($ctrl.working).then(function (response) {   // Create 
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

            if ($ctrl.selected.value >= 0) {
                $ctrl.bindActiveItem();
            } else {
                $ctrl.isNew = true;
                $ctrl.working = {};
            }

        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$onClosing = function () { };
    }

})();

