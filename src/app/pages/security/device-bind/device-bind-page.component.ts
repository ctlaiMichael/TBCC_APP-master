/**
 * 裝置綁定服務
 * default: 裝置綁定服務 > 裝置認證授權 > 啟用裝置認證
 * bound_id=2 & login: 首次登入裝置認證 (不顯示裝置識別碼)
 * bound_id=2: 啟用裝置認證
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { DeviceBindService } from '@pages/security/shared/service/device-bind.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { ActivatedRoute } from '@angular/router';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
@Component({
    selector: 'app-device-bind',
    templateUrl: './device-bind-page.component.html'
})
export class DeviceBindPageComponent implements OnInit {
    /**
     * 參數處理
     */
    data: any;
    editType = 'apply'; // apply 申請頁, bind 綁定頁
    bindId = ''; // boundId類別
    fromStartPage = false; // true 表示從登入轉址進入, false 表示非登入轉址
    // --- main data --- //
    identity = ''; // 裝置識別碼
    inp_data = {
        pswd: ''
    };
    error_data = {
        pswd: ''
    };
    // --- step Bar --- //
    nowStep = '';
    stepMenuData = [];
    // --- step Bar End --- //
    // --- pswd --- //
    inpSetData = {
        // title: '',
        // placeholder: ''
    };
    bind_flag = 'first';
    // --- pswd End --- //
    private back_path = 'user-set'; // 個人設定選單

    constructor(
        private _logger: Logger
        , private _mainService: DeviceBindService
        , private _handleError: HandleErrorService
        , private _formateService: FormateService
        , private route: ActivatedRoute
        , private navgator: NavgatorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
        , private alert: AlertService
    ) { }

    ngOnInit() {
        // --- 頁面設定 ---- //
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.cancelEdit();
        });
        // --- 頁面設定 End ---- //

        this.route.queryParams.subscribe(params => {
            if (params.hasOwnProperty('type')) {
                // set data
                this.fromStartPage = (params['type'] == '1') ? true : false;
                this._logger.step('OTP', 'params', params);
            }
        });

        this._mainService.checkAuth().then(
            (resObj) => {
                this._logger.step('OTP', 'checkAuth', resObj);
                this.bindId = resObj.bound_id;
                this.showBound(resObj.bound_id, resObj);
            },
            (errorObj) => {
                // * 4:已申請且裝置已認證(success)
                // * 5:歸戶身分證已申請5組，但此裝置為第6組(warring)
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }


    /**
     * 依照使用者的綁定狀態，顯示不同情境
     */
    showBound(bound_id, resObj) {
        let show_type = this._formateService.checkField(resObj, 'type');
        show_type = (show_type === 'bind') ? 'bind' : 'apply';
        this.stepMenuData = this._mainService.getSetpBarMenu(show_type);
        // 確認視窗
        if (show_type === 'bind') {
            // 您目前已申請一組裝置認證密碼尚未啟用。您是否要使用該裝置認證密碼啟用目前裝置？
            this.confirm.show(resObj.msg, {
                title: 'ERROR.INFO_TITLE' // 提醒您
                , btnYesTitle: 'BTN.CHECK' // 確定
                , btnNoTitle: 'BTN.CANCEL' // 取消
            }).then(
                () => {
                    // check
                    this.onChangePage('bind', resObj);
                },
                () => {
                    // cancle: 比照目前流程，返回選單
                    // 目前無提供重新查詢裝置識別碼的機制，必須等待逾時才可執行(目前不確定重新申請會不會造成OTP系統異常)
                    this.navgator.push('home');
                }
            );
        } else {
            this.onChangePage('apply', resObj);
            let show_msg = this._formateService.checkField(resObj, 'msg');
            if (show_msg != '' && !this.fromStartPage) {
                // 從登入轉址的不顯示
                // 您已申請裝置認證作業，認證密碼已逾時失效。請您重新申請。
                this.alert.show(show_msg, {
                    title: 'ERROR.INFO_TITLE' // 提醒您
                });
            }
        }
    }

    /**
     * 輸入返回事件
     * @param e
     */
    onInputBack(e) {
        // this._logger.step('OTP', 'onInputBack', e);
        this.inp_data.pswd = e;
    }

    /**
     * 取得裝置綁定識別碼
     */
    onSubmitEvent() {
        this._mainService.applyData(this.inp_data).then(
            (resObj) => {
                this.identity = resObj['OtpIdentity'];
                if (!resObj['status'] && resObj['msg'] !== '') {
                    // 資料異常，但繼續流程(僅提示訊息)
                    this._handleError.handleError({
                        title: 'ERROR.INFO_TITLE',
                        content: resObj['msg'],
                        type: 'dialog'
                    });
                }
                this.onChangePage('identity');
            },
            (errorObj) => {
                if (errorObj.hasOwnProperty('errorType') && errorObj['errorType'] === 'check' && errorObj.hasOwnProperty('error_list')) {
                    this.error_data = errorObj['error_list'];
                    errorObj['type'] = 'dialog';
                    this._handleError.handleError(errorObj);
                } else {
                    errorObj['type'] = 'message';
                    errorObj['backType'] = this.back_path;
                    this._handleError.handleError(errorObj);
                }
            }
        );
    }

    /**
     * 放棄編輯
     */
    cancelEdit() {
        let msg_title = 'POPUP.CANCEL_EDIT.TITLE'; // 提醒您
        let msg_content = 'POPUP.CANCEL_EDIT.CONTENT'; // 您是否放棄此次編輯？
        if (this.nowStep === 'identity') {
            // 您尚未完成啟用裝置認證，是否確定要取消啟用裝置認證？
            msg_content = 'PG_OTP.BIND.LEAVE_BIND.CONTENT';
        }

        this.confirm.show(msg_content, {
            title: msg_title
        }).then(
            () => {
                this.navgator.push(this.back_path);
            },
            () => {
                // no do
            }
        );
    }

    /**
     * 變更步驟
     */
    onChangeStep(step) {
        this.nowStep = step;
    }

    /**
     * step 返回
     * @param e
     */
    onStepBarEvent(e) {
        this._logger.log(e);
        // 目前不提供stepbar click事件，故此處暫不處理
    }

    /**
     * 子層返回事件
     * @param e 
     */
    onBackPage(e) {
        this._logger.step('OTP', 'onBackPage', e);
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
        if (page === 'bind' && pageType === 'step') {
            this.onChangePage(tmp_data);
        }
    }

    /**
    * 頁面切換
    * @param pageType 頁面切換判斷參數
    *        'apply' : 申請綁定頁
    *        'bind' : 裝置綁定頁
    * @param pageData 其他資料
    */
    onChangePage(pageType: string, pageData?: any) {
        switch (pageType) {
            case 'identity': // 顯示裝置識別碼
                this.editType = pageType;
                this.onChangeStep('identity');
                break;
            case 'bind': // 進行啟用流程
                this.editType = pageType;
                this.onChangeStep('bind');
                break;
            case 'result': // 進行啟用結果
                this.onChangeStep('result');
                break;
            case 'apply': // 申請流程
            default:
                // 此功能無返回步驟功能!!!
                this.editType = pageType;
                this.onChangeStep('apply');
                break;
        }
    }

}
