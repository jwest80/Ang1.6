(function () {
    'use strict';

    // SERVICE
    app.factory('emailService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        // Public Functions 
        svc.service = {
            sendRequest: sendRequest,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        // Show Pagination
        function sendRequest(id, pre) {
            if (!pre) pre = "";

            return $http.get("/api/email/" + id + "/send/" + pre);
        }
    }
})();