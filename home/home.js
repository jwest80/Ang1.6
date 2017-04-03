(function () {
    'use strict';

    app.component('home', {
        templateUrl: '/content/js/app/home/home.html',
        controller: requestController,
    });

    requestController.$inject = [];
    function requestController(requestService, $http, $uibModal) {
        var $ctrl = this;
 
        ////////////////

        $ctrl.$onInit = function () { };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$doCheck = function () { };
    }

})();