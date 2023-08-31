(function ($, undefined) {
    'use strict';
    var mainClass = function () { }

    // 點擊事件搜集
    mainClass.prototype.celetbrslnsertClickEvent = function (enentName) {
        var targetObj = new Object();
        targetObj.name = enentName;
        targetObj.id = enentName;
        targetObj.alt = enentName;
        targetObj.tagName = 'button';
        // /* // 暫時關閉大數據測試
        if (window.TCBCSAclick) {
            window.TCBCSAclick(targetObj);
        }
        // */
    }

    // 身分證收集
    mainClass.prototype.manualAddTextChange = function (id, name, userId) {
        console.log("manualAddTextChange_start");
        var targetObj = new Object();
        targetObj.name = name;
        targetObj.id = id;
        if (userId !== undefined) {
            targetObj.value = userId;
        }
        targetObj.tagName = 'input';
        targetObj.type = 'text';

        //* // 暫時關閉大數據測試 (明文禁止傳送)
        if (window.TCBCSAtextchange) {
            window.TCBCSAtextchange(targetObj);
            console.log("loginManual");
        }
        console.log("manualAddTextChange_end");
        // */
    }

    // 初始化頁面事件
    mainClass.prototype.reinitialise = function (enentName) {
        // /* // 暫時關閉大數據測試
        console.log("TCBCSAdoReInit_start");
        window.TCBCSAPageID = enentName;
        window.TCBCSAdoReInit();
        console.log("TCBCSAdoReInit_end");
        // */
    }

    mainClass.prototype.initMethod = function () {
        // /* // 暫時關閉大數據測試
        var celebrusJsPath = window.ReadXml.load("config", "CELEBRUS_JS");
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = celebrusJsPath.data;
        document.body.appendChild(js);
        // */
    }

    window.CelebrusInsertTool = new mainClass();
    window.CelebrusInsertTool.initMethod();
})(jQuery, window, document);
