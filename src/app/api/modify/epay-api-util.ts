/**
 * Epay專區API特殊處理
 */
import { ApiTransResponse } from '@api/modify/api-trans-response.class';
import { TransactionApiUtil } from '@api/modify/transaction-api-util';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FieldUtil } from '@shared/util/formate/modify/field-util';

export const EpayApiUtil = {

    /**
     * 判斷Epay API成功與否
     *  trnsRsltCode	結果
     *      0-交易成功
     *      1-交易失敗
     *      X-交易異常
     *  hostCode	電文回應代碼
     *  hostCodeMsg	電文代碼說明
     * @param resObj data
     */
    modifyResponse(resObj): ApiTransResponse {
        let output = TransactionApiUtil.modifyResponse(resObj); // 跟此設定值相同
        return output;
    }

    /**
     * 雲端發票回傳整理
     * 原qrcodePayServices.convertRes
     */
    , modifyInvoiceResponse(resObj): ApiTransResponse {
        let output = TransactionApiUtil.modifyResponse(resObj); // 跟此設定值相同
        let resDataStr = ObjectCheckUtil.checkObjectList(output.body, 'resData');
        if (!!resDataStr) {
            let resData = JSON.parse(resDataStr);
            if (typeof resData == 'object') {
                const code = FieldUtil.checkField(resData, 'code');
                if (code != '200') {
                    output.status = false;
                    output.hostCode = code;
                    output.hostCodeMsg = FieldUtil.checkField(resData, 'msg');
                    output.classType = 'error';
                    output.msg = output.hostCodeMsg;
                }
            } else {
                output.status = false;
                output.classType = 'error';
                output.trnsRsltCode = 'RSPERR02';
                output.msg = '雲端發票資料有誤';
            }
        } else {
            output.status = false;
            output.classType = 'error';
            output.trnsRsltCode = 'RSPERR01';
            output.msg = '雲端發票 資料有誤';
        }
        return output;
    }


};
