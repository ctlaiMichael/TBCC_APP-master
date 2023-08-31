/**
 * [barcodeLeftMenuDirective] 雲端發票左側隱藏式選單
 */
define([
    'app'
    , 'modules/service/qrcodePay/qrcodePayServices'
    , 'modules/telegram/qrcodePay/qrcodePayTelegram'
], function (MainApp) {
    MainApp.register.directive('barcodeLeftMenuDirective', function (
        $state, $rootScope, $compile, $log
        , framework, qrcodePayServices, qrCodePayTelegram
    ) {
        var linkFun = function ($scope, iElm, iAttrs, controller) {

            $scope.menu = [
                {
                    url:"backTomainPage",
                    name:"登出"
                },
                {
                    url:"getBarcodeShow",
                    name:"發票載具條碼"
                },
                {
                    url:"bankInfoEdit",
                    name:"設定領獎帳號"
                },
                {
                    url:"changeVerEdit",
                    name:"變更手機條碼驗證碼"
                },
                {
                    url:"backToTWPay",
                    name:"合庫E Pay"
                },
                {
                    url:"backTomBank",
                    name:"行動網銀"
                }
            ]

            $scope.clickGO = function (goTarget) {
                if (goTarget == 'backToTWPay') {
                    $scope.clickMenuList(false);
                    qrcodePayServices.closeActivity();
                } else if (goTarget == 'backTomainPage') {
                    $scope.clickMenuList(false);
                    qrcodePayServices.logout();
                    return;
                } else if (goTarget == 'backTomBank') {
                    $scope.clickMenuList(false);
                    if(localStorage.getItem("mBank")!='1'){
                        framework.mainPage();
						plugin.main.mobliebank(function () { }, function () { });
					}
                    return;
                } else if (goTarget == 'getBarcodeShow') {
                    $scope.clickMenuList(false);
                    $state.go("getBarcodeShow", {});
                    return;
                } else {
                    qrcodePayServices.getLoginInfo(function (res) {
                        var form = {
                            txnType: 'T'
                        };
                        form.custId = res.custId;
                        qrCodePayTelegram.send('qrcodePay/fq000101', form, function (res, resultHeader) {
                            if (res) {
                                if (typeof res.mobileBarcode == "undefined" || res.mobileBarcode == "") {
                                    framework.alert("無發票載具條碼資訊\n請先查詢或註冊您的發票載具條碼", function () {
                                        $scope.clickMenuList(false);
                                        $state.go("getBarcodeTerm", {});
                                        return;
                                    });
                                } else {
                                    $scope.clickMenuList(false);
                                    var form = {};
                                    form.cardNo = res.mobileBarcode;
                                    $state.go(goTarget, {result: form},{location: 'replace'});
                                }
                            } else {
                                framework.alert(resultHeader.respCodeMsg, function () {
                                    $scope.clickMenuList(false);
                                    qrcodePayServices.closeActivity();
                                });
                            }
                        }, null, false);
                    });
                }
            }


            $scope.clickMenuList = function (show) {
                $scope.onBarcodeLeftMenu = show;
            }


        };
        return {
            restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
            replace: false,
            templateUrl: 'modules/directive/barcodeLeftMenu/barcodeLeftMenu.html',
            link: linkFun
        };
    });
    //=====[securityTypeSelectorDirective END]=====//

});