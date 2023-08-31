/**
 * 台幣轉外幣
 *
 */
import { Injectable } from '@angular/core';
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { TwdToForexInfo } from '@conf/terms/forex/twd-to-forex-info';
import { NavgatorService } from '@core/navgator/navgator.service';
import { NoAccountInfo } from '@conf/terms/forex/no-account-info';
import { ReservationInfo } from '@conf/terms/forex/reservation-info';
import { F5000102ReqBody } from '@api/f5/f5000102/f5000102-req';
import { F5000109ReqBody } from '@api/f5/f5000109/f5000109-req';
import { F5000109ApiService } from '@api/f5/f5000109/f5000109-api.service';
import { F5000110ReqBody } from '@api/f5/f5000110/f5000110-req';
import { F5000110ApiService } from '@api/f5/f5000110/f5000110-api.service';
import { F5000111ApiService } from '@api/f5/f5000111/f5000111-api.service';

@Injectable()

export class TwdToForeignService {
    /**
     * 參數處理
     */

    constructor(
        private f5000101: F5000101ApiService,
        private f5000102: F5000102ApiService,
        private f5000103: F5000103ApiService,
        private f5000105: F5000105ApiService,
        private f5000109: F5000109ApiService,
        private f5000110: F5000110ApiService,
        private f5000111: F5000111ApiService,
        private _infoService: InfomationService,
        private navgator: NavgatorService) {
    }

    showInfo(message) {
        switch (message) {
            case 'f1000103':
                const info_f1000103 = new TwdToForexInfo();
                this._infoService.show(info_f1000103)
                    .then(
                        () => {
                            // close
                        },
                        () => {
                            // 更多內容
                            if (typeof info_f1000103.linkList['more'] !== 'undefined') {
                                this.navgator.push(info_f1000103.linkList['more']);
                            }
                        }
                    );
                break;
            case 'noAccount':
                const info_noAccount = new NoAccountInfo();
                this._infoService.show(info_noAccount)
                    .then(
                        () => {
                            // close
                        },
                        () => {
                            // 更多內容

                        }
                    );
                break;
            case 'reservation':
                const info_reservation = new ReservationInfo();
                this._infoService.show(info_reservation)
                    .then(
                        () => {
                            // close
                        },
                        () => {
                            // 更多內容

                        }
                    );
                break;
        }

    }

