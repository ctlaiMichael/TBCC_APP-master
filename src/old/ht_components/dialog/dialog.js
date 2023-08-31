/**
 * Created by kie0723 on 2016/4/13.
 */
angular.module('dialog', [])
    .controller('confirmModalController',function($scope, $uibModalInstance, title, content){
        $scope.title = title;
        $scope.content = content;
        $scope.ok = function () {
            $uibModalInstance.close(true);
        };

        $scope.close = function () {
            $uibModalInstance.close(false);
        };
    })
    .controller('bigconfirmModalController',function($scope, $uibModalInstance, title, content){
        $scope.title = title;
        $scope.content = content;
        $scope.ok = function () {
            $uibModalInstance.close(true);
        };

        $scope.close = function () {
            $uibModalInstance.close(false);
        };
    })
    .controller('warnningModalController',function($scope, $uibModalInstance, title, content){
        $scope.title = title;
        $scope.content = content;
        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.close = function () {
            $uibModalInstance.close();
        };
    })
    .controller('anitivirusRemindModalController',function($scope, $uibModalInstance, title, content){
        $scope.title = title;
        $scope.content = content;
        $scope.ok = function () {
            $scope.localStorage = window.localStorage;
            $scope.localStorage.antivirus = true;
            $uibModalInstance.close();
        };

        $scope.close = function () {
            $uibModalInstance.close();
        };
    })
    .controller('autoLogoutModalController',function($scope, $uibModalInstance, sysCtrl, telegram, dialog, i18n,view){

    	$scope.logout = function () {
            $uibModalInstance.close();
            //sysCtrl.logout();
            view.switch('#/logout');
        };

        $scope.staySigned = function () {
            $uibModalInstance.close();

            //TOKEN REFRESH TELEGRAM
            var success = function(){
                sysCtrl.resetTimer();
            };
            var error = function(){
                //dialog.alert('', i18n.getStringByTag('TOKEN_REFRESH_ERROR'));
                $uibModalInstance.close();
                //sysCtrl.logout();
                view.switch('#/logout');
            };
            var fail = function(){
                //dialog.alert('', i18n.getStringByTag('TOKEN_REFRESH_FAIL'));
                $uibModalInstance.close();
                //sysCtrl.logout();
                view.switch('#/logout');
            };
            telegram.sendJson('common.TokenRefresh',{}, success, error, fail);
            // sysCtrl.resetTimer();
        };

        $scope.ok = function () {
            $uibModalInstance.close();
            //sysCtrl.logout();
            //view.switch('#/logout');
        };

        $scope.close = function () {
            $uibModalInstance.close();
        };
        
    })
    .service('dialog', function($uibModal) {

        this.alertThenAct = function(title, content,cbResult){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ht_components/dialog/modals/warnningModal.html',
                controller: 'warnningModalController',
                backdrop: false,
                windowClass:'backdrop',
                size: null,
                resolve: {
                    title: function () {
                        return title;
                    },
                    content: function () {
                        return content;
                    }
                }
            });

            modalInstance.result.then(function () {
                cbResult();
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        this.alert = function(title, content){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ht_components/dialog/modals/warnningModal.html',
                controller: 'warnningModalController',
                backdrop: false,
                windowClass:'backdrop',
                size: null,
                resolve: {
                    title: function () {
                        return title;
                    },
                    content: function () {
                        return content;
                    }
                }
            });

            modalInstance.result.then(function () {
                //$scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        this.confirm = function(title, content, resultFunc){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ht_components/dialog/modals/confirmModal.html',
                controller: 'confirmModalController',
                backdrop: false,
                windowClass:'backdrop',
                size: null,
                resolve: {
                    title: function () {
                        return title;
                    },
                    content: function () {
                        return content;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                //$scope.selected = selectedItem;
                resultFunc(result);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        this.bigconfirm = function(title, content, resultFunc){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ht_components/dialog/modals/bigconfirmModal.html',
                controller: 'bigconfirmModalController',
                backdrop: false,
                windowClass:'backdrop',
                size: null,
                resolve: {
                    title: function () {
                        return title;
                    },
                    content: function () {
                        return content;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                //$scope.selected = selectedItem;
                resultFunc(result);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        this.showAutoLogout = function(){
        	var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ht_components/dialog/modals/autoLogoutModal.html',
                controller: 'autoLogoutModalController',
                backdrop: false,
                windowClass:'backdrop',
                size: null,
                resolve: {
                }
            });

            modalInstance.result.then(function () {
                //$scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        this.showAntiVirusRemind = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ht_components/dialog/modals/antivirusModal.html',
                controller: 'anitivirusRemindModalController',
                backdrop: false,
                windowClass:'backdrop',
                size: null,
                resolve: {
                    title: function () {
                        return '';
                    },
                    content: function () {
                        return '';
                    }
                }
            });

            modalInstance.result.then(function () {
                //$scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        this.showJBRootRemind = function(){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ht_components/dialog/modals/JBRootRemindModal.html',
                controller: 'anitivirusRemindModalController',
                backdrop: false,
                windowClass:'backdrop',
                size: null,
                resolve: {
                    title: function () {
                        return '';
                    },
                    content: function () {
                        return '';
                    }
                }
            });

            modalInstance.result.then(function () {
                //$scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    });