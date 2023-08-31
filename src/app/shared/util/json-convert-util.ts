import { ReqHeader } from '@base/api/model/req-header';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { logger } from '@shared/util/log-util';

const getPrefix = (resultType: string): string => {
    if (!!resultType) {
        return resultType.substring(0, resultType.indexOf(':'));
    } else {
        throw new Error('Error');
    }
};
const removePrefix = (json: any, prefix: string) => {
    const data = {};

    // tslint:disable-next-line:forin
    for (const key in json) {
        const new_key = key.replace(prefix, '');
        const sub_data = json[key];
        if (Array.isArray(sub_data)) {
            data[new_key] = sub_data.map((item) => removePrefix(item, prefix));
        } else if (typeof sub_data === 'object' && sub_data !== null) {
            data[new_key] = removePrefix(sub_data, prefix);
        } else {
            data[new_key] = sub_data;
        }

    }
    return data;
};
const parseResult = (result: any) => {
    const resultType = result['@xsi:type'];
    const prefix = getPrefix(resultType);
    const xmlns = '@xmlns:' + prefix;
    delete result['@xsi:type'];
    delete result['@xmlns:' + prefix];
    return removePrefix(result, prefix + ':');
};
const parseFailure = (failure: any) => {
    const data = {};
    data['result'] = '1';
    data['respCodeMsg'] = 'MSG_FORMATE_ERROR';
    data['codeFromPlaceNameIs'] = '';
    data['respCode'] = '';
    if (failure.hasOwnProperty('certCheck')) {
        data['certCheck'] = 'ERROR';
    }
    // tslint:disable-next-line:forin
    for (const key in failure) {
        const new_key = key;
        const sub_data = failure[key];
        if (new_key === 'debugMessage' && sub_data !== 'undefined') {
            data['respCodeMsg'] = sub_data;
        }
        if (new_key === 'codeFromService' && sub_data !== 'undefined') {
            data['codeFromPlaceNameIs'] = 'Service';
            data['respCode'] = sub_data;
        }
        if (new_key === 'codeFromHost' && sub_data !== 'undefined') {
            data['codeFromPlaceNameIs'] = 'Host';
            data['respCode'] = sub_data;
        }
        // for 快速登入respCode欄位
        if (new_key === 'respCode' && sub_data !== 'undefined') {
            data['codeFromPlaceNameIs'] = 'Host';
            data['respCode'] = sub_data;
        }
    }
    return data;
};
const processDebugMessage = (DebugMessage: any) => {
    const data = {};
    data['result'] = '1';
    data['respCode'] = '';
    data['respCodeMsg'] = DebugMessage;
    return data;
};
const processFatalError = (DebugMessage: any) => {
    const data = {};
    data['result'] = '1';
    data['respCode'] = '';
    data['respCodeMsg'] = DebugMessage;
    return data;
};


