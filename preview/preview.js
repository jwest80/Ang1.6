// Preview Component:
// Dependency:


(function () {
    'use strict';

    app.component('preview', {
        templateUrl: '/content/js/app/preview/preview.html',
        controller: previewController,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    previewController.$inject = ['emailService', 'requestService'];
    function previewController(emailService, requestService) {
        var $ctrl = this;

        $ctrl.currentDate = Date;
        $ctrl.currentUser = GLOBAL.DisplayName;

        $ctrl.romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII',
            'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI',
            'XXVII', 'XXVIII', 'XXIX', 'XXX'];

        $ctrl.sendEmail = function () {
            emailService.sendRequest($ctrl.request.id);
            swal({ title: "Success", text: 'Email Sent', type: "success" });
        };

        $ctrl.save = function () {
            $ctrl.close({ $value: $ctrl.request });
        };

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
            $ctrl.readRequest($ctrl.items[$ctrl.selected.value].id);
        }

        // Read Request
        $ctrl.readRequest = function (id) {
            if (id > 0 && !$ctrl.isDirty) {
                requestService.readRequest(id).then(function (response) {
                    $ctrl.request = response.data;
                    $ctrl.request.document.relatedAccounts.map(function (c) { c.selected = true; return c; })
                    $ctrl.id = $ctrl.request.id;
                })
            } else {
                //$ctrl.request = requestService.getState();
                requestService.getState().then(function (response) {
                    $ctrl.request = response;
                })
            }

        }

        $ctrl.isEmpty = function (object) {
            for (var i in object) { return false; }
            return true;
        }

        $ctrl.hidePresentationSections = function () {
            var match = $ctrl.request.document.primaryMaterials.find(function (x) {
                return x.name === "Custom Presentation";
            });
            return (!match);
        }

        ////////////////

        $ctrl.$onInit = function () {
            
            $ctrl.items = $ctrl.resolve.items;
            $ctrl.selected = $ctrl.resolve.selected;
            $ctrl.isDirty = $ctrl.resolve.isDirty;

            $ctrl.bindActiveItem();
            $ctrl.id = $ctrl.items[$ctrl.selected.value].id;
            
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () {  };
        $ctrl.$onClosing = function () {  };
    }

})();

