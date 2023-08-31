/**
 * 台大醫院-醫療費清單
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { NtuhPayService } from '@pages/hospital/shared/service/ntuh-pay.service';
import { Logger } from '@core/system/logger/logger.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AuthService } from '@core/auth/auth.service';
import { logger } from '@shared/util/log-util';
import { AccountSetService } from '@pages/hospital/shared/service/account-set.service';

@Component({
    selector: 'app-ntuh-paylist',
    templateUrl: 'ntuh-paylist-page.component.html',
    styleUrls: [],
    providers: [NtuhPayService, AccountSetService]
})

export class NtuhPayListComponent implements OnInit {
    @Input() inputData: any;
    @Input() notMySelfShow: boolean;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

    requData: any = { //fh000103的request
        custId: '',
        personId: '',
        chartNo: '',
        birthday: ''
    };

    info_data = {};
    data = [];
    notPayData: any = []; //儲存臨櫃繳資料，結果頁需顯示
    checkAllFlag = false; // 全選的checkbox
    amountData: any = { //接service checkAmount()回傳
        amount: '0',
        count: '0'
    };
    error_message = '';

    //送去下一頁
    requestData: any = {
        custId: '',
        hospitalId: '',
        branchId: '',
        personId: '',
        queryTimeFlag: '',
        trnsAcctNo: '',
        totalCount: '',
        totalAmount: '',
        businessType: '',
        trnsToken: '',
        isMySelfPayment: '',
        details: {
            detail: []
        },
        SEND_INFO: ''
    };

    goConfirm = false; //進入確認頁

    account = ''; //扣款帳號，先寫死(之後要改)!!!!!
    ca_flag: boolean; //是否憑證
    // ca_flag: boolean = false; //是否憑證
    //安控傳參
    transactionObj = {
        serviceId: 'FH000104',
        categoryId: '8',
        transAccountType: '2',
        customAuth: ['2']
    };
    //-------------- 扣款帳號 ------------------
    //送request的物件(fh000101)
    accountData = {
        custId: '',
    };
    account_info: any = {};
    account_data: any = [];


    constructor(
        private _logger: Logger,
        private _getQuery: NtuhPayService,
        private _handleError: HandleErrorService,
        private _headerCtrl: HeaderCtrlService,
        private _formateService: FormateService,
        private _checkService: CheckService,
        private _confirm: ConfirmService,
        private _authService: AuthService,
        private _accountService: AccountSetService,

    ) { }

    ngOnInit() {
        logger.error("notMySelfShow:", this.notMySelfShow);
        logger.error("inputData:", this.inputData);
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': '醫療費清單'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this._confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                title: '提醒您'
            }).then(
                () => {
                    //確定
                    this.onBackPageData({}, '');
                },
                () => {

                }
            );
        });

        //判斷是否裝憑證
        this.ca_flag = this._authService.checkDownloadCA();
        logger.log("ca_flag:", this.ca_flag);

        this.requData.custId = this.inputData.custId;
        this.requData.personId = this.inputData.personId;
        this.requData.chartNo = this.inputData.chartNo;
        this.requData.birthday = this.inputData.birthday;

        //發送fh000101電文 => 取得所有扣款帳號
        this._accountService.getData(this.accountData).then(
            (result) => {
                this.account_info = result.info_data;
                this.accountData = result.data;
                logger.error("account_info:", this.account_info);
                logger.error("accountData", this.accountData);
                //取得約定扣款帳號
                this.account = this.account_info.trnsAcctNo;

                //取得fh000103欄位
                this._getQuery.getData(this.requData).then(
                    (result) => {
                        this.info_data = result.info_data;
                        this.data = result.data;
                        this.notPayData = this._getQuery.notPayable(this.data);
                        logger.error("info_data!!!!!:", this.info_data);
                        logger.error("data:", this.data);
                        this._getQuery.checkData(this.data);
                        //預設全選
                        let set_val = (this.checkAllFlag) ? false : true;
                        this.checkAllFlag = set_val;
                        this.data.forEach(item => {
                            this.onCheck(item, set_val);
                        });
                        // this.account = this._getQuery.accountSet();
                    },
                    (errorObj) => {
                        errorObj['type'] = 'dialog';
                        this._handleError.handleError(errorObj);
                        this.onBackPageData({}, '');
                    });
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }

    //點擊扣款帳號設定
    onGoAccount() {
        logger.error("into onGoAccount!");
        this.onBackPageData({}, 'go_account');
    }

    //點擊其中一筆
    onCheck(item, set_val?: boolean) {
        let error_message = '';
        let isShowMsg = true;
        // let onChecked = checkButton.checked;
        if (typeof set_val === 'undefined') {
            // 子層click (值的反轉)=>判斷點下後*要不要勾選
            if (item.showCheck) {
                set_val = false; //相反值(checked動作)
            } else {
                set_val = true;
            }
        } else {
            // 全選click
            isShowMsg = false;
            // logger.error(set_val);
        }

        if (item.isPayable == '1') {
            set_val = false;
            error_message = '您尚有醫療費用需臨櫃繳納，請您臨櫃辦理。';
        }

        // this._logger.error(item.isPayable, set_val);
        item.showCheck = set_val;
        if (isShowMsg && error_message !== '') {
            this._handleError.handleError({
                type: 'dialog',
                title: 'POPUP.NOTICE.TITLE',
                content: error_message
            });
        }
        logger.error("2:data:", this.data);
        this.amountData = this._getQuery.checkAmount(this.data);
        logger.error("amountData:", this.amountData);
    }

    //點擊全選
    onCheckAll() {
        // let selectAll = allSelect.checked;
        let set_val = (this.checkAllFlag) ? false : true;
        this.checkAllFlag = set_val;
        this.data.forEach(item => {
            this.onCheck(item, set_val);
        });
    }

    //立即繳費
    public onPaymentNow() {
        //檢核是否安裝憑證
        if (this.ca_flag == false) {
            this._handleError.handleError({
                type: 'dialog',
                title: 'POPUP.NOTICE.TITLE',
                content: "目前您的轉帳機制欄位不得為空"
            });
            return false;
        } else {
            let onPayResult = [];
            this.data.forEach(item => {
                if (item['showCheck'] == true) {
                    let tmp = {};
                    tmp['accountId'] = item['accountId'];
                    tmp['clinicDate'] = item['clinicDate'];
                    tmp['patientOwnAmount'] = item['patientOwnAmount'];
                    onPayResult.push(tmp);
                }
            });
            if (onPayResult.length <= 0) {
                this.error_message = 'Payment failed!';
            }
            this.requestData.details.detail = onPayResult;

            if (this.amountData['count'] < 1 || this.amountData['amount'] < 1) {
                this._handleError.handleError({
                    type: 'dialog',
                    title: 'POPUP.NOTICE.TITLE',
                    content: "請選擇繳納之醫療費用。"
                });
                return false;
            }
            this.requestData['custId'] = this.inputData['custId'];
            this.requestData['hospitalId'] = this.inputData['hospitalId'];
            this.requestData['branchId'] = this.inputData['branchId'];
            this.requestData['personId'] = this.inputData['personId'];
            this.requestData['queryTimeFlag'] = this.info_data['queryTimeFlag'];
            this.requestData['trnsAcctNo'] = this.info_data['trnsAcctNo'];
            this.requestData['totalCount'] = (this.amountData['count']).toString();
            this.requestData['totalAmount'] = (this.amountData['amount']).toString();
            this.requestData['businessType'] = this.info_data['businessType'];
            this.requestData['trnsToken'] = this.info_data['trnsToken'];
            this.requestData['isMySelfPayment'] = this.info_data['isMySelfPayment'];
            logger.error("requestData:", this.requestData);
            // 點擊後顯示:進下一頁
            this.goConfirm = true;
        }
    }

    //點擊取消
    onCancel() {
        this.onBackPageData({}, '');
    }

    //安控檢核
    securityOptionBak(e) {

        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.requestData.SEND_INFO = e.sendInfo;
        } else {
            // do errorHandle 錯誤處理 推業或POPUP

            e.ERROR['type'] = 'message';
            this._handleError.handleError(e.ERROR);
        }
    }

    /**
 * 重新設定page data
 * @param item 
 */
    onBackPageData(item, set_type?) {
        let output = {
            'page': 'ntuh-paylist',
            'type': 'back',
            'data': item
        };
        if (set_type !== '') {
            output.page = set_type;
        }
        logger.error("output.page:", output.page);
        this.backPageEmit.emit(output);
    }

    /**
* 子層返回事件(接收回傳)
* @param e 
*/
    onBackPage(e) {
        this._logger.step('NEWS', 'onBackPage', e);
        let page = '';
        let pageType = '';
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
        if (page == 'ntuh-confirm') {
            this.goConfirm = false;

            this._headerCtrl.setLeftBtnClick(() => {
                this._confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
                    title: '提醒您'
                }).then(
                    () => {
                        //確定
                        this.onBackPageData({}, '');
                    },
                    () => {

                    }
                );
            });
        }
    }

    /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(e) {
        this._logger.step('Hospital', 'onErrorBackEvent', e);
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

        this._logger.error('back', errorObj, e);

        switch (page) {
            case 'ntuh-confirm':
                // == 內容返回(先顯示列表再顯示錯誤訊息) == //
                this.onBackPage('list');
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                break;
        }
    }
}