/**
 * Interface for Front-End easy to use mobile methods by cordova plugins
 * @class HtFramework
 * @version 1.0.0
 */
define('x2js', ['components/hitrust/X2JS'], function(x2js) {
    return x2js;
});
define('locale', ['x2js', 'components/hitrust/localization/Locale'], function(x2js, locale) {
    return locale;
});
define('geolocation', ['x2js', 'components/hitrust/Geolocation'], function(x2js, geolocation) {
    return geolocation;
});
define('localTimeZone', ['x2js', 'components/hitrust/LocalTimeZone'], function(x2js, localTimeZone) {
    return localTimeZone;
});
define('parameter', ['x2js', 'components/hitrust/Parameter'], function(x2js, parameter) {
    return parameter;
});
define('htCamera', ['x2js','components/hitrust/HtCamera'], function(x2js, htCamera) {
    return htCamera;
});
define('framework', ['x2js', 'locale', 'geolocation', 'localTimeZone', 'parameter','htCamera'],
    function(x2js, locale, geolocation, localTimeZone, parameter,htCamera) {
        'use strict';
        // Constructor
        function HtFramework(){
            var f = this;

            f.x2js = x2js;
            f.localization = locale;
            f.geolocation = geolocation;
            f.localTimeZone = localTimeZone;
            f.parameter = parameter;
            f.htCamera = htCamera;
        };

        /**
         * <ul>
         *     <li>[home]{@link HTML.home}
         *     <li>[back]{@link HTML.back}
         *     <li>[redirect]{@link HTML.redirect}
         * </ul>
         *
         * @namespace HTML
         * @author JE Wang <jewang@hitrust.com.tw>
         */

        /**
         * Return to home page. ↑{@link HTML}
         * @function home
         * @memberof HTML
         *
         * @example
         * // back to home page
         * framework.home();
         */
        HtFramework.prototype.home = function() {
            window.history.go(-window.history.length+2);
            window.location.replace('#/home');
        };

        /**
         * Return to mainPage. ↑{@link HTML}
         * @function mainPage
         * @memberof HTML
         *
         * @example
         * // back to mainPage
         * framework.mainPage();
         */
        HtFramework.prototype.mainPage = function() {
            // var prefix = location.href;
            // prefix = prefix.substring(0,prefix.indexOf('/www/'))+'/www/';
            // location.href = prefix + 'index_main.html';
            
            // if (device.platform=='Android') {
            //     plugin.bank.close(function(){} ,function(){});// 關閉
            // }else{
            //     plugin.tcbb.returnHome(function(){} ,function(){});
            //     $state.go('mainPageMenu',{});
            // }
            
            plugin.tcbb.returnHome(function(){} ,function(){});
            // plugin.bank.close(function(){} ,function(){});// 關閉
        };

        /**
         * Return to native. ↑{@link HTML}
         * @function backToNative
         * @memberof HTML
         *
         * @example
         * // back to Native
         * framework.backToNative();
         */
        HtFramework.prototype.backToNative = function() {
            // plugin.bank.close(function(){} ,function(){});// 關閉
            plugin.tcbb.returnHome(function(){} ,function(){});
        };

        /**
         * Back pages. ↑{@link HTML}
         * @function back
         * @memberof HTML
         *
         * @param {int} num - back how many pages if Null back one page
         * @example
         * // back 2 pages
         * framework.back(-2);
         */
        HtFramework.prototype.back = function(num) {
            if (num) {
                window.history.go(num);
            } else {
                window.history.back();
            }
        };

        /**
         * Change page. ↑{@link HTML}
         * @function redirect
         * @memberof HTML
         *
         * @param {string} uri - page url
         * @param {boolean} saveToHistory - history or not
         * @example
         * // Change to page2 without saving to history
         * framework.redirect('#/page2', false);
         */
        HtFramework.prototype.redirect = function(uri, saveToHistory) {
            if(saveToHistory) {
                window.location.href = uri;
            } else {
                window.location.replace(uri);
            }
        };

        /**
         * <ul>
         *     <li>[getVersion]{@link X2JS.getVersion}
         *     <li>[setUrl]{@link X2JS.setUrl}
         *     <li>[getUrl]{@link X2JS.getUrl}
         *     <li>[getConfig]{@link X2JS.getConfig}
         *     <li>[getAbout]{@link X2JS.getAbout}
         *     <li>[convertXml2JSon]{@link X2JS.convertXml2JSon}
         *     <li>[convertXmlStr2JSon]{@link X2JS.convertXmlStr2JSon}
         *     <li>[convertJSon2XML]{@link X2JS.convertJSon2XML}
         *     <li>[convertJSon2XMLStr]{@link X2JS.convertJSon2XMLStr}
         *     <li>[convertJSon2String]{@link X2JS.convertJSon2String}
         *     <li>[convertXML2String]{@link X2JS.convertXML2String}
         *     <li>[loadXMLDoc]{@link X2JS.loadXMLDoc}
         *     <li>[loadXMLDocFromFile]{@link X2JS.loadXMLDocFromFile}
         *     <li>[loadFunction]{@link X2JS.loadFunction}
         * </ul>
         *
         * @namespace X2JS
         * @author JE Wang <jewang@hitrust.com.tw>
         * @see
         * [X2JS]{@link https://code.google.com/p/x2js/}
         */

        /**
         * Get app release version from www/modules/common/about.xml. ↑{@link X2JS}
         * @function getVersion
         * @memberof X2JS
         *
         * @returns {string} app version ex:1.01
         * @example
         * // get and alert current version number
         * alert(framework.getVersion());
         */
        HtFramework.prototype.getVersion = function() {
            return this.parameter.getAbout('Release');
        };

        /**
         * Set middle end server url to www/modules/common/config.xml. ↑{@link X2JS}
         * @function setUrl
         * @memberof X2JS
         *
         * @param {string} url - middle end server url
         * @example
         * // set middle end server url
         * framework.setUrl('http://60.248.105.185:8080/HiTRUSTServer2/request/send.do');
         */
        HtFramework.prototype.setUrl = function(url) {
            this.parameter.setParameter('URL', url);
        };

        /**
         * Get middle end server url from www/modules/common/config.xml. ↑{@link X2JS}
         * @function getUrl
         * @memberof X2JS
         *
         * @returns {string} middle end server url
         * @example
         * // get and alert middle end server url from config.xml
         * alert(framework.getUrl());
         */
        HtFramework.prototype.getUrl = function() {
            return this.parameter.getParameter('URL');
        };

        /**
         * Get config information from www/modules/common/config.xml. ↑{@link X2JS}
         * @function getConfig
         * @memberof X2JS
         *
         * @param {string} para - XML tag name
         * @param {string} type(option) - 'B':check exist, 'I':int, Null:string
         * @returns {string} result
         * @example
         * // get and alert offline mode status from config.xml
         * alert(framework.getConfig('OFFLINE'));
         */
        HtFramework.prototype.getConfig = function(para, type) {
            return this.parameter.getParameter(para, type);
        };

        /**
         * Get about information from www/modules/common/about.xml. ↑{@link X2JS}
         * @function getAbout
         * @memberof X2JS
         *
         * @param {string} para - XML tag name
         * @param {string} type(option) - 'B':check exist, 'I':int, Null:string
         * @returns {string} result
         * @example
         * // get and alert app build number from about.xml
         * alert(framework.getAbout('Build'));
         */
        HtFramework.prototype.getAbout = function(para, type) {
            return this.parameter.getAbout(para, type);
        };


        HtFramework.prototype.getXML = function(file,para, type) {
            return this.parameter.getXML(file,para, type);
        };

        /**
         * Convert XML object to JSON object. ↑{@link X2JS}
         * @function convertXml2JSon
         * @memberof X2JS
         *
         * @param {object} xmlObject - XML object
         * @returns {object} JSON Object
         * @example
         * // load XML object
         * var xmlOBJ = framework.loadXMLDocFromFile('message/templates/F0000req.xml');
         * // convert XML object to JSON object and alert the string
         * alert(framework.convertJSon2String(framework.convertXml2JSon(xmlOBJ)));
         */
        HtFramework.prototype.convertXml2JSon = function(xmlObject){
            return this.x2js.convertXml2JSon(xmlObject);
        };

        /**
         * Convert XML string to JSON object. ↑{@link X2JS}
         * @function convertXmlStr2JSon
         * @memberof X2JS
         *
         * @param {string} xmlString - string with XML format
         * @returns {object} JSON Object
         * @example
         * // new XML string
         * var xmlSTR = "<MyOperation><test1>Success</test1><test2><item1>Content</item1></test2></MyOperation>";
         * // convert XML string to JSON object and alert the string
         * alert(framework.convertJSon2String(framework.convertXmlStr2JSon(xmlSTR)));
         */
        HtFramework.prototype.convertXmlStr2JSon = function(xmlString){
            return this.x2js.convertXmlStr2JSon(xmlString);
        };

        /**
         * Convert JSON object to XML object. ↑{@link X2JS}
         * @function convertJSon2XML
         * @memberof X2JS
         *
         * @param {object} jsonObject - JSON object
         * @returns {object} XML Object
         * @example
         * // new JSON object
         * var jsonOBJ =
         * 	    {"MyOperation": {
         * 		    "test1":"Success",
         * 		    "test2": {
         * 		    	"item1":"Content"
         * 	            }
         * 	        }
         * 	    };
         * // convert JSON object to XML object and alert the string
         * alert(framework.convertXML2String(framework.convertJSon2XML(jsonOBJ)));
         */
        HtFramework.prototype.convertJSon2XML = function(jsonObject){
            return this.x2js.convertJSon2XML(jsonObject);
        };

        /**
         * Convert JSON object to XML string. ↑{@link X2JS}
         * @function convertJSon2XMLStr
         * @memberof X2JS
         *
         * @param {object} jsonObject - JSON object
         * @return {string} string with XML format
         * @example
         * // new JSON object
         * var jsonOBJ =
         * 	    {"MyOperation": {
         * 		    "test1":"Success",
         * 		    "test2": {
         * 		    	"item1":"Content"
         * 	            }
         * 	        }
         * 	    };
         * // convert JSON object to XML object and alert the string
         * alert(framework.convertJSon2XMLStr(jsonOBJ));
         */
        HtFramework.prototype.convertJSon2XMLStr = function(jsonObject){
            return this.x2js.convertJSon2XMLStr(jsonObject);
        };

        /**
         * Convert JSON object to string. ↑{@link X2JS}
         * @function convertJSon2String
         * @memberof X2JS
         *
         * @param {object} jsonObject - JSON object
         * @return {string} string with JSON format
         * @example
         * // new JSON object
         * var jsonOBJ =
         * 	    {"MyOperation": {
         * 		    "test1":"Success",
         * 		    "test2": {
         * 		    	"item1":"Content"
         * 	            }
         * 	        }
         * 	    };
         * // convert JSON object to string and alert the string
         * alert(framework.convertJSon2String(jsonOBJ));
         */
        HtFramework.prototype.convertJSon2String=function(jsonObject){
            return this.x2js.convertJSon2String(jsonObject);
        };

        /**
         * Convert XML object to string. ↑{@link X2JS}
         * @function convertXML2String
         * @memberof X2JS
         *
         * @param {object} xmlObject - XML object
         * @return {string} string with XML format
         * @example
         * // load XML object
         * var xmlOBJ = framework.loadXMLDocFromFile('message/templates/F0000req.xml');
         * // convert XML object to string and alert the string
         * alert(framework.convertXML2String(xmlOBJ));
         */
        HtFramework.prototype.convertXML2String=function(xmlObject){
            return this.x2js.convertXML2String(xmlObject) ;
        };

        /**
         * Load XML file to JSON object. ↑{@link X2JS}
         * @function loadXMLDoc
         * @memberof X2JS
         *
         * @param {string} filename - file url ex:'message/templates/F0000req.xml'
         * @return {object} JSON object
         * @example
         * // load XML object and convert to JSON object
         * var jsonOBJ = framework.loadXMLDoc('message/templates/F0000req.xml');
         * // convert JSON object to string and alert the string
         * alert(framework.convertJSon2String(jsonOBJ));
         */
        HtFramework.prototype.loadXMLDoc=function(filename){
            return this.x2js.loadXMLDoc(filename);
        };

        /**
         * Load XML object. ↑{@link X2JS}
         * @function loadXMLDocFromFile
         * @memberof X2JS
         *
         * @param {string} filename - file url ex:'message/templates/F0000req.xml'
         * @return {object} XML object
         * @example
         * // load XML object
         * var xmlOBJ = framework.loadXMLDocFromFile('message/templates/F0000req.xml');
         * // convert XML object to string and alert the string
         * alert(framework.convertXML2String(xmlOBJ));
         */
        HtFramework.prototype.loadXMLDocFromFile=function(filename) {
            return this.x2js.loadXMLDocFromFile(filename);
        };

        /**
         * Load XML object to JSON object and get root collection. ↑{@link X2JS}
         * @function loadFunction
         * @memberof X2JS
         *
         * @param {string} filename - file url ex:'message/templates/F0000req.xml'
         * @returns {JSON.root} JSON object root collection
         * @example
         * // load XML to JSON and get root value
         * var jsonRoot = framework.loadFunction('message/templates/F0000req.xml');
         * // alert the jsonRoot
         * if(jsonRoot) {
         *      alert(jsonRoot);
         * } else { // JSON object without root collection
         *      alert('No Root Collection');
         * }
         */
        HtFramework.prototype.loadFunction=function(filename){
            var json = this.x2js.loadXMLDoc(filename);
            return json.root;
        };

        /**
         * openDB (Framework.openDB(DBName, location, error, success);)
         * @function sqlite Method: 01-openDB
         * @param {String} DBName - DB名稱，如"Hitrust" ,db 名稱不允許為空值!
         * @param {number} location - is used to select the database subdirectory location (iOS only) with the following choices:
         *                         0 (default): Documents - visible to iTunes and backed up by iCloud,
         *                         1: Library - backed up by iCloud, NOT visible to iTunes
         *                         2: Library/LocalDatabase - NOT visible to iTunes and NOT backed up by iCloud
         * @param {Object}error - openDB error message
         * @param {Object}success - 1.success.dbname - 新創的db名稱
         *                          2.success.location - 該db的location
         * @requires sqlitePlugin {https://github.com/litehelpers/Cordova-sqlite-storage}
         */
        HtFramework.prototype.openDB = function(DBName, location, error, success) {


            if(DBName == ""){
                alert("db名稱不允許為空值!");
                return;
            }

            if(isNaN(location) || typeof location == 'NaN'){
                alert("location必須為數字!");
                return;
            }

            if(typeof location == 'number' && (location < 0 || location > 2)){
                alert("請輸入0~2的數字!");
                return;
            }


            var db = window.sqlitePlugin.openDatabase({name: DBName + '.sqlite', location: location}, successcb, errorcb);

            function successcb(res){
                success(JSON.stringify(res.dbname));
            }

            function errorcb(err){
                error(JSON.stringify(err));
            }

            /**
             * createTable (Framework.createTable(tableName, primary_key, mType, mField, error, success);)
             * @function sqlite Method: 02-createTable
             * @param {String}tableName - set table name
             * @param {int} primary_key - 1 為 primary_key,2 則否
             * @param {String} mType - Field[i]的type，提供integer,text,real，放在array裡，指定的field為mField的index而定 [type1,type2,type3]
             * @param {String} mField - Field,放在array裡,指定的Type為mType的index而定 [field1,field2,field3]
             * @param error - transaction error message
             * @param success - 建立完table後的results，有兩個attribute:1.mTableName - 新創的table名稱,
             *                                                      2.mField - 該table的欄位與屬性
             */
            HtFramework.prototype.createTable = function(tableName, primary_key, mType, mField, error, success) {

                var mTypelen = mType.length;
                var mFieldlen = mField.length;

                var field = [];

                if(tableName == ""){
                    alert("table名稱不允許為空值!");
                    return;
                }

                function checkField(){
                    if(mTypelen == mFieldlen && (mTypelen != 0 || mFieldlen != 0)){
                        return true;
                    }else{
                        return false;
                    }
                }

                if(checkField()) {
                    for (var i = 0; i < mTypelen; i++) {
                        field.push(mField[i] + " " + mType[i]);
                    }
                }else{
                    alert("欄位為空或未選擇屬性");
                    return;
                }

                var PK = Number(primary_key);

                //alert("HELLO:" + typeof PK + ":" +  PK);

                switch (PK){
                    case 1:
                        var isPrimaryKey = createTBPK;
                        break;
                    case 2:
                        var isPrimaryKey = createTB;
                        break;
                    default:
                        alert("請輸入1為primary_key，或2則否");
                        break;
                }

                db.transaction(isPrimaryKey, error);

                function createTBPK(tx) {

                    var resTableName;
                    var primarykey = field.shift();

                    if(field.length == 0){
                        alert("primarykey後需設欄位");
                        return;
                    }

                    tx.executeSql("DROP TABLE IF EXISTS '" + tableName + "'");
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(' + primarykey + ' primary key, ' + field + ')',[], isCreate);

                    // demonstrate PRAGMA:
                    db.executeSql("SELECT name FROM sqlite_master WHERE type='table';", [], function (res) {
                        resTableName = res;
                    });
                    db.executeSql("pragma table_info (" + tableName + ");", [], function (resField) {
                        tableFuncINFO(resField, resTableName);
                    });
                }

                function createTB(tx) {
                    var resTableName;

                    tx.executeSql("DROP TABLE IF EXISTS '" + tableName + "'");
                    tx.executeSql("CREATE TABLE IF NOT EXISTS " + tableName + "(" + field + " )", [], isCreate);
                    // demonstrate PRAGMA:

                    db.executeSql("SELECT name FROM sqlite_master WHERE type='table';", [], function (res) {
                        resTableName = res;
                    });
                    db.executeSql("pragma table_info (" + tableName + ");", [], function (resField) {
                        tableFuncINFO(resField, resTableName);
                    });
                }

                function isCreate(){
                    return true;
                }

                function tableFuncINFOBK(resField, resTableName){
                    var Fieldlen = resField.rows.length;

                    for(var i = 0; i < Fieldlen; i++){
                        alert("Fieldlen:" + Fieldlen  + "\n" +
                            "resFieldName:" + JSON.stringify(resField.rows.item(i).name) + "\n" +
                            "resFieldType:" + JSON.stringify(resField.rows.item(i).type));
                    }
                }

                function tableFuncINFO(resField, resTableName){
                    var Tablelen = resTableName.rows.length;
                    var Fieldlen = resField.rows.length;
                    var mField = [];
                    var mTableName = JSON.stringify(resTableName.rows.item(Tablelen - 1).name).match(/[^"]+/g)[0];
                    var mFieldName;
                    var mFieldType;
                    var mRes = {
                        mTableName: mTableName,
                        mField: mField
                    }

                    for(var i = 0; i < Fieldlen; i++){
                        mFieldName = JSON.stringify(resField.rows.item(i).name).match(/[^"]+/g)[0];
                        mFieldType = JSON.stringify(resField.rows.item(i).type).match(/[^"]+/g)[0];

                        mField.push(mFieldName + "_" + mFieldType);
                    }

                    if(isCreate()){
                        success(mRes);
                    }else{
                        alert("Table未建立成功");
                    }
                }
            }

            /**
             * tableINFO (Framework.tableINFO(success);)
             * @function sqlite Method: 02-1 - tableINFO
             * @param {object} success - 回傳一個object，有兩個屬性tablelen和tableName，tablelen為該db的table數量，tableName為所有table名稱
             * @requires sqlitePlugin {https://github.com/litehelpers/Cordova-sqlite-storage}
             */
            HtFramework.prototype.tableNameINFO = function(success) {
                db.executeSql("SELECT name FROM sqlite_master WHERE type='table';", [], selTableName);

                function selTableName(res) {
                    var tablelen = res.rows.length;
                    var tableName = [];
                    var mTableName;

                    var mRes = {
                        tablelen: tablelen,
                        tableName: tableName
                    };

                    for(var i = 0; i <  tablelen; i++){
                        mTableName = JSON.stringify(res.rows.item(i).name).match(/[^"]+/g)[0];
                        tableName.push(mTableName);
                    }
                    success(mRes);
                }
            }

            /**
             * tablePragma (Framework.tablePragma(tableName, error, success);)
             * @function sqlite Method: 02-2 -tablePragma
             * @param {String}tableName - set table name
             * @param {object} error - pragma error
             * @param {object} success - 成功傳回的物件
             */
            HtFramework.prototype.tablePragma = function(tableName, error, success) {

                if(tableName == ""){
                    alert("table名稱不允許為空值!");
                    return;
                }

                db.executeSql("pragma table_info (" + tableName + ");", [], pragmaSuccess, pragmaError);

                function pragmaSuccess(res){
                    success(res);
                }

                function pragmaError(e){
                    error(e.message);
                }

            }
            /**
             * insertData (Framework.insertData(tableName, field, rows, success);)
             * @function sqlite Method: 03-insertData
             * @param {String} tableName - set table name
             * @param {String} field - 欄位名稱 EX: var field = ["Customers", "Num", "SaveMoney"];
             * @param {array} rows - 欄位內容 EX: var rows = ["Tim", 1 , 20000];
             * @param {object} success - insert成功傳回的物件，傳回insert rows的總數
             * @requires sqlitePlugin {https://github.com/litehelpers/Cordova-sqlite-storage}
             */
            HtFramework.prototype.insertData = function(tableName, field, rows, success, error){

                var mFieldlen = field.length;

                if(tableName == ""){
                    alert("table名稱不允許為空值!");
                    return;
                }

                //*** Continue
                //for(var i = 0; i < mFieldlen; i++){
                //    if(mFieldlen[i] == 0){
                //        alert("欄位為空或未選擇屬性");
                //    }
                //}

                db.transaction(insertDB, error);

                function insertDB(tx) {

                    var fieldLen = field.length;
                    var i = 1;
                    var values = "?";

                    while(i < fieldLen){
                        values += ",?";
                        i++;
                    }

                    //alert("values:" + values + "\n" +
                    //      "field:" + field + "\n" +
                    //      "row:" + rows);

                    tx.executeSql("INSERT INTO " + tableName + "(" + field + ") VALUES (" + values +")",  rows, insertSuccess, insertError);

                    function insertSuccess(tx, res) {
                        //insert的數量
                        console.log("insertId: " + res.insertId);
                        console.log("rowsAffected: " + res.rowsAffected);
                    }

                    function insertError(e) {
                        error(e.message);
                    };

                    var fristField = field.shift();

                    tx.executeSql("select count('" + fristField + "') as cnt from " + tableName + ";", [], function(tx, res) {
                        success(res.rows.item(0).cnt);
                        console.log("res.rows.length: " + res.rows.length);
                        console.log("res.rows.item(0).cnt: " + res.rows.item(0).cnt);
                    });
                }
            }


            /**
             * select data (Framework.selectWhere(tableName, where, query, error, success);)
             * @function sqlite Method: 04-selectWhere
             * @param {String} tableName - table name.
             * @param {String} where - 指定要查哪個field
             * @param {String | int} query - 查詢的值
             * @param {Object} error - errorMsg
             * @param {Object} success - 查詢到的results
             * @requires sqlitePlugin {https://github.com/litehelpers/Cordova-sqlite-storage}
             */
            HtFramework.prototype.selectWhere = function(tableName, where, query, error, success){

                db.transaction(querydata, error);

                function querydata(tx) {
                    tx.executeSql("SELECT * FROM " + tableName + " WHERE " + where + "=?", [query], querySuccess, error);
                }
                function querySuccess(tx,results) {
                    success(results);
                }
            };

            /**
             * select Alldata (Framework.selectAll(tableName, success);)
             * @function sqlite Method: 05-selectAll
             * @param {String} tableName - table Name.
             * @param {Object} success - 查詢到的results
             * @requires sqlitePlugin {https://github.com/litehelpers/Cordova-sqlite-storage}
             */
            HtFramework.prototype.selectAll = function(tableName, error, success){

                db.executeSql("SELECT * from " + tableName + ";", [], AllSuccess, AllError);

                function AllSuccess(results){
                    success(results);
                }
                function AllError(e){
                    error(e.message);
                }
            }

            /**
             * updateRow (Framework.updateRow(tableName, field, where, update, success);)
             * @function sqlite Method: 06-updateRow
             * @param {String} tableName - table Name.
             * @param {String} updateField - 預修改的欄位 EX: var updateField = ["Customers" , "SaveMoney"];
             * @param {Object} where - 指定要修改的內容 EX: var where = ["Num = 10"];
             * @param {array} update - 要更新的資料 EX: var update = ["Tina" , 266889];
             * @param {Object}success - 成功回傳的物件
             * @requires sqlitePlugin {https://github.com/litehelpers/Cordova-sqlite-storage}
             */
            HtFramework.prototype.updateRow = function(tableName, updateField, where, update, success, error){

                var count = [];
                var i = 0;
                var fieldLen = updateField.length;

                while(i < fieldLen)
                {
                    count.push(updateField[i] + "=?");
                    i++;
                }

                db.executeSql("UPDATE " + tableName + " SET " + count + " WHERE " + where, update, updateSuccess, updateError);

                function updateSuccess(results){
                    success(results);
                }

                function updateError(e){
                    error(e.message);
                }
            }

            /**
             * deleteTable (Framework.deleteTable(tableName, error, success);)
             * @function sqlite Method: 07-deleteTable
             * @param {String} tableName - 要刪除的tableName
             * @param {object} error -
             * @param {object} success - 刪除的table名稱
             * @requires sqlitePlugin {https://github.com/litehelpers/Cordova-sqlite-storage}
             */
            HtFramework.prototype.deleteTable = function(tableName, error, success){

                //alert("tableName:" + tableName + "\n" +
                //      typeof tableName);

                db.executeSql("DROP TABLE IF EXISTS '" + tableName + "'",[] , deleteTableSuccess, deleteTableError);

                function deleteTableSuccess(results){
                    results = tableName;
                    success(results);
                }

                function deleteTableError(e){
                    error(e.message);
                }

            };
        };

        HtFramework.prototype.setLocale = function(lang) {
            this.localization.setLocale(lang);
        };

        HtFramework.prototype.getLocale = function(tag) {
            if(typeof tag == 'string') {
                var s = tag.split('.');
                var value = this.localization.locale.ROOT;
                for(var i=0; i< s.length; ++i) {
                    value = value[s[i]];
                }
                return value;
            }
            return '';
        };

        /**
         * <ul>
         *     <li>[isGPSSensorEnable]{@link GPS.isGPSSensorEnable}
         *     <li>[isGPS]{@link GPS.isGPS}
         *     <li>[getCurrentPosition]{@link GPS.getCurrentPosition}
         * </ul>
         *
         * @namespace GPS
         * @author JE Wang <jewang@hitrust.com.tw>
         */

        /**
         * Check GPS Sensor Enable / Disable. ↑{@link GPS}
         * @function isGPSSensorEnable
         * @memberof GPS
         *
         * @param {gpsStatus} callback - call by checking GPS sensor enable
         */
        /**
         * Callback When Checking GPS Sensor Succeeded. ↑{@link GPS.isGPSSensorEnable}
         * @callback gpsStatus
         * @param {boolean} status - true, false
         */
        HtFramework.prototype.isGPSSensorEnable = function(gpsStatus) {
            return navigator.geolocation.getCurrentPosition(function(){
                gpsStatus(true);
            }, function(){
                gpsStatus(false);
            });
        };



        /**
         * Check GPS Status. ↑{@link GPS}
         * @function isGPS
         * @memberof GPS
         *
         * @param {gpsON} callback - GPS 有開啟時傳回的物件
         * @param {gpsOFF} callback - GPS 沒開啟時傳回的物件
         */
        /**
         * Callback When GPS Status ON. ↑{@link GPS.isGPS}
         * @callback gpsON
         * @param {boolean} status - true, false
         */
        /**
         * Callback When GPS Status OFF. ↑{@link GPS.isGPS}
         * @callback gpsOFF
         * @param {boolean} status - true, false
         */
        HtFramework.prototype.isGPS = function(gpsON, gpsOFF){

            CheckGPS.check(function(status){
                    gpsON(status);
                },
                function(status){
                    gpsOFF(status);
                });

        };

        /**
         * Get GPS Current Position. ↑{@link GPS}
         * @function getCurrentPosition
         * @memberof GPS
         *
         * @param {getGPS_Success} callback - call by get GPS position succeed
         * @param {getGPS_Error} callback - call by get GPS position error
         * @param {object} options - customize retrieval. ex: { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
         */
        /**
         * Callback When Get GPS position succeed. ↑{@link GPS.getCurrentPosition}
         * @callback getGPS_Success
         * @param {object} jsonObj - jsonObj.coords.(latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed, timestamp)
         */
        /**
         * Callback When Get GPS position error. ↑{@link GPS.getCurrentPosition}
         * @callback getGPS_Error
         * @param {object} jsonObj - jsonObj.code, jsonObj.message
         */
        HtFramework.prototype.getCurrentPosition = function(getGPS_Success,getGPS_Error, options){

            this.geolocation.getCurrentPosition(getGPS_Success,getGPS_Error, options);
        };

        HtFramework.prototype.watchPosition = function(success, error, options){
            this.geolocation.watchPosition(success, error, options);
        };

        HtFramework.prototype.clearWatch = function(){
            this.geolocation.clearWatch();
        };

        HtFramework.prototype.openCameraCapturePhoto = function() {
            return navigator.camera.getPicture(function(imageURI) {
                alert('success');
            }, function(err) {
                alert('error');
            }, { quality : 75,
                destinationType : Camera.DestinationType.DATA_URL,
                sourceType : Camera.PictureSourceType.CAMERA,
                allowEdit : true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true });
        };

        HtFramework.prototype.checkIfFileExists =function(path, fileName, onFileExists, onFileDoesNotExist) {
            window.resolveLocalFileSystemURL(path+fileName, onFileExists, onFileDoesNotExist);
        };

        HtFramework.prototype.getAssetFile = function(path, fileName, onFileExists, onFileDoesNotExist, onDirEntryFail) {
            window.resolveLocalFileSystemURL(path, function(dirEntry) {
                dirEntry.getFile(fileName, {create:false}, onFileExists, onFileDoesNotExist);
            }, onDirEntryFail);
        };

        HtFramework.prototype.openQRCodeReader = function(success, error) {
            cordova.plugins.barcodeScanner.scan(success, error );
        };

        HtFramework.prototype.openQRCodeGenerator = function(text, success, error) {
            cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, text, success, error);
        };




        /**
         * 開啟權限設定
         * @param {*} success 
         * @param {*} error 
         */
        HtFramework.prototype.openSettings = function () {
            QRScanner.openSettings();
        };

        /**
         * 開啟嵌入式QRCode掃描
         * @param {*} success 
         * @param {*} error 
         */
        HtFramework.prototype.openEmbedQRCodeReader = function (decodeSuccess, decodeError) {
            function scanCallback(err, contents) {
                if (err) {
                    // console.error(err._message);
                    decodeError(err);
                    return;
                }
                QRScanner.cancelScan(function (status) {
                    // TODO: status判斷
                    decodeSuccess(contents);
                });
            };
            QRScanner.prepare(function(prepareFail, prepareStatus){
                if(prepareFail){
                    decodeError(prepareFail);
                    return;
                }
                if(!prepareStatus.showing){
                    QRScanner.show(function(showStatus){
                        // console.log('show'+JSON.stringify(showStatus));
                        QRScanner.scan(function (err, contents) {
                            // console.log('scan callback'+JSON.stringify(contents));
                            decodeSuccess(contents);
                            if (err) {
                                // console.error(err._message);
                                decodeError(err);
                                return;
                            }
                            // QRScanner.cancelScan(function (canceledStatus) {
                            //     console.log('scan canceled:'+JSON.stringify(canceledStatus));
                            //     // TODO: status判斷
                            //     decodeSuccess(contents);
                            // });
                        });
                    });
                    return;
                }
                QRScanner.scan(function (err, contents) {
                    decodeSuccess(contents);
                    if (err) {
                        // console.error(err._message);
                        decodeError(err);
                        return;
                    }
                    // QRScanner.cancelScan(function (canceledStatus) {
                    //     // TODO: status判斷
                    //     decodeSuccess(contents);
                    // });
                });
            });
            
        };

        /**
         * 關閉嵌入式QRCode掃描
         * @param {*} success 
         * @param {*} error 
         */
        HtFramework.prototype.cancelEmbedQRCodeReader = function (cancelScanSuccess) {
            QRScanner.cancelScan(function (status) {
                // TODO: status判斷
                cancelScanSuccess();
            });
        };

        /**
         * 關閉嵌入式QRCode掃描
         * @param {*} success 
         * @param {*} error 
         */
        HtFramework.prototype.closeEmbedQRCodeReader = function (destroySuccess) {
            QRScanner.destroy(function (status) {
                // TODO: status判斷
                destroySuccess();
            });
        };

        /**
         * 從相簿讀取QRCode
         * @param {*} success 
         * @param {*} error 
         */
        HtFramework.prototype.readQRCodeFromFile = function (success, error) {
            var decodeQRCode = function (imgPath) {
                var decodeQRCodeSuccess = function (result) {
                    success(result.value);
                }
                QRScanner.readQRCodeFromImage(decodeQRCodeSuccess, error, imgPath);
            }

            var getPictureErr = function (msg) {
                if (msg == 'has no access to assets') {
                    error({ name: 'ALBUM_ACCESS_DENIED', code:9 });
                } else if (msg == 'no image selected') {
                    error({ name: 'SCAN_CANCELED', code:6 });
                } else {
                    error(msg);
                }
            }
            navigator.camera.getPicture(decodeQRCode, getPictureErr, {
                quality: 20,
                destinationType: navigator.camera.DestinationType.DATA_URL,
                sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
            });
        };

        HtFramework.prototype.openEmail = function(subject) {
            cordova.plugins.email.addAlias('gmail', 'com.google.android.gm');
            cordova.plugins.email.open({
                app: 'gmail',
                subject: subject
            });
        };

        /**
         * <ul>
         *     <li>[sendSMS]{@link MobileBasic.sendSMS}
         * </ul>
         *
         * @namespace MobileBasic
         * @author JE Wang <jewang@hitrust.com.tw>
         */

        /**
         * Send SMS. ↑{@link MobileBasic}
         * @function sendSMS
         * @memberof MobileBasic
         *
         * @param {String}phoneNumber - 電話號碼(需大於9位數，小於18位數)
         * @param {String}message - 訊息內容
         * @param {String}success - 成功進入簡訊畫面後回傳
         * @param {String}error - 錯誤訊息
         */
        HtFramework.prototype.sendSMS = function(phoneNumber, message, success, error){
            //alert("sendSMSFramework");
            //CONFIGURATION

            if(phoneNumber.length < 9 || phoneNumber.length > 18){
                var erroro = {
                    message: "您的電話號碼不合法!需大於9位數，小於18位數" + "\n" +
                             "目前為:" + phoneNumber.length + "位數"
                }
                error(erroro.message);
                return;
            }

            var options = {
                replaceLineBreaks: false, // true to replace \n by a new line, false by default
                android: {
                    intent: 'INTENT'  // send SMS with the native android SMS messaging
                    //intent: '' // send SMS without open any other app
                }
            };
            sms.send(phoneNumber, message, options, success, error);
        };

        HtFramework.prototype.getContactsInfomation = function(onSuccess, onError) {
            // find all contacts with 'Bob' in any name field
            var options = new ContactFindOptions();
            options.filter  = "";

            var filter = ["displayName", "phoneNumbers"];

            options.multiple = true;
            navigator.contacts.find(filter, onSuccess, onError, options);
        };

        HtFramework.prototype.getTimeZoneValue = function() {
            return this.localTimeZone.getTime();
        };

        HtFramework.prototype.startRecognizerSpeakVoice = function(success, error) {
            var maxMatches = 5;
            var promptString = "Speak now"; // optional
            var language = "en-US";                     // optional
            window.plugins.speechrecognizer.startRecognize(
                success,error, maxMatches, promptString, language);
        };

        /**
         * <ul>
         *     <li>[startShake]{@link ShakeDetect.startShake}
         *     <li>[stopShake]{@link ShakeDetect.stopShake}
         * </ul>
         *
         * @namespace ShakeDetect
         * @author JE Wang <jewang@hitrust.com.tw>
         */

        /**
         * Start Shake Detect. ↑{@link ShakeDetect}
         * @function startShake
         * @memberof ShakeDetect
         *
         * @param {onShakeSuccess} callback - call by device shake detected
         * @param {onShakeError} callback - call by set detect error
         */
        /**
         * Callback When device shake detected. ↑{@link ShakeDetect.startShake}
         * @callback onShakeSuccess
         */
        /**
         * Callback When set detect error. ↑{@link ShakeDetect.startShake}
         * @callback onShakeError
         */
        HtFramework.prototype.startShake = function(onShakeSuccess, onShakeError) {
            shake.startWatch(onShakeSuccess, 30, onShakeError);
        };

        /**
         * Stop Shake Detect. ↑{@link ShakeDetect}
         * @function stopShake
         * @memberof ShakeDetect
         */
        HtFramework.prototype.stopShake = function() {
            shake.stopWatch();
        };

        HtFramework.prototype.startDetectBLE = function() {
            function isScanningSuccess(obj) {
                console.log("Is Scanning Success : " + JSON.stringify(obj) + " " + obj.isScanning);
            }

            if(bluetoothle.isScanning(isScanningSuccess)) {
                bluetoothle.stopScan(stopScanSuccess, stopScanError);
            }

            var paramsObj = {request:true};
            bluetoothle.initialize(initializeSuccess, initializeError, paramsObj);

            var params = {serviceUuids:[]};
            bluetoothle.startScan(startScanSuccess, startScanError, params);


            function initializeSuccess(obj) {
                console.log("Initialize Success : " + JSON.stringify(obj));

                if (obj.status == "enabled") {
                    console.log("Enabled")
                } else {
                    console.log("Unexpected Initialize Status");
                }
            };

            function initializeError(obj) {
                console.log("Initialize Error : " + JSON.stringify(obj));
            };

            function startScanSuccess(obj) {
                console.log("Start Scan Success : " + JSON.stringify(obj));
                console.log('[Scanning result]：' + JSON.stringify(obj));
                if (obj.status == "scanResult") {
                    alert("Scan Result \n [Scan obj address]" + obj.address + " \n " + "[Scan obj name]" + obj.name);
                    //addDevice(obj.address, obj.name);
                    bluetoothle.stopScan(stopScanSuccess, stopScanError);
                } else if (obj.status == "scanStarted") {
                    alert("Scan Started");
                } else {
                    alert("Unexpected Start Scan Status");
                }
            };

            function startScanError(obj) {
                alert("Start Scan Error : " + JSON.stringify(obj));
            };

            function stopScanSuccess(obj) {
                console.log("Stop Scan Success : " + JSON.stringify(obj));

                if (obj.status == "scanStopped") {
                    console.log("Scan Stopped");
                } else {
                    console.log("Unexpected Stop Scan Status");
                }
            };

            function stopScanError(obj) {
                console.log("Stop Scan Error : " + JSON.stringify(obj));
            };
        };

        HtFramework.prototype.openFile = function(path) {
            window.plugins.fileOpener.open(path);
        };

        HtFramework.prototype.openNativeSettingView = function(success_callback, failure_callback) {
            cordova.plugins.settings.open(success_callback, failure_callback);
        };

        /**
         * <ul>
         *     <li>[checkNfcEnable]{@link NFC.checkNfcEnable}
         *     <li>[startNfcListener]{@link NFC.startNfcListener}
         *     <li>[stopNfcListener]{@link NFC.stopNfcListener}
         *     <li>[checkNfcIsNew]{@link NFC.checkNfcIsNew}
         *     <li>[stopCheckNfcIsNew]{@link NFC.stopCheckNfcIsNew}
         *     <li>[nfcNdefTnfToString]{@link NFC.nfcNdefTnfToString}
         *     <li>[nfcNdefRtdToString]{@link NFC.nfcNdefRtdToString}
         *     <li>[nfcNdefPayloadToString]{@link NFC.nfcNdefPayloadToString}
         *     <li>[nfcJsonArrayToNdefMessage]{@link NFC.nfcJsonArrayToNdefMessage}
         *     <li>[nfcWrite]{@link NFC.nfcWrite}
         *     <li>[nfcErase]{@link NFC.nfcErase}
         *     <li>[nfcStartShareMessage]{@link NFC.nfcStartShareMessage}
         *     <li>[nfcStopShareMessage]{@link NFC.nfcStopShareMessage}
         * </ul>
         *
         * @namespace NFC
         * @author JE Wang <jewang@hitrust.com.tw>
         * @see
         * [phonegap-nfc]{@link https://github.com/chariotsolutions/phonegap-nfc}
         */

        // Global Flags
        HtFramework.prototype.nfcFlag = {
            NFC_CHECK : false,
            NFC_STARTED : false,
            NFC_TAG_LISTENER : false
        };

        // Global Events
        HtFramework.prototype.nfcEvent = {
            TAG_EVENT : new Event('nfcTag'),
            NDEF_EVENT : new Event('nfcNdef'),
            EMPTY_EVENT : new Event('nfcEmpty')
        };

        // Global Nfc Object
        HtFramework.prototype.nfcObject = {
            NFC_OBJ : {}
        };

        /**
         * Check Mobile NFC Enabled. ↑{@link NFC}
         * @function checkNfcEnable
         * @memberof NFC
         *
         * @param {checkSuccess} callback - call by NFC enabled
         * @param {checkError} callback - call by NFC check error
         * @example
         * // Check NFC Enable
         * framework.checkNfcEnable(
         *      function () { // success callback
		 *          alert('NFC Enabled'); // alert when check succeed
		 *      },
         *      function (err) { // error callback
		 *          alert(err); // alert error message when check error
		 *      }
         * );
         */
        /**
         * Callback When Checking NFC Enable Succeeded. ↑{@link NFC.checkNfcEnable}
         * @callback checkSuccess
         */
        /**
         * Callback When Checking NFC Enable Error. ↑{@link NFC.checkNfcEnable}
         * @callback checkError
         * @param {string} error - error message: NO_NFC, NFC_DISABLED
         */
        HtFramework.prototype.checkNfcEnable = function (checkSuccess, checkError) {
            nfc.enabled(checkSuccess, checkError);
        };

        /**
         * Start NFC Tag Event Listener. ↑{@link NFC}
         * @function startNfcListener
         * @memberof NFC
         *
         * @param {nfcTagEvent} callback - get tag info. when event triggered
         * @param {listenSuccess} callback - call by add listener success
         * @param {listenError} callback - call by add listener error
         * @example
         * // Start Listening NFC Event
         * framework.startNfcListener(
         *      function (nfcTag) { // tag event callback
         *          if(nfcTag.ndefMessage) { // check if any message contains
         *              var infoString = "maxSize: " + nfcTag.maxSize + "\n"; // get tag max size
         *              for(var i=0; i<nfcTag.ndefMessage.length; i++) { // get all message
         *                  infoString = infoString +
         *                  "Message[" + i + "] tnf: " + framework.nfcNdefTnfToString(nfcTag.ndefMessage[i].tnf) + "\n" + // get message TNF type and transform to string
         *                  "Message[" + i + "] rtd: " + framework.nfcNdefRtdToString(nfcTag.ndefMessage[i].type) + "\n" + // get message RTD type and transform to string
         *                  "Message[" + i + "] payload: " + framework.nfcNdefPayloadToString(nfcTag.ndefMessage[i].type, nfcTag.ndefMessage[i].payload) + "\n" // get message payload and transform to string
         *              }
         *              alert(infoString); // alert full message
         *          } else {
         *              alert("tag: " + JSON.stringify(nfcTag)); // alert json string if no message contains
         *          }
         *      },
         *      function () { // success callback
		 *          alert('Listening NFC Tag Success'); // alert when start listening succeed
		 *      },
         *      function (err) { // error callback
		 *          alert(err); // alert error message when start listening error
		 *      }
         * );
         */
        /**
         * Callback When Event Triggered and Get Tag Information. ↑{@link NFC.startNfcListener}
         * @callback nfcTagEvent
         * @param {object} tag - tag information
         * @example
         * // Tag Sample
         * tag: {
         *      "maxSize": 2046,
         *      "ndefMessage": [
         *              {
         *                  "id": [],
         *                  "type": [116, 101, 120, 116, 47, 112, 103],
         *                  "payload": [72, 101, 108, 108, 111, 32, 80, 104, 111, 110, 101, 71, 97, 112],
         *                  "tnf": 2
         *              },
         *              {
         *                  "id": [],
         *                  "type": [108, 101, 120, 116],
         *                  "payload": [72, 101, 108, 108, 111, 32, 80, 104, 111, 110, 101, 71, 97, 112],
         *                  "tnf": 1
         *              }
         *      ]
         *  }
         */
        /**
         * Callback When Adding NFC Tag Event Listener Succeeded. ↑{@link NFC.startNfcListener}
         * @callback listenSuccess
         */
        /**
         * Callback When Adding NFC Tag Event Listener Error. ↑{@link NFC.startNfcListener}
         * @callback listenError
         * @param {string} error - error message: NO_NFC, NFC_DISABLED
         */
        HtFramework.prototype.startNfcListener = function(nfcTagEvent, listenSuccess, listenError) {
            this.nfcFlag.NFC_TAG_LISTENER = true;

            // tag event callback
            function eventTag(obj){
                if(this.nfcFlag.NFC_TAG_LISTENER){ // NFC tag listener flag
                    this.nfcObject.NFC_OBJ = obj.tag; // get tag info. only
                    if(!this.nfcFlag.NFC_CHECK) {
                        nfcTagEvent(this.nfcObject.NFC_OBJ); // set object to callback
                    }else{
                        document.dispatchEvent(this.nfcEvent.TAG_EVENT); // if checking nfc is new
                    }
                }
            }

            // ndef event callback
            function eventNdef(obj){
                if(this.nfcFlag.NFC_TAG_LISTENER){ // NFC tag listener flag
                    this.nfcObject.NFC_OBJ = obj.tag; // get tag info. only
                    //alert("tag: "+JSON.stringify(obj.tag));
                    if(!this.nfcFlag.NFC_CHECK) {
                        // get tag.maxSize & tag.ndefMessage info. only
                        var newObj = {
                            "maxSize" : obj.tag.maxSize,
                            "ndefMessage" : obj.tag.ndefMessage
                        };
                        nfcTagEvent(newObj); // set object to callback
                    }else{
                        document.dispatchEvent(this.nfcEvent.NDEF_EVENT); // if checking nfc is new
                    }
                }
            }

            // add tag discovered listener success callback
            function success(){
                this.nfcFlag.NFC_STARTED = true; // start listener flag
                nfc.addNdefListener(eventNdef, listenSuccess, listenError);
            }

            if(!this.nfcFlag.NFC_STARTED) nfc.addTagDiscoveredListener(eventTag, success, listenError);
        };

        /**
         * Stop NFC Tag Event Listener. ↑{@link NFC}
         * @function stopNfcListener
         * @memberof NFC
         *
         * @example
         * // Stop Listening NFC Event
         * framework.stopNfcListener();
         */
        HtFramework.prototype.stopNfcListener = function() {
            this.nfcFlag.NFC_TAG_LISTENER = false;
        };

        /**
         * Check Once NFC Tag is New or Not(Already Formatted). ↑{@link NFC}
         * @function checkNfcIsNew
         * @memberof NFC
         *
         * @param {checkNewResult} callback - get result when event triggered
         * @param {checkNewSuccess} callback - call by start checking success
         * @param {checkNewError} callback - call by start checking error
         *
         * @example
         * // Check Result Callback
         * function checkResult(result) {
         *      alert(result); // alert result
         * }
         * // Start Checking NFC is New
         * framework.checkNfcIsNew(
         *      checkResult, // callback function
         *      function () { // success callback
		 *          alert('Start Waiting NFC Event'); // alert when start checking succeed
		 *      },
         *      function (err) { // error callback
		 *          alert('Please Start NFC Listener First!!!'); // aalert when start checking error(without NFC listener)
		 *      }
         * );
         */
        /**
         * Callback When NFC Event Triggered and Get Result. ↑{@link NFC.checkNfcIsNew}
         * @callback checkNewResult
         * @param {boolean} result - true, false
         */
        /**
         * Callback When Start Checking Listener Success. ↑{@link NFC.checkNfcIsNew}
         * @callback checkNewSuccess
         */
        /**
         * Callback When Start Checking Listener Error(Not yet started NFC Listener). ↑{@link NFC.checkNfcIsNew}
         * @callback checkNewError
         */
        HtFramework.prototype.checkNfcIsNew = function(checkNewResult, checkNewSuccess, checkNewError) {
            this.nfcFlag.NFC_CHECK = true; // set start check nfc is new flag to true filter listener event to here first

            // tag event
            function getTagInfo() {
                if(this.nfcFlag.NFC_CHECK) {
                    if (this.nfcObject.NFC_OBJ.techTypes.length > 0) {
                        var isFormat = false; // default result is false
                        for (var i = 0; i < this.nfcObject.NFC_OBJ.techTypes.length; i++) {
                            if (this.nfcObject.NFC_OBJ.techTypes[i] == "android.nfc.tech.NdefFormatable") { // check if NdefFormatable
                                isFormat = true; // set result value to true
                            }
                        }

                        checkNewResult(isFormat); // set result to callback
                        this.nfcFlag.NFC_CHECK = false; // finished checking flag
                        document.removeEventListener('nfcTag', getTagInfo); // remove event listener
                        document.removeEventListener('nfcNdef', getTagInfo); // remove event listener
                        document.removeEventListener('nfcEmpty', resetEvent); // remove event listener
                    }
                }
            }

            // ndef event
            function getNdefInfo() {
                if(this.nfcFlag.NFC_CHECK) {
                    checkNewResult(false); // if from ndef event must has ndef message inside, then must not a new NFC tag
                    this.nfcFlag.NFC_CHECK = false; // finished checking flag
                    document.removeEventListener('nfcTag', getTagInfo); // remove event listener
                    document.removeEventListener('nfcNdef', getTagInfo); // remove event listener
                    document.removeEventListener('nfcEmpty', resetEvent); // remove event listener
                }
            }

            // reset evnet
            function resetEvent() {
                this.nfcFlag.NFC_CHECK = false; // finished checking flag
                document.removeEventListener('nfcTag', getTagInfo); // remove event listener
                document.removeEventListener('nfcNdef', getTagInfo); // remove event listener
                document.removeEventListener('nfcEmpty', resetEvent); // remove event listener
            }

            // check NFC listener first
            if(this.nfcFlag.NFC_TAG_LISTENER) {
                document.addEventListener('nfcTag', getTagInfo); // add event listener from NFC listener trigger
                document.addEventListener('nfcNdef', getNdefInfo); // add event listener from NFC listener trigger
                document.addEventListener('nfcEmpty', resetEvent); // add event listener from NFC listener trigger
                checkNewSuccess(); // start checking new success callback
            }else {
                checkNewError(); // start checking new error callback
            }
        };

        /**
         * Stop Checking NFC Tag is New or Not(Already Formatted). ↑{@link NFC}
         * @function stopCheckNfcIsNew
         * @memberof NFC
         *
         * @example
         * // Stop Checking NFC is New
         * framework.stopCheckNfcIsNew();
         */
        HtFramework.prototype.stopCheckNfcIsNew = function() {
            document.dispatchEvent(this.nfcEvent.EMPTY_EVENT); // trigger and finish check NFC is new listener
        };

        /**
         * NDEF(NFC Data Exchange Format) TNF Type to String. ↑{@link NFC}
         * @function nfcNdefTnfToString
         * @memberof NFC
         *
         * @param {NDEF_TNF} tnf - NFC Data Exchange Format TNF
         * @returns {string}
         *          <u>TNF_EMPTY</u>,  <u>TNF_WELL_KNOWN</u>,  <u>TNF_MIME_MEDIA</u><br>
         *          <u>TNF_ABSOLUTE_URI</u>,  <u>TNF_EXTERNAL_TYPE</u>,  <u>TNF_UNKNOWN</u><br>
         *          <u>TNF_UNCHANGED</u>,  <u>TNF_RESERVED</u><br>
         *
         * @see
         * [Android NdefRecord]{@link http://developer.android.com/intl/zh-tw/reference/android/nfc/NdefRecord.html}
         *
         * @example
         * // Start Listening NFC Event
         * framework.startNfcListener(
         *      function (nfcTag) { // tag event callback
         *          if(nfcTag.ndefMessage) { // check if any message contains
         *              var infoString = "maxSize: " + nfcTag.maxSize + "\n"; // get tag max size
         *              for(var i=0; i<nfcTag.ndefMessage.length; i++) { // get all message
         *                  infoString = infoString +
         *                  "Message[" + i + "] tnf: " + framework.nfcNdefTnfToString(nfcTag.ndefMessage[i].tnf) + "\n" + // get message TNF type and transform to string
         *                  "Message[" + i + "] rtd: " + framework.nfcNdefRtdToString(nfcTag.ndefMessage[i].type) + "\n" + // get message RTD type and transform to string
         *                  "Message[" + i + "] payload: " + framework.nfcNdefPayloadToString(nfcTag.ndefMessage[i].type, nfcTag.ndefMessage[i].payload) + "\n" // get message payload and transform to string
         *              }
         *              alert(infoString); // alert full message
         *          } else {
         *              alert("tag: " + JSON.stringify(nfcTag)); // alert json string if no message contains
         *          }
         *      },
         *      function () { // success callback
		 *          alert('Listening NFC Tag Success'); // alert when start listening succeed
		 *      },
         *      function (err) { // error callback
		 *          alert(err); // alert error message when start listening error
		 *      }
         * );
         */
        HtFramework.prototype.nfcNdefTnfToString = function(tnf) {
            var tnfString = tnf;
            switch(tnf) {
                case 0:
                    tnfString = "TNF_EMPTY";
                    break;
                case 1:
                    tnfString = "TNF_WELL_KNOWN";
                    break;
                case 2:
                    tnfString = "TNF_MIME_MEDIA";
                    break;
                case 3:
                    tnfString = "TNF_ABSOLUTE_URI";
                    break;
                case 4:
                    tnfString = "TNF_EXTERNAL_TYPE";
                    break;
                case 5:
                    tnfString = "TNF_UNKNOWN";
                    break;
                case 6:
                    tnfString = "TNF_UNCHANGED";
                    break;
                case 7:
                    tnfString = "TNF_RESERVED";
                    break;
            }
            return tnfString;
        };

        /**
         * NDEF(NFC Data Exchange Format) RTD Type to String. ↑{@link NFC}
         * @function nfcNdefRtdToString
         * @memberof NFC
         *
         * @param {NDEF_RTD} rtd - NFC Data Exchange Format RTD
         * @returns {string}
         *          <u>RTD_TEXT</u>,  <u>RTD_URI</u>,  <u>RTD_SMART_POSTER</u><br>
         *          <u>RTD_ALTERNATIVE_CARRIER</u>,  <u>RTD_HANDOVER_CARRIER</u>,  <u>RTD_HANDOVER_REQUEST</u><br>
         *          <u>RTD_HANDOVER_SELECT</u>,  <u>RTD_AAR</u><br>
         *
         * @see
         * [Android NdefRecord]{@link http://developer.android.com/intl/zh-tw/reference/android/nfc/NdefRecord.html}
         *
         * @example
         * // Start Listening NFC Event
         * framework.startNfcListener(
         *      function (nfcTag) { // tag event callback
         *          if(nfcTag.ndefMessage) { // check if any message contains
         *              var infoString = "maxSize: " + nfcTag.maxSize + "\n"; // get tag max size
         *              for(var i=0; i<nfcTag.ndefMessage.length; i++) { // get all message
         *                  infoString = infoString +
         *                  "Message[" + i + "] tnf: " + framework.nfcNdefTnfToString(nfcTag.ndefMessage[i].tnf) + "\n" + // get message TNF type and transform to string
         *                  "Message[" + i + "] rtd: " + framework.nfcNdefRtdToString(nfcTag.ndefMessage[i].type) + "\n" + // get message RTD type and transform to string
         *                  "Message[" + i + "] payload: " + framework.nfcNdefPayloadToString(nfcTag.ndefMessage[i].type, nfcTag.ndefMessage[i].payload) + "\n" // get message payload and transform to string
         *              }
         *              alert(infoString); // alert full message
         *          } else {
         *              alert("tag: " + JSON.stringify(nfcTag)); // alert json string if no message contains
         *          }
         *      },
         *      function () { // success callback
		 *          alert('Listening NFC Tag Success'); // alert when start listening succeed
		 *      },
         *      function (err) { // error callback
		 *          alert(err); // alert error message when start listening error
		 *      }
         * );
         */
        HtFramework.prototype.nfcNdefRtdToString = function(rtd) {
            var recordType = nfc.bytesToString(rtd),
                rtdString;
            switch(recordType) {
                case "T":
                    rtdString = "RTD_TEXT";
                    break;
                case "U":
                    rtdString = "RTD_URI";
                    break;
                case "Sp":
                    rtdString = "RTD_SMART_POSTER";
                    break;
                case "ac":
                    rtdString = "RTD_ALTERNATIVE_CARRIER";
                    break;
                case "Hc":
                    rtdString = "RTD_HANDOVER_CARRIER";
                    break;
                case "Hr":
                    rtdString = "RTD_HANDOVER_REQUEST";
                    break;
                case "Hs":
                    rtdString = "RTD_HANDOVER_SELECT";
                    break;
                case "android.com:pkg": // Android Application Record
                    rtdString = "RTD_AAR";
                    break;
                default :
                    rtdString = recordType;
                    break;
            }
            return rtdString;
        };

        /**
         * NDEF(NFC Data Exchange Format) Payload to String. ↑{@link NFC}
         * @function nfcNdefPayloadToString
         * @memberof NFC
         *
         * @param {NDEF_RTD} rtd - NFC Data Exchange Format RTD
         * @param {NDEF_Payload} payload - NFC Data Exchange Format Payload
         * @returns {string} NFC Data Exchange Format Main Content
         *
         * @example
         * // Start Listening NFC Event
         * framework.startNfcListener(
         *      function (nfcTag) { // tag event callback
         *          if(nfcTag.ndefMessage) { // check if any message contains
         *              var infoString = "maxSize: " + nfcTag.maxSize + "\n"; // get tag max size
         *              for(var i=0; i<nfcTag.ndefMessage.length; i++) { // get all message
         *                  infoString = infoString +
         *                  "Message[" + i + "] tnf: " + framework.nfcNdefTnfToString(nfcTag.ndefMessage[i].tnf) + "\n" + // get message TNF type and transform to string
         *                  "Message[" + i + "] rtd: " + framework.nfcNdefRtdToString(nfcTag.ndefMessage[i].type) + "\n" + // get message RTD type and transform to string
         *                  "Message[" + i + "] payload: " + framework.nfcNdefPayloadToString(nfcTag.ndefMessage[i].type, nfcTag.ndefMessage[i].payload) + "\n" // get message payload and transform to string
         *              }
         *              alert(infoString); // alert full message
         *          } else {
         *              alert("tag: " + JSON.stringify(nfcTag)); // alert json string if no message contains
         *          }
         *      },
         *      function () { // success callback
		 *          alert('Listening NFC Tag Success'); // alert when start listening succeed
		 *      },
         *      function (err) { // error callback
		 *          alert(err); // alert error message when start listening error
		 *      }
         * );
         */
        HtFramework.prototype.nfcNdefPayloadToString = function(rtd, payload) {
            var recordType = nfc.bytesToString(rtd), // decode rtd
                payloadString;

            if(recordType === "T") { // RTD_TEXT
                payloadString = nfc.bytesToString(payload.slice(1+payload[0], payload.length));
            } else if (recordType === "U") { // RTD_URI
                var identifierCode = payload.shift(),
                    uri =  nfc.bytesToString(payload);

                if (identifierCode !== 0) {
                    // TODO decode based on URI Record Type Definition
                    console.log("WARNING: uri needs to be decoded");
                }
                //payload = "<a href='" + uri + "'>" + uri + "<\/a>";
                payloadString = uri;
            } else {
                // treat as String
                payloadString = nfc.bytesToString(payload);
            }

            return payloadString;
        };

        /**
         * ↑{@link NFC}
         *
         * <ul>
         *     <li>[textType]{@link NFC.HtFramework#nfcNdefRecord.textType}
         *     <li>[uriType]{@link NFC.HtFramework#nfcNdefRecord.uriType}
         *     <li>[mimeType]{@link NFC.HtFramework#nfcNdefRecord.mimeType}
         *     <li>[androidApplicationRecord]{@link NFC.HtFramework#nfcNdefRecord.androidApplicationRecord}
         * </ul>
         *
         * @constructor
         * @memberof NFC
         *
         */
        HtFramework.prototype.nfcNdefRecord = {
            /** @constant [TNF_EMPTY: 0x0]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            TNF_EMPTY: 0x0,
            /** @constant [TNF_WELL_KNOWN: 0x01]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            TNF_WELL_KNOWN: 0x01,
            /** @constant [TNF_MIME_MEDIA: 0x02]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            TNF_MIME_MEDIA: 0x02,
            /** @constant [TNF_ABSOLUTE_URI: 0x03]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            TNF_ABSOLUTE_URI: 0x03,
            /** @constant [TNF_EXTERNAL_TYPE: 0x04]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            TNF_EXTERNAL_TYPE: 0x04,
            /** @constant [TNF_UNKNOWN: 0x05]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            TNF_UNKNOWN: 0x05,
            /** @constant [TNF_UNCHANGED: 0x06]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            TNF_UNCHANGED: 0x06,
            /** @constant [TNF_RESERVED: 0x07]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            TNF_RESERVED: 0x07,

            /** @constant [RTD_TEXT: "[0x54]"]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            RTD_TEXT: [0x54], // "T"
            /** @constant [RTD_URI: "[0x55]"]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            RTD_URI: [0x55], // "U"
            /** @constant [RTD_SMART_POSTER: "[0x53, 0x70]"]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            RTD_SMART_POSTER: [0x53, 0x70], // "Sp"
            /** @constant [RTD_ALTERNATIVE_CARRIER: "[0x61, 0x63]"]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            RTD_ALTERNATIVE_CARRIER: [0x61, 0x63], // "ac"
            /** @constant [RTD_HANDOVER_CARRIER: "[0x48, 0x63]"]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            RTD_HANDOVER_CARRIER: [0x48, 0x63], // "Hc"
            /** @constant [RTD_HANDOVER_REQUEST: "[0x48, 0x72]"]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            RTD_HANDOVER_REQUEST: [0x48, 0x72], // "Hr"
            /** @constant [RTD_HANDOVER_SELECT: "[0x48, 0x73]"]
             * @memberof NFC.HtFramework#nfcNdefRecord*/
            RTD_HANDOVER_SELECT: [0x48, 0x73], // "Hs"
            /** @constant [RTD_AAR: "android.com:pkg"]
             * @memberof NFC.HtFramework#nfcNdefRecord
             *
             * @example
             * // new json array contains NDEF record members
             * var jsonArray = [
             *      {
             *          "tnf": framework.nfcNdefRecord.TNF_WELL_KNOWN, // set tnf from nfcNdefRecord member
             *          "rtd": framework.nfcNdefRecord.RTD_TEXT, // set rtd from nfcNdefRecord member
             *          "id": [], // set id can't be null
             *          "payload": "hello by parser" // set payload string
             *      },
             *      {
             *          "tnf": framework.nfcNdefRecord.TNF_MIME_MEDIA, // set tnf from nfcNdefRecord member
             *          "rtd": "text/pg", // set MIME type
             *          "id": [], // set id can't be null
             *          "payload": "mime payload by parser" // set payload string
             *      },
             *      {
             *          "tnf": framework.nfcNdefRecord.TNF_WELL_KNOWN, // set tnf from nfcNdefRecord member
             *          "rtd": framework.nfcNdefRecord.RTD_URI, // set rtd from nfcNdefRecord member
             *          "id": [], // set id can't be null
             *          "payload": "https://github.com/chariotsolutions/phonegap-nfc" // set payload string
             *      },
             *      {
             *          "tnf": framework.nfcNdefRecord.TNF_EXTERNAL_TYPE, // set tnf from nfcNdefRecord member
             *          "rtd": framework.nfcNdefRecord.RTD_AAR, // set rtd from nfcNdefRecord member
             *          "id": [], // set id can't be null
             *          "payload": "com.hitrust.hiframework" // set payload string application bundle id
             *      }
             * ];
             */
            RTD_AAR: "android.com:pkg",

            /**
             * New NDEF Record Text Type. ↑[nfcNdefRecord]{@link NFC.HtFramework#nfcNdefRecord}
             * @function textType
             * @memberof NFC.HtFramework#nfcNdefRecord
             *
             * @param {string} text - NDEF record payload text type
             * @param {byte} id - NDEF record id (optional)
             * @param {string } languageCode - ISO/IANA language code. Examples: “tw”, “en”, “jp”… (optional)
             * @returns {NdefRecord} NFC Data Exchange Format Record <u>TNF_WELL_KNOWN</u> & <u>RTD_TEXT</u>
             *
             * @example
             * // new message array contains NDEF records
             * var message = [
             *      framework.nfcNdefRecord.textType("hello by method"), // text NDEF record
             *      framework.nfcNdefRecord.mimeType("text/pg", "mime payload by method"), // MIME NDEF record
             *      framework.nfcNdefRecord.uriType("https://github.com/chariotsolutions/phonegap-nfc"), // uri NDEF record
             *      framework.nfcNdefRecord.androidApplicationRecord('com.hitrust.hiframework') // android application record
             * ];
             *
             * // write message to NFC tag
             * framework.nfcWrite(
             *      message,
             *      function () {
             *          alert('Write NFC Tag Success'); // write success callback
             *      },
             *      function (err) {
             *          alert(err); // write error callback with error message
             *      }
             * );
             */
            textType : function (text, id, languageCode) {
                return ndef.textRecord(text, languageCode, id);
            },
            /**
             * New NDEF Record Uri Type. ↑[nfcNdefRecord]{@link NFC.HtFramework#nfcNdefRecord}
             * @function uriType
             * @memberof NFC.HtFramework#nfcNdefRecord
             *
             * @param {string} uri - NDEF record payload uri type
             * @param {byte} id - NDEF record id (optional)
             * @returns {NdefRecord} NFC Data Exchange Format Record <u>TNF_WELL_KNOWN</u> & <u>RTD_URI</u>
             *
             * @example
             * // new message array contains NDEF records
             * var message = [
             *      framework.nfcNdefRecord.textType("hello by method"), // text NDEF record
             *      framework.nfcNdefRecord.mimeType("text/pg", "mime payload by method"), // MIME NDEF record
             *      framework.nfcNdefRecord.uriType("https://github.com/chariotsolutions/phonegap-nfc"), // uri NDEF record
             *      framework.nfcNdefRecord.androidApplicationRecord('com.hitrust.hiframework') // android application record
             * ];
             *
             * // write message to NFC tag
             * framework.nfcWrite(
             *      message,
             *      function () {
             *          alert('Write NFC Tag Success'); // write success callback
             *      },
             *      function (err) {
             *          alert(err); // write error callback with error message
             *      }
             * );
             */
            uriType : function (uri, id) {
                return ndef.uriRecord(uri, id);
            },
            /**
             * New NDEF Record MIME Type. ↑[nfcNdefRecord]{@link NFC.HtFramework#nfcNdefRecord}
             * @function mimeType
             * @memberof NFC.HtFramework#nfcNdefRecord
             *
             * @param {string} mimeType - Internet media type
             * @param {string} payload - NDEF record payload MIME type
             * @param {byte} id - NDEF record id (optional)
             * @returns {NdefRecord} NFC Data Exchange Format Record <u>TNF_MIME_MEDIA</u> & <u>MIME Type</u>
             *
             * @see
             * [MIME Types]{@link https://www.iana.org/assignments/media-types/media-types.xhtml}
             *
             * @example
             * // new message array contains NDEF records
             * var message = [
             *      framework.nfcNdefRecord.textType("hello by method"), // text NDEF record
             *      framework.nfcNdefRecord.mimeType("text/pg", "mime payload by method"), // MIME NDEF record
             *      framework.nfcNdefRecord.uriType("https://github.com/chariotsolutions/phonegap-nfc"), // uri NDEF record
             *      framework.nfcNdefRecord.androidApplicationRecord('com.hitrust.hiframework') // android application record
             * ];
             *
             * // write message to NFC tag
             * framework.nfcWrite(
             *      message,
             *      function () {
             *          alert('Write NFC Tag Success'); // write success callback
             *      },
             *      function (err) {
             *          alert(err); // write error callback with error message
             *      }
             * );
             */
            mimeType : function (mimeType, payload, id) {
                return ndef.mimeMediaRecord(mimeType, payload, id);
            },
            /**
             * New NDEF Android Application Record. ↑[nfcNdefRecord]{@link NFC.HtFramework#nfcNdefRecord}
             * @function androidApplicationRecord
             * @memberof NFC.HtFramework#nfcNdefRecord
             *
             * @param {string} appName - App which will be connected when NFC event triggered
             * @returns {NdefRecord} NFC Data Exchange Format Record <u>TNF_EXTERNAL_TYPE</u> & <u>RTD_AAR</u>
             *
             * @example
             * // new message array contains NDEF records
             * var message = [
             *      framework.nfcNdefRecord.textType("hello by method"), // text NDEF record
             *      framework.nfcNdefRecord.mimeType("text/pg", "mime payload by method"), // MIME NDEF record
             *      framework.nfcNdefRecord.uriType("https://github.com/chariotsolutions/phonegap-nfc"), // uri NDEF record
             *      framework.nfcNdefRecord.androidApplicationRecord('com.hitrust.hiframework') // android application record
             * ];
             *
             * // write message to NFC tag
             * framework.nfcWrite(
             *      message,
             *      function () {
             *          alert('Write NFC Tag Success'); // write success callback
             *      },
             *      function (err) {
             *          alert(err); // write error callback with error message
             *      }
             * );
             */
            androidApplicationRecord : function (appName) {
                return ndef.androidApplicationRecord(appName);
            }
        };

        /**
         * Transform Json Array to NDEF(NFC Data Exchange Format) Message. ↑{@link NFC}
         * @function nfcJsonArrayToNdefMessage
         * @memberof NFC
         *
         * @param {array} jsonArray - JSON array contains NDEF records
         * @returns {array} NdefMessage(Message contains NDEF records)
         *
         * @example
         * // new json array contains NDEF record members
         * var jsonArray = [
         *      {
         *          "tnf": framework.nfcNdefRecord.TNF_WELL_KNOWN, // set tnf from nfcNdefRecord member
         *          "rtd": framework.nfcNdefRecord.RTD_TEXT, // set rtd from nfcNdefRecord member
         *          "id": [], // set id can't be null
         *          "payload": "hello by parser" // set payload string
         *      },
         *      {
         *          "tnf": framework.nfcNdefRecord.TNF_MIME_MEDIA, // set tnf from nfcNdefRecord member
         *          "rtd": "text/pg", // set MIME type
         *          "id": [], // set id can't be null
         *          "payload": "mime payload by parser" // set payload string
         *      },
         *      {
         *          "tnf": framework.nfcNdefRecord.TNF_WELL_KNOWN, // set tnf from nfcNdefRecord member
         *          "rtd": framework.nfcNdefRecord.RTD_URI, // set rtd from nfcNdefRecord member
         *          "id": [], // set id can't be null
         *          "payload": "https://github.com/chariotsolutions/phonegap-nfc" // set payload string
         *      },
         *      {
         *          "tnf": framework.nfcNdefRecord.TNF_EXTERNAL_TYPE, // set tnf from nfcNdefRecord member
         *          "rtd": framework.nfcNdefRecord.RTD_AAR, // set rtd from nfcNdefRecord member
         *          "id": [], // set id can't be null
         *          "payload": "com.hitrust.hiframework" // set payload string application bundle id
         *      }
         * ];
         *
         * // transform json array to NDEF message
         * var jsonMsg = framework.nfcJsonArrayToNdefMessage(jsonArray);
         *
         * // write message to NFC tag
         * framework.nfcWrite(
         *      jsonMsg,
         *      function () {
             *          alert('Write NFC Tag Success'); // write success callback
             *      },
         *      function (err) {
             *          alert(err); // write error callback with error message
             *      }
         * );
         */
        HtFramework.prototype.nfcJsonArrayToNdefMessage = function(jsonArray) {
            var ndefMessage = []; // new empty message array
            if(jsonArray.length > 0) { // check json array length
                for(var i = 0; i < jsonArray.length; i++) {
                    // if text type
                    if(jsonArray[i].tnf === this.nfcNdefRecord.TNF_WELL_KNOWN && jsonArray[i].rtd === this.nfcNdefRecord.RTD_TEXT) {
                        ndefMessage.push( // push to message array
                            ndef.record(
                                jsonArray[i].tnf,
                                jsonArray[i].rtd,
                                jsonArray[i].id,
                                ndef.textHelper.encodePayload(jsonArray[i].payload) // encode payload by textHelper
                            )
                        );
                    // if uri type
                    } else if(jsonArray[i].tnf === this.nfcNdefRecord.TNF_WELL_KNOWN && jsonArray[i].rtd === this.nfcNdefRecord.RTD_URI) {
                        ndefMessage.push( // push to message array
                            ndef.record(
                                jsonArray[i].tnf,
                                jsonArray[i].rtd,
                                jsonArray[i].id,
                                ndef.uriHelper.encodePayload(jsonArray[i].payload) // encode payload by uriHelper
                            )
                        );
                    } else {
                        // push without encode
                        ndefMessage.push(ndef.record(jsonArray[i].tnf, jsonArray[i].rtd, jsonArray[i].id, jsonArray[i].payload));
                    }
                }
            }
            return ndefMessage;
        };

        /**
         * Write NDEF(NFC Data Exchange Format) Message to the NFC Tag. ↑{@link NFC}
         * @function nfcWrite
         * @memberof NFC
         *
         * @param {array} ndefMessage - message contains NDEF records
         * @param {writeSuccess} callback - call by write tag succeed
         * @param {writeError} callback - call by write tag error
         *
         * @example
         * // new message array contains NDEF records
         * var message = [
         *      framework.nfcNdefRecord.textType("hello by method"), // text NDEF record
         *      framework.nfcNdefRecord.mimeType("text/pg", "mime payload by method"), // MIME NDEF record
         *      framework.nfcNdefRecord.uriType("https://github.com/chariotsolutions/phonegap-nfc"), // uri NDEF record
         *      framework.nfcNdefRecord.androidApplicationRecord('com.hitrust.hiframework') // android application record
         * ];
         *
         * // write message to NFC tag
         * framework.nfcWrite(
         *      message,
         *      function () {
         *          alert('Write NFC Tag Success'); // write success callback
         *      },
         *      function (err) {
         *          alert(err); // write error callback with error message
         *      }
         * );
         */
        /**
         * Callback When Writing NFC Message Succeed. ↑{@link NFC.nfcWrite}
         * @callback writeSuccess
         */
        /**
         * Callback When Writing NFC Message Error. ↑{@link NFC.nfcWrite}
         * @callback writeError
         * @param {string} error - error message: NO_NFC, NFC_DISABLED, NO_TARGET, Message Over Memory(Tag capacity is xx bytes, message is xx bytes)
         */
        HtFramework.prototype.nfcWrite = function(ndefMessage, writeSuccess, writeError) {

            function error(err) {
                if(!err) { err = "NO_TARGET";} // check if null set NO_TARGET to callback
                writeError(err);
            }

            nfc.write(ndefMessage, writeSuccess, error);
        };

        /**
         * Erase NDEF(NFC Data Exchange Format) Message from the NFC Tag. ↑{@link NFC}
         * @function nfcErase
         * @memberof NFC
         *
         * @param {eraseSuccess} callback - call by erase tag succeed
         * @param {eraseError} callback - call by erase tag error
         *
         * @example
         * // erase message from NFC tag
         * framework.nfcErase(
         *      function () {
         *          alert('Erase NFC Tag Success'); // erase success callback
         *      },
         *      function (err) {
         *          alert(err); // erase error callback with error message
         *      }
         * );
         */
        /**
         * Callback When Erasing NFC Message Succeed. ↑{@link NFC.nfcErase}
         * @callback eraseSuccess
         */
        /**
         * Callback When Erasing NFC Message Error. ↑{@link NFC.nfcErase}
         * @callback eraseError
         * @param {string} error - error message: NO_NFC, NFC_DISABLED, NO_TARGET
         */
        HtFramework.prototype.nfcErase = function (eraseSuccess, eraseError) {

            function error(err) {
                if(!err) { err = "NO_TARGET";} // check if null set NO_TARGET to callback
                eraseError(err);
            }

            nfc.erase(eraseSuccess, error);
        };

        /**
         * Start Sharing NDEF(NFC Data Exchange Format) Message via peer-to-peer. ↑{@link NFC}
         * @function nfcStartShareMessage
         * @memberof NFC
         *
         * @param ndefMessage
         * @param {shareSuccess} callback - call by sharing message succeed(another NFC device been triggered)
         * @param {startError} callback - call by starting share message error
         *
         * @example
         * // new message array contains NDEF records
         * var message = [
         *      framework.nfcNdefRecord.textType("hello by method"), // text NDEF record
         *      framework.nfcNdefRecord.mimeType("text/pg", "mime payload by method"), // MIME NDEF record
         *      framework.nfcNdefRecord.uriType("https://github.com/chariotsolutions/phonegap-nfc"), // uri NDEF record
         *      framework.nfcNdefRecord.androidApplicationRecord('com.hitrust.hiframework') // android application record
         * ];
         *
         * // share message via peer-to-peer
         * framework.nfcStartShareMessage(
         *      message,
         *      function () {
         *          alert('Share NFC Message Success'); // share succeed callback
         *      },
         *      function (err) {
         *          alert(err); // share error callback with error message
         *      }
         * );
         */
        /**
         * Callback When Sharing NFC Message to Another NFC Device Succeed. ↑{@link NFC.nfcStartShareMessage}
         * @callback shareSuccess
         */
        /**
         * Callback When Starting Share NFC Message Error. ↑{@link NFC.nfcStartShareMessage}
         * @callback startError
         * @param {string} error - error message: NO_NFC, NFC_DISABLED
         */
        HtFramework.prototype.nfcStartShareMessage = function (ndefMessage, shareSuccess, startError) {
            nfc.share(ndefMessage, shareSuccess, startError);
        };

        /**
         * Stop Sharing NDEF(NFC Data Exchange Format) Message via peer-to-peer. ↑{@link NFC}
         * @function nfcStopShareMessage
         * @memberof NFC
         *
         * @param {stopSuccess} callback - call by stop sharing message succeed
         * @param {stopError} callback - call by stop sharing message error
         *
         * @example
         * // stop sharing message
         * framework.nfcStopShareMessage(
         *      function () {
         *          alert('unShare NFC Message Success'); // stop sharing succeed callback
         *      },
         *      function (err) {
         *          alert(err); // stop sharing error callback with error message
         *      }
         * );
         */
        /**
         * Callback When Stop Sharing NFC Message Succeed. ↑{@link NFC.nfcStopShareMessage}
         * @callback stopSuccess
         */
        /**
         * Callback When Stop Sharing NFC Message Error. ↑{@link NFC.nfcStopShareMessage}
         * @callback stopError
         * @param {string} error - error message: NO_NFC, NFC_DISABLED
         */
        HtFramework.prototype.nfcStopShareMessage = function (stopSuccess, stopError) {
            nfc.unshare(stopSuccess, stopError);
        };

        /**
         * <ul>
         *   <li>[initLocalNotice]{@link LocalNotification.initLocalNotice}
         *   <li>[sendLocalNoticeByDelay]{@link LocalNotification.sendLocalNoticeByDelay}
         *   <li>[sendLocalNoticeByDate]{@link LocalNotification.sendLocalNoticeByDate}
         *   <li>[resetLocalNoticeBadge]{@link LocalNotification.resetLocalNoticeBadge}
         *   <li>[sortLocalNoticeBadge]{@link LocalNotification.sortLocalNoticeBadge}
         *   <li>[getLocalNotice]{@link LocalNotification.getLocalNotice}
         *   <li>[eventLocalNotice]{@link LocalNotification.eventLocalNotice}
         * </ul>
         *
         * @namespace LocalNotification
         * @author JE Wang <jewang@hitrust.com.tw>
         * @see
         * [cordova-plugin-local-notification]{@link https://github.com/willyboy/cordova-plugin-local-notifications}
         */

        /**
         * Initial Local Notification. ↑{@link LocalNotification}
         * @function initLocalNotice
         * @memberof LocalNotification
         *
         * @param {localNoticeStatusReq} callBack - get permission status response.
         */
        /**
         * Initial Local Notification Callback. ↑{@link LocalNotification.initLocalNotice}
         * @callback localNoticeStatusReq
         * @param {boolean} status - permission status
         */
        HtFramework.prototype.initLocalNotice = function (callBack) {
            switch(device.platform) {
                case "Android":
                    // get local notification permission
                    cordova.plugins.notification.local.hasPermission(callBack);
                    break;
                case "iOS":
                    // register local notification permission
                    cordova.plugins.notification.local.registerPermission(callBack);
                    break;
            }

            // clean local notification
            cordova.plugins.notification.local.cancelAll(function () {});
        };

        /**
         * send local notification after seconds. ↑{@link LocalNotification}
         * @function sendLocalNoticeByDelay
         * @memberof LocalNotification
         *
         * @param {int} delaySec - send notice after delay seconds
         * @param {int} id - set notice unique id for searching
         * @param {string} title - set notice title
         * @param {string} text - set notice text
         * @param {object} data - set notice data as an object
         * @example
         * // Send local notice after 5 seconds with id, title, text, data
         * framework.sendLocalNoticeByDelay(5, 1, 'notice title', 'first notice', {url:'/index.html'});
         */
        HtFramework.prototype.sendLocalNoticeByDelay = function(delaySec, id, title, text, data) {
            var now = new Date().getTime();
            var sendClock = new Date(now + (delaySec*1000));

            // Check notice count
            cordova.plugins.notification.local.getAll(
                function (notices) {
                    var badgeNum; // badge count
                    if(notices.length > 0) { // check sort & update notice badge
                        for(var i=0; i< notices.length; i++) {
                            if( sendClock.getTime() > (notices[i].at*1000) ) { // TODO: local notification bug need *1000
                                badgeNum = i+2;
                            }
                            else {
                                cordova.plugins.notification.local.update({
                                    id: notices[i].id,
                                    badge: i+2
                                });
                            }
                        }
                    }
                    else { // first notice
                        badgeNum = 1;
                    }

                    cordova.plugins.notification.local.schedule({
                        id: id,
                        title: title,
                        text: text,
                        at: sendClock,
                        badge: badgeNum,
                        data: data
                    });
                }
            );
        };

        /**
         * send local notification at date. ↑{@link LocalNotification}
         * @function sendLocalNoticeByDate
         * @memberof LocalNotification
         *
         * @param {date} date - send notice at date
         * @param {int} id - set notice unique id for searching
         * @param {string} title - set notice title
         * @param {string} text - set notice text
         * @param {object} data - set notice data as an object
         * @example
         * // Send local notice at 2015/11/10-11:27:0 with id, title, text, data
         * // (year:4 digits, month:0~11, day:1~31, hour:0~23, minute:0~59, second:0~59)
         * var date = new Date(2015, 10, 10, 11, 27, 0);
         * framework.sendLocalNoticeByDate(date, 1, 'notice title', 'first notice', {url:'/index.html'});
         */
        HtFramework.prototype.sendLocalNoticeByDate = function(date, id, title, text, data) {
            // Check notice count
            cordova.plugins.notification.local.getAll(
                function (notices) {
                    var badgeNum; // badge count
                    if(notices.length > 0) { // check sort & update notice badge
                        for(var i=0; i< notices.length; i++) {
                            if( date.getTime() > (notices[i].at*1000) ) { // TODO: local notification bug need *1000
                                badgeNum = i+2;
                            }
                            else {
                                badgeNum = i+1;
                                cordova.plugins.notification.local.update({
                                    id: notices[i].id,
                                    badge: i+2
                                });
                            }
                        }
                    }
                    else { // first notice
                        badgeNum = 1;
                    }

                    cordova.plugins.notification.local.schedule({
                        id: id,
                        title: title,
                        text: text,
                        at: date,
                        badge: badgeNum,
                        data: data
                    });
                }
            );
        };

        /**
         * reset notification badge. ↑{@link LocalNotification}
         * @function resetLocalNoticeBadge
         * @memberof LocalNotification
         *
         * @example
         * // listening 'click' event
         * framework.eventLocalNotice('click', function (notifications) {
         *      // popup message show notification's id which been clicked
         *      alert('click: '+notifications.id);
         *      // after notification cleared reset badge count
         *      framework.resetLocalNoticeBadge();
         * });
         */
        HtFramework.prototype.resetLocalNoticeBadge = function () {
            var scheduleNotice;
            switch(device.platform) {
                case "Android":
                    cordova.plugins.notification.local.getAll(
                        function (notices) {
                            if(notices.length > 0) {
                                // cancel all notices triggered
                                for(var i=0; i< notices.length; i++) {
                                    var nowTime = new Date().getTime();
                                    if((notices[i].at*1000)<nowTime) {
                                        cordova.plugins.notification.local.cancel(notices[i].id, function () {/*TODO:*/});
                                    }
                                }

                                // delay get all
                                setTimeout(function () {
                                    cordova.plugins.notification.local.getAll(
                                        function (notices) {
                                            scheduleNotice = notices;
                                            // re-sort badge
                                            if(scheduleNotice.length>0) {
                                                for (var i = 0; i < scheduleNotice.length; i++) {
                                                    if(i==0) { // set first one badge= 1
                                                        cordova.plugins.notification.local.update({
                                                            id: scheduleNotice[i].id,
                                                            badge: 1
                                                        });
                                                    }
                                                    else {
                                                        for(var j = 0; j < i; j++) {
                                                            if (scheduleNotice[i].at > scheduleNotice[j].at) {
                                                                cordova.plugins.notification.local.update({
                                                                    id: scheduleNotice[i].id,
                                                                    badge: j+2
                                                                });
                                                            }
                                                            else {
                                                                cordova.plugins.notification.local.update({
                                                                    id: scheduleNotice[i].id,
                                                                    badge: j+1
                                                                });
                                                                cordova.plugins.notification.local.update({
                                                                    id: scheduleNotice[j].id,
                                                                    badge: j+2
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    );
                                }, 500);
                            }
                            else {
                                // TODO:
                            }
                        }
                    );
                    break;
                case "iOS":
                    cordova.plugins.notification.local.getScheduled(
                        function (notices) {
                            scheduleNotice = notices;
                            cordova.plugins.notification.local.cancelAll(function () {/*TODO:*/});

                            // re-sort badge
                            if(scheduleNotice.length>0) {
                                for (var i = 0; i < scheduleNotice.length; i++) {
                                    scheduleNotice[i].at = (scheduleNotice[i].at*1000); // TODO: local notification bug need *1000
                                    if(i==0) { // set first one badge= 1
                                        scheduleNotice[i].badge = 1;
                                    }
                                    else {
                                        for(var j = 0; j < i; j++) {
                                            if (scheduleNotice[i].at > scheduleNotice[j].at) {
                                                scheduleNotice[i].badge = j+2;
                                            }
                                            else {
                                                scheduleNotice[i].badge = j+1;
                                                scheduleNotice[j].badge = j+2;
                                            }
                                        }
                                    }
                                }
                            }
                            // delay reset schedule
                            setTimeout(function () {
                                cordova.plugins.notification.local.schedule(scheduleNotice);
                            }, 500);
                        }
                    );
                    break;
            }
        };

        /**
         * re-sort notification badge. ↑{@link LocalNotification}
         * @function sortLocalNoticeBadge
         * @memberof LocalNotification
         *
         * @example
         * // re-sort notification's badges
         * framework.sortLocalNoticeBadge();
         */
        HtFramework.prototype.sortLocalNoticeBadge = function () {
            cordova.plugins.notification.local.getAll(
                function (notices) {
                    if(notices.length>0){
                        for(var i = 0; i < notices.length; i++) {
                            if(i==0) {
                                cordova.plugins.notification.local.update({
                                    id: notices[i].id,
                                    badge: 1
                                });
                            }
                            else {
                                for(var j = 0; j < i; j++) {
                                    if(notices[i].at > notices[j].at)
                                    {
                                        cordova.plugins.notification.local.update({
                                            id: notices[i].id,
                                            badge: j+2
                                        });
                                    }
                                    else {
                                        cordova.plugins.notification.local.update({
                                            id: notices[i].id,
                                            badge: j+1
                                        });
                                        cordova.plugins.notification.local.update({
                                            id: notices[j].id,
                                            badge: j+2
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            );
        };

        /**
         * get notification by id return jsonArray. ↑{@link LocalNotification}
         * @function getLocalNotice
         * @memberof LocalNotification
         *
         * @returns {objectArray} notifications - get all notice as array object.
         * @example
         * // get and check if notification's id is 1 then alert notification's text
         * var notices = framework.getLocalNotice();
         * for(var i=0; i<notifications.length; i++) {
         *      if(notifications[i].id == 1) {
         *          alert(notifications[i].text);
         *      }
         * }
         */
        HtFramework.prototype.getLocalNotice = function () {
            cordova.plugins.notification.local.getAll(
                function(notifications){
                    return notifications;
                }
            );
        };

        /**
         * local notification event listener. ↑{@link LocalNotification}
         * @function eventLocalNotice
         * @memberof LocalNotification
         *
         * @param {string} event - 'clcik', 'trigger', 'clear', 'clearall', 'cancel', 'cancelall'
         * @param {localNoticeEventReq} callback
         * @param {Object} scope - The callback function's scope (container visibility)
         * @example
         * // listening 'click' event
         * framework.eventLocalNotice('click', function (notifications) {
         *      // popup message show notification's id which been clicked
         *      alert('click: '+notifications.id);
         *      // after notification cleared reset badge count
         *      framework.resetLocalNoticeBadge();
         * });
         */
        /**
         * Initial Local Notification Callback. ↑{@link LocalNotification.eventLocalNotice}
         * @callback localNoticeEventReq
         * @param {object} notification - get notification that been triggered
         */
        HtFramework.prototype.eventLocalNotice = function (event, callback, scope) {
            cordova.plugins.notification.local.on(event, callback, scope);
        };

        /**
         * <ul>
         *   <li>[startListenBeacon]{@link iBeacon.startListenBeacon}
         * </ul>
         *
         * iBeacon Scan Rate
         * <table border="1px">
         *      <tr><th>Scan Type</th><th>Max time to detect a region change</th></tr>
         *       <tr><td> Ranging </td><td> 1 second </td></tr>
         *      <tr><td> Monitoring </td><td> up to 15 minutes </td></tr>
         * </table>
         *
         * @namespace iBeacon
         * @author JE Wang <jewang@hitrust.com.tw>
         * @see
         * [cordova-plugin-ibeacon]{@link https://github.com/petermetz/cordova-plugin-ibeacon}
         */

        /**
         * Start ranging and monitoring iBeacon devices. ↑{@link iBeacon}
         * @function startListenBeacon
         * @memberof iBeacon
         *
         * @param {array} devicesUUIDs - device's uuid for scanning filter
         * @param {rangBeaconReq} callback - high speed scan full information from devices only works in the foreground
         * @param {monitorBeaconReq} callback - low speed scan devices in/out state works in the foreground, background
         */
        /**
         * Callback when iBeacon devices been scanned. ↑{@link iBeacon.startListenBeacon}
         * @callback rangBeaconReq
         * @param {object} beaconInfo - uuid, major, minor, proximity, rssi, tx, accuracy, timeStamp
         */
        /**
         * Callback when iBeacon devices into scan range or out of scan range. ↑{@link iBeacon.startListenBeacon}
         * @callback monitorBeaconReq
         * @param {boolean} state - into scan range or out of scan range
         */
        HtFramework.prototype.startListenBeacon = function (devicesUUIDs, rangCallback, monitorCallback) {
            var delegate = new cordova.plugins.locationManager.Delegate();

            // Called continuously when ranging beacons.
            delegate.didRangeBeaconsInRegion = function(pluginResult)
            {
                //alert('Rang: '+JSON.stringify(pluginResult));
                rangCallback(pluginResult.beacons);
            };

            // Called continuously when monitoring beacons.
            delegate.didStartMonitoringForRegion = function(pluginResult)
            {
                //console.log('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
            };

            // Called continuously when determine state beacons.
            delegate.didDetermineStateForRegion = function(pluginResult)
            {
                var stateResult;
                if(pluginResult.state == 'CLRegionStateInside') {
                    stateResult = 1;
                }else{
                    stateResult = 0;
                }
                monitorCallback(stateResult);
            };

            // Set the delegate object to use.
            cordova.plugins.locationManager.setDelegate(delegate);

            // Request permission from user to access location info.
            // This is needed on iOS 8.
            cordova.plugins.locationManager.requestAlwaysAuthorization();

            // Start monitoring and ranging beacons.
            for (var i in devicesUUIDs)
            {
                var id = parseInt(i)+1;
                var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
                    id.toString(),
                    devicesUUIDs[i]);

                // Start monitoring.
                cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
                    .fail(console.error)
                    .done();

                // Start ranging.
                cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
                    .fail(console.error)
                    .done();
            }
        };

        /**
         * <ul>
         *   <li>[syncLocalInit]{@link Sync.syncLocalInit}
         *   <li>[syncRemoteVersion]{@link Sync.syncRemoteVersion}
         * </ul>
         *
         * @namespace Sync
         * @author JE Wang <jewang@hitrust.com.tw>
         */

        /**
         * Sync Initial Check File System. ↑{@link Sync}
         * @function syncLocalInit
         * @memberof Sync
         *
         * @param {syncLocalOK} callback - call by sync local initial ok
         * @param {syncLocalFail} callback - call by sync local initial fail
         */
        /**
         * Callback when sync local initial ok. ↑{@link Sync.syncLocalInit}
         * @callback syncLocalOK
         */
        /**
         * Callback when sync local initial fail. ↑{@link Sync.syncLocalInit}
         * @callback syncLocalFail
         */
        HtFramework.prototype.syncLocalInit = function(syncLocalOK, syncLocalFail) {
            window.resolveLocalFileSystemURL(uri, // data localpath
                function(wwwEntry){
                    syncLocalFail();
                },
                function(errorMsg){ // Data Directory Not Exist
                    // Device paltform filter
                    switch(device.platform) {
                        case "Android":
                            window.resolveLocalFileSystemURL(cordova.file.applicationDirectory+'www/src_A.zip', // get src.zip
                                function(srcEntry)
                                {
                                    window.resolveLocalFileSystemURL(cordova.file.dataDirectory,
                                        function(dirEntry)
                                        {
                                            //alert(dirEntry.toURL());
                                            srcEntry.copyTo(dirEntry, 'src.zip',
                                                function()
                                                {
                                                    zip.unzip(cordova.file.dataDirectory+"src.zip", cordova.file.dataDirectory,
                                                        function(){
                                                            setTimeout(function() {
                                                                this.redirect(cordova.file.dataDirectory+"www/index.html#/home", true);
                                                                syncLocalOK();
                                                            }, 500);
                                                        }
                                                    );
                                                },
                                                function(errorMsg){}//alert("copy: "+errorMsg.code);}
                                            );
                                        },
                                        function(errorMsg){}//alert("target: "+errorMsg.code);}
                                    );
                                },
                                function(errorMsg){}//alert("src: "+errorMsg.code);}
                            );
                            break;
                        case "iOS":
                            zip.unzip(cordova.file.applicationDirectory+'www/src_I.zip', cordova.file.dataDirectory,
                                function(){
                                    setTimeout(function() {
                                        this.redirect(cordova.file.dataDirectory+"www/index.html#/home", true);
                                        syncLocalOK();
                                    }, 500);
                                }
                            );
                            break;
                        default:
                        // TODO: 待確認
                    }
                }
            );
        };

        /**
         * Sync Initial Check File System. ↑{@link Sync}
         * @function syncRemoteVersion
         * @memberof Sync
         *
         * @param {syncRemoteOK} callback - call by sync remote version ok
         * @param {syncRemoteFail} callback - call by sync remote version fail
         */
        /**
         * Callback when sync remote version ok. ↑{@link Sync.syncRemoteVersion}
         * @callback syncRemoteOK
         */
        /**
         * Callback when sync remote version fail. ↑{@link Sync.syncRemoteVersion}
         * @callback syncRemoteFail
         * @param {string} errorMsg - "TRANSFER_ERROR", "SYNC_ERROR", "NO_PATCH", "TELEGRAM_ERROR"
         */
//20160701因弱掃有問題且專案不會用到所以註解掉
//        HtFramework.prototype.syncRemoteVersion = function(syncRemoteOK, syncRemoteFail) {
//            var localVer;
//            var patchUrl, patchVer;
//            //alert(history.length);
//            /*
//             * 送APP版號到中台 若不是最新版號 中台回覆更新檔連結 利用cordova plugin contentsync 取得更新的patch
//             * zip檔 解壓所更新檔案
//             */
//
//             // Get Local Version
//             var getLocalVer = function () {
//                 var jsonObjLco = this.loadXMLDoc(cordova.file.dataDirectory+'www/modules/common/about.xml');
//                 localVer = jsonObjLco.About.Release;
//             };
//
//             // telegram response
//             var success = function(xmlObject) {
//                 telegram.setOffLine(true); // telegram local
//
//                 var response = xmlObject.MNBResponse;
//                 patchVer = response.result.patchFileVer.__text;
//                 patchUrl = response.result.patchFileUrl.__text;
//
//                 //alert(patchVer);
//                 //alert(patchUrl);
//
//                 if(patchVer > localVer) {
//
//                     switch(device.platform) {
//                         case "Android":
//                             var fileTransfer = new FileTransfer();
//                             fileTransfer.download(encodeURI(patchUrl), cordova.file.dataDirectory+"www.zip",
//                             function(entry) {
//                                zip.unzip(entry.toURL(), cordova.file.dataDirectory,
//                                    function(){
//                                        setTimeout(function() {
//                                            navigator.app.clearCache(); // clear cache
//                                            this.redirect(cordova.file.dataDirectory+"www/index.html#/home", true);
//                                            syncRemoteOK();
//                                        }, 500);
//                                    }
//                                );
//                             },
//                             function(error) {
//                                 setTimeout(function() {
//                                     navigator.app.clearCache(); // clear cache
//                                     this.redirect(cordova.file.dataDirectory+"www/index.html#/home", true);
//                                     syncRemoteFail("TRANSFER_ERROR");
//                                 }, 500);
//                             }
//                             );
//                             break;
//                         case "iOS":
//                             var sync = ContentSync.sync({ src: patchUrl, id: 'NoCloud', type: 'merge' });
//                             sync.on('progress', function(data) {
//                             });
//
//                             sync.on('complete', function(data) {
//                                console.log(data.localPath);
//                                setTimeout(function() {
//                                    this.redirect(cordova.file.dataDirectory+"www/index.html#/home", true);
//                                    syncRemoteOK();
//                                }, 500);
//                             });
//
//                             sync.on('error', function(e) {
//                                console.log('Error: ', e.message);
//                                 syncRemoteFail("SYNC_ERROR");
//                             });
//
//                             sync.on('cancel', function() {
//                             });
//                             break;
//                         default:
//                         // TODO: 待確認
//                     }
//                 }else {
//                     setTimeout(function() {
//                         if(device.platform == "Android") {
//                            navigator.app.clearCache(); // clear cache
//                         }
//                         this.redirect(cordova.file.dataDirectory+"www/index.html#/home", true);
//                         syncRemoteFail("NO_PATCH");
//                     }, 500);
//                 }
//             };
//
//             // telegram fail
//             var error = function() {
//                 telegram.setOffLine(true); // telegram local
//
//                 setTimeout(function() {
//                     if(device.platform == "Android") {
//                        navigator.app.clearCache(); // clear cache
//                     }
//                     this.redirect(cordova.file.dataDirectory+"www/index.html#/home", true);
//                     syncRemoteFail("TELEGRAM_ERROR");
//                 }, 500);
//             };
//
//
//             // Patch Version Check
//             var CheckPatch = function () {
//                 telegram.setOffLine(false); // telegram remote
//
//                 getLocalVer(); // get current local version
//
//                 var jsonObj = framework.loadXMLDoc('message/templates/F0000req.xml'); // get object from temp
//                 jsonObj.MNBRequest.body.version = localVer; // set current value to object
//                 telegram.send(jsonObj, success, error); // send telegram
//             };
//
//             CheckPatch();
//        };

        /**
         * <ul>
         *   <li>[cryptoHandshake]{@link Crypto.cryptoHandshake}
         *   <li>[cryptoExchangeKey]{@link Crypto.cryptoExchangeKey}
         *   <li>[cryptoMD5]{@link Crypto.cryptoMD5}
         *   <li>[cryptoSHA1]{@link Crypto.cryptoSHA1}
         *   <li>[cryptoSHA256]{@link Crypto.cryptoSHA256}
         *   <li>[cryptoAES_Encrypt]{@link Crypto.cryptoAES_Encrypt}
         *   <li>[cryptoAES_Decrypt]{@link Crypto.cryptoAES_Decrypt}
         * </ul>
         *
         * @namespace Crypto
         * @author Austin Chen <austinchen@hitrust.com.tw>
         */

        /**
         * Start Handshake. ↑{@link Crypto}
         * @function cryptoHandshake
         * @memberof Crypto
         *
         * @param {string} base64Text - auth string from server
         * @param {handshakeSuccess} callback - call by handshake succeed
         * @param {handshakeError} callback - call by handshake error
         */
        /**
         * Callback when handshake succeed. ↑{@link Crypto.cryptoHandshake}
         * @callback handshakeSuccess
         * @param {object}  jsonObject - attr1:value(string), attr2:error(int)
         */
        /**
         * Callback when handshake error. ↑{@link Crypto.cryptoHandshake}
         * @callback handshakeError
         * @param {object} jsonObject - attr1:message(string), attr2:error(int)
         */
        HtFramework.prototype.cryptoHandshake = function(base64Text, handshakeSuccess, handshakeError) {
            plugin.crypto.Handshake(base64Text, handshakeSuccess, handshakeError);
        };

        /**
         * Start Exchange Key. ↑{@link Crypto}
         * @function cryptoExchangeKey
         * @memberof Crypto
         *
         * @param {string} publicKey - pem format publice key from server
         * @param {exchangeKeySuccess} callback - call by exchange key succeed
         * @param {exchangeKeyError} callback - call by exchange key error
         */
        /**
         * Callback when exchange key succeed. ↑{@link Crypto.cryptoExchangeKey}
         * @callback exchangeKeySuccess
         * @param {object}  jsonObject - attr1:value(string), attr2:error(int)
         */
        /**
         * Callback when exchange key error. ↑{@link Crypto.cryptoExchangeKey}
         * @callback exchangeKeyError
         * @param {object} jsonObject - attr1:message(string), attr2:error(int)
         */
        HtFramework.prototype.cryptoExchangeKey = function(publicKey, exchangeKeySuccess, exchangeKeyError) {
            plugin.crypto.ExchangeKey(publicKey, exchangeKeySuccess, exchangeKeyError);
        };

        /**
         * Start MD5 Encrypt. ↑{@link Crypto}
         * @function cryptoMD5
         * @memberof Crypto
         *
         * @param {string} text - encrypt source
         * @param {MD5_Success} callback - call by md5 encrypt succeed
         * @param {MD5_Error} callback - call by md5 encrypt error
         */
        /**
         * Callback when md5 encrypt succeed. ↑{@link Crypto.cryptoMD5}
         * @callback MD5_Success
         * @param {object} jsonObject - attr1:value(string), attr2:error(int)
         */
        /**
         * Callback when md5 encrypt error. ↑{@link Crypto.cryptoMD5}
         * @callback MD5_Error
         * @param {object} jsonObject - attr1:message(string), attr2:error(int)
         */
        HtFramework.prototype.cryptoMD5 = function(text, MD5_Success, MD5_Error) {
            plugin.crypto.MD5(text, MD5_Success, MD5_Error);
        };

        /**
         * Start SHA1 Encrypt. ↑{@link Crypto}
         * @function cryptoSHA1
         * @memberof Crypto
         *
         * @param {string} text - encrypt source
         * @param {SHA1_Success} callback - call by sha1 encrypt succeed
         * @param {SHA1_Error} callback - call by sha1 encrypt error
         */
        /**
         * Callback when sha1 encrypt succeed. ↑{@link Crypto.cryptoSHA1}
         * @callback SHA1_Success
         * @param {object} jsonObject - attr1:value(string), attr2:error(int)
         */
        /**
         * Callback when sha1 encrypt error. ↑{@link Crypto.cryptoSHA1}
         * @callback SHA1_Error
         * @param {object} jsonObject - attr1:message(string), attr2:error(int)
         */
        HtFramework.prototype.cryptoSHA1 = function(text, SHA1_Success, SHA1_Error) {
            plugin.crypto.SHA1(text, SHA1_Success, SHA1_Error);
        };

        /**
         * Start SHA256 Encrypt. ↑{@link Crypto}
         * @function cryptoSHA256
         * @memberof Crypto
         *
         * @param {string} text - encrypt source
         * @param {SHA256_Success} callback - call by sha256 encrypt succeed
         * @param {SHA256_Error} callback - call by sha256 encrypt error
         */
        /**
         * Callback when sha256 encrypt succeed. ↑{@link Crypto.cryptoSHA256}
         * @callback SHA256_Success
         * @param {object} jsonObject - attr1:value(string), attr2:error(int)
         */
        /**
         * Callback when sha256 encrypt error. ↑{@link Crypto.cryptoSHA256}
         * @callback SHA256_Error
         * @param {object} jsonObject - attr1:message(string), attr2:error(int)
         */
        HtFramework.prototype.cryptoSHA256 = function(text, SHA256_Success, SHA256_Error) {
            plugin.crypto.SHA256(text, SHA256_Success, SHA256_Error);
        };

        /**
         * Start AES encrypt. ↑{@link Crypto}
         * @function cryptoAES_Encrypt
         * @memberof Crypto
         *
         * @param {string} keyLabel - key
         * @param {string} text - encrypt source
         * @param {AES_Encrypt_Success} callback - call by AES encrypt succeed
         * @param {AES_Encrypt_Error} callback - call by AES encrypt error
         */
        /**
         * Callback when AES encrypt succeed. ↑{@link Crypto.cryptoAES_Encrypt}
         * @callback AES_Encrypt_Success
         * @param {object} jsonObject - attr1:value(string), attr2:error(int)
         */
        /**
         * Callback when AES encrypt error. ↑{@link Crypto.cryptoAES_Encrypt}
         * @callback AES_Encrypt_Error
         * @param {object} jsonObject - attr1:message(string), attr2:error(int)
         */
        HtFramework.prototype.cryptoAES_Encrypt = function(keyLabel, text, AES_Encrypt_Success, AES_Encrypt_Error) {
            plugin.crypto.AES_Encrypt(keyLabel, text, AES_Encrypt_Success, AES_Encrypt_Error);
        };

        /**
         * Start AES decrypt. ↑{@link Crypto}
         * @function cryptoAES_Decrypt
         * @memberOf Crypto
         *
         * @param {string} keyLabel - key
         * @param {string} text - decrypt source
         * @param {AES_Decrypt_Success} callback - call by AES decrypt succeed
         * @param {AES_Decrypt_Error} callback - call by AES decrypt error
         */
        /**
         * Callback when AES decrypt succeed. ↑{@link Crypto.cryptoAES_Decrypt}
         * @callback AES_Decrypt_Success
         * @param {object} jsonObject - attr1:value(string), attr2:error(int)
         */
        /**
         * Callback when AES decrypt error. ↑{@link Crypto.cryptoAES_Decrypt}
         * @callback AES_Decrypt_Error
         * @param {object} jsonObject - attr1:message(string), attr2:error(int)
         */
        HtFramework.prototype.cryptoAES_Decrypt = function(keyLabel, text, AES_Decrypt_Success, AES_Decrypt_Error) {
            plugin.crypto.AES_Decrypt(keyLabel, text, AES_Decrypt_Success, AES_Decrypt_Error);
        };

        /**
         * Start Protecting Password. ↑{@link Crypto}
         * @function cryptoProtectPassword
         * @memberOf Crypto
         *
         * @param {string} password - password source
         * @param {string} randomNum - random number
         * @param {Protect_Success} callback - call by protecting password succeed
         * @param {Protect_Error} callback - call by protecting password error
         */
        /**
         * Callback when protecting password succeed. ↑{@link Crypto.cryptoProtectPassword}
         * @callback Protect_Success
         * @param {object} jsonObject - attr1:value(string), attr2:error(int)
         */
        /**
         * Callback when protecting password error. ↑{@link Crypto.cryptoProtectPassword}
         * @callback Protect_Error
         * @param {object} jsonObject - attr1:message(string), attr2:error(int)
         */
        HtFramework.prototype.cryptoProtectPassword = function(publickey, randomNum, Protect_Success, Protect_Error) {

            //// Convert resule.value string to JSON object
            //function success(result){
            //    var obj = JSON.parse(result.value);
            //    Protect_Success(obj);
            //}

            plugin.crypto.ProtectPassword(publickey, randomNum+'', Protect_Success, Protect_Error);
        };

        /**
         *
         * @namespace Root_JB_Detector
         * @author JE Wang <jewang@hitrust.com.tw>
         * @see
         * [ROOT]{@link https://github.com/trykovyura/cordova-plugin-root-detection}
         * @see
         * [JB]{@link https://github.com/leecrossley/cordova-plugin-jailbreak-detection}
         *
         */
        HtFramework.prototype.checkRootJB = function(checkSuccessCallback, checkErrorCallback){

            if(device.platform === "Android"){ // android check root
                rootdetection.isDeviceRooted(checkSuccessCallback, checkErrorCallback);
            }else if(device.platform === "iOS"){ // ios check JB
                jailbreakdetection.isJailbroken(checkSuccessCallback, checkErrorCallback);
            }else{ // other platform
                var errorMsg = "platform error!!!"
                checkErrorCallback(errorMsg);
            }

        };

        /**
         * 
         */
        HtFramework.prototype.confirm = function(message, callback, title){
            if(title==null){
                title='訊息';
            }
            if (navigator.notification && navigator.notification.confirm){
                navigator.notification.confirm(
                message, // message
                function(buttonIndex) {
                    if (buttonIndex === 2) {
                        if(callback){
                            callback(true);
                        }
                    } else {
                        if(callback){
                            callback(false);
                        }
                    }
                },
                title,
                ['取消', '確定']);
            } else {
                if (confirm(message)){
                    if(callback){
                        callback(true);
                    }
                } else {
                    if(callback){
                        callback(false);
                    }
                }
            }
        }

        
        
        /**
         * 
         */
        HtFramework.prototype.alert = function(message, callback,  title){
            if(title==null){
                title='訊息';
            }
            if (navigator.notification && navigator.notification.alert){
                navigator.notification.alert( message, 
                    callback, 
                    title, 
                    '確定');
            } else {
                alert(message);
                callback();
            }
        }

        /**
         * 開放截圖
         */
        HtFramework.prototype.enabledScreenshotPrevention = function (success, error) {
            OurCodeWorldpreventscreenshots.enable(success, error);
        }

        /**
         * 禁止截圖
         */
        HtFramework.prototype.disabledScreenshotPrevention = function (success, error) {
            OurCodeWorldpreventscreenshots.disable(success, error);
        }

        /**
         * <ul>
         *   <li>
         * </ul>
         *
         * @namespace MobileFirst
         * @author JE Wang <jewang@hitrust.com.tw>
         */

        HtFramework.prototype.MFP = {
            /**
             * Set MobileFirst Device ID to Http Request Header.
             * @function setDeviceID2Header
             * @memberof MobileFirst
             */
            webRequest : function (url, method, timeout) {

                return new WLResourceRequest(url, method, timeout);

            },
            webRequestMethod : {
                GET : 'GET',
                POST : 'POST',
                DELETE : 'DELETE',
                HEAD : 'HEAD',
                OPTIONS : 'OPTIONS',
                TRACE : 'TRACE',
                CONNECT : 'CONNECT'
            },

            connectMFServer : function (connectSuccess, connectFailure) {
                WL.Client.connect({onSuccess: connectSuccess, onFailure: connectFailure});
            },

            getDeviceID : function (getSuccess, getFailure) {

                return WL.Device.getID({onSuccess: getSuccess, onFailure: getFailure});
            }

        };

        // Create a new instance and return
        return new HtFramework();
    }
);
