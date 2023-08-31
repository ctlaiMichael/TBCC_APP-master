/**
 * 台大醫院-選單
 * 
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AuthService } from '@core/auth/auth.service';
import { logger } from '@shared/util/log-util';

@Component({
    selector: 'app-ntuh-menu-page',
    templateUrl: 'ntuh-menu-page.component.html',
    styleUrls: [],
    providers: []
})

export class NtuhMenuPageComponent implements OnInit {

    // varbal(存取醫院主選單Component傳來的資料)
    reqData = {
        hospitalId: '',
        branchId: '',
        hospitalName: ''
    };
    //定義醫療or產壽變數
    hospitalName: string = '台大醫院';
    type = "1"; //1: 醫療 , 2: 產壽 (不會發request)

    goHasPay = false; //顯示以繳醫療費用
    goAccountSet = false; //顯示扣款帳號設定
    ntuhMenu = true;
    goNtuhPay = false;
    goQrCode = false;

    //傳給已繳醫療費查詢頁面(台大用)
    //haspayReq.custId存放使用者身分證
    haspayReq = {
        custId: '',
        hospitalId: '',
        branchId: '',
        hospitalName: ''
    }

    constructor(
        private route: ActivatedRoute
        , private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private _formateService: FormateService
        , public authService: AuthService
    ) { }

    ngOnInit() {
        logger.error("into ntuh menu!");
        this._headerCtrl.updateOption({
            'title': '台大醫院醫療費用',
            'style':'normal'
        });
      
        //取得上一頁帶過來的參數(url)
        this.route.queryParams.subscribe(params => {
            if (params.hasOwnProperty('hospitalId') && params.hasOwnProperty('branchId')) {
                // set data
                this.reqData.hospitalId = params.hospitalId; //接到傳參值(url)
                this.reqData.branchId = params.branchId;
                this.reqData.hospitalName = this.hospitalName;
                // this._headerCtrl.updateOption({
                //     'title': params.titleName
                // });
            }
            logger.error('params',params,params.path);
            if(params.hasOwnProperty('path')&&params.path!=null&&this.authService.isLoggedIn()){
                const userData = this.authService.getUserInfo(); //拿使用者資料
                this.haspayReq.custId = userData.custId;
                this.haspayReq.hospitalId = this.reqData['hospitalId'];
                this.haspayReq.branchId = this.reqData['branchId'];
                this.haspayReq.hospitalName = this.reqData['hospitalName'];
                this.onChangePage(params.path);
            }
            // this.onChangePage('list');
        });
        this.authService.redirectUrl = "/hospital/ntuh/ntuh-menu?hospitalId="+this.reqData.hospitalId+"&branchId="+this.reqData.branchId
        +"&hospitalName="+this.reqData.hospitalName;
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('hospital');
        });
    }

    //繳醫療費
    onPayEvent() {
        if (!this.authService.isLoggedIn()) {
            this.authService.redirectUrl= this.authService.redirectUrl+"&path=ntuh-pay";
            this.navgator.push('login'); //導回登入頁
            return false;
        }

        const userData = this.authService.getUserInfo(); //拿使用者資料
        this.haspayReq.custId = userData.custId;
        this.haspayReq.hospitalId = this.reqData['hospitalId'];
        this.haspayReq.branchId = this.reqData['branchId'];
        this.haspayReq.hospitalName = this.reqData['hospitalName'];

        this.onChangePage('ntuh-pay');
        logger.error("haspayReq:", this.haspayReq);
    }

    //已繳醫療費查詢
    onHasPayQuery() {
        if (!this.authService.isLoggedIn()) {
            this.authService.redirectUrl= this.authService.redirectUrl+"&path=haspay-query";
            this.navgator.push('login'); //導回登入頁
            return false;
        }

        const userData = this.authService.getUserInfo(); //拿使用者資料
        this.haspayReq.custId = userData.custId;
        this.haspayReq.hospitalId = this.reqData['hospitalId'];
        this.haspayReq.branchId = this.reqData['branchId'];
        this.haspayReq.hospitalName = this.reqData['hospitalName'];
        // this.goHasPay = true;
        this.onChangePage('haspay-query');
        // this.onChangePage('list');
        logger.error("haspayReq:", this.haspayReq);

        // }
    }

    //扣款帳號設定
    onAccountSetup() {
        if (!this.authService.isLoggedIn()) {
            this.authService.redirectUrl= this.authService.redirectUrl+"&path=account-set";
            this.navgator.push('login'); //導回登入頁
            return false;
        }

        const userData = this.authService.getUserInfo(); //拿使用者資料
        this.haspayReq.custId = userData.custId;
        this.haspayReq.hospitalId = this.reqData['hospitalId'];
        this.haspayReq.branchId = this.reqData['branchId'];
        this.haspayReq.hospitalName = this.reqData['hospitalName'];

        this.onChangePage('account-set');
    }

    //服務條碼區
    onBarCode() {
        this.onChangePage('qr-code-save');
    }

    /**
    * 子層返回事件
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
        if (page == 'ntuh-pay') {
            this.ntuhMenu = true; //顯示台大主選單
            this.goHasPay = false;
            this.goAccountSet = false;
            this.goNtuhPay = false;
            this.goQrCode = false;
            //重新設定header
            this._headerCtrl.updateOption({
                'title': '台大醫院醫療費用'
            });
            //點擊左側返回
            this._headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('hospital');
            });
        }
        if (page == 'account-set') {
            this.ntuhMenu = true; //顯示台大主選單
            this.goHasPay = false;
            this.goAccountSet = false;
            this.goNtuhPay = false;
            this.goQrCode = false;
            //重新設定header
            this._headerCtrl.updateOption({
                'title': '台大醫院醫療費用'
            });
            //點擊左側返回
            this._headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('hospital');
            });
        }
        if (page == 'haspay-query') {
            this.ntuhMenu = true; //顯示台大主選單
            this.goHasPay = false;
            this.goAccountSet = false;
            this.goNtuhPay = false;
            this.goQrCode = false;
            //重新設定header
            this._headerCtrl.updateOption({
                'title': '台大醫院醫療費用'
            });
            //點擊左側返回
            this._headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('hospital');
            });

        }
        //扣款帳號設定，完成前往醫療繳費功能
        if (page == 'goto-pay') {
            this.ntuhMenu = false;
            this.goHasPay = false;
            this.goAccountSet = false;
            this.goNtuhPay = true; //前往繳費
            this.goQrCode = false;
        }
        //台大繳費點選扣款帳號(接收)，導入扣款帳號
        if(page == 'goto-account') {
            this.ntuhMenu = false;
            this.goHasPay = false;
            this.goAccountSet = true;
            this.goNtuhPay = false; //前往繳費
            this.goQrCode = false;
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
        if(page == 'ntuh-paylist-error') {
            this.ntuhMenu = true;
            this.goHasPay = false;
            this.goAccountSet = false;
            this.goNtuhPay = false; //前往繳費
            this.goQrCode = false;
            this._handleError.handleError(errorObj);
            this._headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('hospital');
            });

        }

        switch (page) {
            case 'ntuh-pay':
                // == 內容返回(先顯示列表再顯示錯誤訊息) == //
                this.onBackPage('list');
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
                break;
        }
    }


    /**
    * 頁面切換
    * @param pageType 頁面切換判斷參數
    *        'list' : 顯示額度使用明細查詢頁(page 1)
    *        'content' : 顯示額度使用明細結果頁(page 2)
    * @param pageData 其他資料
    */
    onChangePage(pageType: string, pageData?: any) {
        switch (pageType) {
            case 'haspay-query':
                this.goHasPay = true;
                this.ntuhMenu = false;
                this.goAccountSet = false;
                this.goNtuhPay = false;
                this.goQrCode = false;
                break;
            case 'account-set':
                this.ntuhMenu = false;
                this.goHasPay = false;
                this.goAccountSet = true;
                this.goNtuhPay = false;
                this.goQrCode = false;
                break;
            case 'ntuh-pay':
                this.ntuhMenu = false;
                this.goHasPay = false;
                this.goAccountSet = false;
                this.goNtuhPay = true;
                this.goQrCode = false;
                break;
            case 'qr-code-save':
                this.ntuhMenu = false;
                this.goHasPay = false;
                this.goAccountSet = false;
                this.goNtuhPay = false;
                // this.goQrCode = true;
                this.navgator.push('qr-code-save');
                break;
            case 'back-select-page':
                this.ntuhMenu = true;
                this.goHasPay = false;
                this.goAccountSet = false;
                this.goNtuhPay = false;
                break;
            default: // 分院頁
                this.ntuhMenu = true;
                this.goHasPay = false;
                this.goAccountSet = false;
                this.goQrCode = false;
                // --- 頁面設定 ---- //
                this._headerCtrl.updateOption({
                    'leftBtnIcon': 'back',
                    // 'title': this.hospitalName
                });
                this._logger.error(this.reqData);
                this._headerCtrl.setLeftBtnClick(() => {
                    this.navgator.push('hospital-branch', {}, this.reqData);
                });
                // --- 頁面設定 End ---- //
                break;
        }
    }

}