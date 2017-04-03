(function () {
    'use strict';

    // SERVICE
    app.factory('presentationSectionService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var controller = 'presentationsection'
        var detailController = 'presentationsectiondetail'

        // Public Functions 
        svc.service = {
            create: create,
            read: read,
            update: update,
            delete: del,
            createDetail: createDetail,
            readDetail: readDetail,
            updateDetail: updateDetail,
            deleteDetail: delDetail,
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


        // DETAIL
        function createDetail(data) {
            return $http.post("/api/" + detailController + "", data);
        }

        function readDetail(sectionId) {
            return $http.get("/api/" + detailController + "?$filter=PresentationSectionId eq " + sectionId + "", {});
        }

        function updateDetail(data) {
            return $http.put("/api/" + detailController + "", data);
        }

        function delDetail(id) {
            return $http.delete("/api/" + detailController + "/" + id);
        }

    }
})();