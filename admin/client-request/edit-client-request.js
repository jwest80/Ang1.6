// Edit Client Request  Modal:

(function () {
    'use strict';

    app.component('editCustomClientRequest', {
        templateUrl: '/content/js/app/admin/client-request/edit-client-request.html',
        controller: editCustomClientRequestController,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    editCustomClientRequestController.$inject = ['customClientRequestService', 'adminUtility','requestService'];
    function editCustomClientRequestController(customClientRequestService, adminUtility, requestService) {
        var $ctrl = this;

        // ----- Typeahead -----
        $ctrl.readAccounts = function (val) {
            return requestService.readAccounts(val);
        }
        $ctrl.accountSelected = function () {
            var item = $ctrl.items.find(function (x) {
                return (x.accountId == $ctrl.accountSearch.id);
            });
            if (item) {
                $ctrl.working = item;
            } else {
                $ctrl.working.name = $ctrl.accountSearch.intechAccountNumber + '/' + $ctrl.accountSearch.janusAccountNumber + ' - ' + $ctrl.accountSearch.name;
                $ctrl.working.accountId = $ctrl.accountSearch.id;
            }
        }

        $ctrl.save = function () {
            adminUtility.validateForm($ctrl.addEditForm);
            if ($ctrl.working.id) {
                customClientRequestService.update($ctrl.working).then(function (response) {   // Update 
                    $ctrl.close({ $value: $ctrl.working });
                }, processErrors)
            } else {
                customClientRequestService.create($ctrl.working).then(function (response) {   // Create 
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
        $ctrl.$onDestroy = function () {  };
        $ctrl.$onClosing = function () {  };
    }

})();

