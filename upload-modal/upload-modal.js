// Edit Prospect Modal:

(function () {
    'use strict';

    app.component('uploadModal', {
        templateUrl: '/content/js/app/upload-modal/upload-modal.html',
        controller: uploadModalController,
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&',
        },
    });

    uploadModalController.$inject = ['FileUploader', 'growl'];
    function uploadModalController(FileUploader, growl) {
        var $ctrl = this;

        $ctrl.errors = [];
        $ctrl.isUploading = false;

        $ctrl.uploader = new FileUploader({
            url: '/api/prospect/upload',
            queueLimit: 1
        });

        $ctrl.save = function () {
            $ctrl.close({ $value: $ctrl.working });
        };


        $ctrl.cancel = function () {
            $ctrl.dismiss({ $value: 'close' });
        };


        $ctrl.growlSuccess = function (fileitem) {
            var size = ((fileitem.file.size / 1024)|0).toString() + ' KB'
            var msg = '<b>' + fileitem.file.name + '</b> has been processed. - ' + size;
            growl.success(msg, { title: 'Import Complete' });
        }
        $ctrl.growlFailure = function (fileitem) {
            var size = ((fileitem.file.size / 1024) | 0).toString() + ' KB'
            var msg = '<b>' + fileitem.file.name + '</b> could not be processed. - ' + size;
            growl.error(msg, { title: 'Import Failed' });
        }

        // CALLBACKS

        $ctrl.uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        $ctrl.uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
            $ctrl.isErrors = false;
        };
        $ctrl.uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        $ctrl.uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
            $ctrl.isUploading = true;
        };
        $ctrl.uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        $ctrl.uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
            $ctrl.isUploading = false;
        };
        $ctrl.uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            $ctrl.isErrors = false;
            $ctrl.growlSuccess(fileItem);
        };
        $ctrl.uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
            var error = response.applicationErrors[0].errorMessage;
            $ctrl.isErrors = true;
            $ctrl.errors.push(error);
            fileItem.errorMessage = error;
            $ctrl.growlFailure(fileItem);
        };
        $ctrl.uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        $ctrl.uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        $ctrl.uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        console.info('uploader', $ctrl.uploader);



        ////////////////

        $ctrl.$onInit = function () {
            $ctrl.items = $ctrl.resolve.items;
            $ctrl.selected = $ctrl.resolve.selected;
        };
        $ctrl.$onChanges = function (changesObj) { };
        $ctrl.$onDestroy = function () { };
        $ctrl.$onClosing = function () { };
    }

})();

