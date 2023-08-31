/**
 * 約定轉入帳號設定
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AgreedAccountService } from '../shared/service/agreedAccount.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ObjToEmptyPipe } from '@shared/formate/string/string-formate.pipe';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
@Component({
    selector: 'app-agreed-account-page',
    templateUrl: './agreed-account-page.component.html',
    styleUrls: [],
    providers: [AgreedAccountService]
})
/**
  * 約定帳號設定
  */
export class AgreedAccountPageComponent implements OnInit {

    // 查詢回之資料
    agreedArr = [];
    accReady = false;   // Tim 新增
    //修改之資料
    editData = {
        'trnsInBank': '',
        'trnsInAccnt': '',
        'accntName': '',
        'createDate': '',
        'accntNickName': '',
        'USER_SAFE': '',
        'SEND_INFO': ''
    };
    dataTime = '';
    successMsg = '註銷約定轉入帳號成功';
    successContent = [];
    succData = {};
    notice;
    // safeType = [];    //全部轉帳機制
    // nowType;    //select預設之轉帳機制
    pageType: string = 'search';    // 預設進入查詢頁


    popFlag = {
        // safe: false,    //憑證  // 20190821@wei 關閉頁面popup
        attest: false,  // 尚未認證
        later: false,   // 稍後認證
        notyear: false,  // 尚未啟用裝置認證密碼
        exceed: false,   // 超過綁定數量
    };
    transactionObj = {
        serviceId: 'FG000402',
        categoryId: '7',
        transAccountType: '1',
    };
    private _defaultHeaderOption: any;

    constructor(
        private _logger: Logger
        , private _mainService: AgreedAccountService
        , private router: ActivatedRoute
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private authService: AuthService
        , private _uiContentService: UiContentService
    ) { }

    ngOnInit() {

        // this.getAccount();   Tim註解
        // 模擬取得安控以及預設SSL
        // this.safeType = this._mainService.get_security('data');
        // if (typeof this.safeType === 'object' && this.safeType[0].hasOwnProperty('id')) {
        //     this.nowType = this.safeType[0];
        // }

        this._defaultHeaderOption = this.navgator.getHeader();
    }

    // 確認頁返回編輯頁
    toEditPage(e) {
        if (!!e) {
            this._headerCtrl.updateOption(this._defaultHeaderOption);
            this.pageType = 'search';
            this._uiContentService.scrollTop();
        }
    }
    /**
    * 取得約定帳號
    */
    getAccount(): Promise<any> {
        return this._mainService.getAgreedAccount().then(
            (res) => {


                if (res.hasOwnProperty('data')) {
                    this.agreedArr = res.data;

                }
                if (res.hasOwnProperty('dataTime')) {
                    this.dataTime = res.dataTime;
                }
                this.accReady = true; // Tim 新增


            },
            (errorObj) => {

                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
            }
        );
    }
    /**
    * 註銷約定帳號/新增
    */
    modifyData(editData?) {

        let userData = this.authService.getUserInfo();

        //安控
        if (!this.editData.SEND_INFO['status']) {
            //error handle
            let errorObj = {
                type: 'dialog',
                content: this.editData.SEND_INFO['message'],
                message: this.editData.SEND_INFO['message']
            };
            this._handleError.handleError(errorObj);
            return;
        }


        // 判斷走註銷or新增流程
        if (editData) { // 註銷流程
            this.transactionObj = {
                serviceId: 'FG000402',
                categoryId: '7',
                transAccountType: '1',
            };
            this.pageType = 'modify';

            this.editData.accntName = editData.accntName;
            this.editData.accntNickName = editData.accntNickName;
            this.editData.createDate = editData.createDate;
            this.editData.trnsInAccnt = editData.trnsInAccnt;
            this.editData.trnsInBank = editData.trnsInBank;
        } else {
            // 新增流程

            // 未開放線上約定轉入帳號註記狀態
            if (userData.isOlnATrnsInAcct != '1') {
                this._handleError.handleError({
                    type: 'dialog',
                    title: 'FIELD.INFO_TITLE',
                    content: "您尚未同意開放線上約定轉入帳號，請親持身分證、原申請網路銀行的存摺印鑑就近至本行任一分行辦理。"
                });
                return false;
            }


            if (this.editData.USER_SAFE == '1') {     // 選擇SSL
                // 裝置認證檢查，尚未申請裝置認證  先關閉(native已mark起來)
                // if (userData.BoundID != '4') {        //尚未認證
                //     this.popFlag.attest = true;
                //     return false;
                // } else {
                //     this.popFlag.safe = true;         //認證完成
                //     return false;
                // }

                // 20190821@wei 關閉頁面popup
                // this.popFlag.safe = true;
                this._mainService.popupShow('safe');
                return false;
            } else {                                  // 選擇憑證
                // 新增約定帳號安控只能使用憑證
                this.transactionObj = {
                    serviceId: 'FG000406',
                    categoryId: '7',
                    transAccountType: '1',
                };
                this.pageType = 'add';
            }
        }
        this._uiContentService.scrollTop();

    }


