/**
 * 繳費清單(checkbox)=>本人帳戶、信用卡(選單)
 * 
 * 
 */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { BranchBillService } from '@pages/hospital/shared/service/branch-bill.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { CryptoService } from '@lib/plugins/crypto.service';
import { StartAppService } from '@lib/plugins/start-app/start-app.service';
import { logger } from '@shared/util/log-util';
import { FormateService } from '@shared/formate/formate.service';

@Component({
    selector: 'app-bill-list',
    templateUrl: 'bill-list-page.component.html',
    styleUrls: [],
    providers: [BranchBillService]
})

export class BillListPageComponent implements OnInit {
    @Input() inputData: any;
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() disableATMObj: any;
    //上一頁傳來的資料
    checkAllFlag = false; // 全選的checkbox
    reqData = {
        custId: '', //身分證字號
        hospitalId: '',
        branchId: '',
        personId: '', //身分證字號，若有登入，則帶入登入者身分證號
        birthday: '', //出生年月日，若為產險，填入空白
        licenseNo: '', //車牌號碼，若為醫療，填入空白
    };

    data1 = []; //當日： kind = 0;
    data2 = []; //非當日 kind = 1;
    data = []; //整合data1、data2資料，會照kind順序排列
    info_data: any = {};
    data_details: any = {};
    error_message = '';
    amountData: any = { //接service checkAmount()回傳
        amount: '0',
        count: '0'
    };
    showData = true; //是否顯示資料(後端)
    showDetailData = false; //是否顯示資料(後端)
    isCheckData = [];

    //存放(傳入下一頁)
    requestData: any = {};
    requestData_debit: any = {};

    // showHospital = true;
    // showInsurance = true;
    goNextPage = false; //顯示本人帳戶、信用卡(選單)
    goEditPage = false; //顯示子層(編輯頁)
    goCreditPage = false;
    vghtpCheck = false; //判斷是否為台北榮民總醫院 => 顯示：就醫時間
    channel = ""; //分辨: 醫療:1、產壽:2

    hospitalName = '醫療費清單';

    H_bank = false; //繳費選單，顯示：活期性存款帳戶
    I_bank = false; //繳費選單，顯示：本人帳戶
    H_icCard = false; //繳費選單，顯示：行動ATM
    I_icCard = false; //繳費選單，顯示：金融卡繳費
    creditCard = false; //繳費選單，顯示：信用卡繳費
    personIdHidden = ''; //身分證隱碼
    constructor(
        private _mainService: BranchBillService
        , private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private confirm: ConfirmService
        , private cryptoService: CryptoService
        , private startAppService: StartAppService
        , private _formateService: FormateService
    ) { }

