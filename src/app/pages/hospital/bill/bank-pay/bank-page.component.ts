/**
 * 繳費方式(本人帳戶)
 * 
 * 
 */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { BankService } from '@pages/hospital/shared/service/bank.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CheckService } from '@shared/check/check.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';
import { Logger } from '@core/system/logger/logger.service';
import { CaptchaComponent } from '@shared/captcha/captcha.component';

@Component({
    selector: 'app-bank-pay',
    templateUrl: 'bank-page.component.html',
    styleUrls: [],
    providers: [BankService, CheckService, SocialsharingPluginService]
})

export class BankPageComponent implements OnInit {
    @ViewChild(CaptchaComponent) _captcha: CaptchaComponent;
    @Input() inputData: any = {};
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    reqData: any = {};
    //flag:
    editShow = true; //顯示編輯頁
    bankCodeShow = false; //銀行代號顯示
    nationalShow = false; //全國繳費顯示
    confirmShow = false; //顯示確認頁
    resultShow = false; //顯示結果頁
    successResultShow = true; //trnsRsltCode : 0(成功)
    failedResultShow = false; //trnsRsltCode : 1(失敗)
    abnormalResultShow = false; //trnsRsltCode : X(異常)
    processResultShow = false; //trnsRsltCode: 2(已扣款交易異常請至櫃台處理)

    checkAccountShow = false; //錯誤顯示紅框
    checkAccountError = ""; //錯誤訊息
    info_data: any = {};
    trnsTokenData = ""; //接收trnsToken(交易控制碼)

    setObj = {}; //呼叫getBankCode()的參數，給空物件
    bankCode_info: any = {}; //接收getBankCode()回傳物件
    bankCode_data = []; //接收getBankCode()回傳物件 => []
    bankCodeItem = {}; //該筆銀行代號
    BankCodeChange = true; //切換顯示: 請選擇銀行代碼 or 銀行代號

    resultInfo = {}; //存放202電文回傳資料{}
    resultData = []; //存放202電文回傳資料[]

    inBankCode = false; //判斷有無點選「銀行代號選擇」onBankCode()
    channel = ""; //分辨: 醫療:1、產壽:2

    //------ 確認頁顯示 ------
    sumAmount = ""; //金額總計: 總金額+手續費
    creditCardHidden = ""; //信用卡卡號(隱碼)
    // personIdHidden = ""; //身分證(隱碼)
    vghtpCheck = false; //判斷是否為台北榮民總醫院 => 顯示：就醫時間
    
    //圖形驗證碼相關
    checkCaptchaFlag: any;

    constructor(
        private _logger: Logger,
        private _mainService: BankService
        // , private _AppCheckService: AppCheckService
        , private route: ActivatedRoute
        , private _checkService: CheckService
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private confirm: ConfirmService
        , private socialShare: SocialsharingPluginService
    ) { }

    ngOnInit() {
        this._initEvent();
        this._logger.log("inputData!!!:", this.inputData);
        if (this.inputData['hospitalId'] == 'VGHTP') {
            this.vghtpCheck = true;
        }
        this.route.queryParams.subscribe(params => {
            if (params.hasOwnProperty("type") && !(params['type'] == '')) {
                this.channel = params['type'];
            }
        })
        this._mainService.getBankCode().then(
            (result) => {
                this.bankCode_info = result.info_data;
                this.bankCode_data = result.data;
                this._logger.log("bankCode_info:", this.bankCode_info);
                this._logger.log("bankCode_data:", this.bankCode_data);
            },
            (errorObj) => {
                let error_msg = "Get BankCode Error!";
                if (typeof errorObj === 'object' && errorObj.hasOwnProperty("msg")) {
                    errorObj.msg = error_msg;
                    this._handleError.handleError(errorObj);
                }
            }
        );

        //金額總計
        let totalAmount = parseInt(this.inputData['totalAmount']);
        if (this.channel == "1") {
            this.sumAmount = (totalAmount + 10).toString();
        } else {
            this.sumAmount = (totalAmount).toString();
        }
        //身分證隱碼
        // this.personIdHidden = (this.inputData['personId'].slice(0, 3) + "*****"
        //     + this.inputData['personId'].slice(8, 10));
    }

    //按下取消
    onCancel(type: string) {
        if (type === 'check') {
            this.editShow = true;
        } else {
            this.onErrorBackEvent({}, 'back');
        }
    }