    // 現行本功能不開放OTP做設定 wei@20190821
    // 20190821@wei 關閉頁面popup
    // popClose(type) {

    //     switch (type) {
    //         // 20190821@wei 關閉頁面popup
    //         // case 'safe':
    //         //     this.popFlag.safe = false;
    //         //     break;

    //         case 'attestY':     // 立即申請
    //             // 判斷boundId狀態
    //             this.popFlag.attest = false;
    //             if (this.authService.getUserInfo().BoundID == '2') {        // 已申請且裝置未認證，認證密碼有效
    //                 this.popFlag.notyear = true;
    //             } else if (this.authService.getUserInfo().BoundID == '5') { // 歸戶身分證已申請5組
    //                 this.popFlag.exceed = true;
    //             } else if (this.authService.getUserInfo().BoundID == '1' || this.authService.getUserInfo().BoundID == '3') {    //未申請or已申請且裝置未認證，認證密碼逾期
    //                 this.navgator.push('user-set', {});
    //             }
    //             break;
    //         case 'attestN':     // 稍後申請
    //             this.popFlag.attest = false;
    //             this.popFlag.later = true;
    //             break;
    //         case 'later':       // 稍後申請確定
    //             this.popFlag.later = false;
    //             break;
    //         case 'notyearY':     // 申請未超過時效，選擇是，連結至「啟用裝置認證畫面」
    //             this.popFlag.notyear = false;
    //             this.navgator.push('user-set', {});
    //             break;
    //         case 'notyearN':     // 申請未超過時效，選擇否
    //             this.popFlag.notyear = false;
    //             break;
    //         case 'exceed':      // 超過綁定數量
    //             this.popFlag.exceed = false;
    //             break;

    //     }
    //     // 20190821@wei 關閉頁面popup
    //     // this.popFlag.safe = false;


    //     // let userData = this.authService.getUserInfo();
    //     // if (userData.BoundID == '2') {         //已申請且裝置未認證，認證密碼有效
    //     //     this.popFlag.notyear = true;
    //     // } else if (userData.BoundID == '5') {   //超過綁定數量
    //     //     this.popFlag.exceed = true;
    //     // }
    // }

    goResult(e) {

        if (e.securityResult.ERROR.status == true) {
            this.onSend(e);
        } else {

        }
    }

    /**
     * 送電文
     */
    onSend(security) {
        this._mainService.onSendRemove(this.editData, security).then(
            (res) => {
                this.succData = res.info_data;

                if (typeof this.editData['accntName'] !== 'string') {
                    this.editData['accntName'] = '';
                };
                this.successContent = [{ title: '交易時間', detail: DateUtil.transDate(this.succData['trnsDateTime']) },
                { title: '交易序號', detail: this.succData['trnsNo'] },
                { title: '轉入行庫', detail: this.succData['bank'] },
                { title: '轉入帳號', detail: this.succData['account'] },
                { title: '申請日期', detail: DateUtil.transDate(this.editData['createDate'], 'date') },
                { title: '帳號名稱', detail: this.editData['accntName'] },
                { title: '狀態', detail: this.editData['trnsInSetType'] == '1' ? '臨櫃約定' : '線上約定' },
                ];
                this.notice = '如預約定新帳號請持身份證、原申請網路銀行的存款印鑑就近至本行任一分行辦理，或於網路銀行/行動網銀線上辦理。';
                if (res.status) {

                }
                this.pageType = 'result';
            },
            (errorObj) => {

                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            });
    }
    securityOptionBak(e) {
        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.editData.SEND_INFO = e.sendInfo;
            this.editData.USER_SAFE = e.sendInfo.selected;
            if (this.accReady == false) { // Tim新增
                this.getAccount();
            }
        } else {
            e['type'] = 'message';
            this._handleError.handleError(e.ERROR);
        }
    }


}
