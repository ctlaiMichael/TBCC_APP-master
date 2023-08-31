/**
 * 投資設定查詢
 */
import { Injectable } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
// API
import { FJ000102ApiService } from '@api/fj/fj000102/fj000102-api.service';
import { FJ000103ApiService } from '@api/fj/fj000103/fj000103-api.service';
import { FJ000103ReqBody } from '@api/fj/fj000103/fj000103-req';
import { AuthService } from '@core/auth/auth.service';

@Injectable()
export class AcntBlaCertService {
    /**
     * 參數處理
     */

    constructor(
        private _logger: Logger
        , private fj000102: FJ000102ApiService
        , private fj000103: FJ000103ApiService
        , private _formateService: FormateService
        , private _authService: AuthService
    ) { }

    mergSendData(mergData, userData) {

        // mergData.applyPeriod 要轉明國年格式
        
        let trnsfrDate: any;
        if (mergData.hasOwnProperty('applyPeriod') && mergData.applyPeriod) {
            trnsfrDate = this._formateService.transDate(this.replaceDash(mergData.applyPeriod), { 'formate': 'yyyMMdd', 'chinaYear': true });
        }
        // 地址設定
        let address: any;
        
        if (mergData.receiveAddress === '1') {
            // 戶籍地址
            address = userData.residenceAddr;
        } else if (mergData.receiveAddress === '2') {
            // 通訊地址
            address = userData.noticeAddr;
        } else if (mergData.receiveAddress === '3') {
            // 公司地址
            address = userData.companyAddr;
        } else if (mergData.receiveAddress === '4') {
            // 其他
            address = mergData.otherReceiveAddress;
        } else if (mergData.receiveAddress === '5') {
            // 自取
            address = mergData.bankBranch;
        }


        let form = {};
        form['custId'] = this._authService.getUserInfo().custId,
            form['applyAcct'] = mergData.account;
        form['applyCurr'] = mergData.currency;
        form['custChName'] = mergData.chineseName;
        form['custEnName'] = mergData.englishName;
        form['certDate'] = trnsfrDate;
        form['chooseAmt'] = mergData.balanceType;
        form['applyAmount'] = mergData.applyAmount;
        form['amountLang'] = mergData.moneyPresentType;
        form['amountPurpose'] = mergData.whyApply;
        form['addrItem'] = mergData.receiveAddress;
        form['sendAddr'] = address;
        form['contactPhone'] = mergData.telNumber;
        form['mobilePhone'] = mergData.phoneNumber;
        form['fee'] = mergData.serviceCharge;
        form['postFee'] = mergData.mailFee;
        form['copy'] = mergData.copyNumber;
        form['trnsOutAcct'] = mergData.payAccount;
        form['email'] = mergData.e_mail;
        form['trnsToken'] = userData.trnsToken;
        return form;
    }
    replaceDash(str) {
        let replaceString = '';
        replaceString = str.replace(/-/g, '');
        
        return replaceString;
    }
    sendResult(req, headerObj) {
        return this.fj000103.send(req, { header: headerObj }).then(
            (result_S) => {
                if (result_S.status) {
                    return Promise.resolve(result_S);
                }
            }, (result_F) => {
                
                return Promise.reject(result_F);
            }

        );
    }
    getData(): Promise<any> {
        return this.fj000102.send({ custId: '' }).then(
            (output) => {
                // 

                let returnData = {
                    applyAccount: {},
                    addressList: {},
                    trnsOutAcnts: {},
                    userInfo: {},
                    Error: {
                        type: 'message',
                        content: '',
                        errorMsg: ''
                    }

                };
                if (output.status) {
                    // 申請帳號處理
                    if (!!output.applyAcnts) {
                        let applyAccount = this.doApplyAccountData(output.applyAcnts);
                        returnData.applyAccount = applyAccount;
                    } else {
                        returnData.Error.content = '查無相關資料';
                        return Promise.reject(returnData.Error);
                    }
                    if (!!output.branches) {
                        let addressList = this.doAddressSelect(output.branches);
                        returnData.addressList = addressList;
                    } else {
                        returnData.Error.content = '查無相關資料';
                        return Promise.reject(returnData.Error);
                    }
                    if (!!output.trnsOutAcnts) {
                        let trnsOutAcnts = this.doApplyAccountData(output.trnsOutAcnts);
                        returnData.trnsOutAcnts = trnsOutAcnts;
                    } else {
                        returnData.Error.content = '查無相關資料';
                        return Promise.reject(returnData.Error);
                    }

                    returnData.userInfo = {
                        custName: this._formateService.checkField(output.infoData, 'custName'),
                        residenceAddr: this._formateService.checkField(output.infoData, 'residenceAddr'),
                        noticeAddr: this._formateService.checkField(output.infoData, 'noticeAddr'),
                        companyAddr: this._formateService.checkField(output.infoData, 'companyAddr'),
                        contactPhone: this._formateService.checkField(output.infoData, 'contactPhone'),
                        trnsToken: this._formateService.checkField(output.infoData, 'trnsToken')
                    };

                    return Promise.resolve(returnData);
                } else {
                    // 
                    returnData.Error.content = output.msg;
                    return Promise.reject(returnData.Error);
                }
            },
            (error_obj) => {
                
                return Promise.reject(error_obj);
            }
        );
    }


    doApplyAccountData(source) {
        let accountList = [];
        let accountCurrency = {};
        let returnObj = {};
        for (let index in source) {
            if (accountList.indexOf(source[index].acctNo) < 0) {
                let accVal = source[index].acctNo;
                let currencyVal: any;
                accountList.push(accVal);
                if (source[index].hasOwnProperty('curr')) {
                    currencyVal = source[index].curr;
                    accountCurrency[accVal] = currencyVal.split(',');
                }
            }
        }
        returnObj['acntList'] = accountList;
        returnObj['acnCurr'] = accountCurrency;

        return returnObj;
    }

    doAddressSelect(source) {
        let returnObj = {
            city: [],
            list: {},
        }
        // 地址分行整理
        for (let Obj of source) {
            
            if (returnObj.city.indexOf(Obj.city) < 0) {
                // 塞縣市類別
                returnObj.city.push(Obj.city);
            }
            // 塞分行清單
            if (returnObj.list[Obj.city] === undefined) {
                returnObj.list[Obj.city] = [];
            }
            returnObj.list[Obj.city].push({ 'branchId': Obj.branchId, 'branchName': Obj.branchName });
        }
        return returnObj;
    }
}