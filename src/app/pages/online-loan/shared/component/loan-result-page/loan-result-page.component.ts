/**
 * 線上申貸-結果頁(共用)
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { DownloadService } from '@pages/online-loan/shared/service/download.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';
import { MortgageIncreaseService } from '../../service/mortgage-increase.service';


@Component({
    selector: 'app-loan-result-page',
    templateUrl: './loan-result-page.component.html',
    styleUrls: [],
    providers: [DownloadService]
})

export class LoanResultPageComponent implements OnInit {
    @Input() type: string;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() fullData: any;
    @Input() resver: string; //是否為預填單 'Y':預填,'N':非預填
    @Input() action: string; //紀錄返回狀態，'go':進入此頁，'back':返回此頁
    changeTitle = '';
    sucessStatus = false; //都成功 (圖都有上傳)
    errorStatus = false; //上傳失敗(408 api)
    remindStatus = false; //成功但有缺
    exectShow = false; //交易失敗(409 api)

    reqData: any = {}; 
    constructor(
        private _logger: Logger
        , private _handleError: HandleErrorService
        , private _headerCtrl: HeaderCtrlService
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _downloadService: DownloadService
        , private _share: SocialsharingPluginService
        , private _allService: MortgageIncreaseService
    ) { }

    ngOnInit() {
        this._logger.log("into app-loan-result-page");
        this._logger.log("fullData:", this.fullData);
        this.reqData = this._allService.getAllData();
        this._headerCtrl.setLeftBtnClick(() => {
            this.navgator.push('online-loan');
        });
        if (this.type == 'mortgage') {
            this.changeTitle = '房貸增貸';
        } else if (this.type == 'credit') {
            this.changeTitle = '信用貸款';
        } else {
            this.changeTitle = '房屋貸款';
        }
        //預填單能進這頁代表已經成功了
        if (this.resver == 'Y') {
            if (this.fullData.resultStatus == '4') {
                this.sucessStatus = false;
                this.errorStatus = false;
                this.remindStatus = false;
                this.exectShow = true;
            } else {
                this.sucessStatus = false;
                this.errorStatus = false;
                this.remindStatus = false;
                this.exectShow = false;
            }

            //非預填單(登入)
        } else {
            //申請上傳皆成功(全部上傳)
            if (this.fullData.resultStatus == '1') {
                this._logger.log("resultStatus:1", this.fullData.resultStatus);
                this.sucessStatus = true;
                this.errorStatus = false;
                this.remindStatus = false;
                this.exectShow = false;
                //申請、上傳成功，但圖片有漏，選擇1~5張
            } else if (this.fullData.resultStatus == '2') {
                this._logger.log("resultStatus:2", this.fullData.resultStatus);
                this.sucessStatus = false;
                this.errorStatus = false;
                this.remindStatus = true;
                this.exectShow = false;
                //第四種情況，result == 1(交易失敗) or respCode != 4001 
            } else if (this.fullData.resultStatus == '4') {
                this.sucessStatus = false;
                this.errorStatus = false;
                this.remindStatus = false;
                this.exectShow = true;
                //申請成功，上傳失敗
            } else {
                this._logger.log("resultStatus:3", this.fullData.resultStatus);
                this.sucessStatus = false;
                this.errorStatus = true;
                this.remindStatus = false;
                this.exectShow = true;
            }
        }
    }

    backLoan() {
        //預填單導到線上櫃檯
        if (this.resver == 'Y') {
            this.navgator.push('online-loan-desk');
        } else {
            this.navgator.push('online-loan');
        }
    }

    //download(網銀登入，預填單不提供)
    onDownload() {
        let setData = {
            custId: '', //身分證字號
            txKind: '', //申請種類
            ebkCaseNo: '', //案件編號，約據下載：'3'
            dataType: 'A1', //下載類型(固定申請書)
        };
        //房貸增貸
        if (this.type == 'mortgage') {
            setData['txKind'] = 'A';
        } else if (this.reqData['loanUsage'] == '09') { //信貸紓困
            setData['txKind'] = 'E';
        } else if (this.type == 'credit') {//信貸
            setData['txKind'] = 'B';
            //房屋貸款
        } else if (this.type == 'house') {
            setData['txKind'] = 'D';
            //信貸
        } else {
            setData['txKind'] = 'C';
        }
        setData['ebkCaseNo'] = this.fullData['ebkCaseNo']; //案件編號
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
}
