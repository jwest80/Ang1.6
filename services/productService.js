(function () {
    'use strict';

    // SERVICE
    app.factory('productService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var controller = 'product'

        // Public Functions 
        svc.service = {
            create: create,
            read: read,
            readAdvertised: readAdvertised,
            readNonAdvertised: readNonAdvertised,
            update: update,
            delete: del,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        function create(data) {
            return $http.post("/api/" + controller + "", data);
        }

        function read() {
            return $http.get("/api/" + controller + "", {});
        }
        function readAdvertised() {
            return $http.get("/api/" + controller + "/advertised", {});
        }
        function readNonAdvertised() {
            return $http.get("/api/" + controller + "/non-advertised", {});
        }

        function update(data) {
            return $http.put("/api/" + controller + "", data);
        }

        function del(id) {
            return $http.delete("/api/" + controller + "/" + id);
        }

    }
})();