    /**
     *
     * @param page 查詢頁數
     * @param sort 排序 ['排序欄位', 'ASC|DESC']
     */
    getData(type, openNightChk?, searchInAccount?: string, searchOutAccount?: string): Promise<any> {
        let req = {
            type: type,
            openNightChk: openNightChk
        };
        return this.f5000101.getData(req).then(
            (sucess) => {
                let output = this.midfyDefaultAccount(sucess, searchInAccount, searchOutAccount);
                return Promise.resolve(output);
            },
            (failed) => {
                return Promise.reject(failed);
            }
        );
    }
    getRate(reqObj): Promise<any> {
        let data = new F5000102ReqBody();
        if (reqObj.hasOwnProperty('trnsfrOutCurr') && reqObj.hasOwnProperty('trnsfrOutAmount') &&
            reqObj.hasOwnProperty('trnsfrInCurr') && reqObj.hasOwnProperty('trnsfrInAmount') && reqObj.hasOwnProperty('openNightChk')) {
            data.custId = '';
            data.trnsfrOutCurr = reqObj.trnsfrOutCurr;
            data.trnsfrOutAmount = reqObj.trnsfrOutAmount;
            data.trnsfrInCurr = reqObj.trnsfrInCurr;
            data.trnsfrInAmount = reqObj.trnsfrInAmount;
            data.openNightChk = reqObj.openNightChk;
        }

        return this.f5000102.getData(data).then(
            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }
    getResult(reqObj: object, securityResult: any): Promise<any> {

        let reqHeader = {
            header: securityResult.headerObj
        };
        //bussinessType = "Y" && today
        if (reqObj.hasOwnProperty('isReservation') && reqObj['isReservation'] == false) {
            return this.f5000103.getData(reqObj, reqHeader).then(

                (output) => {
                    return Promise.resolve(output);
                },
                (error_obj) => {
                    return Promise.reject(error_obj);
                }
            );
        } else {
            return this.f5000105.getData(reqObj, reqHeader).then(
                (output) => {
                    return Promise.resolve(output);
                },
                (error_obj) => {
                    return Promise.reject(error_obj);
                }
            );
        }

    }




    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    /*
    * 取得預設顯示帳號_defaultAccount
    * 搜尋帳號列表，若搜尋目標在帳號列表內，則塞入_defaultAccount
    * 否則將搜尋目標直接塞入_defaultAccount
    */

    private midfyDefaultAccount(data, inAccount?: any, outAccount?: any) {
        let output = data;
        output['_defaultInAccount'] = null;
        output['_defaultOutAccount'] = null;

        output['modifyTrnsInCurr'] = [];
        output['_twdToForexInAccount'] = [];
        // 檢查轉入帳號
        const checkInAcct = (typeof inAccount === 'string' && inAccount !== '') ? true : false;

        if (output.hasOwnProperty('trnsInAccts') && (output['trnsInAccts'] instanceof Array)) {
            let acctobj = {
                trnsInCurr: '',
                trnsfrInAccnt: '',
                trnsfrInId: '',
                trnsfrInName: ''
            };
            let flag = true;
            output['trnsInAccts'].forEach((item) => {
                if (checkInAcct && item.trnsfrInAccnt == inAccount) {
                    flag = false;
                }
                let temp_currArray = item.trnsInCurr.split(',');
                output['modifyTrnsInCurr'] = temp_currArray.filter(function (item, index, array) {
                    return item !== 'TWD';

                });
                if (output['modifyTrnsInCurr'] != '') {
                    output['_twdToForexInAccount'].push({ 'trnsfrInAccnt': item.trnsfrInAccnt, 'trnsInCurr': output['modifyTrnsInCurr'], 'trnsInSetType': item.trnsInSetType });
                }
                // currcy != '' push _twdToForexInAccount

            });
            if (checkInAcct && flag) {
                acctobj.trnsfrInAccnt = inAccount;
                output['_defaultInAccount'] = acctobj;
            }
        }
        // 檢查轉出帳號
        if (typeof outAccount === 'string' && outAccount !== ''
            && output.hasOwnProperty('trnsOutAccts') && (output['trnsOutAccts'] instanceof Array)
        ) {
            let acctobj = {
                trnsOutCurr: '',
                trnsfrOutAccnt: '',
                trnsfrOutId: '',
                trnsfrOutName: ''
            };
            let flag = true;
            output['trnsOutAccts'].forEach((item) => {
                if (item.trnsfrOutAccnt == outAccount) {
                    flag = false;
                }
                // output['_defaultAccount'] = item;
            });
            if (flag) {
                acctobj.trnsfrOutAccnt = outAccount;
                output['_defaultOutAccount'] = acctobj;
            }
        }
        return output;
    }
    /**
         * 檢查若有中文則判斷不超過8個
         */
    checkNotLen(str) {
        let data = {
            status: true,
            msg: ''
        }
        let chinese = false;

        for (let i = 0; i < str.length; i++) {
            if ((str.charCodeAt(i) >= 0) && (str.charCodeAt(i) <= 255)) {

            } else {
                //有中文
                chinese = true;
                break;
            }
        }
        if (chinese && str.length > 8) {
            data.msg = '給收款人訊息或付款人自我備註欄位長度不得超過18位英數字或8個中文字。'
            data.status = false;
        } else if (str.length > 18) {
            data.msg = '給收款人訊息或付款人自我備註欄位長度不得超過18位英數字或8個中文字。'
            data.status = false;
        }
        return data;
    }

    getPropertyTypeTwToForeign() {
        let PropertyTypeTwToForeign = {
            "0000": "單純結購外匯存款不再匯出",
            "111E": "海運貨運費支出",
            "115E": "航空貨運費支出",
            "121E": "財產保險支出",
            "131E": "商務支出",
            "132E": "觀光支出",
            "133E": "探親支出",
            "134E": "留學支出",
            "135E": "信用卡支出",
            "191E": "文化及休閒支出",
            "192E": "貿易佣金及代理費支出",
            "195E": "使用智慧財產權支出",
            "19AE": "郵務與快遞支出",
            "19BE": "電腦與資訊支出",
            "19CE": "營業租賃支出",
            "19DE": "專業技術事務支出",
            "19EE": "視聽支出",
            "19FE": "外國政府機構之勞務收入匯出款",
            "210A": "對外股本投資",
            "220B": "對外貸款投資",
            "250A": "存放國外銀行",
            "262A": "投資國外股權證券",
            "263A": "投資國外長期債票券",
            "264A": "投資國外短期債票券",
            "266A": "國外有本金交割的遠匯及換匯之資金匯出",
            "267A": "國外無本金交割的衍生金融商品之資金匯出",
            "270A": "投資國外不動產",
            "280B": "對外融資貸款",
            "340B": "償還國外借款",
            "440C": "國外借款利息",
            "510F": "贍家匯款支出",
            "511G": "工作者匯款支出",
            "520F": "捐贈匯款支出",
            "530F": "移民支出",
            "540F": "購買自然資源與非研發成果資產支出",
            "70AI": "付款人已自行辦理進口通關的貨款",
            "701I": "尚未進口之預付貨款",
            "702I": "燃油費及補給支出",
            "704I": "樣品費支出",
            "710D": "委外加工貿易支出",
            "711D": "商仲貿易支出"
        }
        return PropertyTypeTwToForeign;
    }
    //議價匯率
    getBargain(reqObj): Promise<any> {
        let data = new F5000109ReqBody();
        if (reqObj.hasOwnProperty('fnctType') && reqObj.hasOwnProperty('negotiatedCurr')) {
            data.custId = '';
            data.fnctType = reqObj.fnctType;
            data.negotiatedCurr = reqObj.negotiatedCurr;
        }

        return this.f5000109.getData(data).then(
            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }
    //110
    getBargainRate(reqObj): Promise<any> {
        return this.f5000110.getData(reqObj).then(
            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }
    getBargainResult(reqObj: object, securityResult: any): Promise<any> {
        let reqHeader = {
            header: securityResult.headerObj
        };
        return this.f5000111.getData(reqObj, reqHeader).then(

            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
    }
}