    /**
* 啟動事件
*/
    private _initEvent() {
        //設定header
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '繳費方式'
        });
        //左側返回
        this._headerCtrl.setLeftBtnClick(() => {
            this.onErrorBackEvent({}, 'cancel-edit');
        });
    }

    //-------------------------編輯頁-------------------------------
    //確認轉帳帳號
    public onAccount(account) {
        let accountdata = {};
        accountdata = this._checkService.checkActNum(account);
        if (accountdata['status'] == false) {
            this.checkAccountShow = true;
            this.checkAccountError = accountdata['msg'];
        }
        if (this.inBankCode == false) {
            this.checkAccountShow = true;
            this.checkAccountError = "請選擇銀行代號";
        }
        if(accountdata['status'] == true && this.inBankCode == true) {

            // 檢核成功才進下一頁
            this.checkAccountShow = false;
            this.inputData['trnsOutBank'] = this.bankCodeItem['bankCode'];
            this.inputData['trnsOutAcct'] = account;
            this._logger.log("inputData!!!!!!!", this.inputData);
            this.editShow = false;
            this.nationalShow = true;
            this.confirmShow = false;
            this.resultShow = false;
        }
        this._logger.log("accountdata:", accountdata);

        // 檢核成功才呼叫Service
        // if (accountdata['status'] == true) {
        //     this.inputData['trnsOutBank'] = this.bankCodeItem['bankCode'];
        //     this.inputData['trnsOutAcct'] = account;
        //     this._logger.log("inputData!!!!!!!", this.inputData);
        //     this.editShow = false;
        //     this.nationalShow = true;
        //     this.confirmShow = false;
        //     this.resultShow = false;
        // }
    }

    //銀行代號選擇
    public onBankCode() {
        this.bankCodeShow = true;
        this.editShow = false;
        this.confirmShow = false;
        this.resultShow = false;
        this.inBankCode = true;
    }

    //點擊該筆銀行代號
    public onSelectBankCode(item) {
        this._logger.log("item:", item);
        this.bankCodeItem = item;
        this.bankCodeShow = false;
        this.editShow = true;
        this.BankCodeChange = false;
    }


    //-------------------------全國繳費專區-------------------------------

    //點擊同意
    public onNational(checkNational) {
        if (checkNational.checked) {
            this.editShow = false;
            this.nationalShow = false;
            this.confirmShow = true;
            this.resultShow = false;
        }
    }

    //點擊不同意
    public onNoNational() {
        this.goEnd();
    }

    //-------------------------確認頁-------------------------------
    //確認頁點擊確認(這裡必須得到202電文需要的request欄位)
    //先發203電文取得交易控制碼，再發202電文取得結果頁欄位
    public onConfirm() {
        this.reqData = this.inputData;
        this.reqData['details']['detail'].forEach(item => {
            delete item['kind'];
        });
        this._logger.log("reqData:", this.reqData);

        //圖形驗證
        this.checkCaptchaFlag = this._captcha.checkCaptchaVal(); //紀錄驗證是否成功
        //圖形驗證成功(發交易api)
        if(this.checkCaptchaFlag == true) {
            this._mainService.sendData(this.reqData).then(
                (result) => {
                    this.resultInfo = result.info_data;
                    this.resultData = result.data;
                    this._logger.log("resultInfo66666666666:", this.resultInfo);
                    if (!(this.resultInfo === '') && !(this.resultData.length <= 0)) {
                        this.editShow = false;
                        this.nationalShow = false;
                        this.confirmShow = false;
                        this.resultShow = true;
                    }
                    if (this.resultInfo.hasOwnProperty("trnsRsltCode") && this.resultInfo['trnsRsltCode'] == '0') {
                        this.successResultShow = true;
                        this.failedResultShow = false;
                        this.abnormalResultShow = false;
                        this.processResultShow = false;
                    } else if (this.resultInfo.hasOwnProperty("trnsRsltCode") && this.resultInfo['trnsRsltCode'] == '1') {
                        this.successResultShow = false;
                        this.failedResultShow = true;
                        this.abnormalResultShow = false;
                        this.processResultShow = false;
                    } else if (this.resultInfo.hasOwnProperty("trnsRsltCode") && this.resultInfo['trnsRsltCode'] == 'X') {
                        this.successResultShow = false;
                        this.failedResultShow = false;
                        this.abnormalResultShow = true;
                        this.processResultShow = false;
                    } else if (this.resultInfo.hasOwnProperty("trnsRsltCode") && this.resultInfo['trnsRsltCode'] == '2'
                        && this.channel == "1") {
                        this.successResultShow = false;
                        this.failedResultShow = false;
                        this.abnormalResultShow = false;
                        this.processResultShow = true;
                    }
                },
                (errorObj) => {
                    let error_msg = 'Error';
                    if (typeof errorObj === 'object' && errorObj.hasOwnProperty('msg')) {
                        errorObj.msg = error_msg;
                    }
                }
            );
            //圖形驗證失敗(不發api進行後續動作)
        } else {
            return false;
        }

    }


    /**
 * 回傳(透過它回父層)
 * @param error_obj 失敗物件
 */
    onErrorBackEvent(error_obj, type?: string) {
        if (typeof type == 'undefined') {
            type = 'error';
        }
        let output = {
            'page': 'bank-pay',
            'type': type,
            'data': error_obj
        };

        this.errorPageEmit.emit(output);
    }


    // onResultNotice() {
    //     // this.goEnd();
    // }
    socialSharing() {
        let resultAmt = this.resultInfo['sumAmount'];
        this._logger.log('twd-transfer-page line159', 'ASDAadfsas sharing?');
        this.socialShare.shareMsg({
            subject: '',
            message: 'Hi, 我已經繳醫療費' + this.resultInfo['sumAmount'] + '元囉!',
            url: ''
        }).then(
            (success) => {
                // success
                this._logger.log('twd-transfer line167', 'successed');
            },
            (error) => {
                // error
                this._logger.log('twd-transfer line171', 'failed');
            }
        );
    }

    onConfirmEnd() {
        this.goEnd();
    }

    //返回置醫療/產壽主選單
    private goEnd() {
        this.route.queryParams.subscribe(params => {
            if (params.hasOwnProperty('type')) {
                if (params.type == '1') {
                    this.navgator.push('hospital');
                } else if (params.type == '2') {
                    this.navgator.push('insurance');
                }
            }
        });
    }

    //返回行動網銀首頁
    backHome() {
        this.navgator.push('home');
    }
}