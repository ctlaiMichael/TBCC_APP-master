/**
 * 交易API特殊處理
 */
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { ApiTransResponse } from '@api/modify/api-trans-response.class';

export const TransactionApiUtil = {

    /**
     * 判斷交易API成功與否
     *  trnsRsltCode	結果
     *  hostCode	電文回應代碼
     *  hostCodeMsg	電文代碼說明
     * @param resObj data
     */
    modifyResponse(resObj): ApiTransResponse {
        let output: ApiTransResponse = new ApiTransResponse();

        let jsonObj = (resObj.hasOwnProperty('body') && resObj['body']) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header') && resObj['header']) ? resObj['header'] : {};
        let result_flag = FieldUtil.checkField(jsonObj, 'trnsRsltCode');
        output.trnsRsltCode = result_flag;
        output.hostCode = FieldUtil.checkField(jsonObj, 'hostCode');
        output.hostCodeMsg = FieldUtil.checkField(jsonObj, 'hostCodeMsg');
        output.resultCode = output.hostCode;
        if (output.trnsRsltCode == '0') {
            output.status = true;
            output.title = '交易成功';
            output.classType = 'success';
        } else if (output.trnsRsltCode == '1') {
            output.title = '交易失敗';
            output.classType = 'error';
        } else if (output.trnsRsltCode == 'X') {
            output.title = '交易異常';
            output.classType = 'warning';
        } else {
            output.title = '交易不明';
            output.classType = 'error';
        }

        if (output.hostCode != '') {
            output.host_list.push('(' + output.hostCode + ')');
        }
        if (output.hostCodeMsg != '') {
            output.host_list.push(output.hostCodeMsg);
        }
        if (output.host_list.length > 0 ) {
            output.msg = output.host_list.join('');
        } else {
            output.msg = output.title;
        }
 
        output.body = jsonObj;
        output.header = jsonHeader;
        return output;
    }

};
