(function () {
    'use strict';

    // SERVICE
    app.factory('recipientService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var controller = 'recipient'

        // Public Functions 
        svc.service = {
            create: create,
            read: read,
            update: update,
            delete: del,
            predicates: predicates
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        // Create Presenters
        function create(data) {
            return $http.post("/api/" + controller + "", data);
        }

        // Read Presenters
        function read(val) {
            //return $http.get("/api/" + controller + "", {});
            if (val) {
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

        function predicates() {
            return [
                { name: 'All', value: '' },
                { name: 'Name', value: 'name' },
                { name: 'Email', value: 'email' },
                { name: 'Firm/Plan/Hotel', value: 'firmPlanHotel'},
                { name: 'Address', value: 'mailingAddress' },
                { name: 'City', value: 'city' },
                { name: 'State', value: 'state' },
                { name: 'Zip', value: 'zipCode' },
                { name: 'Country', value: 'country' },
            ];
        }

    }
})();