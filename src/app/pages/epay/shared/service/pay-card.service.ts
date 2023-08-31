/**
 * 繳費-繳卡費
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { EpayFormateService } from '@pages/epay/shared/pipe/epay-formate.service'; // epay formate
import { CheckService } from '@shared/check/check.service';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';
import { FQ000107ApiService } from '@api/fq/fq000107/fq000107-api.service';
import { FQ000107ReqBody } from '@api/fq/fq000107/fq000107-req';

//mody by alex
import { FQ000117ApiService } from '@api/fq/fq000117/fq000117-api.service';
import { FQ000117ReqBody } from '@api/fq/fq000117/fq000117-req';


@Injectable()
export class PayCardService {

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private _checkService: CheckService
        , private qrtype: QRTpyeService
        , private fq000107: FQ000107ApiService
        //mody by alex
        , private fq000117: FQ000117ApiService
        , private epayFormate: EpayFormateService
    ) { }

    /**
     * 編輯資料整理
     * 實際儲存資料請搭配fq000107-api確認(少數欄位送出需要特殊處理)
     * @param paramsObj
     */
    getEditData(paramsObj) {
        let output: any = {
            status: false,
            msg: 'ERROR.DATA_FORMAT_ERROR'
        };
        output['qrcode'] = this._formateService.checkObjectList(paramsObj, 'qrcode');
        output['trnsLimitAmt'] = this._formateService.checkField(paramsObj, 'trnsLimitAmt');
        output['form'] = { // FQ000104
            trnsfrOutAcct: '' // 轉出帳號
            , secureCode: '' // 安全碼
            , acqInfo: '' // 收單行資訊
            , trnsfrOutBank: '' // 轉出銀行
            , txnAmt: '' // 交易金額
            , txnCurrencyCode: '' // 交易幣別
            , deadlinefinal: '' // 繳納期限(截止日)
            , noticeNbr: '' // 銷帳編號
            , otherInfo: '' // 其他資訊Y
            , qrExpirydate: '' // QR Code 效期
            , feeInfo: '' // 費用資訊
            , charge: '' // 使用者支付手續費
            , feeName: '' // 費用名稱
            , merchantName: ''
            , feeKind: ''
            , typeAndFee: ''
            , feeSessionId: ''
            //mody by alex
            , cardNbr : ''

            , trnsToken: '' // 交易控制碼
        };
        // output['error_data'] = this._formateService.transClone(output['form']);
        output['error_data'] = {
            txnAmt: '' // 交易金額
        };
        output['disableList'] = {
            txnAmt: true // 交易金額
            , orderNumber: false
        };
        if (!output['qrcode'] || typeof output['qrcode'] != 'object') {
            output.msg = 'EPAY.ERROR.DATA_FORMAT_ERROR';
            return output;
        }

        // == Data Set Start == //
        output['form'].trnsfrOutBank = '006'; // 固定值
        output['form'].trnsfrOutAcct = this._formateService.checkField(paramsObj, 'trnsfrOutAcct');
        output['form'].secureCode = this._formateService.checkField(output['qrcode'], 'secureCode');
        output['form'].acqInfo = this._formateService.checkField(output['qrcode'], 'acqInfo');
        // 費用資訊
        output['form'].feeInfo = this._formateService.checkField(output['qrcode'], 'feeInfo');
        // 費用名稱
        output['form'].feeName = this._formateService.checkField(output['qrcode'], 'feeName');
        // 交易幣別(針對可能為空值特別處理)
        output['form'].txnCurrencyCode = this._formateService.checkField(output['qrcode'], 'txnCurrencyCode');
        // QRCode效期(針對可能為空值特別處理)
        output['form'].qrExpirydate = this._formateService.checkField(output['qrcode'], 'qrExpirydate');
        // 其他資訊
        output['form'].otherInfo = this._formateService.checkField(output['qrcode'], 'otherInfo');

        // 費用項目
        output['qrcode']['merchantName'] = this._formateService.checkField(output['qrcode'], 'merchantName');
        output['form'].merchantName = output['qrcode']['merchantName'];
        // 20190915新增Fq000107上行電文
        output['form'].feeKind = this._formateService.checkField(output['qrcode'], 'feeKind');
        output['form'].typeAndFee = this._formateService.checkField(output['qrcode'], 'typeAndFee');
        console.log(' outputtypeAndFee ' +  output['form'].typeAndFee );
        //  // 取出Ｆ手續費
        //  let typeAndFeeValue;
        // if (output['form'].typeAndFee.indexOf('F') != '-1') {
        //     let startindex = output['form'].typeAndFee.indexOf('F');
        //     let endindex = (output['form'].typeAndFee.substring(output['form'].typeAndFee.indexOf('F'))).indexOf(','); // F沒有出現在最後
        //     if (endindex != '-1') {
        //         typeAndFeeValue = output['form'].typeAndFee.substring( startindex + 1, startindex + endindex);
        //         output['form'].typeAndFee = output['form'].typeAndFee.substring( startindex , startindex + endindex);
        //     }else {// F出現在最後
        //         typeAndFeeValue = output['form'].typeAndFee.substring(startindex + 1);
        //         output['form'].typeAndFee = output['form'].typeAndFee.substring( startindex);
        //     }
        //     output['form'].charge = (typeAndFeeValue.substring(0)).concat('00');
        //     // console.log('startindex' + startindex );
        //     // console.log('endindex' +  endindex );
        //   } else {
        //     output['form'].charge = this._formateService.checkField(output['qrcode'], 'charge');
        //   }
        // if (output['form'].typeAndFee != null && output['form'].typeAndFee != '' && (output['form'].typeAndFee.indexOf('F') != '-1')) {
        //     output['form'].charge = (typeAndFeeValue.substring(0)).concat('00');
        // } else {
        //     output['form'].charge = this._formateService.checkField(output['qrcode'], 'charge');
        // }
        // console.log(' outputtypeAndFee ' +  output['form'].typeAndFee );
        // console.log('charge11' + output['form'].charge);
        output['form'].feeSessionId = this._formateService.checkField(output['qrcode'], 'feeSessionId');
        // 取出Ｆ＊＊＊的feeSessionId
        // let feeSessionId = output['form'].feeSessionId;
        // if (feeSessionId != null && feeSessionId != '' && (feeSessionId.indexOf('F') != '-1')) {
        //     let feeSessionIdArray = [];
        //     feeSessionIdArray = feeSessionId.split(',');
        //         for (let i = 0; i < feeSessionIdArray.length; i++) {
        //             if (feeSessionIdArray[i].indexOf('F') != '-1') {
        //                 feeSessionId = feeSessionIdArray[i];
        //             }
        //           }
        // output['form'].feeSessionId = feeSessionId;
        // } else if (feeSessionId != null && feeSessionId != '' && (feeSessionId.indexOf('F') != '-1'){

        // }


        // 銷帳編號
        let noticeNbr = this._formateService.checkField(output['qrcode'], 'noticeNbr');
        output['form'].noticeNbr = noticeNbr;
        // // 傳什麼出什麼，其他靠頁面顯示
        // if (noticeNbr != '') {
        //     noticeNbr = noticeNbr.split('%2B').join('%20');
        //     noticeNbr = this.qrtype.decodeURI(noticeNbr);
        // }
        // output['qrcode']['noticeNbr'] = this.qrtype.checkNoticeNbr(noticeNbr);
        // output['form'].noticeNbr = output['qrcode']['noticeNbr'];


        // 交易金額
        let txnAmt = this._formateService.checkField(output['qrcode'], 'txnAmt');
        let canAmtEdit = this._formateService.checkField(output['qrcode'], 'canAmtEdit');
        output['disableList'].txnAmt = true;
        if (txnAmt != '') {
            // tslint:disable-next-line:radix
            output['form'].txnAmt = this.epayFormate.epayAmount(txnAmt);
            if (canAmtEdit == 'Y') {
                output['disableList'].txnAmt = false;
            }
        }
        // this._logger.log('AMOUNT_LIMIT_200', output['qrcode']['txnAmt'], txnAmt, output['form'].txnAmt);

        // 訂單編號(針對可能為空值特別處理)
        let orderNumber = this._formateService.checkField(output['qrcode'], 'orderNumber');
        output['disableList'].orderNumber = false;
        if (orderNumber != '') {
            output['form'].orderNumber = orderNumber;
            output['disableList'].orderNumber = true; // 好像沒用到....
        }

        // 繳納期限輸入為空之處理
        let deadlinefinal = this.qrtype.checkIsEmpty(output['qrcode'], 'deadlinefinal');
        if (!!deadlinefinal) {
            output['form'].deadlinefinal = deadlinefinal;
        } else {
            output['qrcode']['deadlinefinal'] = '';
            output['form'].deadlinefinal = '';
        }

        // 手續費為空之處理
        // let charge = this.qrtype.checkIsEmpty(output['qrcode'], 'charge');
        let charge = output['form'].charge;
        if (!!charge && charge !== '') {
            output['form'].charge = charge;
        } else {
            output['qrcode']['charge'] = '0';
            output['form'].charge = '0';
        }

        this._logger.log('paycard', this._formateService.transClone(output), this._formateService.transClone(paramsObj));

        output.status = true;
        output.msg = '';
        this._logger.log('check edi', this._formateService.transClone(output), this._formateService.transClone(paramsObj));
        return output;
    }

    /**
     * 檢查表單資料
     */
    checkEditData(set_data, selectSecurityType) {
        let output = {
            status: false,
            msg: 'CHECK.EMPTY', // 請輸入正確資料
            type: 'dialog',
            data: this._formateService.transClone(set_data),
            error_list: {
                txnAmt: '' // 交易金額
            }
        };
        let check_data: any;
        let check_data2: any;
        let err_msg = '';
        let error_list = [];
        let currency = 'TWD';

        // 交易金額檢查
        err_msg = '';
        let tmp_money = this._formateService.checkField(set_data, 'txnAmt');
        check_data = this._checkService.checkMoney(tmp_money, { currency: currency, not_zero: true });
        if (!check_data.status) {
            err_msg = check_data.msg;
        } else {
            check_data2 = this._checkService.compareNumber(tmp_money, 2000000, '<=');
            // this._logger.log('AMOUNT_LIMIT_200', tmp_money, check_data2);
            if (!check_data2.status) {
                // 本交易超過單筆交易200萬限額
                err_msg = 'EPAY.ERROR.AMOUNT_LIMIT_200';
            }
        }
        output.error_list['txnAmt'] = err_msg;

        // 因為只有一個輸入欄位，alert訊息直接等於該欄位訊息
        if (output.error_list['txnAmt'] == '') {
            output.status = true;
            output.msg = '';
        } else {
            output.msg = output.error_list['txnAmt'];
        }

        if (output.status) {
            // 目前先不整合檢查
            let check_security = this.qrtype.checkSecuritySelect(selectSecurityType);
            if (!check_security.status) {
                output.msg = check_security.msg;
            }
        }

        return output;
    }

    /**
     * 資料送出
     */
    async sendData(set_data, selectSecurityType, meansTransactionCard, cardNbr): Promise<any> {
        let output: any = {
            status: false,
            msg: 'CHECK.EMPTY', // 請輸入正確資料
            type: 'dialog',
            data: {
            },
            errorType: 'check',
            error_list: {
                txnAmt: '' // 交易金額
            },
            resultData: {
                classType: 'error',
                title: '',
                content: '',
                content_params: {}
            }
        };

        // 資料檢查
        let check_data = this.checkEditData(set_data, selectSecurityType);
        if (!check_data.status) {
            output.error_list = check_data.error_list;
            // 當使用者輸入有誤時，將頁面拉回最上方。
            check_data['type'] = 'dialog';
            return Promise.reject(output);
        }

        this._logger.step('Epay', 'paycart start', this._formateService.transClone(set_data));
        try {
            this._logger.step('Epay', 'paycart start token');
            let transToken = await this.qrtype.getTrnsToken();
            this._logger.step('Epay', 'token success', transToken);



            //mody by alex


            // let resObj = await this.fq000107.sendData(set_data, transToken, resSecurityInfo);
            // this._logger.step('Epay', 'fq000107 success', resObj, set_data);
            // outputRes = this._modifyResp(resObj, set_data);

            //mody by alex 加入選擇信用卡金融卡判斷
            // debugger;
            let outputRes;
            if (meansTransactionCard == true) {
                set_data.cardNbr = cardNbr;
                delete set_data.feeSessionId1;
                delete set_data.charge1;
                delete set_data.typeAndFee1;
                let CA_Object1 = this.fq000117.checkSecurity(set_data, transToken);
                let resSecurityInfo1 = await this.qrtype.getSecurityInfo(CA_Object1, selectSecurityType);
                this._logger.step('Epay', 'security success', resSecurityInfo1);
                let resObj1 = await this.fq000117.sendData(set_data, transToken, resSecurityInfo1);
                this._logger.step('Epay', 'fq000117 success', resObj1, set_data);
                outputRes = this._modifyResp(resObj1, set_data);
            } else {
                delete set_data.cardNbr;
                set_data.typeAndFee = set_data.typeAndFee1;
                set_data.feeSessionId = set_data.feeSessionId1;
                set_data.charge = set_data.charge1;
                delete set_data.feeSessionId1;
                delete set_data.charge1;
                delete set_data.typeAndFee1;
                let CA_Object = this.fq000107.checkSecurity(set_data, transToken);
                let resSecurityInfo = await this.qrtype.getSecurityInfo(CA_Object, selectSecurityType);
                this._logger.step('Epay', 'security success', resSecurityInfo);
                let resObj = await this.fq000107.sendData(set_data, transToken, resSecurityInfo);
                this._logger.step('Epay', 'fq000107 success', resObj, set_data);
                outputRes = this._modifyResp(resObj, set_data);
            }


            return Promise.resolve(outputRes);
        } catch (errorObj) {
            this._logger.error('Epay Error paycard', errorObj);
            let error_data = this._formateService.transClone(errorObj);
            if (!!error_data.ERROR) {
                error_data = error_data.ERROR;
            }
            return Promise.reject(error_data);
        }


    }



    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__| PART_BOX: private
    // --------------------------------------------------------------------------------------------

    private _modifyResp(resObj, set_data) {
        this._logger.step('Epay', 'res modify', resObj);

        let info_data = [];
        let res_body = resObj.body;
        let tmp_data: any;
        if (resObj.status) {
            // 費用項目
            info_data.push({
                title: 'EPAY.PAY_CARD.FIELD.merchantName',
                content: this._formateService.checkField(set_data, 'merchantName')
            });
            // 交易序號
            info_data.push({
                title: 'EPAY.FIELD.trnsNo',
                content: this._formateService.checkField(res_body, 'trnsNo')
            });
            // 交易時間
            tmp_data =  this._formateService.checkField(res_body, 'trnsDateTime');
            info_data.push({
                title: 'EPAY.FIELD.trnsDateTime',
                content: this._formateService.transDate(tmp_data)
            });
            // 銷帳編號
            tmp_data = this._formateService.checkField(res_body, 'noticeNbr');
            tmp_data = this.epayFormate.epayNoticeNbr(tmp_data, 'fee');
            info_data.push({
                title: 'EPAY.PAY_CARD.FIELD.noticeNbr',
                content: tmp_data
            });

            // 繳納期限
            info_data.push({
                title: 'EPAY.PAY_CARD.FIELD.deadlinefinal',
                content: this._formateService.checkField(set_data, 'deadlinefinal')
            });

            // 手續費
                let charge: any = this._formateService.checkField(res_body, 'charge');
                // if (!!charge && charge !== '') {
                //     charge = this.epayFormate.epayAmount(charge);
                // }
                info_data.push({
                    title: 'EPAY.PAY_CARD.FIELD.charge',
                    content: this._formateService.transMoney(charge, 'TWD')
                });
            // 手續費
            // let typeAndFee;
            // alert("res_body" + JSON.stringify(res_body));
            // alert("res_body.typeAndFee" + res_body.typeAndFee);
            // if (res_body.typeAndFee != null ) {
            //     typeAndFee = res_body.typeAndFee.substring(1);
            //     info_data.push({
            //         title: 'EPAY.PAY_CARD.FIELD.charge',
            //         content: typeAndFee
            //     });
            // }else {
            //     let charge: any = this._formateService.checkField(res_body, 'charge');
            //     if (!!charge && charge !== '') {
            //         charge = this.epayFormate.epayAmount(charge);
            //     }
            //     info_data.push({
            //         title: 'EPAY.PAY_CARD.FIELD.charge',
            //         content: this._formateService.transMoney(charge, 'TWD')
            //     });
            // }

            // 交易帳號
            info_data.push({
                title: 'EPAY.PAY_CARD.FIELD.trnsfrOutAcct',
                content: this._formateService.checkField(res_body, 'trnsfrOutAcct')
            });
            // 交易卡號
            info_data.push({
                title: 'EPAY.PAY_CARD.FIELD.cardNbr',
                content: this._formateService.checkField(res_body, 'cardNbr')
            });
            // 交易金額
            let money = this._formateService.checkField(res_body, 'txnAmt');
            if (!!money) {
                money = this._formateService.transMoney(this.epayFormate.epayAmount(money), 'TWD');
            }
            info_data.push({
                title: 'EPAY.PAY_CARD.FIELD.txnAmt',
                content: money
            });
        } else {
            // 錯誤代碼
            info_data.push({
                title: 'EPAY.FIELD.hostCode',
                content: this._formateService.checkField(resObj, 'hostCode')
            });
            // 主機代碼訊息
            info_data.push({
                title: 'EPAY.FIELD.hostCodeMsg',
                content: this._formateService.checkField(resObj, 'hostCodeMsg')
            });
            // 交易序號
            info_data.push({
                title: 'EPAY.FIELD.trnsNo',
                content: this._formateService.checkField(res_body, 'trnsNo')
            });
            // 交易時間
            tmp_data =  this._formateService.checkField(res_body, 'trnsDateTime');
            info_data.push({
                title: 'EPAY.FIELD.trnsDateTime',
                content: this._formateService.transDate(tmp_data)
            });
        }
        let output = {
          title: resObj.title, // 結果狀態
          content_params: { }, // 副標題i18n
          content: resObj.msg, // 結果內容
          classType: resObj.classType, // 結果樣式
          detailData: info_data,
          button: 'EPAY.FIELD.BACK_EPAY', // 返回合庫E Pay
          buttonPath: 'epay'
        };

        return output;
    }

}
