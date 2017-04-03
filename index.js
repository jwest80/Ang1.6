var app = angular.module('app',
    ['ngComponentRouter', 'ui.bootstrap', 'oitozero.ngSweetAlert', 'smart-table', 'ui.bootstrap.contextMenu',
        'angularFileUpload', 'angular-growl', 'ngStorage'])

app.run(['$rootScope', '$templateCache', function ($rootScope, $templateCache) {
    $rootScope.$on('$viewContentLoaded', function () {
        $templateCache.removeAll();
    });
}]);
 
var __version_number = 1.0; // cacheBustSuffix = Date.now('U'); // 'U' -> linux/unix epoch date int

app.config(['growlProvider', '$uibTooltipProvider', '$httpProvider', function (growlProvider, $uibTooltipProvider, $httpProvider) {

    growlProvider.onlyUniqueMessages(false);
    growlProvider.globalReversedOrder(true);
    growlProvider.globalTimeToLive({ success: 10000, error: 10000, warning: 10000, info: 10000 });
    growlProvider.globalDisableCountDown(false);
    growlProvider.globalPosition('bottom-right');  // top/bottom - left/right/center

    $uibTooltipProvider.options({
        placement: 'top',
        trigger: 'mouseenter'
    });
}]);

app.value('$routerRootComponent', 'app')

app.component('app', {
    template:'<ng-outlet></ng-outlet>',
    $routeConfig: [
        { path: '/', name: 'Home', component: 'requestList', useAsDefault: true },
        { path: '/request', name: 'RequestAdd', component: 'request' },
        { path: '/request:id', name: 'RequestEdit', component: 'request' },
        { path: '/list', name: 'RequestList', component: 'requestList' },
        { path: '/preview:id', name: 'PreviewFull', component: 'previewFull' },
        { path: '/print:id', name: 'Print', component: 'print' },

        // Admin
        { path: '/admin/consultant', name: 'Consultant', component: 'consultant' },
        { path: '/admin/custom-client-request', name: 'CustomClientRequest', component: 'clientRequest' },
        { path: '/admin/distribution-method', name: 'DistributionMethod', component: 'distributionMethod' },
        { path: '/admin/materials', name: 'Materials', component: 'materials' },
        { path: '/admin/presentation-section', name: 'PresentationSection', component: 'presentationSection' },
        { path: '/admin/presenter', name: 'Presenter', component: 'presenter' },
        { path: '/admin/primary-materials', name: 'PrimaryMaterials', component: 'primaryMaterials' },
        { path: '/admin/prospect', name: 'Prospect', component: 'prospect' },
        { path: '/admin/recipient', name: 'Recipient', component: 'recipient' },
        { path: '/admin/sales-owner', name: 'SalesOwner', component: 'salesOwner' },
        { path: '/admin/time-of-day', name: 'TimeOfDay', component: 'timeOfDay' },

        // Help
        { path: '/help', name: 'Help', component: 'help' },

        // Proof of Concept - Testing Routes Below
        { path: '/poc/server-grid', name: 'ServerGrid', component: 'serverGrid' },
    ]
});