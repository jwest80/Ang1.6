// Delivery Information Component:
// Dependency:


(function () {
    'use strict';

    app.component('deliveryInformation', {
        templateUrl: '/content/js/app/delivery-information/delivery-information-form.html',
        controller: deliveryInformationController,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    deliveryInformationController.$inject = ['recipientService', 'distributionMethodService', 'messageService', 'timeOfDayService'];
    function deliveryInformationController(recipientService, distributionMethodService, messageService, timeOfDayService) {
        var $ctrl = this;

        $ctrl.validate = function () {
            $ctrl.deliveryInfoForm.$setSubmitted();
            return $ctrl.deliveryInfoForm.$valid;
        }

        $ctrl.ok = function () {
            if ($ctrl.isNew) {
                $ctrl.items.push($ctrl.working);
            }
            $ctrl.close({ $value: $ctrl.items });
        };

        $ctrl.close = function () {
            $ctrl.selected.value = -1; // Remove Grid Highlight
            $ctrl.dismiss({ $value: 'close' });
        };

        $ctrl.back = function () {
            if ($ctrl.selected.value === 0) {
                $ctrl.selected.value = $ctrl.items.length - 1;
            } else { $ctrl.selected.value--; }
            $ctrl.bindActiveItem();
        };

        $ctrl.forward = function () {
            if ($ctrl.selected.value === $ctrl.items.length - 1) {
                $ctrl.selected.value = 0;
            } else { $ctrl.selected.value++; }
            $ctrl.bindActiveItem();
        };

        $ctrl.bindActiveItem = function () {
            $ctrl.working = $ctrl.items[$ctrl.selected.value];
        }

        $ctrl.pageMessage = function () {
            var page = $ctrl.selected.value + 1;
            return "Showing: " + page + ' of ' + $ctrl.items.length;
        };

        // Read Distribution Methods
        distributionMethodService.read().then(function (response) {
            $ctrl.distributionMethods = response.data;
        }, function (error) { messageService.alertError(error); });

        // Read Times of Day
        timeOfDayService.read().then(function (response) {
            $ctrl.timesOfDay = response.data;
        }, function (error) { messageService.alertError(error); });

        // Read Recipients
        recipientService.read().then(function (response) {
            $ctrl.recipientList = response.data;
        }, function (error) { messageService.alertError(error); });

        // Read Recipients (Typeahead)
        $ctrl.readRecipients = function (val) {
            return recipientService.read(val).then(function (response) {
                return response.data;
            }, function () { })
        }

        // Item selected from Existing list
        $ctrl.recipientChange = function (item) {
            $ctrl.working.recipient = $ctrl.recipientTemp;
        }
        // Non-existing recipient 
        $ctrl.recipientChange2 = function () {
            if ($ctrl.recipientTemp) {
                if (!$ctrl.recipientTemp.name) {
                    $ctrl.working.recipient = { 'name': $ctrl.recipientTemp };
                }
            }
        }

        // Update Events (Child input controls)
        $ctrl.updateDate = function (event) {
            $ctrl.working.deliveryDate = event.item;
        };
        $ctrl.updateTimeOfDay = function (event) {
            $ctrl.working.timeOfDay = event.item;
        };
        $ctrl.updateDistributionMethod = function (event) {
            $ctrl.working.distributionMethod = event.item;
        };
        $ctrl.updateRecipient = function (event) {
            $ctrl.working.recipient = event.item;
        };


        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.items = $ctrl.resolve.items;
            $ctrl.selected = $ctrl.resolve.selected;

            if ($ctrl.selected.value >= 0) {
                $ctrl.bindActiveItem();
            } else {
                $ctrl.working = { deliveryDate: '' };
                $ctrl.isNew = true;
            }

        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$onClosing = function () { };
    }

})();

