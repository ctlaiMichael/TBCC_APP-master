/**
 * 讀取XML並轉成json
 */
(function ($, undefined) {
    'use strict';
    var mainClass = function (config) {

        // XML解析使用設定
        var DOMNodeTypes = {
            ELEMENT_NODE: 1,
            TEXT_NODE: 3,
            CDATA_SECTION_NODE: 4,
            COMMENT_NODE: 8,
            DOCUMENT_NODE: 9
        };
        // XML解析使用設定
        config = config || {};
        initConfigDefaults();
        initRequiredPolyfills();


        function initConfigDefaults() {
            if (config.escapeMode === undefined) {
                config.escapeMode = true;
            }
            config.attributePrefix = config.attributePrefix || "_";
            config.arrayAccessForm = config.arrayAccessForm || "none";
            config.emptyNodeForm = config.emptyNodeForm || "text";
            if (config.enableToStringFunc === undefined) {
                config.enableToStringFunc = true;
            }
            config.arrayAccessFormPaths = config.arrayAccessFormPaths || [];
            if (config.skipEmptyTextNodesForObj === undefined) {
                config.skipEmptyTextNodesForObj = true;
            }
            if (config.stripWhitespaces === undefined) {
                config.stripWhitespaces = true;
            }
            config.datetimeAccessFormPaths = config.datetimeAccessFormPaths || [];

            if (config.useDoubleQuotes === undefined) {
                config.useDoubleQuotes = false;
            }
        }

        function initRequiredPolyfills() {
            function pad(number) {
                var r = String(number);
                if (r.length === 1) {
                    r = '0' + r;
                }
                return r;
            }
            // Hello IE8-
            if (typeof String.prototype.trim !== 'function') {
                String.prototype.trim = function () {
                    return this.replace(/^\s+|^\n+|(\s|\n)+$/g, '');
                }
            }
            if (typeof Date.prototype.toISOString !== 'function') {
                // Implementation from http://stackoverflow.com/questions/2573521/how-do-i-output-an-iso-8601-formatted-string-in-javascript
                Date.prototype.toISOString = function () {
                    return this.getUTCFullYear()
                        + '-' + pad(this.getUTCMonth() + 1)
                        + '-' + pad(this.getUTCDate())
                        + 'T' + pad(this.getUTCHours())
                        + ':' + pad(this.getUTCMinutes())
                        + ':' + pad(this.getUTCSeconds())
                        + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                        + 'Z';
                };
            }
        }


        /**
         * XML to JSON
         * @param {*} node xml Obj
         * @param {*} path 
         */
        function parseDOMChildren(node, path) {
            if (node.nodeType == DOMNodeTypes.DOCUMENT_NODE) {
                var result = new Object;
                var nodeChildren = node.childNodes;
                // Alternative for firstElementChild which is not supported in some environments
                for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
                    var child = nodeChildren.item(cidx);
                    if (child.nodeType == DOMNodeTypes.ELEMENT_NODE) {
                        var childName = getNodeLocalName(child);
                        result[childName] = parseDOMChildren(child, childName);
                    }
                }
                return result;
            }
            else
                if (node.nodeType == DOMNodeTypes.ELEMENT_NODE) {
                    var result = new Object;
                    result.__cnt = 0;

                    var nodeChildren = node.childNodes;

                    // Children nodes
                    for (var cidx = 0; cidx < nodeChildren.length; cidx++) {
                        var child = nodeChildren.item(cidx); // nodeChildren[cidx];
                        var childName = getNodeLocalName(child);

                        if (child.nodeType != DOMNodeTypes.COMMENT_NODE) {
                            result.__cnt++;
                            if (result[childName] == null) {
                                result[childName] = parseDOMChildren(child, path + "." + childName);
                                toArrayAccessForm(result, childName, path + "." + childName);
                            }
                            else {
                                if (result[childName] != null) {
                                    if (!(result[childName] instanceof Array)) {
                                        result[childName] = [result[childName]];
                                        toArrayAccessForm(result, childName, path + "." + childName);
                                    }
                                }
                                (result[childName])[result[childName].length] = parseDOMChildren(child, path + "." + childName);
                            }
                        }
                    }

                    // Attributes
                    for (var aidx = 0; aidx < node.attributes.length; aidx++) {
                        var attr = node.attributes.item(aidx); // [aidx];
                        result.__cnt++;
                        result[config.attributePrefix + attr.name] = attr.value;
                    }

                    // Node namespace prefix
                    var nodePrefix = (typeof node.prefix !== 'undefined') ? node.prefix : null;
                    if (nodePrefix != null && nodePrefix != "") {
                        result.__cnt++;
                        result.__prefix = nodePrefix;
                    }

                    if (result["#text"] != null) {
                        result.__text = result["#text"];
                        if (result.__text instanceof Array) {
                            result.__text = result.__text.join("\n");
                        }
                        //if(config.escapeMode)
                        //	result.__text = unescapeXmlChars(result.__text);
                        if (config.stripWhitespaces)
                            result.__text = result.__text.trim();
                        delete result["#text"];
                        if (config.arrayAccessForm == "property")
                            delete result["#text_asArray"];
                        result.__text = checkFromXmlDateTimePaths(result.__text, childName, path + "." + childName);
                    }
                    if (result["#cdata-section"] != null) {
                        result.__cdata = result["#cdata-section"];
                        delete result["#cdata-section"];
                        if (config.arrayAccessForm == "property")
                            delete result["#cdata-section_asArray"];
                    }

                    if (result.__cnt == 1 && result.__text != null) {
                        result = result.__text;
                    }
                    else
                        if (result.__cnt == 0 && config.emptyNodeForm == "text") {
                            result = '';
                        }
                        else
                            if (result.__cnt > 1 && result.__text != null && config.skipEmptyTextNodesForObj) {
                                if ((config.stripWhitespaces && result.__text == "") || (result.__text.trim() == "")) {
                                    delete result.__text;
                                }
                            }
                    delete result.__cnt;

                    if (config.enableToStringFunc && (result.__text != null || result.__cdata != null)) {
                        result.toString = function () {
                            return (this.__text != null ? this.__text : '') + (this.__cdata != null ? this.__cdata : '');
                        };
                    }

                    return result;
                }
                else
                    if (node.nodeType == DOMNodeTypes.TEXT_NODE || node.nodeType == DOMNodeTypes.CDATA_SECTION_NODE) {
                        return node.nodeValue;
                    }
        }

        // xml解析使用
        function getNodeLocalName(node) {
            var nodeLocalName = node.localName;
            if (nodeLocalName == null) // Yeah, this is IE!!
                nodeLocalName = node.baseName;
            if (nodeLocalName == null || nodeLocalName == "") // =="" is IE too
                nodeLocalName = node.nodeName;
            return nodeLocalName;
        }


        // xml解析使用
        function toArrayAccessForm(obj, childName, path) {
            switch (config.arrayAccessForm) {
                case "property":
                    if (!(obj[childName] instanceof Array))
                        obj[childName + "_asArray"] = [obj[childName]];
                    else
                        obj[childName + "_asArray"] = obj[childName];
                    break;
                /*case "none":
                 break;*/
            }

            if (!(obj[childName] instanceof Array) && config.arrayAccessFormPaths.length > 0) {
                var idx = 0;
                for (; idx < config.arrayAccessFormPaths.length; idx++) {
                    var arrayPath = config.arrayAccessFormPaths[idx];
                    if (typeof arrayPath === "string") {
                        if (arrayPath == path)
                            break;
                    }
                    else
                        if (arrayPath instanceof RegExp) {
                            if (arrayPath.test(path))
                                break;
                        }
                        else
                            if (typeof arrayPath === "function") {
                                if (arrayPath(obj, childName, path))
                                    break;
                            }
                }
                if (idx != config.arrayAccessFormPaths.length) {
                    obj[childName] = [obj[childName]];
                }
            }
        }


        function checkFromXmlDateTimePaths(value, childName, fullPath) {
            if (config.datetimeAccessFormPaths.length > 0) {
                var path = fullPath.split("\.#")[0];
                var idx = 0;
                for (; idx < config.datetimeAccessFormPaths.length; idx++) {
                    var dtPath = config.datetimeAccessFormPaths[idx];
                    if (typeof dtPath === "string") {
                        if (dtPath == path)
                            break;
                    }
                    else
                        if (dtPath instanceof RegExp) {
                            if (dtPath.test(path))
                                break;
                        }
                        else
                            if (typeof dtPath === "function") {
                                if (dtPath(obj, childName, path))
                                    break;
                            }
                }
                if (idx != config.datetimeAccessFormPaths.length) {
                    return fromXmlDateTime(value);
                }
                else
                    return value;
            }
            else
                return value;
        }


        /**
         * 讀取xml
         * @param {*} filename xml名稱
         */
        this.loadXMLDocFromFile = function (filename) {
            // console.log('===> start', 'loadXMLDocFromFile');
            var xhttp;
            if (window.XMLHttpRequest) {
                xhttp = new XMLHttpRequest();
            }
            else // code for IE5 and IE6
            {
                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
            if (typeof filename === 'undefined' || !filename || filename == '') {
                filename = 'config';
            }
            var path = this.filePath + filename + '.xml';

            xhttp.open("GET", path, false);
            xhttp.send();
            // console.log('===> start', 'loadXMLDocFromFile send');
            return xhttp.responseXML;
        };

        /**
         * 轉換xml to josn
         * @param {*} xmlDoc 
         */
        this.convertXml2JSon = function (xmlDoc) {
            var output = {
                state: false,
                data: {},
                msg: ''
            };
            // console.log(typeof xmlDoc, xmlDoc);
            if (typeof xmlDoc !== 'object') {
                output.msg = '讀取XML失敗';
                return output;
            }

            var responseObj = parseDOMChildren(xmlDoc);
            if (typeof responseObj !== 'object') {
                output.msg = '資料解析失敗';
                return output;
            }
            output.state = true;
            output.data = responseObj;

            return output;
        };

    }
    mainClass.prototype.filePath = 'resource/'; // xml路徑宣告
    mainClass.prototype.cacheData = {}; // 解析完的暫存


    /**
     * 讀取xml檔案，並轉成json格式
     * @param {*} filename 
     */
    mainClass.prototype.load = function (filename, name, showtype) {
        var output = {
            state: false,
            data: {},
            msg: ''
        };
        var jsonObj = {};
        if (typeof this.cacheData[filename] !== 'undefined') {
            jsonObj = JSON.parse(JSON.stringify(this.cacheData[filename]));
        } else {
            // console.log('===> start');
            var xmlObj = this.loadXMLDocFromFile(filename);
            var responseObj = this.convertXml2JSon(this.loadXMLDocFromFile(filename));
            // console.log('===> end', responseObj);
            if (!responseObj.state) {
                output.msg = responseObj.msg;
                output.msg = '資料解析失敗';
                return output;
            }
            if (typeof responseObj.data !== 'object') {
                output.msg = '資料解析失敗';
                return output;
            }
            jsonObj = responseObj.data;
            if (typeof jsonObj[filename.toUpperCase()] !== 'undefined') {
                jsonObj = jsonObj[filename.toUpperCase()];
            }
            this.cacheData[filename] = JSON.parse(JSON.stringify(jsonObj));
        }

        if (typeof name === 'string') {
            output.data = (typeof jsonObj[name] !== 'undefined') ? jsonObj[name] : '';
        } else {
            output.data = jsonObj;
        }
        // Blooean回傳
        if (typeof showtype !== 'undefined' && showtype === 'B') {
            var flag = false;
            if (output.data && output.data !== 'false' && output.data !== 'null') {
                flag = true;
            }
            output.data = flag;
        }

        output.state = true;
        return output;
    };


    window.ReadXml = new mainClass();
})(jQuery, window, document);
