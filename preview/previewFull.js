// Preview Component:
// Dependency:


(function () {
    'use strict';

    app.component('previewFull', {
        templateUrl: '/content/js/app/preview/previewFull.html',
        controller: previewController,
        bindings: { },
    });

    previewController.$inject = ['requestService', '$window', 'emailService'];
    function previewController(requestService, $window, emailService) {
        var $ctrl = this;

        $ctrl.currentDate = Date;
        $ctrl.currentUser = GLOBAL.DisplayName;

        $ctrl.romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII',
            'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI',
            'XXVII', 'XXVIII', 'XXIX', 'XXX'];

        this.$routerOnActivate = function (next, previous) {
            $ctrl.id = next.params.id;
            $ctrl.readRequest($ctrl.id);
        }

        // Read Request
        $ctrl.readRequest = function (id) {
            //$ctrl.request = requestService.getState();
            requestService.getState().then(function (response) {
                $ctrl.request = response;

                if (!$ctrl.request) {
                    if (id > 0) {
                        $ctrl.saved = true;
                        requestService.readRequest(id).then(function (response) {
                            $ctrl.request = response.data;
                            $ctrl.request.document.relatedAccounts.map(function (c) { c.selected = true; return c; })
                        })
                    }
                }
            })

        }

        $ctrl.sendEmail = function () {
            emailService.sendRequest($ctrl.id);
            swal({ title: "Success", text: 'Email Sent', type: "success" });
        };


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

        $ctrl.$onInit = function () {};
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$onClosing = function () { };
    }

})();

