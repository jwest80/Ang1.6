(function () {
    'use strict';


    app.component('requestList', {
        templateUrl: '/content/js/app/request/requestList.html',
        controller: requestListController,
    });

    requestListController.$inject = ['requestService', '$http', '$uibModal', 'settingsService', 'messageService', '$window', 'growl', 'exportService', 'emailService'];
    function requestListController(requestService, $http, $uibModal, settingsService, messageService, $window, growl, exportService, emailService) {
        var $ctrl = this;

        // Settings
        $ctrl.itemsPerPage = settingsService.itemsPerPage();
        $ctrl.showFullPreview = settingsService.showFullPreview();

        // NOTE: If you need to search multiple properties look at example here:  http://plnkr.co/edit/2bohkcq3NdhTCp1ilsit?p=preview
        $ctrl.predicates = [
                { name: 'All', value: '' },
                { name: 'ID', value: 'id' },
                { name: 'Meeting Date', value: 'document.date' },
                { name: 'Delivery Date', value: 'minDeliveryDate' },
                { name: 'Type', value: 'document.pcsType.name'},
                { name: 'Name', value: 'name' },
                { name: 'Presenters', value: 'document.presenters.name' },
                { name: 'Requested By', value: 'requestByDisplayName' },
                { name: 'Assigned To', value: 'assignedTo' },
                { name: 'Status', value: 'requestStatus' },
        ];
        $ctrl.selectedPredicate = $ctrl.predicates[0];

        $ctrl.data = [];    // List of Request

        // Request list
        $ctrl.readRequest = function () {
            if ($ctrl.showCompleted) {
                requestService.readRequest().then(function (response) {
                    $ctrl.data = response.data.value;  // odata add .value
                    angular.forEach($ctrl.data, function (item) { item.minDeliveryDate = $ctrl.firstDeliveryDate(item.document.deliveryInformation); });
                })
            } else {
                requestService.readRequestIncomplete().then(function (response) {
                    $ctrl.data = response.data.value;  // odata add .value
                    angular.forEach($ctrl.data, function (item) { item.minDeliveryDate = $ctrl.firstDeliveryDate(item.document.deliveryInformation); });
                })
            }

        }

        // Preview Modal
        $ctrl.openPreviewModal = function (index) {
            $ctrl.previewIndex = { value: index };
            var modalInstance = $uibModal.open({
                component: 'preview',
                resolve: {
                    items: function () {
                        return $ctrl.data;
                    },
                    selected: $ctrl.previewIndex
                },
                size: 'lg',
                backdrop: 'static',
                keyboard: false
            });
        };

        // Delete Item
        $ctrl.deleteRequest = function (item) {
            requestService.deleteRequest(item.id).then(function (response) {
                $ctrl.readRequest();
            }, function (error) {
                messageService.alertError(error);
            })
        }

        // Update Item
        $ctrl.updateRequest = function (item, msg) {
            requestService.updateRequest(item).then(function (response) {
                $ctrl.readRequest();
                console.log(response);
                $ctrl.sendEmail(response.data.id, "Revised");
                if (msg) {
                    growl.success(msg, { title: 'Request Updated' });
                }
            }, function (httpError) {
                messageService.alertError(error);
            })
        }

        $ctrl.sendEmail = function (id, pre) {
            emailService.sendRequest(id, pre);
        };

        // Show Completed
        $ctrl.markCompletedRequest = function (item) {
            requestService.readRequest(item.id).then(function (response) {
                var updateItem = response.data;
                updateItem.document.status = { "id": 3, "name": "Completed" };
                $ctrl.updateRequest(updateItem, 'Request has been marked Complete.');
            }, function (httpError) {
                messageService.alertError(error);
            })
        }
        $ctrl.toggleCompletedDisplay = function () {
            $ctrl.showCompleted = !($ctrl.showCompleted);
            $ctrl.readRequest();
        }

        // Preview Modal
        $ctrl.openAssignModal = function (index) {
            $ctrl.previewIndex = { value: index };
            var modalInstance = $uibModal.open({
                component: 'assign',
                resolve: {
                    requestId: function () {
                        return $ctrl.data[index].id;
                    },
                },
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                $ctrl.readRequest();
            }, function () {
                // Dismiss
            });
        };

        // Context Menu
        $ctrl.menuOptions = [
            ['Preview', function ($itemScope, $event, modelValue, text, $li) {
                $ctrl.openPreviewModal($itemScope.$index);
            }],
            null, // Dividier
            ['Edit', function ($itemScope, $event, modelValue, text, $li) {
                $window.location.href = '#/request:id?id=' + $itemScope.item.id;
            }],
            null, // Dividier
            ['Mark Completed', function ($itemScope, $event, modelValue, text, $li) {
                $ctrl.markCompletedRequest($itemScope.item);
            }],
            null, // Dividier
            ['Assign', function ($itemScope, $event, modelValue, text, $li) {
                $ctrl.openAssignModal($itemScope.$index);
            }]
        ];

        // Get Ealiest Delivery Date
        $ctrl.firstDeliveryDate = function (deliveries) {
            if (deliveries.length) {
                var dates = deliveries.map(function (a) { return new Date(a.deliveryDate); });
                var minDate = new Date(Math.min.apply(null, dates));
                return minDate;
            }
            return '';
        }

        // Is Prior to Today?
        $ctrl.isPriorToToday = function (date) {
            if (date && date != '') {
                // Create date from input value
                var inputDate = new Date(date);

                // Get today's date
                var todaysDate = new Date();

                // call setHours to take the time out of the comparison
                if (inputDate.setHours(0, 0, 0, 0) < todaysDate.setHours(0, 0, 0, 0)) {
                    return true;
                }
            }
            return false;
        }

        // EXPORT 
        $ctrl.export = function (items) {   //Pass in display collection
            //exportService.csv($ctrl.data);
            exportService.csv(items);
        }
        $ctrl.exportData = function () {
            var data = $ctrl.data.map(function (a) {
                return {
                    'ID': a.id,
                    'Date of Meeting': new Date(a.document.date),
                    'Delivery Date': a.minDeliveryDate,
                    'Type': a.document.pcsType.name,
                    'Name': a.name + $ctrl.createRelatedList(a.document.relatedAccounts),
                    'Products': (a.document.account.productName ? a.document.account.productName : '' ) + $ctrl.createProductList(a.document.relatedAccounts),
                    'Presenters': $ctrl.createPresentersList(a.document.presenters),
                    'Requested By': a.requestByDisplayName,
                    'Assigned To': a.assignedTo,
                    'Status': a.requestStatus
                }
            });
            var opts = [{ sheetid: 'Request Log', header: true }];
            var res = alasql('SELECT INTO XLSX("Log.xlsx",?) FROM ?', [opts, [$ctrl.mapData()]]);
        };

        $ctrl.productList = function (request) {

            var list;

            if (request.document.pcsType.name == 'Client') {
                list = [request.document.account.productName];                      // Account Product
                list = list.concat(request.document.relatedAccounts                 // Related Account Products
                    .map(function (x) { return x.productName }));
            } else {  // Consultant or Prospect
                list = request.document.presentationSections                        // Presentation Section Products
                    .filter(function (x) { return x.productCode; })
                    .map(function (x) { return x.name; });
                list = list.concat(request.document.additionalMaterials             // Additional Materials Products
                    .filter(function (x) { return x.materialType == "Product"; })
                    .map(function (x) { return x.name; })
                );
            }

            // Remove duplicates
            var uniqueArray = list.filter(function (item, pos, self) {
                return self.indexOf(item) == pos;
            })

            return uniqueArray;

        }

        $ctrl.createRelatedList = function (related) {
            var list = '';
            related.forEach(function (item) {
                list += (
                    item.intechAccountNumber + '/'
                    + item.janusAccountNumber + ' - '
                    + item.name + ' - ' + item.productName
                    + String.fromCharCode(10) + String.fromCharCode(13));
            })
            return list;
        }
        $ctrl.createProductList = function (related) {
            var list = '';
            related.forEach(function (item) {
                if (item.productName) {
                    list += (item.productName + String.fromCharCode(10) + String.fromCharCode(13));
                }
            })
            return list;
        }
        $ctrl.createPresentersList = function (presenters) {
            var list = '';
            presenters.forEach(function (item) {
                list += (
                    item.name + String.fromCharCode(10) + String.fromCharCode(13));
            })
            return list;
        }


        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.readRequest();
            $ctrl.showArchived = false;
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$doCheck = function () { };
    }

})();