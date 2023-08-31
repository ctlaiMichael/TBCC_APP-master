/**
 * 進度查詢-編輯頁
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ScheduleQueryService } from '@pages/online-loan/shared/service/schedule-query.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { DownloadService } from '@pages/online-loan/shared/service/download.service';
import { Base64FileUtil } from '@shared/util/formate/modify/base64-file-util';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';

@Component({
    selector: 'app-search',
    templateUrl: './download-search-page.component.html',
    styleUrls: [],
    providers: [ScheduleQueryService, DownloadService, SocialsharingPluginService]
})

export class DownloadSearchPageComponent implements OnInit {
    @Input() page: string | number = 1;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    nowPage = 'query1Page';
    reqData = {
        custId: '', //身分證字號
        txKind: '', //申請種類
        ebkCaseNo: '', //案件編號，約據下載：'3'
        dataType: '', //下載類型
        caseStatus: ''
    };
    queryInfo = {};
    queryData = [];
    //503 api
    info_data = {};
    base64Data = '';

    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private alert: AlertService
        , private _mainService: ScheduleQueryService
        , private confirm: ConfirmService
        , private _downloadService: DownloadService
        , private _share: SocialsharingPluginService
    ) { }

    ngOnInit() {
        this._logger.error("into query1!");
        this.reqData['caseStatus'] = '3';
        if (typeof this.page === 'undefined') {
            this.page = 1;
        } else {
            this.page = parseInt(this.page.toString(), 10);
        }
        this._mainService.getQuery(this.reqData, this.page).then(
            (result) => {
                this.queryInfo = result.info_data;
                this.queryData = result.data;
                this._logger.log("result:", result);
                this._logger.log("queryInfo:", this.queryInfo);
                this._logger.log("queryData:", this.queryData);
                this.onBackPageData(result);
            },
            (errorObj) => {
                this.onErrorBackEvent(errorObj, 'list-item');
                this._logger.log("errorObj:", errorObj);
            }
        );
    }

    //點擊線上約距下載
    onDownload(setData) {
        this._logger.log("into click download:", setData);
        switch (setData.txKind) {
            case 'A': //房貸增貸
                this.reqData.txKind = 'A';
                break;
            case 'B': //信貸
                this.reqData.txKind = 'B';
                break;
            case 'C': //信用卡
                this.reqData.txKind = 'C';
                break;
            case 'D': //房貸
                this.reqData.txKind = 'D';
                break;
            default:
                this.reqData.txKind = 'A';
        }
        this.reqData.ebkCaseNo = setData['ebkCaseNo'];
        //親赴分行對保中，之情況只能下載申請書(無借款契約)
        if (setData['singkind'] == '2') {
            this.alert.show('請選擇欲下載的資料', {
                title: '提醒您',
                btnTitle: '申請書',
            }).then(
                () => {
                    this.reqData.dataType = 'A1'; //申請書
                    this.get503Api(this.reqData);
                }
            );
        } else {
            this.confirm.show('請選擇欲下載的資料', {
                title: '提醒您',
                btnYesTitle: '申請書',
                btnNoTitle: '借款契約'
            }).then(
                () => {
                    this.reqData.dataType = 'A1'; //申請書
                    this.get503Api(this.reqData);
                },
                () => {
                    this.reqData.dataType = 'A2'; //借款契約
                    this.get503Api(this.reqData);
                }
            );
        }

    }

    get503Api(setData?) {
        this._downloadService.getDownload(setData).then(
            (result) => {
                this._logger.log("503 result:", result);
                if (result.status) {
                    this._share.shareFile(result.pdfset, result.base64Str).then(() => {
                        this._logger.log("share success");
                    }, () => {
                        this._logger.log("share error");
                    });
                }
            },
            (errorObj) => {
                this._handleError.handleError(errorObj);
            }
        );
    }

    /**
 * 重新設定page data
 * @param item
 */
    onBackPageData(item, setype?) {
        const output = {
            'page': 'list-item',
            'type': 'page_info',
            'data': item
        };
        this._logger.log("onBackPageData() output:", output);
        if (typeof setype !== 'undefined') {
            output.page = 'download-search';
            output.type = 'go-download';
        }
        this.backPageEmit.emit(output);
    }

    /**
 * 失敗回傳
 * @param error_obj 失敗物件
 */
    onErrorBackEvent(error_obj, page) {
        const output = {
            'page': 'list-item',
            'type': 'error',
            'data': error_obj
        };
        switch (page) {
            case 'query-edit':
                output.page = page;
                break;
        }
        this.errorPageEmit.emit(output);
    }
}