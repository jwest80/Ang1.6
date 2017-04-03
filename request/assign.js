// Edit Presenter Modal:

(function () {
    'use strict';

    app.component('assign', {
        templateUrl: '/content/js/app/request/assign.html',
        controller: assign,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    assign.$inject = ['requestService', 'salesOwnerService', 'messageService', 'adminUtility', 'emailService'];
    function assign(requestService, salesOwnerService, messageService, adminUtility, emailService) {
        var $ctrl = this;

        $ctrl.readRequest = function (id) {
            requestService.readRequest(id).then(function (response) {
                $ctrl.request = response.data;
            }, function (httpError) {
                messageService.alertError(error);
            })
        }

        salesOwnerService.read().then(function (response) {
            $ctrl.salesOwners = response.data;
        }, function (httpError) {
            messageService.alertError(error);
        })

        $ctrl.save = function () {
            requestService.updateRequest($ctrl.request).then(function (response) {
                $ctrl.sendEmail('Assigned');
                $ctrl.close({ });
            }, processErrors)
        };

        $ctrl.sendEmail = function (pre) {
            console.log('Sending Email: Request Id - ' + $ctrl.request.id);
            emailService.sendRequest($ctrl.request.id, pre);
        };

        function processErrors(error) {
            adminUtility.processErrors(error, $ctrl.form);
        }

        $ctrl.cancel = function () {
            $ctrl.dismiss({ $value: 'close' });
        };


        $ctrl.updateAssignment = function (event) {
            $ctrl.request.document.status = {id: 2, name: 'Assigned'};
            $ctrl.request.document.assigned = event.item;
        };


        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.requestId = $ctrl.resolve.requestId;
            $ctrl.readRequest($ctrl.requestId);
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$onClosing = function () { };
    }

})();