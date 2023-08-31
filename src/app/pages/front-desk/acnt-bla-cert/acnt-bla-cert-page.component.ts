/**
 * 線上申請存款餘額證明
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AcntBlaCertService } from '../shared/service/acnt-bla-cert.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { DateUtil } from '@shared/util/formate/date/date-util';

@Component({
    selector: 'app-acnt-bla-cert-page',
    templateUrl: './acnt-bla-cert-page.component.html',
    styleUrls: [],
    providers: []
})

export class AcntBlaCertPageComponent implements OnInit {
    resultData = {
        resData: {},
        showData: {},
        reqData: {}
    };
    transactionObj = {
        serviceId: 'FJ000103',  // FJ000103 
        categoryId: '7',
        transAccountType: '1',  // 預設回傳1 (約轉)。 2 為(非約轉)。
    };
    // 安控
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    };
    check_SSL_Flag: any;
    sendInfo: any;
    pageType = 'edit';
    userData: any;
    addressList = [];
    branchList = [];
    applyAccount: any;
    trnsOutAcnts: any;
    currencyList: any;
    copyList: any;
    maxCopy = 20;
    dateLimit = {
        today: '',
        max: '',
        min: ''
    };
    defaultClass = 'inner_table_frame';
    errorClass = 'inner_table_frame active_warnning';

    domObj = {
        class: {

        },
        errorMsg: {

        }
    };
    sendData = {
        account: '',
        applyAmount: '',
        currency: '',
        moneyPresentType: '',
        balanceType: '',
        chineseName: '',
        englishName: '',
        applyPeriod: '',
        whyApply: '',
        otherApplyReason: '',
        receiveAddress: '',
        otherReceiveAddress: '',
        city: '',
        bankBranch: '',
        bankBranchValue: '',
        bankBranchName: '',
        copyNumber: '',
        telNumber: '',
        phoneNumber: '',
        serviceCharge: '',
        mailFee: '',
        payAccount: '',
        e_mail: ''
    };
    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _mainService: AcntBlaCertService
        , private _formateService: FormateService
        , private _checkService: CheckService
        , private _checkSecurityService: CheckSecurityService
        , private _authService: AuthService

    ) { }

    ngOnInit() {
        // 取得帳號資料
        this.getUserData();
        this.setDateCondition('');
        // 產生class errorMsg
        this.setDomObj(this.sendData);
        // 預設日期
        this.sendData.applyPeriod = this.dateLimit.today;
    }

    getUserData() {
        this._mainService.getData().then(
            (getUserInfo_S) => {
                this.userData = getUserInfo_S.userInfo;
                // 選單設定
                this.addressList = getUserInfo_S.addressList;
                this.applyAccount = getUserInfo_S.applyAccount;
                this.trnsOutAcnts = getUserInfo_S.trnsOutAcnts.acntList;
                // 申請分數
                this.doCopyList(this.maxCopy);
                // 預設資料設定
                this.sendData.chineseName = this.userData.custName;

            }, (getUserInfo_F) => {

                this._handleError.handleError(getUserInfo_F);
            }
        );

    }
    setDomObj(keyList) {

        for (let index in keyList) {

            this.domObj.class[index] = this.defaultClass;
            this.domObj.errorMsg[index] = '';
        }

    }
    cancelEdit() {

    }
    // 送出驗欄位
    checkEvent() {

        let notCheckArray = [
            'chineseName', 'englishName', 'applyAmount', 'otherReceiveAddress'
            , 'serviceCharge', 'mailFee', 'otherApplyReason', 'city', 'bankBranch', 'bankBranchName', 'bankBranchValue',
            'telNumber', 'phoneNumber', 'e_mail'
        ];

        // 欄位check
        this.check_SSL_Flag = true;
        for (let keyName in this.sendData) {
            let value = this.sendData[keyName];
            if (notCheckArray.indexOf(keyName) > -1) {
                continue;
            } else {
                // 驗空值

                let checkEmptyRef = ObjectCheckUtil.checkEmpty(value);
                if (!checkEmptyRef.status) {

                    this.check_SSL_Flag = false;
                    this.showErrorMsg(keyName, 'error', 'PG_FRONT_DESK.ERROR_MSG.' + keyName);
                }
                //// 例外處理 block start
                if (keyName === 'moneyPresentType' && value === '2') {
                    // 選英文
                    if (this.sendData['englishName'].trim() === '') {

                        this.check_SSL_Flag = false;
                        this.showErrorMsg('englishName', 'error', 'PG_FRONT_DESK.ERROR_MSG.englishName');
                    }
                }
                if (keyName === 'balanceType') {
                    if (value === '2' || value === '4' || value === '6') {
                        let flag = ObjectCheckUtil.checkEmpty(this.sendData['applyAmount']);
                        if (!flag.status) {
                
                            this.check_SSL_Flag = false;
                            this.showErrorMsg('applyAmount', 'error', 'PG_FRONT_DESK.ERROR_MSG.applyAmount');
                        }
                    }
                    if (!this.checkApplyDate()) {
                      
                        this.check_SSL_Flag = false;
                    }

                }
                if (keyName === 'whyApply' && value === '4') {
                    let flag = ObjectCheckUtil.checkEmpty(this.sendData['otherApplyReason']);
                    if (!flag.status) {
                        
                        this.check_SSL_Flag = false;
                        this.showErrorMsg('otherApplyReason', 'error', 'PG_FRONT_DESK.ERROR_MSG.otherApplyReason');
                    }
                }
                //
                if (keyName === 'receiveAddress') {
                    if (value === '4') {
                        let flag = ObjectCheckUtil.checkEmpty(this.sendData['otherReceiveAddress']);
                        if (!flag.status) {
                            
                            this.check_SSL_Flag = false;
                            this.showErrorMsg('otherReceiveAddress', 'error', 'PG_FRONT_DESK.ERROR_MSG.otherReceiveAddress');
                        }
                    } else if (value === '5') {
                        let flag = ObjectCheckUtil.checkEmpty(this.sendData['city']);
                        if (!flag.status) {
                            
                            this.check_SSL_Flag = false;
                            this.showErrorMsg('city', 'error', 'PG_FRONT_DESK.ERROR_MSG.city');
                        }
                        let flag2 = ObjectCheckUtil.checkEmpty(this.sendData['bankBranch']);
                        if (!flag2.status) {
                            
                            this.check_SSL_Flag = false;
                            this.showErrorMsg('bankBranch', 'error', 'PG_FRONT_DESK.ERROR_MSG.bankBranch');
                        }
                    }
                }
                //// 例外處理 block end
            }
            if (this.sendData['telNumber'].trim() === ''
                && this.sendData['phoneNumber'].trim() === ''
                && this.sendData['e_mail'].trim() === '') {

                this.check_SSL_Flag = false;
                this.showErrorMsg('telNumber', 'error', 'PG_FRONT_DESK.ERROR_MSG.telNumber');
                this.showErrorMsg('phoneNumber', 'error', 'PG_FRONT_DESK.ERROR_MSG.phoneNumber');
                this.showErrorMsg('e_mail', 'error', 'PG_FRONT_DESK.ERROR_MSG.e_mail');
            } else {

                this.showErrorMsg('telNumber', 'default');
                this.showErrorMsg('phoneNumber', 'default');
                this.showErrorMsg('e_mail', 'default');
                if (this.sendData['e_mail'] != '' && !this.validateEmail(this.sendData['e_mail'])) {
                    this.check_SSL_Flag = false;
                    this.showErrorMsg('e_mail', 'error', 'PG_FRONT_DESK.ERROR_MSG.e_mail_format');
                }
            }
        }
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.sendInfo
        };
    }
    // 根據max 申請份數跑回圈
    doCopyList(number) {
        this.copyList = [];
        for (let i = 1; i <= number; i++) {
            this.copyList.push(i);
        }
    }
    // 下拉選項控制開關
    setData(e) {
        let name = e.target.name;
        let value = e.target.value;
        if (value != '') {
            this.showErrorMsg(name, 'default');
        }
        // 切換帳號
        if (name === 'account') {
            // 更換幣別資料
            this.currencyList = this.applyAccount['acnCurr'][value];
            // 還原預設
            this.sendData.currency = '';
        }
        if (name === 'englishName') {
            if (value.trim() !== '') {
                this.showErrorMsg('englishName', 'default');
            } else if (value.trim() !== '' && this.sendData.moneyPresentType === '2') {
                this.showErrorMsg('englishName', 'error', 'PG_FRONT_DESK.ERROR_MSG.englishName');
            }
        }
        // 切換金額表示方式 為英文 英文名稱不為空
        if (name === 'moneyPresentType') {
            // 檢核englishName 不為空
            if (value === '2') { // 選英文
                if (this.sendData.englishName.trim() === '') {
                    // 顯示ERROR
                    this.showErrorMsg('englishName', 'error', 'PG_FRONT_DESK.ERROR_MSG.englishName');
                }
            } else {
                // 還原錯誤格式
                this.showErrorMsg('englishName', 'default');
            }
        }
        if (name === 'balanceType') {

            if (value != '') {
                // 切換重設設定日期限制
                this.setDateCondition(value);
                // 檢查日期
                this.checkApplyDate();
                if (value === '1' || value === '3') {
                    // 全額 申請金額不顯示
                    this.sendData.applyAmount = '';
                } else {
                    // 部分 顯示金額欄位
                }
            } else {
                this.showErrorMsg('applyPeriod', 'default');
            }
        }
        // 日期選擇後檢核
        if (name === 'applyPeriod' && value != '') {
            
            if (this.sendData.balanceType != '') {
                this.checkApplyDate();
            }
        }
        // 指定收件地址
        if (name === 'receiveAddress') {
            // 設定郵寄費用
            this.sendData.mailFee = ((value === '5') || (value === '')) ? '0' : '28';
        }
        // 計算郵寄與手續費
        if (name === 'copyNumber') {
            if (value !== '') {
                value = parseInt(value, 10);
                this.sendData.serviceCharge = ((value * 20) + 30).toString();
            } else {
                this.sendData.serviceCharge = '0';
            }
        }
        if (name === 'e_mail') {
            if (!this.validateEmail(value)) {
                this.showErrorMsg('e_mail', 'error', 'PG_FRONT_DESK.ERROR_MSG.e_mail_format');
            }
        }
        // 縣市變動初始分行選單
        if (name === 'city' && this.sendData.bankBranch != '') {
            this.sendData.bankBranchValue = '';
            this.sendData.bankBranch = '';
            this.sendData.bankBranchName = '';
        }
        if (name === 'bankBranch') {
            if (value) {
                let branchData = value.split(',');
                value = branchData[0];
                this.sendData.bankBranch = value;
                this.sendData.bankBranchValue = value + ',' + branchData[1];
                this.sendData.bankBranchName = branchData[1];
            } else {
                this.sendData.bankBranchValue = '';
                this.sendData.bankBranch = '';
                this.sendData.bankBranchName = '';
            }

        }
        // 塞值
        if (value != '') {

            this.showErrorMsg('name', 'default');
        }
        this.sendData[name] = value;

        
    }

    checkApplyDate() {

        if (DateUtil.compareDate(this.sendData.applyPeriod, this.dateLimit.min) === 1
            || DateUtil.compareDate(this.sendData.applyPeriod, this.dateLimit.max) === -1
        ) {
            let errorMsg = '';
            if (this.sendData.balanceType === '1' || this.sendData.balanceType === '3' || this.sendData.balanceType === '5') {
                errorMsg = '日期為今日起至前2個月內';
            } else {
                errorMsg = '日期為今日起至前一年內';
            }
            this.showErrorMsg('applyPeriod', 'error', errorMsg);
            return false;
        } else {
            this.showErrorMsg('applyPeriod', 'default');
            return true;
        }
    }
    // 設定欄位變化
    showErrorMsg(keyName, type, msg?) {
        if (!msg) {
            msg = '';
        }
        if (type == 'error') {
            this.domObj.class[keyName] = this.errorClass;
        } else {
            this.domObj.class[keyName] = this.defaultClass;
        }
        this.domObj.errorMsg[keyName] = msg;
    }
    validateEmail(email) {
        
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    setDateCondition(type) {
        let today = new Date(Date.now());
        this.dateLimit.today = this._formateService.transDate(today, 'dateInpt');
        this.dateLimit.max = this.dateLimit.today;
        this.dateLimit.min = '';
        let date_set_obj = {};
        if (type === '1' || type === '3') {
            // 2M
            date_set_obj = {
                baseDate: 'today', // 基礎日
                rangeType: 'M', // "查詢範圍類型" M OR D
                rangeNum: '2', // 查詢範圍限制
            };
        } else {
            // 1Y
            date_set_obj = {
                baseDate: 'today', // 基礎日
                rangeType: 'M', // "查詢範圍類型" M OR D
                rangeNum: '12', // 查詢範圍限制
            };

        }
        
        let overDateObj = this._checkService.getDateSet(date_set_obj, 'strict');
        
        this.dateLimit.max = this._formateService.transDate(overDateObj.maxDate, 'dateInpt');
        this.dateLimit.min = this._formateService.transDate(overDateObj.minDate, 'dateInpt');
        
    }

    private securityOptionBak(e) {
        if (e.status) {
            
            // 取得需要資料傳遞至下一頁子層變數
            this.securityObj = {
                'action': 'init',
                'sendInfo': e.sendInfo
            };
            this.sendInfo = e.sendInfo;
        } else {
            // do errorHandle 錯誤處理 推業或POPUP
            e['type'] = 'message';
            this._handleError.handleError(e.ERROR);
        }
    }

    stepBack(e) {
        
        let reqData = {};
        if (e.status && this.check_SSL_Flag) {
            reqData = this._mainService.mergSendData(this.sendData, this.userData);
            if (e.securityType === '3') {
                e.otpObj.depositNumber = ''; // 轉出帳號
                e.otpObj.depositMoney = ''; // 金額
                e.otpObj.OutCurr = ''; // 幣別
                e.transTypeDesc = ''; //
            } else if (e.securityType === '2') {
                e.signText = reqData;
                
            };
            // 統一叫service 做加密
            this._checkSecurityService.doSecurityNextStep(e).then(
                (rep_S) => {
                    
                    // 送出到 103

                    this._mainService.sendResult(reqData, rep_S.headerObj).then(
                        (result_S) => {
                            
                            
                            // transToPageReault 
                            
                            this.resultData.resData = result_S;
                            this.resultData.reqData = reqData;
                            this.resultData.showData = this.sendData;
                            this.pageType = 'result';
                        }, (result_F) => {

                            
                            let error = {
                                content: '',
                                message: '',
                                type: 'message'
                            };
                            if (result_F.hasOwnProperty('content')) {
                                error.content = result_F.content;
                            }else if(result_F.hasOwnProperty('msg')){
                                error.content = result_F.msg;
                            }

                            this._handleError.handleError(error);
                        }
                    );
                }, (res_F) => {
                    
                    this._handleError.handleError(res_F);
                    //   this.backPageEmit.emit({
                    //     type: 'goResult',
                    //     value: false,
                    //     securityResult: F
                    //   });
                }
            );
        } else {
            return false;
        }
    }
}
