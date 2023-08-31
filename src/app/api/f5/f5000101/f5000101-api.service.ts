// F5000101:外匯存款帳戶查詢
import { Injectable } from '@angular/core';
import { F5000101ResBody } from './f5000101-res';
import { F5000101ReqBody } from './f5000101-req';

import { TelegramService } from '@core/telegram/telegram.service';
import { AuthService } from '@core/auth/auth.service';
import { ApiBase } from '@base/api/api-base.class';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class F5000101ApiService extends ApiBase<F5000101ReqBody, F5000101ResBody> {
    constructor(
        public telegram: TelegramService<F5000101ResBody>,
        public authService: AuthService,
        public errorHandler: HandleErrorService,
        private _logger: Logger,
        private _formateService: FormateService
    ) {
        super(telegram, errorHandler, 'F5000101');

    }

    /**
     *
     * @param type 外匯轉帳類別
     */
    getData(req: object): Promise<any> {
        const userData = this.authService.getUserInfo();
        if (!userData.hasOwnProperty('custId') || userData.custId == '') {
            this._logger.error('DATA_FORMAT_ERROR login', userData);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        // 參數處理
        let data: F5000101ReqBody = new F5000101ReqBody();
        data.custId = userData.custId; // user info;
        data.type = this._formateService.checkField(req, 'type');
        data.openNightChk = this._formateService.checkField(req, 'openNightChk');
        if (data.type == '') {
            this._logger.error('DATA_FORMAT_ERROR api req', data, req);
            return Promise.reject({
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
        }
        return this.send(data).then(
            (resObj) => {
                let output = {
                    status: false,
                    msg: 'Error',
                    info_data: {},
                    trnsOutAccts: [],
                    trnsInAccts: [],
                    trnsCurrs: [],
                    headerTime: '',
                    propertyTypeTwToForeign: {
                        "0000": "結售之外匯原係以新台幣結購存入",
                        "111E": "海運貨運收入",
                        "112E": "海運客運收入",
                        "115E": "航空貨運收入",
                        "116E": "航空客運收入",
                        "122E": "財產保險理賠收入",
                        "191E": "文化及休閒收入",
                        "192E": "貿易佣金及代理費收入",
                        "193E": "營建收入",
                        "195E": "使用智慧財產權收入",
                        "19AE": "郵務與快遞收入",
                        "19BE": "電腦與資訊收入",
                        "19CE": "營業租賃收入",
                        "19DE": "專業技術事務收入",
                        "19EE": "視聽收入",
                        "210A": "收回股本投資",
                        "220B": "收回貸款投資",
                        "250A": "收回國外存款",
                        "262A": "收回投資國外股權證券",
                        "263A": "收回投資國外長期債票券",
                        "264A": "收回投資國外短期債票券",
                        "266A": "國外有本金交割的遠匯及換匯之資金匯入",
                        "267A": "國外無本金交割的衍生金融商品之資金匯入",
                        "270A": "收回投資國外不動產",
                        "280B": "收回對外貸款",
                        "291Z": "收回分期付款出口融資",
                        "292Z": "資本租賃收入",
                        "340B": "國外借款",
                        "370A": "外人購置不動產",
                        "410C": "薪資款匯入",
                        "440C": "對外貸款利息",
                        "441C": "股本投資盈餘或股利",
                        "442C": "股權證券股利",
                        "443C": "國外存款利息",
                        "444C": "有關出口之利息",
                        "445C": "長期債票券利息",
                        "446C": "短期債票券利息",
                        "448C": "貸款投資利息",
                        "510F": "贍家匯款收入",
                        "511G": "工作者匯款收入",
                        "520F": "捐贈匯款收入",
                        "540F": "出售自然資源與非研發成果資產收入",
                        "612Z": "旅行剩餘退匯",
                        "70AI": "收款人已自行辦理出口通關的貨款",
                        "701I": "尚未出口之預收貨款",
                        "702I": "港口售油及補給",
                        "704I": "樣品費收入",
                        "710D": "委外加工貿易收入",
                        "711D": "商仲貿易收入"
                    }
                };

                let telegramHeader = (resObj.hasOwnProperty('header')) ? resObj.header : {};
                if (telegramHeader.hasOwnProperty('requestTime')) {
                    output.headerTime = telegramHeader.requestTime;
                };
                let jsonObj = (resObj.hasOwnProperty('body')) ? resObj['body'] : {};

                output.info_data = jsonObj;


                if (jsonObj.hasOwnProperty('trnsOutAccts') && jsonObj['trnsOutAccts']
                    && jsonObj['trnsOutAccts'].hasOwnProperty('trnsOutAcct') && jsonObj['trnsOutAccts']['trnsOutAcct']
                ) {
                    output.trnsOutAccts = this.modifyTransArray(jsonObj.trnsOutAccts['trnsOutAcct']);
                } else {
                    output.trnsOutAccts = [];
                };

                if (jsonObj.hasOwnProperty('trnsInAccts') && jsonObj['trnsInAccts']
                    && jsonObj['trnsInAccts'].hasOwnProperty('trnsInAcct') && jsonObj['trnsInAccts']['trnsInAcct']
                ) {
                    output.trnsInAccts = this.modifyTransArray(jsonObj.trnsInAccts['trnsInAcct']);
                } else {
                    output.trnsInAccts = [];
                };

                if (jsonObj.hasOwnProperty('trnsCurrs') && jsonObj['trnsCurrs']
                    && jsonObj['trnsCurrs'].hasOwnProperty('trnsCurr') && jsonObj['trnsCurrs']['trnsCurr']
                ) {
                    output.trnsCurrs = this.modifyTransArray(jsonObj.trnsCurrs['trnsCurr']);
                } else {
                    output.trnsCurrs = [];
                };
                if (output.trnsOutAccts.length <= 0 && output.trnsInAccts.length <= 0) {
                    return Promise.reject({
                        title: 'ERROR.TITLE',
                        content: '※ 您未申請約定轉出/轉入帳號，尚無法執行本項交易。欲約定轉出/轉入帳號，請洽本行營業單位辦理'
                    });
                }

                output.status = true;
                output.msg = '';

                return Promise.resolve(output);
            },
            (errorObj) => {

                return Promise.reject(errorObj);
            }
        );
    }

    modifyTrans(data) {
        data.trnsOutAccts = this.modifyTransArray(data.trnsOutAccts['trnsOutAcct']);
        return data;
    }




}
