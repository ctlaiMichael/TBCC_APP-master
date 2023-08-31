/**
 * 一般API處理
 */
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';
import { ApiTransResponse } from '@api/modify/api-trans-response.class';
import { DateUtil } from '@shared/util/formate/date/date-util';

export const CommonApiUtil = {

    /**
     * 判斷API成功與否
     *  result	結果
     *  respCode	電文回應代碼(4001表示成功, 其他代碼 表示失敗)
     *  respCodeMsg	電文代碼說明
     * @param resObj data
     */
    modifyResponse(resObj) {
        let output: ApiTransResponse = new ApiTransResponse();

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        let result_flag = FieldUtil.checkField(jsonObj, 'result');
        output.trnsRsltCode = result_flag;
        output.resultCode = FieldUtil.checkField(jsonObj, 'respCode');
        output.hostCode = output.resultCode;
        output.hostCodeMsg = FieldUtil.checkField(jsonObj, 'respCodeMsg');
        if (output.trnsRsltCode == '0') {
            output.status = true;
            output.title = '成功';
            output.classType = 'success';
        } else if (output.trnsRsltCode == '1') {
            output.title = '失敗';
            output.classType = 'error';
        } else {
            output.title = '狀態不明';
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

        let data_time = FieldUtil.checkField(jsonHeader, 'responseTime');
        output.dataTime = '';
        if (data_time != '') {
            output.dataTime = DateUtil.transDate(data_time);
        }

        output.body = jsonObj;
        output.header = jsonHeader;
        return output;
    }

};
