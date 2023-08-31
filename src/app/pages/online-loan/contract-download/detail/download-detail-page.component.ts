/**
 * 線上約據下載
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { DownloadService } from '@pages/online-loan/shared/service/download.service';

@Component({
    selector: 'app-download-detail',
    templateUrl: './download-detail-page.component.html',
    styleUrls: [],
    providers: []
})

export class DownloadDetailPageComponent implements OnInit {

    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'edit2Page';
    reqData = {
        custId: '', //身分證字號
        txKind: '', //申請種類
        ebkCaseNo: '', //案件編號
        dataType: '' //下載類型
    };

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private alert: AlertService
        , private confirm: ConfirmService
        , private _mainService: DownloadService
    ) { }

    ngOnInit() {
        this._logger.error("into download!");

        this._headerCtrl.setLeftBtnClick(() => {
            this.backPageEmit.emit({});
        });
    }

    // onDownload() {
    //     this.confirm.show('請選擇預下載的資料', {
    //         title: '提醒您',
    //         btnYesTitle: '申請書',
    //         btnNoTitle: '借款契約'
    //     }).then(
    //         () => {
    //             this.reqData.dataType = 'A1'; //申請書
    //             this.nowPage = 'resultPage';
    //         },
    //         () => {
    //             this.reqData.dataType = 'A2'; //借款契約
    //             this.nowPage = 'resultPage';
    //         }
    //     );
    // }
    // backLoan() {
    //     this.navgator.push('online-loan');
    // }
    // test() {
    //     this.nowPage = 'testPage';
    // }
    // onTestBack() {
    //     this.navgator.push('online-loan');
    // }
    // get503Api(setData?) {
    //     this._mainService().then(
    //         (result) => {

    //         },
    //         (errorObj) => {

    //         }
    //     );
    // }
}