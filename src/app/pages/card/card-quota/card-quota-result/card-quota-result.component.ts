/**
 * 額度調整結果頁
 */
import { Component, OnInit, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Component({
    selector: 'app-card-quota-result',
    templateUrl: './card-quota-result-page.component.html',
    providers: []
})



export class CardQuotaResultComponent implements OnInit {
    /**
     *參數設定
     */

    @Input() resultData;//確認頁發送結果api之資訊

    sucessStatus = false; //都成功 (圖都有上傳)
    errorStatus = false; //上傳失敗(fc001005 api)
    remindStatus = false; //成功但有缺
    exectShow = false; //交易失敗(fc001004 api)

    constructor(
        private _headerCtrl: HeaderCtrlService
        , private navgator: NavgatorService
        , private _formateService: FormateService
        , private _logger: Logger
    ) {
    }

    ngOnInit() {
        this._logger.log("into result compontent, resultData:", this.resultData);
        this._headerCtrl.updateOption({
            'leftBtnIcon': 'menu'
        });

        //申請上傳皆成功(全部上傳)
        if (this.resultData.resultStatus == '1') {
            this._logger.log("resultStatus:1", this.resultData.resultStatus);
            this.sucessStatus = true;
            this.errorStatus = false;
            this.remindStatus = false;
            this.exectShow = false;
            //申請、上傳成功，但圖片有漏，選擇1~5張
        } else if (this.resultData.resultStatus == '2') {
            this._logger.log("resultStatus:2", this.resultData.resultStatus);
            this.sucessStatus = false;
            this.errorStatus = false;
            this.remindStatus = true;
            this.exectShow = false;
            //第四種情況，result == 1(交易失敗) or respCode != 4001 
        } else if (this.resultData.resultStatus == '4') {
            this.sucessStatus = false;
            this.errorStatus = false;
            this.remindStatus = false;
            this.exectShow = true;
            //申請成功，上傳失敗
        } else {
            this._logger.log("resultStatus:3", this.resultData.resultStatus);
            this.sucessStatus = false;
            this.errorStatus = true;
            this.remindStatus = false;
            this.exectShow = false;
        }
    }

    backMenu() {
        this.navgator.push('web:card');
    }
}
