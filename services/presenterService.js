﻿(function () {
    'use strict';

    // SERVICE
    app.factory('presenterService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var controller = 'presenter'

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