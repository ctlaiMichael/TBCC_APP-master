define(['app'], function (app) {

    app.controller('TestCtrl', function ($scope, $window, $log, $http, $rootScope, i18n, sysCtrl, framework, view) {
        //navigator.app.clearCache();

        $scope.openCamera = function () {

           var fSuccess =  function cameraSuccess(imageUri) {

                displayImage(imageUri);

               alert("imageUri:" + imageUri);
                // You may choose to copy the picture, save it somewhere, or upload.
                //func(imageUri);
               window.resolveLocalFileSystemURL(imageUri, onResolveSuccess, fail);

               function onResolveSuccess(fileEntry) {
                   function success(file) {
                       alert("File size: " + file.size + "\n" );
                   }
                   fileEntry.file(success, fail);
                   alert("onResolveSuccess:"+fileEntry.name);
               }

               function fail(evt) {
                   alert(evt.target.error.code);
               }



                console.debug("openCamera: " + imageUri + "xxxx ", "app");

            };

            var fError = function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");

            };
            var slefOPtion = {
                //targetWidth:100,
               //targetHeight:100,
                saveToPhotoAlbum:true
            };
            framework.htCamera.openCamera(fSuccess,fError,slefOPtion);
        }

        $scope.selectPicFile = function () {

            var fSuccess =  function cameraSuccess(imageUri) {

                alert("imageUri:" + imageUri);
                // You may choose to copy the picture, save it somewhere, or upload.
                //func(imageUri);
                window.resolveLocalFileSystemURL(imageUri, onResolveSuccess, fail);

                function onResolveSuccess(fileEntry) {
                    function success(file) {
                        alert("File size: " + file.size + "\n" );
                    }
                    fileEntry.file(success, fail);
                    alert("onResolveSuccess:"+fileEntry.name);
                }

                function fail(evt) {
                    alert(evt.target.error.code);
                }

                displayImage(imageUri);
                // You may choose to copy the picture, save it somewhere, or upload.
                //func(imageUri);
                console.debug("openCamera: " + imageUri + "xxxx ", "app");

            };

            var fError = function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");

            };

            var slefOPtion = {
                //targetWidth:100,
                //targetHeight:100,
                 saveToPhotoAlbum:true
            };

            framework.htCamera.selectPicFile(fSuccess,fError,slefOPtion);
        }


        function displayImage(imgUri) {

            angular.element("#imgFile")[0].src = imgUri;
        }

        $scope.openQRCode = function() {
            var fSuccess = function (result) {
                alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
            };
            var fError = function (error) {
                alert("Scanning failed: " + error);
            }

            framework.openQRCodeReader(fSuccess,fError);
        }

        $scope.openQRCodeGenerator = function() {
            var qrcode = $scope.qrcode;
            var fSuccess = function (success) {
                alert("encode success: " + success);
            };

            var fError = function (fail) {
                alert("encoding failed: " + fail);
            }

            framework.openQRCodeGenerator("http://www.nytimes.com",fSuccess,fError);

        }

        $scope.openTel = function() {
            var fSuccess = function () {
                alert("success");
            };
            var fError = function (error) {
                alert("openTel failed: " + error);
            }

            framework.htLaunchApp.openTel("0919800746",fSuccess,fError);
        }

        $scope.openSms = function() {
            var fSuccess = function () {
                alert("success");
            };
            var fError = function (error) {
                alert("openSms failed: " + error);
            }

            framework.htLaunchApp.openSms("0919800746?body=Hello! HiTRUST",fSuccess,fError);
        }
        $scope.openRingtone = function() {
            //var fSuccess = function () {
            //    alert("success");
            //};
            //var fError = function (error) {
            //    alert("openSms failed: " + error);
            //}

            cordova.plugins.settings.openSetting("sound", function(){console.log("opened nfc settings")},function(){console.log("failed to open nfc settings")});
        }
        $scope.openMail = function() {

            var fSuccess = function () {
                alert("success");
            };
            var fError = function (error) {
                alert("openTel failed: " + error);
            }

            framework.htLaunchApp.openMail("foo@example.com?cc=bar@example.com&subject=Greetings%20from%20Cupertino!&body=Wish%20you%20were%20here!",fSuccess,fError);

        }

        $scope.callto = function() {
            var onSuccess = function () {
                alert("success");
            };
            var onError = function (error) {
                alert("openTel failed: " + error);
            }
            window.plugins.CallNumber.callNumber(onSuccess, onError, "0919800746", true);

        }

        $scope.exit = function() {
            navigator.app.exitApp();
        }

        $scope.login = function() {
            var onSuccess = function (rtnObj) {
                alert("success;"+rtnObj.login);
            };
            var onError = function (error) {
                alert("openTel failed: " + error.error);
            }
            plugin.tcbb.doLogin(onSuccess,onError);
        }



    });


});