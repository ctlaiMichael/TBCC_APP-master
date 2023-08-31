//(function(){
//    // channel = require('cordova/channel');
//    // channel.onCordovaReady.subscribe(update);
//    document.addEventListener("deviceready", onlineUpdate, false);
//}());

function onlineUpdate() {

    initResource(function () {
            checkServer("1.0.1", function (arg) {
                if (arg.isNeedToUpdate)
                    updateProcess(arg.url);
                else
                    location = cordova.file.dataDirectory + 'www/index.html';
            });
        },
        function () {
            console.log('inite www resource fail');
        });

}

function checkServer(currentVersion, callBack) {
    if (typeof callBack === 'function') {
        var arg = {
            version: "1.0.2",
            isNeedToUpdate: true,
            url: cordova.platformId === 'android' ? 'http://192.168.100.124:8080/www_a.zip' : 'http://192.168.100.124:8080/www_i.zip'
        }
        callBack(arg);
    }
}

function initResource(successCallBack, failCallback) {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + 'www', function (dirEntry) {
            console.log('dataDirectory www folder is found');

            //ToDo:
            var service = angular.element(document.querySelector('html')).injector().get('serviceStatus');

            //取得loader timestamp
            service.getLoaderTimeStamp(function (loader_timestamp) {
                //取得cordova.file.dataDirectory+'www' 中的 timestamp
                service.getRuntimeTimeStamp(function (runtime_timestamp) {
                    
                    if (parseInt(loader_timestamp) > parseInt(runtime_timestamp)) {
                        //如果loader timestamp比cordova.file.dataDirectory+'www' 中的 timestamp還新的時候
                        //要刪除cordova.file.dataDirectory+'www' 
                        deleteDataWWW(function () {
                            deleteCashZipFile(function () {
                                //然後重新call一次initResource 重新初始化cordova.file.dataDirectory+'www'
                                initResource(successCallBack, failCallback);
                            }, failCallback)
                        }, failCallback);
                    } else {
                        //如果loader timestamp比cordova.file.dataDirectory+'www' 中的 timestamp還舊的時候
                        //則call successCallBack()
                        if (typeof successCallBack === 'function')
                            successCallBack();
                    }
                })
            })

        },
        function (arg) {
            console.log('dataDirectory www folder is not found');
            if (arg.code === 1) {
                window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (dirEntry) {
                        console.log('get cacheDirectory entry');
                        console.log(dirEntry);
                        var theEntry = dirEntry;
                        window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/www.zip', function (dirEntry) {
                                console.log('get applicationDirectory\'s www.zip entry');
                                console.log(dirEntry);
                                dirEntry.copyTo(theEntry, 'www.zip',
                                    function () {
                                        var fileURL = cordova.file.cacheDirectory + 'www.zip';
                                        unZipResource(fileURL,
                                            function () {
                                                if (typeof successCallBack === 'function')
                                                    successCallBack();
                                            }, failCallback);
                                    },
                                    function (err) {
                                        console.log(err);
                                        failCallback();
                                    });
                            },
                            function (arg) {
                                console.log('cannot get applicationDirectory\'s www.zip entry');
                                if (typeof failCallback === 'function')
                                    failCallback(arg);
                            });
                    },
                    function (arg) {
                        console.log('cannot get cacheDirectory entry')
                        if (typeof failCallback === 'function')
                            failCallback(arg);
                    });
            }
        });
}

function initUpdateResource(successCallBack, failCallback) {
    window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (dirEntry) {
            console.log('get cacheDirectory entry');
            var desEntry = dirEntry;
            window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + 'www/www.zip', function (dirEntry) {
                    console.log('get applicationDirectory\'s www.zip entry');
                    var srcEntry = dirEntry;
                    if (cordova.platformId === 'android') {
                        srcEntry.copyTo(desEntry, 'www.zip',
                            function () {
                                var fileURL = cordova.file.cacheDirectory + 'www.zip';
                                verifyZIPfile(fileURL, successCallBack, failCallback);
                            }, failCallback);
                    } else {
                        window.resolveLocalFileSystemURL(cordova.file.cacheDirectory + 'www.zip',
                            function (dirEntry) {
                                dirEntry.remove(
                                    function () {
                                        srcEntry.copyTo(desEntry, 'www.zip',
                                            function () {
                                                var fileURL = cordova.file.cacheDirectory + 'www.zip';
                                                verifyZIPfile(fileURL, successCallBack, failCallback);
                                            }, failCallback);
                                    }, failCallback);
                            }, failCallback);
                    }
                },
                function (arg) {
                    console.log('cannot get applicationDirectory\'s www.zip entry');
                    if (typeof failCallback === 'function')
                        failCallback(arg);
                });
        },
        function (arg) {
            console.log('cannot get cacheDirectory entry')
            if (typeof failCallback === 'function')
                failCallback(arg);
        });
}

function updateProcess(url, data) {

    function failCallBack(arg) {
        console.log('update version fail' + JSON.stringify(arg));
    }

    updateVeresion2(url, failCallBack, data);
}

