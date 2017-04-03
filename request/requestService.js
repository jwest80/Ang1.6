(function () {
    'use strict';

    // SERVICE
    app.factory('requestService', Service)
    Service.$inject = ['$q','$http','$filter'];
    function Service($q, $http, $filter) {
        var svc = this;

        var stateData = null;
        var reqListSelect = '/odata/requests?$select=id,name,description,assignedTo,requestStatus,active,createdBy,requestByDisplayName,dateCreated,document&$expand=document($select=additionalMaterials,presentationSections,date,account,pcsType,deliveryInformation,relatedAccounts,presenters;$expand=additionalMaterials($select=materialCategoryName,name,materialType),presentationSections,deliveryInformation($select=deliveryDate),account,pcsType,relatedAccounts,presenters($select=name))'
        //var reqListSelect = '/odata/requests?$select=id,name,description,assignedTo,requestStatus,active,createdBy,requestByDisplayName,dateCreated,document&$expand=document($select=date,account,pcsType,deliveryInformation,relatedAccounts,presenters;$expand=deliveryInformation($select=deliveryDate),account,pcsType,relatedAccounts,presenters($select=name))';

        // Public Functions
        svc.service = {
            readPCSTypes: readPCSTypes,
            readAccounts: readAccounts,
            readRelatedAccounts: readRelatedAccounts,
            readPresenters: readPresenters,
            readPrimaryMaterials: readPrimaryMaterials,
            readTrailingPeriods: readTrailingPeriods,
            readMaterialGroups: readMaterialGroups,
            readMaterialCategories: readMaterialCategories,
            readMaterials: readMaterials,
            readEmployee: readEmployee,
            readStatusTypes: readStatusTypes,
            ///
            readRequest: readRequest,
            readRequestIncomplete: readRequestIncomplete,
            createRequest: createRequest,
            updateRequest: updateRequest,
            deleteRequest: deleteRequest,
            ///
            clearState: clearState,
            setState: setState,
            getState: getState
        };

        return svc.service;



        //////////////// FUNCTIONS ////////////////

        // Read PCSTypes
        function readPCSTypes() {
            return $http.get('/api/pcstype', {});
        }

        // Read Accounts
        function readAccounts(val) {
            if (!val) { val = '';}
            var query = "/api/account?$top=15&$filter=substringof('" + val + "',IntechAccountNumber)eq true or substringof('" + val + "',JanusAccountNumber)eq true or substringof(tolower('" + val + "'),tolower(Name))eq true";
            return $http.get(query, {}).then(function (response) {
                return response.data;
            });
        };

        // Read Related Accounts
        function readRelatedAccounts(groupId) {
            var query = '/api/account/' + groupId + '/related-account'
            return $http.get(query, {}).then(function (response) {
                return response.data;
            });
        };

        // Read Presenters
        function readPresenters() {
            return $http.get('/api/presenter', {});
        }

        // Read Primary Materials
        function readPrimaryMaterials(type) {
            return $http.get("/api/primarymaterial?$filter=PCSType eq '" + type.name + "'", {});
        }

        // Read Trailing Periods
        function readTrailingPeriods() {
            return $http.get('/api/TrailingPeriod', {});
        }

        // Read Material Groups
        function readMaterialGroups() {
            return $http.get('/api/MaterialGroup', {});
        }

        // Read Material Categories
        function readMaterialCategories(group) {
            return $http.get('/api/MaterialCategory?$filter=MaterialGroupId eq ' + group.id, {});
        }

        // Read Materials
        function readMaterials(category) {
            return $http.get('/api/Material?$filter=MaterialCategoryId eq ' + category.id, {});
        }

        // Read Employee
        function readEmployee() {
            return $http.get('/api/employee', {});
        }

        // Read Status
        function readStatusTypes() {
            return $http.get('/api/request-status', {});
        }

        // Read Request
        function readRequest(id) {
            if (id > 0) {
                return $http.get('/api/request/' + id, {});
            } else {
                //return $http.get('/api/request', {});
                return $http.get(reqListSelect, {});
            } 
        }

        // Read Request Incomplete
        function readRequestIncomplete() {
            //return $http.get("/api/request?$filter=RequestStatus ne 'Completed'", {})
            return $http.get(reqListSelect + "&$filter=requestStatus ne IS2.PCSMarketing.Model.Enums.RequestStatus'Completed'", {});
        }

        // Create Request
        function createRequest(data) {
            data.requestByDisplayName = GLOBAL.DisplayName;
            return $http.post("/api/request", data);
        }

        // Update Request
        function updateRequest(data) {
            data.requestByDisplayName = GLOBAL.DisplayName;
            return $http.put("/api/request", data);
        }

        // Delete Request
        function deleteRequest(id) {
            return $http.delete("/api/request/" + id);
        }

        function odataMapper(params) {
            var filters = '';
            if (params.search.predicateObject) {
                Object.keys(params.search.predicateObject).forEach(function (key, index) {
                    filters += "$filter=substringof('" + params.search.predicateObject[key] + "','" + key + "')eq true"
                    // key: the name of the object key
                    // index: the ordinal position of the key within the object 
                });
            }
            //"$filter=substringof('" + val + "','" + propert + "')eq true"
            if (filters.length) { filters = '?' + filters; }
            return filters;
        }

        // State
        function clearState() {
            sessionStorage.removeItem("requestData");
            sessionStorage.removeItem("materials");
        }
        function setState(data) {
            //sessionStorage.setItem('materials', JSON.stringify(data.document.materials));
            sessionStorage.setItem('requestData', JSON.stringify(data));
        }
        function getState() {
            var deferred = $q.defer();
            var data = JSON.parse(sessionStorage.getItem('requestData'));
            deferred.resolve(data);
            return deferred.promise;
        }       
    }
})();