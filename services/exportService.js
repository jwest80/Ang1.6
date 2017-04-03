(function () {
    'use strict';

    // SERVICE
    app.factory('exportService', Service)
    Service.$inject = ['$http'];
    function Service($http) {
        var svc = this;

        var controller = 'export'

        // Public Functions 
        svc.service = {
            csv: csv,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////
        function download(filename, text) {

            if (navigator.msSaveBlob) { // IE 10+ 
                navigator.msSaveBlob(new Blob([text], { type: 'text/csv;charset=utf-8;' }), filename);
            } else {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            }


        }

        // Create Presenters
        function csv(data) {
            return $http.post("/api/" + controller + "", data)
                .then(function (response) {
                    download('export.csv', response.data);
                }
            );
        }

    }
})();