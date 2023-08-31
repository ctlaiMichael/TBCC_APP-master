/**
 * 外幣繳保費
 */
import { Component, OnInit, transition, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ForeignInsurancePayService } from '../../shared/service/foreign-insurance-pay.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ForeignInsurancePay } from '@conf/terms/forex/foreign-insurance-pay-notice';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { CheckService } from '@shared/check/check.service';

@Component({
    selector: 'app-foreign-insurance-pay',
    templateUrl: './foreign-insurance-pay.component.html',
    styleUrls: [],
    providers: [ForeignInsurancePayService]
})

export class ForeignInsurancePayComponent implements OnInit {
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'edit'; //當前頁面
    custId = ''; //request
    info_data: any = {}; //整組資訊
    data: any = []; //列表
    not_handle = true; //是否辦理過
    //送F5000202 requset用
    reqData = {
        custId: '',
        paymentObject: '',
        trnsfrOutAcct: '',
        trnsfrOutCurr: '',
        trnsfrAmount: '',
        paymentNumber: '',
        trnsToken: ''
    };
    trnsCurr = '';
    tmp = [];
    //綁ngModel，paymentObject == 'A'的情況，送值
    life = {
        insurance: '', //情況為A，選擇哪個繳費對象， 1：南山，2.新光
        insurance_type: '' //ngModel 綁定保單種類，只有南山人壽會出現
    };
    //----- 檢核變數 -----
    check_paymentObject = false; //繳費對象flag
    check_insurance_type = false; //保費種類flag
    check_acct = false; //付款帳號flag
    check_curr = false; //付款幣別flag
    check_paymentNumber = false; //繳費單號flag
    check_trnsfrAmount = false; //繳款金額flag

    numberObj = ['未輸入保單/繳款編號', '繳費單號格式錯誤']; //繳費單錯誤訊息，錯哪種送哪個
    numberError = ''; //儲存繳費單錯誤訊息
    saveAmount = {}; //金額檢核

    constructor(
        private _logger: Logger
        , private _checkSecurityService: CheckSecurityService
        , private _headerCtrl: HeaderCtrlService
        , private _authService: AuthService
        , private navgator: NavgatorService
        , private _mainService: ForeignInsurancePayService
        , private _handleError: HandleErrorService
        , private alert: AlertService
        , private confirm: ConfirmService
        , private infomationService: InfomationService
        , private _checkService: CheckService
    ) { }