function verifyZIPfile(fileURL, successCallBack, failCallback) {
    console.log('verifyZIPfile');
    zip.unzip(fileURL, cordova.file.cacheDirectory,
        function (arg) {
            console.log('result' + arg)

            if (arg === 0) {
                if (typeof successCallBack === 'function')
                    successCallBack();
            } else if (arg === -1) {
                if (typeof failCallBack === 'function')
                    failCallBack();
            }
        },
        function (progressEvent) {
            console.log(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        });
}

function unZipResource(fileURL, successCallBack, failCallback) {
    console.log('unZipResource');
    zip.unzip(fileURL, cordova.file.dataDirectory,
        function (arg) {
            console.log('result:' + arg)

            if (arg === 0) {
                if (typeof successCallBack === 'function')
                    successCallBack();
            } else if (arg === -1) {
                if (typeof failCallBack === 'function')
                    failCallBack();
            }
        },
        function (progressEvent) {
            console.log(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        });
}

function switchToRuntimeFolder() {
    console.log('switchToRuntimeFolder');
    window.location = cordova.file.dataDirectory + 'www/index.html';
}



function copyDataWWWtoCache(successCallBack, failCallBack) {
    window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function (dirEntry) {
            console.log('file system open: ' + JSON.stringify(dirEntry));
            var theEntry = dirEntry;
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory + 'www', function (dirEntry) {
                    console.log('file system open: ' + JSON.stringify(dirEntry));
                    dirEntry.copyTo(theEntry, 'www', successCallBack, failCallBack);
                },
                function (arg) {
                    console.log('resolveLocalFileSystemURL fail');
                    if (typeof failCallBack === 'function')
                        failCallBack(arg);
                });
        },
        function (arg) {
            console.log('resolveLocalFileSystemURL fail')
            if (typeof failCallBack === 'function')
                failCallBack(arg);
        });
}

function deleteDataWWW(successCallBack, failCallback) {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory + 'www', function (dirEntry) {
            console.log('file system open: ' + JSON.stringify(dirEntry));
            dirEntry.removeRecursively(successCallBack, failCallback);
        },
        function (arg) {
            console.log('resolveLocalFileSystemURL fail');
            if (typeof failCallBack === 'function')
                failCallBack(arg);
        });
}

function deleteCashZipFile(successCallBack, failCallback) {
    window.resolveLocalFileSystemURL(cordova.file.cacheDirectory + 'www.zip', function (dirEntry) {
            console.log('file system open: ' + JSON.stringify(dirEntry));
            dirEntry.remove(successCallBack, failCallback);
        },
        function (arg) {
            console.log('resolveLocalFileSystemURL fail');
            if (typeof failCallBack === 'function')
                failCallBack(arg);
        });
}

function moveCacheWWWtoData(successCallBack, failCallBack) {
    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dirEntry) {
            console.log('file system open: ' + JSON.stringify(dirEntry));
            var theEntry = dirEntry;
            window.resolveLocalFileSystemURL(cordova.file.cacheDirectory + 'www', function (dirEntry) {
                    console.log('file system open: ' + JSON.stringify(dirEntry));
                    dirEntry.moveTo(theEntry, 'www', successCallBack, failCallBack);
                },
                function (arg) {
                    console.log('resolveLocalFileSystemURL fail');
                    if (typeof failCallBack === 'function')
                        failCallBack(arg);
                });
        },
        function (arg) {
            console.log('resolveLocalFileSystemURL fail')
            if (typeof failCallBack === 'function')
                failCallBack(arg);
        });
}

function updateVeresion(url, failCallBack) {
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);
    var fileURL = cordova.file.dataDirectory + 'www.zip';

    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            console.log("download complete: " + entry.toURL());

            verifyZIPfile(fileURL,
                function () {
                    unZipResource(fileURL,
                        function () {
                            switchToRuntimeFolder();
                        },
                        failCallBack
                    );
                },
                failCallBack
            );
        },
        function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);

            if (typeof failCallBack === 'function')
                failCallBack();
        },
        false, {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
};

function updateVeresion1(url, failCallBack) {
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);
    var fileURL = cordova.file.cacheDirectory + 'www.zip';

    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            console.log("download complete: " + entry.toURL());

            copyDataWWWtoCache(
                function () {
                    verifyZIPfile(fileURL,
                        function () {
                            deleteDataWWW(
                                function () {
                                    moveCacheWWWtoData(
                                        function () {
                                            switchToRuntimeFolder();
                                        },
                                        failCallBack
                                    );
                                },
                                failCallBack
                            );
                        },
                        failCallBack
                    );
                }, failCallBack
            );
        },
        function (error) {
            console.log("download error source " + error.source);
            console.log("download error target " + error.target);
            console.log("download error code" + error.code);

            if (typeof failCallBack === 'function')
                failCallBack();
        },
        false, {
            headers: {
                "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
            }
        }
    );
};

function updateVeresion2(url, failCallBack, data) {
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(url);

    var index = uri.lastIndexOf('/');

    var encrypterfileURL = cordova.file.cacheDirectory + uri.slice(index + 1, uri.length) + '.zip';
    var fileURL = cordova.file.cacheDirectory + 'www.zip';

    initUpdateResource(
        function () {
            fileTransfer.download(
                uri,
                encrypterfileURL,
                function (entry) {
                    console.log("download complete: " + entry.toURL());

                    plugin.crypto.SaveDecryptedFile(uri, encrypterfileURL, fileURL,
                        function () {
                            verifyZIPfile(fileURL,
                                function () {
                                    deleteDataWWW(
                                        function () {
                                            moveCacheWWWtoData(
                                                function () {
                                                    switchToRuntimeFolder();
                                                },
                                                failCallBack
                                            );
                                        },
                                        failCallBack
                                    );
                                },
                                failCallBack
                            );
                        },
                        failCallBack);
                },
                function (error) {
                    console.log("download error source " + error.source);
                    console.log("download error target " + error.target);
                    console.log("download error code" + error.code);

                    if (typeof failCallBack === 'function')
                        failCallBack();
                },
                false, {
                    headers: data.headers
                }
            );
        },
        function (arg) {
            console.log('initUpdateResource fail:' + arg.code);
            if (typeof failCallBack === 'function')
                failCallBack();
        }
    );
};