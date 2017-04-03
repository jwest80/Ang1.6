(function () {
    'use strict';

    // SERVICE
    app.factory('consultantService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var controller = 'consultant'

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

        function read(filter, val) {
            if (filter) {
                if (!val) { val = ''; }
                return $http.get("/api/" + controller + "?$top=15&$filter=substringof(tolower('" + val + "'),tolower(Name))eq true", {});
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