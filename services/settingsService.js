(function () {
    'use strict';

    // SERVICE
    app.factory('settingsService', Service)
    Service.$inject = ['$localStorage'];
    function Service($localStorage) {
        var svc = this;

        var defaults = {
            debug: false,
            fullPreview: false,
            itemsPerPage: 15,
            unsavedChangesWarning: true,
        }
        var settings = {};
        loadSettings();

        // Public Functions 
        svc.service = {
            read: read,
            update: update,
            reset: reset,
            unsavedChangesWarning: unsavedChangesWarning,
            showDebug: showDebug,
            itemsPerPage: itemsPerPage,
            showFullPreview: showFullPreview,
        };

        return svc.service;


        //////////////// FUNCTIONS ////////////////

        // Init
        function loadSettings() {
            if ($localStorage.settings) {
                // User Settings
                settings = angular.copy($localStorage.settings);
            } else {
                // Defaults
                settings = angular.copy(defaults);
            }
        }

        // Show Pagination
        function read() { return settings; }
        function update(newSettings) { settings = newSettings; $localStorage.settings = angular.copy(settings); }
        function reset() { $localStorage.settings = null; loadSettings(); }
        function showDebug() { return settings.debug; }
        function showFullPreview() { return settings.fullPreview; }
        function itemsPerPage() { return settings.itemsPerPage; }
        function unsavedChangesWarning() { return settings.unsavedChangesWarning; }


    }
})();