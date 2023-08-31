/**
 * 編輯結果頁公版
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { EditResultTemp } from '@shared/template/result/edit/edit-result-temp.class';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
    selector: 'app-edit-result-temp',
    templateUrl: './edit-result-temp.component.html',
    styleUrls: [],
    providers: []
})

export class EditResultTempComponent implements OnInit {
    /**
     * 參數處理
     */
    @Input() setData: any;
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
    showClass = '';
    title = ''; // 標題
    title_params: any = {}; // 副標題i18n參數
    content = ''; // 副標題
    content_params: any = {}; // 副標題i18n參數
    buttonMain = 'BTN.RETURN_HOME'; // 返回首頁
    buttonPath = 'home'; // 返回首頁
    mainInfo = [];
    detailData = [];
    showData = {
        content: false, // 顯示副標題
        mainInfo: false, // 顯示副標題資訊
        detail: false // 顯示細節
    };
    private leftBtnIcon: string;
    private classType = '';
    private class_list = {
        'success': '',
        'error': 'fault_active',
        'warning': 'exclamation_active'
    };

    constructor(
        private _logger: Logger
        , private _formateService: FormateService
        , private navgator: NavgatorService
        , private _headerCtrl: HeaderCtrlService
    ) { }

    ngOnInit() {
        if (typeof this.setData === 'object' && this.setData) {
            let defaultOptions = new EditResultTemp();
            const paramsSet = { ...defaultOptions, ...this.setData };
            this.classType = paramsSet.classType;
            this.title = paramsSet.title;
            this.title_params = paramsSet.title_params;
            this.content = paramsSet.content;
            this.content_params = paramsSet.content_params;
            this.buttonMain = paramsSet.button;
            this.buttonPath = paramsSet.buttonPath;
            this.mainInfo = paramsSet.mainInfo;
            this.detailData = paramsSet.detailData;
            this.leftBtnIcon = paramsSet.leftBtnIcon;
            if (this.content !== '') {
                this.showData.content = true;
            }
            if (this.mainInfo.length > 0) {
                this.showData.mainInfo = true;
            }
            if (this.detailData.length > 0) {
                this.showData.detail = true;
            }
            if (this.class_list.hasOwnProperty(this.classType)) {
                this.showClass = this.class_list[this.classType];
            } else {
                this.showClass = this.class_list['success'];
            }

        }
        // 顯示header資訊
        this._headerCtrl.updateOption({
            style: 'result',
            leftBtnIcon: this.leftBtnIcon
        });
        if (this.leftBtnIcon === 'back') {
            this._headerCtrl.setLeftBtnClick(() => {
                this.onMainClickEvent();
            });
        }
        if (this.setData.hasOwnProperty('err_btn') && this.setData.err_btn != '') {
            this.buttonMain = this.setData.err_btn;
        }
    }

    onMainClickEvent() {
        if(this.setData.hasOwnProperty('err_btn') && this.setData.err_btn != ''){
            this.backPageEmit.emit({});
        }else{
            this.navgator.push(this.buttonPath);
        }
    }

}
