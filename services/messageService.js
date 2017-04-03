(function () {
    'use strict';

    // SERVICE
    app.factory('messageService', Service)
    Service.$inject = ['$http', '$q', 'SweetAlert'];
    function Service($http, $q, SweetAlert) {
        var svc = this;

        // Public Functions 
        svc.service = {
            alertError: alertError,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        // Show Pagination
        function alertError(error) {
            console.log(error);
            swal({ title: "Error: " + error.statusText, text: error.data.Message, type: "error" });
        }
    }
})();