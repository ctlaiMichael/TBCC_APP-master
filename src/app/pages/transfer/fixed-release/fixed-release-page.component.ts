/**
 * 外匯綜定存中途解約
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';

// service
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { TimeDepositTerminateInfo } from '@conf/terms/forex/time-deposit-terminate-info';
import { InfomationService } from '@shared/popup/infomation/infomation.service';
import { FixedReleaseService } from '../shared/service/fixed-release.service';


@Component({
    selector: 'app-fixed-release',
    templateUrl: './fixed-release-page.component.html',
    styleUrls: [],
    providers: [FixedReleaseService]
})
export class FixedReleasePageComponent implements OnInit {
    /**
     * 參數設定
     */

    showNextPage = 'edit';
    // 電文

    all_datas: any = {};//F6000201 全部資料
    datas = []; //F6000201 綜定存歸戶查詢回傳
    sendObj = {};   //使用者所選擇解約之該筆資料，並送到下一頁
    info_data = {};   //F6000202 回傳
    securityObj = {
        "SEND_INFO": "",
        "USER_SAFE": ""
    };
    showData = false;
    transactionObj = {
        serviceId: 'F6000202',
        categoryId: '1',
        transAccountType: '1',
        customAuth: ['1', '2'] // 客制權限
    };
    requestTime;
    constructor(
        private _logger: Logger,
        private _handleError: HandleErrorService,
        private _mainService: FixedReleaseService,
        private _headerCtrl: HeaderCtrlService,
        private confirm: ConfirmService,
        private navgator: NavgatorService,
        private infomationService: InfomationService
    ) {
    }

    ngOnInit() {
        this._mainService.getData().then(
            (result) => {
                console.log('201 res', result);
                if (result.info_data.businessType == 'T' ) {  //測試先關閉
                    if (result.hasOwnProperty('data') && result.data.length > 0) {
                        this.all_datas = result;
                        this.datas = result.data;
                        this.showData = true;
                        this.requestTime = result.requestTime;
                    }
                } else {
                    // 非交易時間
                    this._handleError.handleError({
                        type: 'message',
                        title: '',
                        content: '本交易限營業時間內始得辦理'
                    });
                }
            }
            ,
            (reject) => {
                reject['type'] = 'message';
                this._handleError.handleError(reject);
            }
        );
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

    onSelectEvent(selectedData) {
        console.log('toppppotp',this.securityObj.SEND_INFO)
        if (!this.securityObj.SEND_INFO['status']) {
            //error handle
            let errorObj = {
                type: 'dialog',
                content: this.securityObj.SEND_INFO['popObj']['message'],
                message: this.securityObj.SEND_INFO['popObj']['message']
            };
            this._handleError.handleError(errorObj);
            return false;
        }
        console.log('select data:', selectedData);
        this.sendObj = selectedData;
        this.sendObj = Object.assign(this.sendObj, { businessType: this.all_datas.info_data.businessType, trnsToken: this.all_datas.info_data.trnsToken });
        console.log('sendObj', this.sendObj)
        this.showNextPage = 'confirm';
    }


    goResult(e) {
        if (e.securityResult.ERROR.status == true) {
            this.onSend(this.sendObj, e);
        } else {

        }
    }
    /**
     * 送F6000202電文
     */
    onSend(sendObj, security) {
        this._mainService.onSend(sendObj, security).then(
            (res) => {
                console.log('onSend suc', res);
                this.info_data = res.info_data;
                this.showNextPage = 'result';
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
