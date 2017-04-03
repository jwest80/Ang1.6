(function () {
    'use strict';


    app.component('request', {
        templateUrl: '/content/js/app/request/request.html',
        controller: requestController,
    });

    requestController.$inject = ['$q', 'requestService', 'salesOwnerService', 'consultantService', 'prospectService', 'presentationSectionService', 'materialDefaultSectionMapService', '$uibModal', '$window', 'settingsService', '$location', '$anchorScroll', 'emailService', 'messageService', 'adminUtility', 'performanceService', 'customClientRequestService'];
    function requestController($q, requestService, salesOwnerService, consultantService, prospectService, presentationSectionService, materialDefaultSectionMapService, $uibModal, $window, settingsService, $location, $anchorScroll, emailService, messageService, adminUtility, performanceService, customClientRequestService) {
        var $ctrl = this;

        $ctrl.reset = function () {
            $ctrl.request.document = {
                meetingCall: false,
                public: false,
                boardMeeting: false,
                date: '',
                dueDiligence: false,
                account: null,
                relatedAccounts: [],
                consultant: null,
                prospect: null,
                presenters: [],
                primaryMaterials: [],

                performanceDate1: '',
                performanceDate2: '',
                performanceReporting: null,

                clientReview: false,        // Client
                executiveSummary: false,    // Client
                other: false,               // Client
                customAttribution: false,
                commonClientSlide: false,   // Consultant
                genericCover: false,        // Consultant
                presentationSections: [],   // Consultant and Prospect

                clientSpecific: false,
                trailingPeriod1: null,
                asOfDate1: '',
                trailingPeriod2: null,
                asOfDate2: '',

                additionalMaterials: [],
                specialInstructions: '',
                deliveryInformation: [],
                assigned: {},
                status: null,
            }

            $ctrl.relatedAccounts = [];
            $ctrl.primaryMaterials = [];
            $ctrl.materialCategories = [];
            $ctrl.additionalMaterials = [];
            $ctrl.selectedMaterialGroup = null;
            $ctrl.selectedMaterialCategory = null;

            $ctrl.defaultStatus();
            requestService.clearState();

        }

        // Settings
        $ctrl.showFullPreview = settingsService.showFullPreview();

        // On Navigation (Is this existing or new request?)
        this.$routerOnActivate = function (next, previous) {

            var id = next.params.id;

            // Load State -> If not state (Read or New)
            requestService.getState().then(function (response) {
                $ctrl.request = response;
                if (!$ctrl.request) {
                    if (id > 0) {                       // Read
                        $ctrl.readRequest(id);
                    } else {                            // New
                        $ctrl.request = {document: {}};
                        $ctrl.reset();
                        $ctrl.isNewRequest = true;
                        $ctrl.loadDataList();
                    }

                } else {                                // Load State
                    $ctrl.loadedState = true;
                    $ctrl.readRelatedAccounts();
                    $ctrl.requestForm.$setDirty();
                    $ctrl.loadDataList();
                    $ctrl.bindDatesStringToObjects();
                    if (id > 0) {
                    } else { $ctrl.isNewRequest = true; }
                }
            })
            
        }
        this.$routerCanDeactivate = function (next, previous) {
            var safeNavList = ['print:id', 'preview:id'];
            if (safeNavList.indexOf(next.urlPath) > -1) {
                return true;
            }
            requestService.clearState();

            if (!$ctrl.requestForm.$dirty || $ctrl.allowNav || !settingsService.unsavedChangesWarning()) {
                return true;
            }
            var params = previous.urlParams.length ? '?' + previous.urlParams[0] : '';
            $window.location.href = '#/' + previous.urlPath + params;
            $ctrl.openAlertModal(next);
            return false;
        };



        // Data loads (
        $ctrl.loadDataList = function () {
            // PCS Types List
            requestService.readPCSTypes().then(function (response) {
                $ctrl.types = response.data;
                if ($ctrl.request.document.pcsType) {
                    var type = $ctrl.types.find(function (x) {
                        return x.id === $ctrl.request.document.pcsType.id;
                    });
                    $ctrl.PCSTypeChange(type);
                }
            })

            // Presenters
            requestService.readPresenters().then(function (response) {
                $ctrl.presenters = filterByDifference(response.data, $ctrl.request.document.presenters, "id");
            })

            // Presentation Sections
            //presentationSectionService.read().then(function (response) {
            //    $ctrl.presentationSections = filterByDifference(response.data, $ctrl.request.document.presentationSections, "id");
            //})

            // Trailing Periods
            requestService.readTrailingPeriods().then(function (response) {
                $ctrl.trailingPeriods = response.data;
            })

            // Performance Types
            performanceService.read().then(function (response) {
                $ctrl.performanceTypes = response.data;
            })

            // Employee List
            requestService.readEmployee().then(function (response) {
                $ctrl.employees = response.data;
            })

            // Product Management Associates "Sales Owner"
            salesOwnerService.read().then(function (response) {
                $ctrl.salesOwners = response.data;
                $ctrl.isProductManager = $ctrl.checkProductManager(GLOBAL.DisplayName);
            })

            // Status List
            requestService.readStatusTypes().then(function (response) {
                $ctrl.statuses = response.data;
                $ctrl.defaultStatus();
            })
        }
        $ctrl.defaultStatus = function () {
            if (!$ctrl.request.document.status) {
                if ($ctrl.statuses) {
                    $ctrl.request.document.status = $ctrl.statuses[0];
                }
            }
        }

        // ----- Typeahead -----
        // Accounts - (Used by TypeAhead)
        $ctrl.readAccounts = function (val) {
            return requestService.readAccounts(val);
        }
        // Consultants
        $ctrl.readConsultants = function (val) {
            return consultantService.read(true, val).then(function (response) {
                return response.data;
            }, function () { })
        }
        // Prospects
        $ctrl.readProspects = function (val) {
            return prospectService.read(true, val).then(function (response) {
                return response.data;
            }, function () { })
        }

        // Related Accounts
        $ctrl.readRelatedAccounts = function () {
            if ($ctrl.request.document.account) {
                requestService.readRelatedAccounts($ctrl.request.document.account.relatedAccountGroupId).then(function (response) {
                    var selectedList = $ctrl.request.document.relatedAccounts.map(function (c) { if (c.selected == true) return c.id });
                    
                    $ctrl.request.document.relatedAccounts = response;


                    for (var x = 0; x < selectedList.length; x++) {
                        for (var y = 0; y < $ctrl.request.document.relatedAccounts.length; y++) {
                            if ($ctrl.request.document.relatedAccounts[y].id === selectedList[x]) {
                                $ctrl.request.document.relatedAccounts[y].selected = true;
                            }
                        }
                    }

                }, function () {
                    $ctrl.request.document.relatedAccounts = [];
                    $ctrl.request.document.relatedAccounts.push($ctrl.request.document.account);
                })
            }
        }

        // (PCS Type Change Event)
        $ctrl.PCSTypeChange = function (type) {
            if ($ctrl.isNewRequest && !$ctrl.loadedState) {
                $ctrl.reset();
            }

            $ctrl.request.document.pcsType = type;

            // Update Primary Materials
            requestService.readPrimaryMaterials(type).then(function (response) {
                $ctrl.primaryMaterials = filterByDifference(response.data, $ctrl.request.document.primaryMaterials, "id");
            })
        }

        // (Account Selected Event)
        $ctrl.accountSearchChange = function () {
            $ctrl.requestForm.$setDirty();
            $ctrl.request.document.public = ($ctrl.request.document.account.accountType == GLOBAL.PublicAccount ? true : false);
            customClientRequestService.read($ctrl.request.document.account.id).then(function (response) {
                $ctrl.request.document.customClientRequest = response.data[0];
            });
            $ctrl.readRelatedAccounts();
        };

        // (Select Related Event)
        $ctrl.selectPrimary = function (item) {
            $ctrl.requestForm.$setDirty();
            $ctrl.request.document.account = item;
            $ctrl.request.document.public = (item.accountType == GLOBAL.PublicAccount ? true : false);
            customClientRequestService.read(item.id).then(function (response) {
                $ctrl.request.document.customClientRequest = response.data[0];
            });
            
        }
        $ctrl.toggleSelectRelated = function (item) {
            $ctrl.requestForm.$setDirty();
            if (item.selected === null) { item.selected = true; }
            else { item.selected = !item.selected; }
        }
        $ctrl.getSelectColumnText = function (item) {
            var text = "Select";
            if (item.selected == true) { text = "Related"; }
            if ($ctrl.request.document.account) {
                if (item.id == $ctrl.request.document.account.id) { text = "Primary"; }
            }
            return text;
        }


        // Read Request
        $ctrl.readRequest = function (id) {
            requestService.readRequest(id).then(function (response) {
                $ctrl.request = response.data;
                $ctrl.originalAssignee = $ctrl.request.document.assigned.id;  // For checking if Assignee changes
                $ctrl.loadDataList();
                $ctrl.PCSTypeChange($ctrl.request.document.pcsType);
                $ctrl.request.document.accountSearch = $ctrl.request.document.account;

                $ctrl.request.document.relatedAccounts.map(function (c) { c.selected = true; return c; })   // Set Related Accounts (from server) to Selected before reading the rest of the list
                $ctrl.readRelatedAccounts();

                if ($ctrl.request.document.account) {
                    customClientRequestService.read($ctrl.request.document.account.id).then(function (response) {
                        $ctrl.request.document.customClientRequest = response.data[0];
                    });
                }

                $ctrl.bindDatesStringToObjects();
            })
        }

        $ctrl.bindDatesStringToObjects = function () {
            // Date strings to -> Date Objects
            if ($ctrl.request.document.date) {
                $ctrl.request.document.date = new Date($ctrl.request.document.date);
            }
            
            $ctrl.request.document.asOfDate1 = new Date($ctrl.request.document.asOfDate1);
            $ctrl.request.document.asOfDate2 = new Date($ctrl.request.document.asOfDate2);
            $ctrl.request.document.performanceDate1 = new Date($ctrl.request.document.performanceDate1);
            $ctrl.request.document.performanceDate2 = new Date($ctrl.request.document.performanceDate2);
        }

        // Save Request - (Save click)
        $ctrl.saveRequest = function (nextUrl) {
            nextUrl = nextUrl || '#/list';
            adminUtility.validateForm($ctrl.requestForm);

            //$ctrl.request.document.relatedAccounts = $ctrl.request.document.relatedAccounts.filter(c => c.selected === true);
            $ctrl.request.document.relatedAccounts = $ctrl.request.document.relatedAccounts.filter(function (c) {
                return c.selected === true;
            });

            if ($ctrl.isNewRequest) {
                requestService.createRequest($ctrl.request).then(function (response) {
                    $ctrl.request = response.data;
                    $ctrl.allowNav = true;
                    requestService.clearState();
                    $ctrl.sendEmail();
                    if (nextUrl == '#/print:id') nextUrl = nextUrl + '?id=' + $ctrl.request.id;
                    $window.location.href = nextUrl;
                    swal({ html: true, title: 'Request Created', text: 'Your request has been saved.', type: 'success' });
                }, processErrors)
            } else {
                requestService.updateRequest($ctrl.request).then(function (response) {
                    $ctrl.request = response.data;
                    $ctrl.allowNav = true;
                    requestService.clearState();
                    var pre = $ctrl.originalAssignee == $ctrl.request.document.assigned.id ? "Revised" : "Assigned";
                    $ctrl.sendEmail(pre);
                    $window.location.href = nextUrl;
                    swal({ html: true, title: 'Request Updated', text: 'Your request has been saved.', type: 'success' });
                }, processErrors)
            }
        }
        $ctrl.sendEmail = function (pre) {
            if (!pre) pre = '';
            emailService.sendRequest($ctrl.request.id, pre);
            swal({ title: "Success", text: 'Email Sent', type: "success" });
        };

        // Validation Process Form Errors - (Submit Event)
        function processErrors(error) {
            $ctrl.allowNav = false;
            adminUtility.processErrors(error, $ctrl.requestForm);
            $location.hash('scrollToTop');
            $anchorScroll();
        }

        // Delivery Information
        $ctrl.openDeliveryInformationModal = function (index) {
            $ctrl.requestForm.$setDirty();
            $ctrl.deliveryIndex = { value: index };
            var modalInstance = $uibModal.open({
                component: 'deliveryInformation',
                resolve: {
                    items: function () {
                        return $ctrl.request.document.deliveryInformation;
                    },
                    selected: $ctrl.deliveryIndex
                },
                backdrop: 'static',
                keyboard: false
            });
        };
        $ctrl.removeDeliveryItem = function (index) {
            $ctrl.requestForm.$setDirty();
            $ctrl.request.document.deliveryInformation.splice(index, 1);
        };

        // Preview Modal
        $ctrl.openPreviewModal = function () {
            $ctrl.previewIndex = { value: 0 };
            var modalInstance = $uibModal.open({
                component: 'preview',
                resolve: {
                    items: function () {
                        return [$ctrl.request];
                    },
                    selected: $ctrl.previewIndex,
                    isDirty: $ctrl.requestForm.$dirty,
                },
                size: 'lg',
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response) {
                adminUtility.validateForm($ctrl.requestForm);
                if ($ctrl.requestForm.$valid) {
                    $ctrl.saveRequest();
                }
            }, function () {
                // Dismiss
            });
        };

        // Alert "Dirty Form" Modal
        $ctrl.openAlertModal = function (next) {

            var modalInstance = $uibModal.open({
                component: 'alert',
                resolve: {},
                size: 'md',
                backdrop: 'static',
                keyboard: false
            });

            modalInstance.result.then(function (response)
            {
                $ctrl.allowNav = true;
                if (response == 'save') {
                    $ctrl.saveRequest('#/' +next.urlPath);
                } else {
                    $window.location.href = '#/' +next.urlPath;
                }
            }, function () {
                // Dismiss
            });
        };

        // Show Preview
        $ctrl.showPreview = function () {
            requestService.setState($ctrl.request);
            if ($ctrl.showFullPreview) {
                $window.location.href = '#/preview:id?id=' + $ctrl.request.id;
            } else {
                $ctrl.openPreviewModal();
            }
        }



        // ----- Update Events ------
        $ctrl.updateDate = function (event) {
            $ctrl.request.document.date = event.item;
        };
        $ctrl.updatePrimary = function (event) {
            var item = event.item.find(function (x) { return x.showPresentationSections == true });
            if (item) {
                materialDefaultSectionMapService.read(item.id).then(function (response) {
                    if (response.data.length) {
                        $ctrl.request.document.presentationSections =
                            response.data.map(function (x) { return x.presentationSection; });
                    }
                });
            } 
        };
        $ctrl.updateTrailing1 = function (event) {
            $ctrl.request.document.trailingPeriod1 = event.item;
        };
        $ctrl.updateTrailing2 = function (event) {
            $ctrl.request.document.trailingPeriod2 = event.item;
        };
        $ctrl.updateAssignment = function (event) {
            $ctrl.request.document.assigned = event.item;
            $ctrl.request.document.status = $ctrl.statuses.find(function (x) {
                return x.name === "Assigned";
            });
        };
        $ctrl.updateStatus = function (event) {
            $ctrl.request.document.status = event.item;
        };
        $ctrl.updatePerformanceReporting = function (event) {
            $ctrl.request.document.performanceReporting = event.item;
        };

        // ----- Utility -----

        $ctrl.checkProductManager = function (name) {
            if ($ctrl.salesOwners) {
                var result = $ctrl.salesOwners.filter(function (x) { return x.name == name; });
                return result.length;
            }
        }

        $ctrl.disablePerformanceType = function () {
            var match = $ctrl.request.document.primaryMaterials.find(function (x) {
                return x.name === "Due Diligence" || x.name === "Executive Summary" || x.name === "Client Review";
            });
            return (!match);
        }
        $ctrl.disablePresentationSections = function () {
            var match = $ctrl.request.document.primaryMaterials.find(function (x) {
                return x.showPresentationSections === true;
            });
            return (!match);
        }
        $ctrl.isPreviewDisabled = function () {
            if ($ctrl.isNewRequest && !$ctrl.requestForm.$dirty) 
                return true;
            return false;
        }

        // Sort Primary account to top
        $ctrl.isPrimaryAccount = function (id) {
            if ($ctrl.request.document.account && id) {
                if ($ctrl.request.document.account.id == id.value) {
                    return -1;
                }
                return 1;
            }
            return 0;
        }

        $ctrl.isTypeIn = function (listOfTypes) {
            var current = $ctrl.request.document.pcsType ? $ctrl.request.document.pcsType.id : -1;
            if (listOfTypes.indexOf(current) > -1) return true;
            return false;
        }

        // Check if empty
        $ctrl.isEmpty = function (obj) {
            return angular.equals(obj, {});
        }
        // Check differences in array of objects
        function filterByDifference(array1, array2, compareField) {
            if (array1.length && array2.length) {
                return differenceInFirstArray(array1, array2, compareField);
            }
            return array1;
        }
        function differenceInFirstArray(array1, array2, compareField) {
            return array1.filter(function (current) {
                return array2.filter(function (current_b) {
                    return current_b[compareField] === current[compareField];
                }).length == 0;
            });
        }

        $ctrl.$onInit = function () {
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$doCheck = function () { };
    }

})();