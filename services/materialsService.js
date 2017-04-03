(function () {
    'use strict';

    // SERVICE
    app.factory('materialsService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var groupController = 'materialgroup'
        var categoryController = 'materialcategory'
        var controller = 'material'

        // Public Functions 
        svc.service = {
            readMaterialType: readMaterialType,

            groupCreate: groupCreate,
            groupRead: groupRead,
            groupUpdate: groupUpdate,
            groupDelete: groupDel,

            categoryCreate: categoryCreate,
            categoryRead: categoryRead,
            categoryUpdate: categoryUpdate,
            categoryDelete: categoryDel,

            create: create,
            read: read,
            update: update,
            delete: del,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        // Material Types
        function readMaterialType() {
            return $http.get('/api/material-type', {});
        }

        // Group Material
        function groupCreate(data) {
            return $http.post("/api/" + groupController + "", data);
        }

        function groupRead() {
            return $http.get("/api/" + groupController + "", {});
        }

        function groupUpdate(data) {
            return $http.put("/api/" + groupController + "", data);
        }

        function groupDel(id) {
            return $http.delete("/api/" + groupController + "/" + id);
        }


        // Category Material
        function categoryCreate(data) {
            return $http.post("/api/" + categoryController + "", data);
        }

        function categoryRead(groupId) {
            return $http.get("/api/" + categoryController + "?$filter=MaterialGroupId eq " + groupId, {});
        }

        function categoryUpdate(data) {
            return $http.put("/api/" + categoryController + "", data);
        }

        function categoryDel(id) {
            return $http.delete("/api/" + categoryController + "/" + id);
        }


        // Material
        function create(data) {
            return $http.post("/api/" + controller + "", data);
        }

        function read(categoryId) {
            return $http.get("/api/" + controller + "?$filter=MaterialCategoryId eq " + categoryId, {});
        }

        function update(data) {
            return $http.put("/api/" + controller + "", data);
        }

        function del(id) {
            return $http.delete("/api/" + controller + "/" + id);
        }

    }
})();