    ngOnInit() {
        this._initEvent();

       

        logger.error("inputData!!:", this.inputData);
        if (this.inputData['hospitalId'] == 'VGHTP') {
            this.vghtpCheck = true;
        }
        let dt = new Date();
        logger.error("dt：", dt);
        // if (this.inputData.channel == "1") {
        //     this.showHospital = true;
        //     this.showInsurance = false;
        // } else {
        //     this.showHospital = false;
        //     this.showInsurance = true;
        // }

        //將上一頁輸入的值，和前面電文蒐集到的欄位值，加入reqData
        this.reqData.hospitalId = this.inputData.hospitalId;
        this.reqData.branchId = this.inputData.branchId;
        this.reqData.personId = this.inputData.personId;
        this.reqData.birthday = this.inputData.birthday;
        this.reqData.custId = this.inputData.custId;
        this.reqData.licenseNo = this.inputData.licenseNo;
        logger.error("reqData:", this.reqData);
        this.channel = this.inputData.channel;

        this._mainService.getData(this.reqData, this.channel).then(
            (result) => {
                this.info_data = result.info_data;
                this.data_details = result.data_details;
                this.data1 = result.data1; //當日kind = 0;
                this.data2 = result.data2; //當日kind = 1;
                this.data = this.data1.concat(this.data2);
                this.isCheckData = result.tmp;
                this.showData = true;
                this.showDetailData = true;
                //身分證隱碼
                this.personIdHidden = this._formateService.transIdentity(this.info_data['personId']);
                // this.personIdHidden = (this.info_data['personId'].slice(0, 3) + "*****"
                //     + this.inputData['personId'].slice(8, 10));
                // logger.error("info_data:", this.info_data);
                // logger.error("data_details:", this.data_details);
                // logger.error("data1:", this.data1);
                // logger.error("data2:", this.data2);
                // logger.error("data:", this.data);
                // logger.error("isCheckData:", this.isCheckData);

                //執行(檢核isPayable值，是否要勾選)
                //=>回傳檢核過的data(拿到view顯示)
                this._mainService.checkData(this.data);
                this.amountData = this._mainService.checkAmount(this.data);
                // logger.error("amountData:", this.amountData);
                // logger.error("data!:", this.data);
            },
            (errorObj) => {
                this._logger.step('Hospital', 'getData', errorObj);
                this.showData = false;
                this.showDetailData = false;
                // this.onErrorBackEmit(errorObj);
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );

        //判斷顯示：本人帳戶繳費 or 活期性存款帳戶
        if (this.channel == '1' && this.inputData.eBillTrns == 'Y') {
            this.H_bank = true;
            this.I_bank = false;
        }
        if (this.channel == '2' && this.inputData.eBillTrns == 'Y') {
            this.H_bank = false;
            this.I_bank = true;
        }
        //判斷顯示：信用卡
        if (this.inputData.creditCardTrns == 'Y') {
            this.creditCard = true;
        }
        //判斷顯示：行動ATM or 金融卡繳費
        if (this.channel == '1' && this.inputData.icCardTrns == 'Y') {
            // if(canOpenmATM == 'Y') {
            this.H_icCard = true;
            this.I_icCard = false;
            // }
        }
        if (this.channel == '2' && this.inputData.icCardTrns == 'Y') {
            // if(canOpenmATM == 'Y') {
            this.I_icCard = true;
            this.H_icCard = false;
            // }
        }
    }

    /**
     * 啟動事件
     */
    private _initEvent() {
        if (this.inputData.channel == '2') {
            this.hospitalName = '保險費清單';
        }

        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back',
            'title': this.hospitalName
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
    }

    //跳出popup是否返回
    cancelEdit() {
        this.confirm.show('POPUP.CANCEL_ALERT.CONTENT', {
            title: '提醒您'
        }).then(
            () => {
                //確定
                this.onErrorBackEmit({}, 'cancel-edit');
            },
            () => {

            }
        );
    }

    //點選取消
    onCancel(type: string) {
        this.cancelEdit();
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

        if (item.isPayable == '2' && this.channel == '1') {
            set_val = true;
            error_message = '該項目為必繳項目，無法取消';
        } else if (item.isPayable == '2' && this.channel == '2') {
            set_val = true;
            error_message = '該項目為必繳項目，無法取消';
        }
        else if (item.isPayable == '1' && this.channel == '1') {
            set_val = false;
            // error_message = '您尚有醫療費用需臨櫃繳納，請您臨櫃辦理。';
            error_message = '該項目為臨櫃繳費項目，無法選擇';
        } else if (item.isPayable == '1' && this.channel == '2') {
            set_val = false;
            // error_message = '您尚有保險費用無法進行網路繳納，請您臨櫃辦理。';
            error_message = '該項目為臨櫃繳費項目，無法選擇';
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
        this.amountData = this._mainService.checkAmount(this.data);
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
        let onPayResult = []; //送request用，共用(除了金融卡)
        let onPayResult_icard = []; //金融卡用






        //檢核有無選擇費用  
        if (this.amountData['count'] < 1 || this.amountData['amount'] < 1) {
            this._handleError.handleError({
                type: 'dialog',
                title: 'POPUP.NOTICE.TITLE',
                content: "請選擇繳納之醫療費用。"
            });
            return false;
        } else {
            //共用(除了金融卡)   ----------------------------------
            this.data.forEach(item => {
                if (item['showCheck'] == true) {
                    let tmp = {};
                    tmp['accountId'] = item['accountId'];
                    tmp['clinicDate'] = item['clinicDate'];
                    tmp['amount'] = item['amount'];
                    // tmp['kind'] = item['kind'];
                    onPayResult.push(tmp);
                    logger.error("onPayResult:", onPayResult);
                }
            });

            if (onPayResult.length <= 0) {
                this.error_message = 'Payment failed!';
            }
            if (typeof this.requestData === 'object' && typeof this.requestData['details'] === 'undefined') {
                this.requestData = {
                    details: {}
                }
            }
            this.requestData['details']['detail'] = onPayResult;
            this.requestData['queryTime'] = this.info_data['queryTime'];
            this.requestData['totalCount'] = (this.amountData['count']).toString();
            this.requestData['totalAmount'] = (this.amountData['amount']).toString();
            this.requestData['custId'] = this.inputData['custId'];
            this.requestData['hospitalId'] = this.inputData['hospitalId'];
            this.requestData['branchId'] = this.inputData['branchId'];
            this.requestData['personId'] = this.inputData['personId'];
            logger.error("requestData:", this.requestData);
            // ----------------------------------

            //融卡用  ----------------------------------
            this.data.forEach(item => {
                if (item['showCheck'] == true) {
                    let tmp2 = {};
                    tmp2['accountId'] = item['accountId'];
                    tmp2['dateTime'] = item['clinicDate'];
                    tmp2['amount'] = item['amount'];
                    // tmp['kind'] = item['kind'];
                    onPayResult_icard.push(tmp2);
                    logger.error("onPayResult_icard:", onPayResult_icard);
                }
            });

            if (onPayResult_icard.length <= 0) {
                this.error_message = 'Payment failed!';
            }
            if (typeof this.requestData_debit === 'object' && typeof this.requestData_debit['details'] === 'undefined') {
                this.requestData_debit = {
                    details: {}
                }
            }
            this.requestData_debit['details']['detail'] = onPayResult_icard;
            this.requestData_debit['dateTime'] = this.info_data['queryTime'];
            this.requestData_debit['totalCount'] = (this.amountData['count']).toString();
            this.requestData_debit['totalAmount'] = (this.amountData['amount']).toString();
            this.requestData_debit['custId'] = this.inputData['custId'];
            this.requestData_debit['hospitalId'] = this.inputData['hospitalId'];
            this.requestData_debit['branchId'] = this.inputData['branchId'];
            this.requestData_debit['personId'] = this.inputData['personId'];
            logger.error("requestData_debit:", this.requestData_debit);
            //--------------------------------------------
        }

        // 點擊後顯示:本人帳戶、信用卡選單
        this.goNextPage = true;
    }

    //------ 本人帳戶、信用卡(選單) -------
    public goBank() {
        let ctotalAmount = 0; //當日費用 總金額
        logger.error("requestData['details']['detail']:", this.requestData['details']['detail']);
        ctotalAmount = parseInt(this.requestData['totalAmount']);
        if (ctotalAmount > 100000) {
            this._handleError.handleError({
                type: '我知道了',
                title: '提醒您',
                content: '提醒您，本服務繳付限額，每一轉出帳戶每日不得超過新臺幣（下同）10萬元，每月不得超過20萬元。如轉出金融機構之限額低於前述規定，則依轉出金融機構之規定辦理。」'
            });
            this.goEditPage = false;
            return false;
        } else {
            this.goEditPage = true;
        }
    }

    public goCreditCard() {
        this.goCreditPage = true;
    }

    public goDebidCard() {

        this.confirm.show('您將使用金融卡進行交易，請備妥您的行動讀卡機及金融卡，是否繼續交易？', {
            title: '提醒您'
        }).then(
            () => {
                //確定
                this.debitXmlGo(this.requestData_debit);
            },
            () => {

            }
        );
    }

    debitXmlGo(set_data) {
        this._mainService.getDebitCardNumber(set_data).then(
            (res) => {
                let tmp_html;
                tmp_html = '';
                tmp_html += "<?xml version=\"1.0\" encoding=\"Big5\"?>";
                tmp_html += "<CardBillRq>";
                tmp_html += "<SendSeqNo>" + res.info_data.sendSeqNo + "</SendSeqNo>";
                tmp_html += "<TxType>" + res.info_data.txType + "</TxType>";
                tmp_html += "<PAYNO>" + res.info_data.payNo + "</PAYNO>";
                tmp_html += "<PayType>" + res.info_data.payType + "</PayType>";
                // tmp_html += "<UserData>" + this.disableATMObj.branchName + "</UserData>";
                tmp_html += "<UserData></UserData>";
                tmp_html += "<ONO>" + res.info_data.refNo + "</ONO>";
                tmp_html += "<AcctIdTo>" + res.info_data.refNo + "</AcctIdTo>";
                tmp_html += "<CurAmt>" + res.info_data.totalAmount + "</CurAmt>";
                tmp_html += "<PayDt>" + res.info_data.payDt + "</PayDt>";
                tmp_html += "<MAC>" + res.info_data.mac + "</MAC>";
                tmp_html += "<RsURL>iTCBLaunchFromPayBill://</RsURL>";//iTCBLaunchFromPayBill://String.format("%s://", 'iTCBLaunchFromATM') )
                tmp_html += "</CardBillRq>";

                logger.error('tmp_html', tmp_html);
                // let a='PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxDYXJkQmlsbFJxPjxTZW5kU2VxTm8+MjAxMzEwMTcxNjA0MTk8L1NlbmRTZXFObz48VHhUeXBlPjI1NjA8L1R4VHlwZT48UEFZTk8+MDA2ODk5NjcxNjYwMDAxPC9QQVlOTz48UGF5VHlwZT41MDA3ODwvUGF5VHlwZT48VXNlckRhdGE+JiN4NkUyQzsmI3g4QTY2OyYjeDhDQzc7JiN4NjU5OTtDb21tQTwvVXNlckRhdGE+PE9OTz4wMDAxMDAwMjAwMDMwMDA0PC9PTk8+PEFjY3RJZFRvPjA4NzgwNjAxNTUwMzQ8L0FjY3RJZFRvPjxDdXJBbXQ+MDAwMDAwMDEyMzQ8L0N1ckFtdD48UGF5RHQ+OTk5OTEyMzE8L1BheUR0PjxSc1VSTD5jb21tQTovLzwvUnNVUkw+PE1BQz5xdVAvZVBYRmhFRUkzMVlvdW42b0NXZ2Zxd3FyYVFxSDwvTUFDPjwvQ2FyZEJpbGxScT4K';
                this.cryptoService.Base64Encode(tmp_html).then(
                    (result) => {
                        logger.error('Base64Encode', result);
                    
                        let finalUrl = '';
                        finalUrl = encodeURIComponent(result.value);   // urlEncoding
                        console.error('Base64EncodeURL', finalUrl);
                        this.startAppService.startAppParam('debitcard', 'debit', finalUrl);
                    }, (errorObj) => {
                        logger.error('Base64Encode errorObj', errorObj);
                        errorObj['type'] = 'message';
                        this._handleError.handleError(errorObj);
                    }
                );


            },
            (rej) => {

            }
        )
    }

    /**
   * 頁面切換
   * @param pageType 頁面切換判斷參數
   *        'list' : 顯示額度使用明細查詢頁(page 1)
   *        'content' : 顯示額度使用明細結果頁(page 2)
   * @param pageData 其他資料
   */
    onChangePage(pageType: string, pageData?: any) {
        //如果傳進來的參數為以下狀況 => haspay-query ,page_info, list
        switch (pageType) {
            // case 'list':
            // default: // 分院頁
            //     // --- 頁面設定 ---- //
            //     this._headerCtrl.updateOption({
            //         'leftBtnIcon': 'back',
            //         'title': this.hospitalName
            //     });
            //     this._headerCtrl.setLeftBtnClick(() => {
            //         this.navgator.push(this.type_name); //轉址
            //     });
            //     // --- 頁面設定 End ---- //
            //     break;
        }
    }



    /**
     * 失敗回傳(back)子回傳給父
     * @param error_obj 失敗物件
     */
    onErrorBackEmit(error_obj, type?: string) {
        if (typeof type == 'undefined') {
            type = 'error';
        }
        let output = {
            'page': 'bill-list',
            'type': type,
            'data': error_obj
        };

        this.errorPageEmit.emit(output);
    }

    /**
     * 失敗回傳(接收)
     * @param error_obj 失敗物件
     */
    onErrorBackEvent(e) {
        this._logger.step('Hospital', 'onErrorBackEvent', e);
        let page = 'form';
        let pageType = 'form';
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
        logger.error('back:', page, pageType, errorObj);

        switch (pageType) {
            case 'cancel-edit':
                this.cancelEdit();
                break;
            case 'error':
                this.goNextPage = false;
                this.goCreditPage = false;
                this.goEditPage = false;
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                break;
            default:
                // not do
                this.goNextPage = false;
                this.goCreditPage = false;
                this.goEditPage = false;
                break;
        }
    }
}
