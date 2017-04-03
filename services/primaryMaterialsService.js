(function () {
    'use strict';

    // SERVICE
    app.factory('primaryMaterialsService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var controller = 'primaryMaterial'

        // Public Functions 
        svc.service = {
            create: create,
            read: read,
            update: update,
            delete: del,
            predicates: predicates,
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

        function predicates() {
            return [
                { name: 'All', value: '' },
                { name: 'Name', value: 'name' },
                { name: 'PCS Type', value: 'pcsType' }
            ];
        }
    }
})();