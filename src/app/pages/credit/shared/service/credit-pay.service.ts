/**
 * 借款查詢
 *
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';


import { F9000301ApiService } from '@api/f9/f9000301/f9000301-api.service';
import { F9000302ApiService } from '@api/f9/f9000302/f9000302-api.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { F9000303ApiService } from '@api/f9/f9000303/f9000303-api.service';
import { F9000303ReqBody } from '@api/f9/f9000303/f9000303-req';

@Injectable()

export class CreditPayService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger,
        private f9000301: F9000301ApiService,
        private f9000302: F9000302ApiService,
        private f9000303: F9000303ApiService

    ) {
    }

    /**
	 *
	 * @param page 查詢頁數
	 * @param sort 排序 ['排序欄位', 'ASC|DESC']
	 */
    public getData(page?: number, sort?: Array<any>): Promise<any> {
        // let reqData = new F9000301ReqBody();
        // reqData.custId = '';

        return this.f9000301.getPageData(page, sort).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }

    public gettrnsfrAccount(req: object): Promise<any> {


        return this.f9000302.getData(req).then(
            (sucess) => {
                return Promise.resolve(sucess);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }

    /**
	 * @param data 301 res
	 * @param infodata 302res
	 * @param inputView 頁面欄位
	 * @param security
	 */
    public onSend(data, infodata, inputView, security): Promise<any> {
        let output = {
            info_data: {},
            success_data: {},
            msg: '',
            status: false
        };


        let reqObj = new F9000303ReqBody();
        if (data.hasOwnProperty('borrowAccount') && inputView.hasOwnProperty('trnsAcnt')
            && inputView.hasOwnProperty('money') && inputView.hasOwnProperty('repayRadio')
            && data.hasOwnProperty('payType') && infodata.hasOwnProperty('businessType')
            && infodata.hasOwnProperty('trnsToken') && infodata.hasOwnProperty('details')
            && infodata['details'].hasOwnProperty('detail') && infodata['details']['detail'][0].hasOwnProperty('issueSeq')) {
            /**
			 *  1:已逾繳息日
					2:尚未逾期
					3:已逾到期日
			 */
            // 未逾期  期數  還本金時期數為00  ， 還本息只有一筆
            if (data.payType == '2') {
                reqObj = {
                    "custId": '',
                    "borrowAccount": data.borrowAccount,  // 借款帳號
                    "trnsfrOutAccnt": inputView.trnsAcnt, // 轉出帳號
                    "trnsfrAmount": inputView.money,   // 還款金額
                    "issueSeq": inputView.repayRadio == '2' ? '00' : infodata.details.detail[0].issueSeq,  // 期數     ，如果是本金給00、本息只有一筆故第一筆
                    "trxType": inputView.repayRadio,        // 還款方式
                    "payType": data.payType,        // 到期及繳息狀況
                    "businessType": infodata.businessType,   // 次營業日註記
                    "trnsToken": infodata.trnsToken      // 交易控制碼
                };
                // 有逾期  期數  僅能選擇還本息
            } else {
                reqObj = {
                    "custId": '',
                    "borrowAccount": data.borrowAccount,  // 借款帳號
                    "trnsfrOutAccnt": inputView.trnsAcnt, // 轉出帳號
                    "trnsfrAmount": inputView.money,   // 還款金額
                    // "issueSeq": inputView.repayRadio == '2' ? '00' : infodata.details.detail[0].issueSeq,  // 期數
                    "issueSeq": infodata.details.detail[inputView.periods].issueSeq,
                    "trxType": inputView.repayRadio,        // 還款方式
                    "payType": data.payType,        // 到期及繳息狀況
                    "businessType": infodata.businessType,   // 次營業日註記
                    "trnsToken": infodata.trnsToken      // 交易控制碼
                };
            }

        } else {
            return Promise.reject(output);
        }

        let reqHeader = {
            header: security.securityResult.headerObj
        };
        return this.f9000303.send(reqObj, reqHeader).then(
            (jsonObj) => {
                if (jsonObj.hasOwnProperty('status')
                    && jsonObj.status == true
                    && jsonObj.hasOwnProperty('info_data')
                    && jsonObj.hasOwnProperty('success_data')
                ) {
                    output.info_data = jsonObj.info_data;
                    output.status = true;
                    return Promise.resolve(output);
                } else {
                    output.msg = jsonObj['hostCodeMsg'];
                    return Promise.reject(jsonObj);
                };

            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }
}
