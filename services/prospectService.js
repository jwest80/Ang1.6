(function () {
    'use strict';

    // SERVICE
    app.factory('prospectService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var controller = 'prospect'

        // Public Functions 
        svc.service = {
            create: create,
            read: read,
            update: update,
            delete: del,
            predicates: predicates,
            upload: upload,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        // Create 
        function create(data) {
            return $http.post("/api/" + controller + "", data);
        }

        // Read 
        function read(filter, val) {
            if (filter) {
                if (!val) { val = ''; }
                return $http.get("/api/" + controller + "?$top=15&$filter=substringof(tolower('" + val + "'),tolower(Name))eq true", {});
            } else {
                return $http.get("/api/" + controller + "", {});
            }
        }

        // Update
        function update(data) {
            return $http.put("/api/" + controller + "", data);
        }

        // Delete
        function del(id) {
            return $http.delete("/api/" + controller + "/" + id);
        }

        function predicates() {
            return [
                { name: 'All', value: '' },
                { name: 'Name', value: 'name' },
                { name: 'Sales Owner', value: 'salesOwner' },
                { name: 'City', value: 'city' },
                { name: 'State', value: 'state' }
            ];
        }

        function upload(file, uploadUrl)
        {
            var fd = new FormData();
            fd.append('file', file);
            
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            
            .success(function () {
                console.log(alert('Success'));
            })
            
            .error(function () {
                console.log(alert('Failed'));
            });
        }
    }
})();