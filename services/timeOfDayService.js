(function () {
    'use strict';

    // SERVICE
    app.factory('timeOfDayService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var controller = 'timeofday'

        // Public Functions 
        svc.service = {
            create: create,
            read: read,
            update: update,
            delete: del,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        // Create Presenters
        function create(data) {
            return $http.post("/api/" + controller + "", data);
        }

        // Read Presenters
        function read() {
            return $http.get("/api/" + controller + "", {});
        }

        function update(data) {
            return $http.put("/api/" + controller + "", data);
        }

        function del(id) {
            return $http.delete("/api/" + controller + "/" + id);
        }

    }
})();