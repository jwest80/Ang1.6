// Preview Component:
// Dependency:


(function () {
    'use strict';

    app.component('print', {
        templateUrl: '/content/js/app/preview/print.html',
        controller: printController,
        bindings: {},
    });

    printController.$inject = ['requestService', '$window'];
    function printController(requestService, $window) {
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
                        requestService.readRequest(id).then(function (response) {
                            $ctrl.request = response.data;
                            $ctrl.request.document.relatedAccounts.map(function (c) { c.selected = true; return c; })
                        })
                    }
                }
            })

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

        $ctrl.$onInit = function () { };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$onClosing = function () { };
    }

})();

