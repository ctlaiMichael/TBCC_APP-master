/**
 * Header
 */
import { Component, OnInit, Input, Output, Renderer2, NgZone, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { AgreedAccountService } from '@pages/user-set/shared/service/agreedAccount.service';
import { AccountCheckUtil } from '@shared/util/check/data/account-check-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { DateUtil } from '@shared/util/formate/date/date-util';

@Component({
    selector: 'app-add-agreed-acnt-page',
    templateUrl: './add-agreed-acnt-page.component.html',
    styleUrls: [],
    providers: [AgreedAccountService]
})
/**
  * 新增約定帳號
  */
export class AddAgreedAcntPageComponent implements OnInit {
    @Input() editData;
    @Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();  // 返回上一頁
    private have_papa = false;

    //約定帳號
    agreeAccList = [];
    //銀行列表
    bankList = [];
    //合庫本人可約定帳戶列表
    selfAccList = [];

    //INPUT欄位
    userAcnt = {
        "custId": '',//身分證
        "bankNo": '',           //銀行別
        "accountNo": '',        //帳號
        "accountNickName": '',  //好記名稱
        "currency": '',         //幣別
        "bankAllname": '006-合作金庫商業銀行',       //顯示於確認頁之轉入行庫名稱
        "USER_SAFE": '2',        //安控模式
        "SEND_INFO": {
            'status': false,
            'serviceId': ''
        }
    };


    trnsType: string = '1';   //交易型態 預設為合庫本人
    // selectAcnt;
    // selectBank;

    easyName: string = '';
    //check error
    errorMsg: any = { 'easyName': '', 'errAcnt': '', 'bankNo': '', "currency": '' };
    // popFlag = false;
    //頁面切換
    pageModify = 'edit';
    showPage = '';
    //結果頁內容
    successMsg = "新增約定帳號成功";
    successContent = [];
    transactionObj = {
        serviceId: 'FG000406',
        categoryId: '7',
        transAccountType: '1',
    };
    certyfiiOutput: any;

    constructor(
        private _logger: Logger
        , private _mainService: AgreedAccountService
        , private router: ActivatedRoute
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private navgator: NavgatorService

    ) { }

    ngOnInit() {
        this.trnsTypeChg();
        this.getAcntSelf();

        //取得約定帳號
        // this.getAgreeAccount('');
        // this.getBank();
        this.userAcnt.SEND_INFO = this.editData.SEND_INFO;
        this.userAcnt.SEND_INFO.serviceId = 'FG000406';
        this.userAcnt.USER_SAFE = this.editData.USER_SAFE;

        this._headerCtrl.updateOption({
            'title': '新增約定轉入帳號'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            console.log('click back');
            this.cancelEdit();
        });

        if (!!this.editData) {
            this.have_papa = true;
        }
    }
    // 跳出popup是否返回
    cancelEdit() {
        if (this.showPage == 'bankPage') {
            this.showPage = 'edit';
        } else {
            this.confirm.show('您是否放棄此次編輯?', {
                title: '提醒您'
            }).then(
                () => {
                    // 確定
                    if (this.have_papa) {
                        this.backToEdit.emit({
                            type: 'add-page',
                            value: 'back'
                        });
                    } else {
                        this.navgator.push('user-set');
                    }
                },
                () => {

                }
            );
        }
    }
    toEditPage(e) {
        if (e) {
            this._headerCtrl.setLeftBtnClick(() => {
                this.cancelEdit();
            });

            this.pageModify = 'edit';
        }
    }
    trnsTypeChg() {
        if (this.trnsType == '1') {
            this.userAcnt.bankAllname = '006-合作金庫商業銀行';
        } else {
            this.userAcnt.bankNo = '';
            this.userAcnt.accountNo = '';
            this.userAcnt.bankAllname = '';
        }
        this.userAcnt.accountNo = '';

    }
    //轉入行庫
    bankChoose() {
        // this.getBank();
        //如果是合庫本人則直接談出可選擇帳號
        if (this.trnsType == '1') {
            this.acntChoose();
        } else {
            this.showPage = 'bankPage';

        }
    }
    //轉入行庫選擇完
    getBankCode(e) {
        this.showPage = '';
        this.userAcnt.bankNo = e.bankcode;
        this.userAcnt.bankAllname = e.bankName;
    }
    //轉入帳號
    acntChoose() {

        if (this.trnsType == '1') {
            this.showPage = 'chooseAccPage';
        } else {

        }
    }
    //選擇完個人約定轉入帳號
    acntChooseClose(flag) {

        this.userAcnt.bankAllname = "006-合作金庫銀行";
        if (flag == '1') {
            this.userAcnt.accountNo == '';
        }
        this.showPage = '';
    }

    // /**
    //  * 取得銀行列表
    //  */
    // getBank(): Promise<any> {
    //     return this._mainService.getBank().then(
    //         (res) => {
    //             if (res.hasOwnProperty('info_data') && typeof res['info_data'] === 'object') {
    //                 this.bankList = res['info_data'];
    //             }
    //         },
    //         (errorObj) => {
    //             errorObj['type'] = 'dialog';
    //             this._handleError.handleError(errorObj);
    //         }
    //     );
    // }
    /**
   * 取得合庫本人可約定帳號查詢
   */
    getAcntSelf(): Promise<any> {
        return this._mainService.getAcntSelf().then(
            (res) => {
                if (res.hasOwnProperty('info_data') && typeof res['info_data'] === 'object') {
                    this.selfAccList = res['info_data'];
                }

            },
            (errorObj) => {
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
            }
        );
    }

    //確認頁點選確認彈出pop憑證視窗
    goResult(e) {
        // this.popFlag = true;
        // this.certyfiiOutput = e;
        // this.onSend(e);


        if (e.securityResult.ERROR.status == true) {
            this.onSend(e);
        } else {

        }
    }
    //監聽憑證回傳之output
    onVerifyResult(e) {
        if (e) {
            // this.popFlag = false;
            this.onSend(this.certyfiiOutput);
        }
    }
    /**
      * 送電文
      */
    onSend(security) {
        this._mainService.onSend(this.userAcnt, security).then(
            (res) => {
                let successArr = {};
                if (res.hasOwnProperty('info_data')) {
                    successArr = res.info_data;
                    this.successContent = [{ title: '交易時間', detail: DateUtil.transDate(successArr['trnsDateTime']) },
                    { title: '交易序號', detail: successArr['trnsNo'] }, { title: '轉入行庫', detail: this.userAcnt.bankAllname },
                    { title: '轉入帳號', detail: successArr['accountNo'] }, { title: '好記名稱', detail: successArr['accountNickName'] }
                    ];
                    this.pageModify = 'result';

                };
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            });
    }



    //     /**
    //     * 檢查並前往下一頁
    //     */
    checkEvent() {

        if (!this.userAcnt.SEND_INFO['status']) {
            //error handle
            let errorObj = {
                type: 'dialog',
                content: this.userAcnt.SEND_INFO['message'],
                message: this.userAcnt.SEND_INFO['message']
            };
            this._handleError.handleError(errorObj);
            return;
        }
        const check_obj = this._mainService.checkNickName(this.userAcnt.accountNickName);

        let checkacnt = this.userAcnt.accountNo.replace(/-/g, '');
        const check_act = AccountCheckUtil.checkActNum(checkacnt);

        //幣別
        if (this.userAcnt.currency == "") {
            this.errorMsg.currency = "CHECK.CURRENCY";
        } else {
            this.errorMsg.currency = "";
        };
        //帳號
        if (check_act.status) {
            this.errorMsg.errAcnt = '';
        } else {
            this.errorMsg.errAcnt = check_act.msg;
        };
        //轉入行庫
        if (this.trnsType == '1') {
            this.errorMsg.bankNo = '';
            this.userAcnt.bankNo = '006';
        }
        if (this.trnsType == '2' && this.userAcnt.bankNo == '') {
            this.errorMsg.bankNo = 'CHECK.BANK';
        }
        //好記名稱
        if (check_obj.status) {
            this.errorMsg.easyName = '';
        } else {
            this.errorMsg.easyName = check_obj.error_list;
        };

        if (check_act.status && check_obj.status && this.errorMsg.easyName == '' && this.errorMsg.currency == '') {
            this.pageModify = 'confirm';
        };

        // let safeObj = { USER_SAFE: this.nowType['id'], action: action, custId: this.custId };
        // this.userAcnt = Object.assign(this.userAcnt, safeObj);

    }
    // securityOptionBak(e) {
    //     if (e.status) {
    //         // 取得需要資料傳遞至下一頁子層變數
    //         this.userAcnt.SEND_INFO = e.sendInfo;
    //         this.userAcnt.USER_SAFE = e.sendInfo.selected;
    //     } else {
    //         e.ERROR['type'] = 'message';
    //         this._handleError.handleError(e.ERROR);
    //     }
    // }
}
