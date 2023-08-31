import { Component, OnInit, NgZone } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { HeaderOptions } from '@core/layout/header/header-options';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { logger } from '@shared/util/log-util';
@Component({
    selector: 'app-result-page',
    templateUrl: './result-page.component.html',
    styleUrls: ['./result-page.component.css']
})
export class ResultPageComponent implements OnInit {
    options: HandleErrorOptions;
    className: string;
    icon_img = 'icon_success';
    backPath = 'home';

    /**
     * 結果頁追加參數
     */
    buttonMain = 'BTN.RETURN_HOME'; // 返回首頁
    buttonPath = 'home'; // 返回首頁
    mainInfo = [];
    detailData = [];
    notice: string;
    showData = {
        // content: false, // 顯示副標題
        mainInfo: false, // 顯示副標題資訊
        detail: false // 顯示細節
        , notice: false // 資訊區塊
        , dataTime: false // 資料時間
    };

    constructor(
        private zone: NgZone,
        private navgator: NavgatorService,
        private errorHandler: HandleErrorService,
        private headerCtrl: HeaderCtrlService
    ) {
        this.options = this.navgator.getParams();
        this.options.content = this.options.content || '';
        this.options.backType = this.options.backType || '0';
        this.options.button = this.options.button || 'BTN.RETURN_HOME';
        if (this.options.backType === '0') {
            this.options.button = 'BTN.RETURN_HOME'; // 固定為回首頁
        }
        this.options.from_page = this.options.from_page || '';
        this.options.dataTime = this.options.dataTime || '';

        this.mainInfo = this.options.mainInfo;
        this.detailData = this.options.detailData;
        this.notice = this.options.notice;
        if (this.options.mainInfo.length > 0) {
            this.showData.mainInfo = true;
        }
        if (this.detailData.length > 0) {
            this.showData.detail = true;
        }
        if (!!this.notice && this.notice != '') {
            this.showData.notice = true;
        }
        if (!!this.options.dataTime) {
            this.showData.dataTime = true;
        }

        let prePageData = this.navgator.getPrePageSet();
        logger.log('pre page:', this.navgator.returnData, prePageData);

        const header = new HeaderOptions();
        header.style = 'result';
        // header.title = this.options.title; // 頭檔資訊不改變
        if (!!this.options.header_title) {
            header.title = this.options.header_title;
        } else if (!!prePageData.headerData && !!prePageData.headerData.title) {
            // 前一頁設定值資料
            header.title = prePageData.headerData.title;
        }
        const history = this.navgator.history;
        if (history.length > 2) {
            this.backPath = history[history.length - 3];
        }
        header.backPath = this.backPath;
        if (!!this.options.leftBtnIcon) {
            header.leftBtnIcon = this.options.leftBtnIcon;
        }
        this.headerCtrl.updateOption(header);
        if(this.options.backType === '2'){ //返回信用卡專區專用
            this.headerCtrl.setLeftBtnClick(() => {
                this.navgator.push('web:card');
              });
        }
        // 20/04/16/ ERROR.TITLE(訊息)  與  ERROR.INFO_TITLE(提醒您)圖示改為驚嘆號
        if (this.options.classType == 'error' 
            && (this.options.title == 'ERROR.TITLE' || this.options.title == 'ERROR.INFO_TITLE' 
                || this.options.title == 'POPUP.ALERT.TITLE')
        ) {
        this.options.classType = 'warning';
    }
        this.setStyle(this.options.classType);
    }
    ngOnInit() {
        this.zone.run(() => { });
    }

    setStyle(type) {
        if (type === 'success') {
            this.className = '';
        } else if (type === 'warning') {
            this.className = 'exclamation_active';
        } else if (type === 'error') {
            this.className = 'fault_active';
        }
    }

    clickBtn() {
        if (this.errorHandler.authError.indexOf(this.options.resultCode) > -1) {
            this.navgator.authError();
        } else if (this.options.backType === '0') {
            this.navgator.home();
        } else if (this.options.backType === '1') {
            this.navgator.popTo(this.backPath);
        } else if (this.options.backType === '2') { 
            this.navgator.push('web:card');
        } else {
            this.navgator.push(this.options.backType);
        }
    }
}
