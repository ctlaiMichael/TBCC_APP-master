/**
 * 外匯綜定存中途解約
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';

// service
import { TimeDepositTerminateService } from '../shared/service/time-deposit-terminate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { TimeDepositTerminateInfo } from '@conf/terms/forex/time-deposit-terminate-info';
import { InfomationService } from '@shared/popup/infomation/infomation.service';


@Component({
    selector: 'app-time-deposit-terminate',
    templateUrl: './time-deposit-terminate-page.component.html',
    styleUrls: [],
    providers: [TimeDepositTerminateService]
})
export class TimeDepositTerminateComponent implements OnInit {
    /**
     * 參數設定
     */

    showNextPage = 'edit';
    // 電文

    datas = []; //F6000401 回傳
    sendObj = {};   //F6000402 回傳 ，並送到下一頁
    info_data = {};   //F60004303 回傳
    securityObj = {
        "SEND_INFO": "",
        "USER_SAFE": ""
    };
    showData = false;
    transactionObj = {
        serviceId: 'F6000403',
        categoryId: '4',
        transAccountType: '1',
    };
    requestTime;
    constructor(
        private _logger: Logger,
        private _handleError: HandleErrorService,
        private _mainService: TimeDepositTerminateService,
        private _headerCtrl: HeaderCtrlService,
        private confirm: ConfirmService,
        private navgator: NavgatorService,
        private infomationService: InfomationService
    ) {
    }

    ngOnInit() {
        this._mainService.getTime('2').then(
            (result) => {
                if (result.info_data.hasOwnProperty('businessType') && result.info_data.businessType == 'N') {
                    this._handleError.handleError({
                        type: 'message',
                        title: '',
                        content: "本交易限營業時間內始得辦理"
                    });
                    // this.navgator.push('foreign-exchange');
                } else {
                    this._mainService.getData().then(
                        (res) => {
                            const set_data = new TimeDepositTerminateInfo();
                            this.infomationService.show(set_data);
                            if (res.hasOwnProperty('data')) {
                                this.datas = res.data;
                                this.showData = true;
                                this.requestTime = res.requestTime;
                            };
                        },
                        (errorObj) => {
                            errorObj['type'] = 'message';
                            this._handleError.handleError(errorObj);
                        });
                }
            },
            (reject) => {
                reject['type'] = 'message';
                this._handleError.handleError(reject);
            }
        )
    }

    // 確認頁返回編輯頁

    toEditPage(e) {
        if (e) {
            this._headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('foreign-exchange');
            });
            this.showNextPage = 'edit';
        }

    };

    onSelectEvent(selectedAcct) {
        if (!this.securityObj.SEND_INFO['status']) {
            //error handle
            let errorObj = {
                type: 'dialog',
                content: this.securityObj.SEND_INFO['message'],
                message: this.securityObj.SEND_INFO['message']
            };
            this._handleError.handleError(errorObj);
            return;
        }
        this._mainService.getDetail(selectedAcct).then(
            (result) => {
                this.sendObj = result.info_data;
                this.showNextPage = 'confirm';
            },
            (errorObj) => {
                errorObj['type'] = 'dialog';
                this._handleError.handleError(errorObj);
            }

        )

    }


    goResult(e) {
        if (e.securityResult.ERROR.status == true) {
            this.onSend(this.sendObj, e);
        } else {

        }
    }
    /**
     * 送F6000403電文
     */
    onSend(sendObj, security) {
        this._mainService.onSend(sendObj, security).then(
            (res) => {
                if (res.hasOwnProperty('status') && res.status == true && res.hasOwnProperty('info_data')) {
                    this.info_data = res.info_data;
                    this.showNextPage = 'result';
                } else {
                    let error = {};
                    error['type'] = 'message';
                    this._handleError.handleError(error);
                };
            },
            (errorObj) => {
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            });
    }
    securityOptionBak(e) {
        if (e.status) {
            // 取得需要資料傳遞至下一頁子層變數
            this.securityObj.SEND_INFO = e.sendInfo;
            this.securityObj.USER_SAFE = e.sendInfo.selected;
        } else {
            // do errorHandle 錯誤處理 推業或POPUP
            e['type'] = 'message';
            this._handleError.handleError(e.ERROR);
        }
    }
}
