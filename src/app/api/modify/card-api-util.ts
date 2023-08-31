/**
 * 信用卡專區API特殊處理
 */
import { FieldUtil } from '@shared/util/formate/modify/field-util';
import { ObjectUtil } from '@shared/util/formate/modify/object-util';

export const CardApiUtil = {

    /**
     * 判斷信用卡API成功與否
     *  result	結果
     *  respCode	電文回應代碼
     *  respCodeMsg	電文代碼說明
     * @param resObj data
     */
    modifyResponse(resObj) {
        let output: any = {
            status: false,
            msg: '',
            resultCode: '',
            body: {},
            header: {}
        };

        let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};
        let jsonHeader = (resObj.hasOwnProperty('header')) ? resObj['header'] : {};
        let result_flag = FieldUtil.checkField(jsonObj, 'result');
        output.msg = FieldUtil.checkField(jsonObj, 'respCodeMsg');
        output.resultCode = FieldUtil.checkField(jsonObj, 'respCode');
        if (result_flag == '0') {
            output.status = true;
        }
        output.body = jsonObj;
        output.header = jsonHeader;
        return output;
    }

};
