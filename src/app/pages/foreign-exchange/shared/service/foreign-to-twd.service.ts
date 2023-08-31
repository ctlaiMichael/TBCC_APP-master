/**
 * 外幣轉台幣
 *
 */
import { Injectable } from '@angular/core';
import { F5000101ApiService } from '@api/f5/f5000101/f5000101-api.service';
import { F5000102ApiService } from '@api/f5/f5000102/f5000102-api.service';
import { F5000103ApiService } from '@api/f5/f5000103/f5000103-api.service';
import { F5000105ApiService } from '@api/f5/f5000105/f5000105-api.service';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { TwdToForexInfo } from '@conf/terms/forex/twd-to-forex-info';
import { NoAccountInfo } from '@conf/terms/forex/no-account-info';
import { ReservationInfo } from '@conf/terms/forex/reservation-info';
import { F5000102ReqBody } from '@api/f5/f5000102/f5000102-req';
import { F2000201ApiService } from '@api/f2/f2000201/f2000201-api.service';

@Injectable()

export class ForeignToTwdService {
    /**
     * 參數處理
     */

    constructor(
        private f5000101: F5000101ApiService
        , private f5000102: F5000102ApiService
        , private f5000103: F5000103ApiService
        , private f5000105: F5000105ApiService
        , private f2000201: F2000201ApiService
        , private _infoService: InfomationService
        , private navgator: NavgatorService
    ) {
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

    getMoney(): Promise<any> {
		let pageSize = '500';
        return this.f2000201.getPageData(1, [], false, pageSize).then(
            (output) => {
                return Promise.resolve(output);
            },
            (error_obj) => {
                return Promise.reject(error_obj);
            }
        );
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
                    return item === 'TWD';

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
    getPropertyTypeForeignToTw(){
        let propertyTypeForeignToTw= {
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
        return propertyTypeForeignToTw;
    }
}
