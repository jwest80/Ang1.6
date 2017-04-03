(function () {
    'use strict';

    // SERVICE
    app.factory('pcsTypeService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        // Public Functions 
        svc.service = {
            read: read,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        // Read PCSTypes
        function read() {
            return $http.get('/api/pcstype', {});
        }
    }
})();