(function () {
    'use strict';

    // SERVICE
    app.factory('materialDefaultSectionMapService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var controller = 'materialdefaultsectionmap'

        // Public Functions 
        svc.service = {
            create: create,
            read: read,
            update: update,
            delete: del,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        function create(data) {
            return $http.post("/api/" + controller + "", data);
        }

        function read(id) {
            if (id) {
                return $http.get("/api/" + controller + "/" + id + "/by-material", {});
            } else {
                return $http.get("/api/" + controller + "", {});
            }

        }

        function update(data) {
            return $http.put("/api/" + controller + "", data);
        }

        function del(id) {
            return $http.delete("/api/" + controller + "/" + id);
        }

    }
})();