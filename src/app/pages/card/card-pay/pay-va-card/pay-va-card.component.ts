/**
 * 繳本人合庫信用卡款
 */
import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { CardBillService } from '@pages/card/shared/service/card-bill-service/card-bill.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { SessionStorageService } from '@lib/storage/session-storage.service';

@Component({
    selector: 'app-pay-va-card',
    templateUrl: './pay-va-card.component.html',
    styleUrls: [],
    providers: [CardBillService]
})
export class PayVaCardComponent implements OnInit {
    /**
     * 參數處理
     */
    showClass = '';
    nowPage = 'edit-page';
    //f8000402查帳號
    reqData = {
        custId: ''
    };
    info_data = {}; //資訊
    data = []; //帳號

    //f8000401交易結果
    inp_data = {
        custId: '',
        trnsfrOutAccnt: '',
        trnsfrAmount: '',
        businessType: '',
        trnsToken: ''
    };

    //檢核欄位
    check_accnt = false; //帳號紅框
    check_amount = false; //金額紅框
    accnt_errorMsg = '';
    ammount_errorMsg = '';

    userAddress = {
        'USER_SAFE': '',
        'SEND_INFO': ''
    };

    transactionObj = {
        serviceId: 'F8000401',
        categoryId: '6',
        transAccountType: '1',
        customAuth: ['1', '2']
    };
    securityObj = {
        'action': 'init',
        'sendInfo': {}
    };
    safeE = {};
    //結果頁
    resultInfo: any; //結果資訊
    resTitle = '';
    trnsRsltCode = '';
    rescontent = '';
    sucess = false; //交易成功
    failed_x = false; // 異常
    failed_1 = false; //失敗

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _handleError: HandleErrorService
        , private _mainService: CardBillService
        , private _checkService: CheckService
        , private alert: AlertService
        , private confirm: ConfirmService
        , private _headerCtrl: HeaderCtrlService
        , private authService: AuthService
        , private _checkSecurityService: CheckSecurityService
        , private sessionStorage:SessionStorageService
    ) {
    }

    ngOnInit() {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '繳本人卡款',
            'style': 'normal'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    this.navgator.push("web:pay");
                    // this.onBackPageData({});
                },
                () => {

                }
            );
        });
        //判斷身份 信卡無法使用此功能
        let loginUser=this.sessionStorage.getObj("login_method");  
        if(loginUser && loginUser == '2'){
            this.navgator.push('web:payCardFee');
        }
        // 安控變數初始化
        this.securityObj = {
            'action': 'init',
            'sendInfo': this.userAddress.SEND_INFO
        };
        this.transactionObj['serviceId'] = 'F8000401';

        //取得轉出帳號
        this._mainService.getAccount(this.reqData).then(
            (result) => {
                this._logger.error("402 result:", result);
                this.info_data = result.info_data;
                this.data = result.data;
                this._logger.error("402 data:", this.data);
                this._logger.error("402 info_data:", this.info_data);
            },
            (errorObj) => {
                this._logger.error("402 errorObj:", errorObj);
                this._handleError.handleError(errorObj);
            }
        );
    }

    onConfirm() {
        this._logger.log("into onConfirm");
        this._logger.log("inp_data.trnsfrOutAccnt:", this.inp_data.trnsfrOutAccnt);
        let saveAmount = this._checkService.checkMoney(this.inp_data.trnsfrAmount);
        //檢查帳號
        if (this.inp_data.trnsfrOutAccnt == '') {
            this.check_accnt = true;
            this.accnt_errorMsg = '請輸入轉出帳號';
        } else {
            this.check_accnt = false;
            this.accnt_errorMsg = '';
        }
        //檢查金額
        if (saveAmount['status'] == false) {
            this.check_amount = true;
            this.ammount_errorMsg = saveAmount['msg'];
        } else {
            this.check_amount = false;
            this.ammount_errorMsg = '';
        }
        //都輸入成功進下一頁
        if (this.inp_data.trnsfrOutAccnt !== '' && saveAmount['status'] == true) {
            //不可超過200萬
            if (parseInt(this.inp_data.trnsfrAmount) > 2000000) {
                this.alert.show('繳款金額不能超過200萬元', {
                    title: '提醒您',
                    btnTitle: '我知道了',
                }).then(
                    () => {
                    }
                );
                return false;
            }
            if (this.info_data['businessType'] == 'N') {
                this.confirm.show('「現在已超過轉帳時間，您是否同意執行此筆轉帳交易，並且於次營業日處理?」', {
                    title: '提醒您',
                    btnYesTitle: '確定',
                    btnNoTitle: '取消'
                }).then(
                    () => {
                        this.goConfirm();
                    },
                    () => {
                        return false;
                    }
                );
            } else {
                this.goConfirm();
            }
        }
    }

    //進入確認頁
    goConfirm() {
        this.inp_data['custId'] = this.info_data['custId'];
        this.inp_data['businessType'] = this.info_data['businessType'];
        this.inp_data['trnsToken'] = this.info_data['trnsToken'];
        this._logger.log("go inp_data:", this.inp_data);
        //進下一頁
        this._logger.log("go next page");
        this.nowPage = 'confirm-page';
    }

    onCancel() {
        this.navgator.push("web:pay");
    }


    //---------- 確認頁 ----------
    //確定
    onConfirm2() {
        // 安控變數設置
        this.securityObj = {
            'action': 'submit',
            'sendInfo': this.userAddress.SEND_INFO
        };
    }
    //上一步
    onCancel2() {
        this.nowPage = 'edit-page';
        // this.onBackPageData({});
    }

    // 安控函式
    securityOptionBak(e) {
        this._logger.log('securityOptionBak: ', e);
        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.userAddress.SEND_INFO = e.sendInfo;
            this.userAddress.USER_SAFE = e.sendInfo.selected;
            this.securityObj = {
                'action': 'init',
                'sendInfo': e.sendInfo
            };
        } else {
            // do errorHandle 錯誤處理 推業或POPUP
            e['type'] = 'message';
            this._handleError.handleError(e.ERROR);
        }
    }

    stepBack(e) {
        if (e.status) {
            this._logger.log(e);
            if (e.securityType === '3') {
                e.otpObj.depositNumber = this.inp_data['trnsfrOutAccnt']; // 轉出帳號
                e.otpObj.depositMoney = this.inp_data['trnsfrAmount']; // 金額
                e.otpObj.OutCurr = 'TWD'; // 幣別
                e.transTypeDesc = ''; //
            } else if (e.securityType === '2') {
                e.signText = {
                    // 憑證 寫入簽章本文
                    'custId': this.authService.getCustId(),
                    'trnsfrOutAccnt': this.inp_data['trnsfrOutAccnt'],
                    'trnsfrAmount': this.inp_data['trnsfrAmount'],
                    'businessType': this.inp_data['businessType'],
                    'trnsToken': this.inp_data['trnsToken']
                };

            }
            // 統一叫service 做加密 
            this._checkSecurityService.doSecurityNextStep(e).then(
                (S) => {
                    this._logger.log("into Security success!");
                    //安控成功，發電文
                    this.onSend(this.inp_data, S);
                }, (F) => {
                    this._logger.log("into Security error!");
                    this._handleError.handleError(F);
                }
            );
        } else {
            return false;
        }
    }
    //結果頁電文
    onSend(set_data, security) {
        this._mainService.getPayResult(set_data, security).then(
            (result) => {
                this._logger.log("result:", this._formateService.transClone(result));
                this.nowPage = 'result-page'; //進結果頁
                this.goResult(result);
            },
            (errorObj) => {
                this._logger.log("errorObj:", errorObj);
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }

    //---------- 結果頁 ----------
    goResult(resultData) {
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '交易結果',
            style: 'result'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.onHome();
        });
        this._logger.log("into goResult(), resultData:",this._formateService.transClone(resultData));
        this.resultInfo = resultData.info_data;
        this.resTitle = resultData['title'];
        this.trnsRsltCode = resultData.trnsRsltCode;
        this.rescontent = resultData['msg'];
        
        let classType = resultData['classType'];
        let class_list = {
            'success': '',
            'error': 'fault_active',
            'warning': 'exclamation_active'
        };
        if (class_list.hasOwnProperty(classType)) {
            this.showClass = class_list[classType];
        } else {
            this.showClass = class_list['success'];
        }
    }
    onHome() {
        this.navgator.push("web:pay");
    }

    /**
     * 子層返回事件(接收)
     * @param e
     */
    onPageBackEvent(e) {
        this._logger.step('Deposit', 'onPageBackEvent', e);
        let page = 'list';
        let pageType = 'list';
        let tmp_data: any;
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
        this._logger.log("page:", page);
        this._logger.log("pageType:", pageType);
        this._logger.log("tmp_data:", tmp_data);
        if (page == 'pay-confirm' && pageType == 'back') {
            this.nowPage = 'edit-page';
        }
    }


    /**
     * 返回上一層
     * @param item
     */
    onBackPageData(item?: any) {
        // 返回最新消息選單
        let output = {
            'page': 'pay-card',
            'type': 'back',
            'data': item
        };
        if (item.hasOwnProperty('page')) {
            output.page = item.page;
        }
        if (item.hasOwnProperty('type')) {
            output.type = item.type;
        }
        if (item.hasOwnProperty('data')) {
            output.data = item.data;
        }
        // this.backPageEmit.emit(output);
    }
}