    ngOnInit() {

        //左側返回
        this._headerCtrl.setLeftBtnClick(() => {
            this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    this.navgator.push('foreign-exchange');
                },
                () => {

                }
            );
        });
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '外幣繳保費'
        });
        // 改為下方提醒您
        // const set_data = new ForeignInsurancePay();
        // this.infomationService.show(set_data);

        //外幣保費資料查詢
        this._mainService.getInsData(this.custId).then(
            (result) => {
                this.info_data = result.info_data;
                this.data = result.data;
                this.not_handle = result.not_handle;

                if (this.not_handle == false) {
                    this._handleError.handleError({
                        type: '我知道了',
                        title: '提醒您',
                        content: '尚未約定繳付外幣保費功能，請洽本行各營業單位辦理'
                    });
                    this.navgator.push('foreign-exchange');
                }
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
                // this.navgator.push('foreign-exchange');
            }
        );
    }

    //帳號欄位有變化
    onSelectAcct() {
        this.reqData.trnsfrOutCurr = '';
        for (let i = 0; i < this.data.length; i++) {
            if (this.reqData['trnsfrOutAcct'] == this.data[i]['acctNo']) {
                this.trnsCurr = this.data[i]['acctCurr'];
            }
        }
        this.tmp = this.trnsCurr.split(',');
    }

    //點擊確認
    onConfirm() {
        this.reqData.trnsToken = this.info_data.trnsToken; //將trnsToken帶入request
        //*檢核繳費對象
        if (this.info_data.paymentObject == 'A' && this.life.insurance == '') {
            this.check_paymentObject = true;
        } else {
            //有選擇
            this.check_paymentObject = false;
            if (this.life.insurance == '1') {
                this.reqData.paymentObject = 'N'; //南山人壽  
            } else if (this.life.insurance == '2') {
                this.reqData.paymentObject = 'S'; //新光人壽
            }
        }
        if (this.info_data.paymentObject == 'N' || this.life.insurance == '1') {
            this.reqData.paymentObject = 'N'; //南山人壽
        } else if (this.info_data.paymentObject == 'S' || this.life.insurance == '2') {
            this.reqData.paymentObject = 'S'; //新光人壽
        }
        //*檢核保費種類
        //選擇南山，才檢核保費種類
        if (this.info_data.paymentObject == 'N' || this.life.insurance == '1') {
            //選擇 首期保費，跳視窗提示，且開啟紅框
            if (this.life.insurance_type == '1') {
                this.check_insurance_type = true;
                this.alert.show('首期保費暫不開放網路繳納，請洽臨櫃辦理。', {
                    title: '提醒您',
                    btnTitle: '我知道了',
                }).then(
                    () => {
                    }
                );
            }
            //未選擇，保費種類，跳紅框
            if (this.life.insurance_type == '') {
                this.check_insurance_type = true;
                //有值且不選擇 首期保費，才取消紅框
            } else if (this.life.insurance_type !== '' && this.life.insurance_type == '2') {
                this.check_insurance_type = false;
            }
        }
        //*檢核付款帳號
        if (this.reqData.trnsfrOutAcct == '') {
            this.check_acct = true
        } else {
            this.check_acct = false;
        }
        //*檢核付款幣別
        if (this.reqData.trnsfrOutCurr == '') {
            this.check_curr = true;
        } else {
            this.check_curr = false;
        }
        //*檢核繳款編號
        if (this.reqData.paymentNumber == '' || typeof this.reqData.paymentNumber === 'undefined') {
            this.check_paymentNumber = true;
            this.numberError = this.numberObj[0];
            //南山 需輸入10碼
        } else if (this.reqData.paymentNumber !== '' && (this.info_data.paymentObject == 'N' || this.life.insurance == '1')
            && this.reqData.paymentNumber.length !== 10) {
            this.check_paymentNumber = true;
            this.numberError = this.numberObj[1];
            //新光 需輸入14碼
        } else if (this.reqData.paymentNumber !== '' && (this.info_data.paymentObject == 'S' || this.life.insurance == '2')
            && this.reqData.paymentNumber.length !== 14) {
            this.check_paymentNumber = true;
            this.numberError = this.numberObj[1];
        } else {
            this.check_paymentNumber = false;
            this.numberError = '';
        }
        //*檢核繳款金額
        if (this.reqData.trnsfrAmount == '' || this.reqData.trnsfrAmount == '0'
            || typeof this.reqData.trnsfrAmount === 'undefined' || !(/^[0-9]*$|^[0-9]+(.[0-9]{2})?/.test(this.reqData.trnsfrAmount))) {
            this.check_trnsfrAmount = true;
        } else {
            this.check_trnsfrAmount = false;
            this.reqData.trnsfrAmount = this.reqData.trnsfrAmount.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //輸入不能超過小數點兩位
        }

        //** 最終檢核，過了才進入下一頁
        //最終選 南山人壽
        if (this.info_data.paymentObject == 'N' || this.life.insurance == '1') {
            if (this.life.insurance_type !== '' && this.life.insurance_type == '2'
                && this.reqData.trnsfrOutAcct !== '' && this.reqData.trnsfrOutCurr !== ''
                && this.reqData.paymentNumber !== '' && this.reqData.paymentNumber.length == 10
                && this.reqData.trnsfrAmount !== '' && (/^[0-9]*$|^[0-9]+(.[0-9]{2})?/.test(this.reqData.trnsfrAmount))) {
                //將保單編號 第一碼轉大寫
                this.reqData.paymentNumber = this.reqData.paymentNumber.toString().substring(0, 1).toUpperCase() + this.reqData.paymentNumber.toString().substring(1, 10);
                //進下一頁
                this.nowPage = 'confirm';
            } else {
                return false;
            }
        }
        //最終選 新光人壽
        if (this.info_data.paymentObject == 'S' || this.life.insurance == '2') {
            if (this.reqData.trnsfrOutAcct !== '' && this.reqData.trnsfrOutCurr !== ''
                && this.reqData.paymentNumber !== '' && this.reqData.paymentNumber.length == 14
                && this.reqData.trnsfrAmount !== '' && (/^[0-9]*$|^[0-9]+(.[0-9]{2})?/.test(this.reqData.trnsfrAmount))) {
                //進下一頁
                this.nowPage = 'confirm';
            } else {
                return false;
            }
        }
    }

    //點擊取消
    onBack() {
        this.navgator.push('foreign-exchange');
    }

    /**
 * 子層返回事件(分頁)
 * @param e
 */
    onPageBackEvent(e) {
        let page = 'list';
        let pageType = 'list';
        let tmp_data: any;
        let week_obj = [];
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('type')) {
                pageType = e.type;
            }
            if (e.hasOwnProperty('data')) {
                tmp_data = e.data;
            }
        }
    }

    /**
* 失敗回傳(分頁)
* @param error_obj 失敗物件
*/
    onErrorBackEvent(e) {
        this._logger.step('Deposit', 'onErrorBackEvent', e);
        let page = 'list';
        let pageType = 'list';
        let errorObj: any;
        if (typeof e === 'object') {
            if (e.hasOwnProperty('page')) {
                page = e.page;
            }
            if (e.hasOwnProperty('type')) {
                pageType = e.type;
            }
            if (e.hasOwnProperty('data')) {
                errorObj = e.data;
            }
        }
        // 列表頁：首次近來錯誤推頁
        errorObj['type'] = 'dialog';
        this._handleError.handleError(errorObj);
    }
}
