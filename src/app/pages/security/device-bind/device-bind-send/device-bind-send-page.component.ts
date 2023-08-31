/**
 * 裝置綁定服務-啟動
 * 進入啟動裝置認證流程，不會回到申請流程!!!
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { DeviceBindService } from '@pages/security/shared/service/device-bind.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { logger } from '@shared/util/log-util';
@Component({
    selector: 'app-device-bind-send',
    templateUrl: './device-bind-send-page.component.html'
})
export class DeviceBindSendPageComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() setData: object;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    private back_path = 'user-set'; // 個人設定選單
    identityStr = ''; // 授權碼
    inp_data = {
        OtpIdentity: '',
        commonName: ''
    };
    error_data: any = {
        OtpIdentity: '',
        commonName: ''
    };
    // 長度控制
    inp_maxlen = {
        OtpIdentity: '6', // 授權碼長度(目前固定6碼)
        commonName: '10'
    };
    showResult = false; // 顯示結果
    resultData: any;

    constructor(
        private _logger: Logger
        , private _mainService: DeviceBindService
        , private _handleError: HandleErrorService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _headerCtrl: HeaderCtrlService
        , private confirm: ConfirmService
    ) { }

    ngOnInit() {
        // --- 頁面設定 ---- //
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'back'
        });
        this._headerCtrl.setLeftBtnClick(() => {
            this.onCancelEvent();
        });
        // --- 頁面設定 End ---- //
        if (typeof this.setData == 'string' && this.setData != '') {
            // 顯示授權碼
            this.identityStr = this.setData;
        }
    }

    /**
     * 確認: 裝置綁定
     */
    onSubmitEvent() {
        this._mainService.bindData(this.inp_data).then(
            (resObj) => {
                this.onBackPageData('result');
                this.resultData = {
                    title: 'PG_OTP.ERROR.BIND_TITLE_SUCCESS', // 完成裝置認證
                    // 您已於{{ date }}完成認證此裝置，歡迎您多加利用本行多元便利的行動網銀服務。
                    content: 'PG_OTP.ERROR.BIND_SUCCESS',
                    content_params: { date: resObj.date }
                };
                this.showResult = true;
            },
            (errorObj) => {
                this.onBackPageData('result');
                // logger.debug("line 83 errorObj:", errorObj);
                // logger.error(this._formateService.transClone(errorObj));
                if (errorObj.hasOwnProperty('errorType') && errorObj['errorType'] === 'check' && errorObj.hasOwnProperty('error_list')) {
                    this.error_data = errorObj['error_list'];
                    errorObj['type'] = 'dialog';
                    this._handleError.handleError(errorObj);
                } else {
                    errorObj['type'] = 'message';
                    errorObj['title'] = 'PG_OTP.ERROR.BIND_TITLE_ERROR'; // 裝置認證失敗
                    errorObj['backType'] = this.back_path;
                    this._handleError.handleError(errorObj);
                }
            }
        );
    }

    /**
     * 取消
     * 放棄取消就離開編輯了!!!
     */
    onCancelEvent() {
        logger.debug("555555");
        const msg = 'PG_OTP.BIND.LEAVE_BIND.CONTENT';
        this.confirm.show(msg, {
            title: 'ERROR.INFO_TITLE',
            btnYesTitle: 'BTN.CHECK',
            btnNoTitle: 'BTN.CANCEL'
        }).then(
            () => {
                // 返回個人設定選單
                // this.navgator.push(this.back_path);
                this.navgator.push('home');
            },
            () => {
                // not do
            }
        );
    }


    /**
     * 重新設定page data
     * 此功能僅為同步step bar資訊
     * @param item
     */
    onBackPageData(item?: any) {
        // 返回修改step bar
        let output = {
            'page': 'bind',
            'type': 'step',
            'data': item
        };
        this.backPageEmit.emit(output);
    }



}