export const JsonConvertUtil = {
    /**
	 * [generateGUID 產出GUID] => reqId不可超出40字元
	 * @return {[type]} [description]
	 */
    generateGUID: () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + s4() + s4() + s4() + s4();
        // return s4() + s4()  + s4()  + s4() + s4()  + s4() + s4() + s4();
    },
    /**
     * 檢查物件中是否有key值
     * @param obj 物件
     */
    converToXmlJson: (serviceId: string, jsonObj: any, reqHeader: any) => {
        if (typeof jsonObj !== 'object') {
            jsonObj = {};
        }
        const heq_header = {};
        const heq_body = {
            '@xsi:type': serviceId + 'BodyType'
        };

        let tmp_value: { [x: string]: any; }, sub_value: { [x: string]: any; };
        // ==header==//
        // tslint:disable-next-line:forin
        for (const key in reqHeader) {
            tmp_value = reqHeader[key];
            if (typeof tmp_value === 'object') {
                sub_value = {};
                // tslint:disable-next-line:forin
                for (const headerSubkey in tmp_value) {
                    sub_value['co:' + headerSubkey] = tmp_value[headerSubkey];
                }
                tmp_value = sub_value;
            }
            heq_header['co:' + key] = tmp_value;
        }

        const tmp_specail_list = ['custId', 'paginator', 'pageSize', 'pageNumber', 'sortColName', 'sortDirection'];
        // ==body== //
        // tslint:disable-next-line:forin
        for (let key in jsonObj) {
            tmp_value = jsonObj[key];
            if (typeof tmp_value === 'object') {
                sub_value = {};
                for (const subkey in tmp_value) {
                    if (tmp_specail_list.indexOf(subkey) > -1) {
                        sub_value['co:' + subkey] = tmp_value[subkey];
                    } else {
                        sub_value[subkey] = tmp_value[subkey];
                    }
                }
                tmp_value = sub_value;
            }
            if (tmp_specail_list.indexOf(key) > -1) {
                key = 'co:' + key;
            }
            heq_body[key] = tmp_value;
        }

        jsonObj = {
            'co:MNBRequest': {
                '@xmlns': 'http://mnb.hitrust.com/service/schema/' + serviceId,
                '@xmlns:co': 'http://mnb.hitrust.com/service/schema',
                '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'co:reqHeader': heq_header,
                'co:body': heq_body
            }
        };
        // logger.log(jsonObj);
        return jsonObj;
    },
    /**
     * 將中台XmlJson轉換回一般物件
     * @param xmljson ms
     */
    converFromXmlJson: (xmljson: any) => {
        let res;
        let resHeader;
        if (!!xmljson.MNBResponse) {
            res = xmljson.MNBResponse;
            resHeader = res.resHeader;
        } else {
            res = xmljson;
        }
        let body = {};

        if (!!res.failure && typeof res.failure === 'object') {
            const failure = res.failure;
            body = parseFailure(failure);
        } else if (!!res.result && typeof res.result === 'object') {
            const result = res.result;
            body = parseResult(result);
        } else if (!!res.debugMessage && typeof res.debugMessage !== 'undefined') {
            body = processDebugMessage(res.debugMessage);
            resHeader = (!!res.resHeader) ? res.resHeader : '';
        } else if (!!res.fatalError && typeof res.fatalError !== 'undefined') {
            body = processFatalError((!!res.fatalError.debugMessage) ? res.fatalError.debugMessage : '');
            resHeader = res.fatalError.resHeader;
        }
        const data = {
            'header': resHeader,
            'body': body
        };
        logger.log('res:', data);
        // return xmljson.MNBResponse;
        return data;
    },

    /**
     * 將Server回來的物件串列轉為Array
     */
    getList: (objList: any) => {
        const list = [];
        if (!objList || typeof objList === 'string') {
            return list;
        }
        // tslint:disable-next-line:forin
        for (const i in objList) {
            list.push(objList[i]);
        }
        return list;
    },

    /**
   * 產生header
   */
    setTelegramHeader: (devicesInfo: any) => {
        const reqHeader = new ReqHeader();
        reqHeader.rquId = JsonConvertUtil.generateGUID() + '-' + devicesInfo.serviceId;
        reqHeader.appVersion = devicesInfo.appinfo.version;
        reqHeader.ipAddress = '';
        reqHeader.osType = JsonConvertUtil.getClientOS(devicesInfo.platform);

        reqHeader.locale = navigator.language;
        reqHeader.sessionId = ''; // user.authToken;
        if (!!sessionStorage.userInfo) {
            const userInfo = JSON.parse(sessionStorage.userInfo);
            reqHeader.sessionId = userInfo.sessionId;
        }
        reqHeader.mobileNo = devicesInfo.uuid;

        // ==憑證==//
        reqHeader.plainText = '';
        reqHeader.signature = '';
        reqHeader.certSN = '';
        reqHeader.cn = '';
        reqHeader.SecurityType = '';
        reqHeader.SecurityPassword = '';
        reqHeader.Acctoken = '';

        return reqHeader;
    },

    /**
     * 取得OS版本格式
     */
    getClientOS: (platform) => {
        if ('iOS' === platform) {
            return '01';
        } else if ('Android' === platform) {
            return '02';
        }
        return '00';
    },

    /**
     * 判斷錯誤訊息格式
     */
    isHandelarErrorOption: (obj) => {
        logger.log('in obj:' + JSON.stringify(obj));
        let error;
        if (!!obj.content && !!obj.title) {
            error = new HandleErrorOptions(!!obj.body.respCodeMsg ? obj.body.respCodeMsg : 'ERROR.DATA_FORMAT_ERROR', 'ERROR.TITLE');
        } else if (!!obj.message) {
            // {"headers":{"normalizedNames":{},"lazyUpdate":null,"headers":{}},"status":0,"statusText":"Unknown Error","url":null,"ok":false,"name":"HttpErrorResponse","message":"Http failure response for (unknown url): 0 Unknown Error","error":{"isTrusted":true}}
            error = new HandleErrorOptions(obj.message, 'ERROR.TITLE');
        } else {
            error = obj;
        }
        logger.log('out obj:' + JSON.stringify(error));
        return error;
    }

};
