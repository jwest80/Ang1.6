(function () {
    'use strict';

    // SERVICE
    app.factory('adminUtility', Service)
    Service.$inject = ['$http', 'messageService'];
    function Service($http, messageService) {
        var svc = this;

        // Public Functions 
        svc.service = {
            validateForm: validateForm,
            processErrors: processErrors,
            resetValidation: resetValidation,
            adminContextMenu: adminContextMenu,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        // Validate Form
        function validateForm(form) {
            form.$setSubmitted();
            return form.$valid;
        }

        // Process Errors on Form
        function processErrors(error, form) {
            if (error.status === 400) {
                resetValidation(form);
                error.data.validationErrors.forEach(function (item) {
                    if (form[item.field]) {
                        form[item.field].$setValidity(item.errorMessage, false);
                    }
                })
            } else {
                messageService.alertError(error);
            }
        }

        // Reset Errors on Form
        function resetValidation(form) {
            var controlNames = Object.keys(form).filter(function (key) {
                return key.indexOf('$') !== 0;
            });
            for (var x = 0; x < controlNames.length; x++) {
                form[controlNames[x]].$setValidity('', true);
            }
        };

        function adminContextMenu(editFunction, deleteFunction) {
            return [
                ['Edit', function ($itemScope, $event, modelValue, text, $li) {
                    editFunction($itemScope.item.id);
                }],
                null, // Dividier
                ['Delete', function ($itemScope, $event, modelValue, text, $li) {
                    deleteFunction($itemScope.item.id);
                }]
            ];
        }

    }
})();