/**
 * [樣版] 步驟條
 */
import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';

@Component({
    selector: 'app-step-bar',
    templateUrl: './step-bar.component.html',
    styleUrls: [],
    providers: []
})
export class StepBarComponent implements OnInit, OnChanges {
    /**
     * 參數處理
     */
    @Input() setData: string | Array<object>; // 選單資料(all)
    @Input() defaultKey: any; // 預設選單
    @Input() setKey: any; // 預設選單
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>(); // 返回事件
    menuData = []; // 選單資料(all)
    showType = ''; // 第一頁籤選擇項目
    hiddenData = false; // 隱藏選單

    private allData = {
        showType: '',
        menuData: {},
        setData: [] // 原始設定資料
    };

    constructor(
        private _logger: Logger,
        private errorHandler: HandleErrorService,
        private _formateService: FormateService
        , private _uiContentService: UiContentService
    ) { }

    ngOnInit() {
        this._modifyData();
        this._logger.log('StepBar', 'all data', this.allData, this.menuData);
        this._reset(this.setKey); // 預設顯示default
    }

    ngOnChanges() {
        if (this.showType !== '' && this.setKey != this.showType && this.allData.menuData.hasOwnProperty(this.setKey)) {
            // this.showType = this.setKey;
            this.onGoEvent(this.allData.menuData[this.setKey]);
            this._logger.log('StepBar', 'change key', this.defaultKey, this.setKey, this.showType);
        } else if (this.setData != this.allData.setData) {
            this._modifyData();
            this._logger.log('StepBar', 'change data', this.allData, this.menuData);
            this._reset(this.setKey); // 預設顯示default
        }
    }


    /**
     * 選單事件(主頁籤)
     * @param menu 選單
     */
    onGoEvent(menu) {
        let output = {
            'page': 'step-bar',
            'type': 'content',
            'data': this._formateService.transClone(menu)
        };

        this.showType = this._formateService.checkField(menu, 'id');
        this._logger.step('StepBar', 'showType', this.showType, menu);
        if (menu.hasOwnProperty('hidden') && menu.hidden === true) {
            this.hiddenData = true;
        } else if (this.hiddenData) {
            this.hiddenData = false; // 未隱藏請打開
        }

        this._uiContentService.scrollTop(); // 切換頁籤時要移到最上方
        this.backPageEmit.emit(output);
    }


    // --------------------------------------------------------------------------------------------
    //  ____       _            _         _____                 _
    //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
    //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
    //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
    //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
    // --------------------------------------------------------------------------------------------

    private _modifyData() {
        this._logger.step('StepBar', '_modifyData setData', this._formateService.transClone(this.setData));
        if (!!this.setData) {
            if (this.setData === 'default') {
                // 顯示預設step bar
                this.setData = [
                    // 填寫資料
                    { id: 'edit', name: 'STEP_BAR.COMMON.EDIT' }
                    // 確認資料
                    , { id: 'check', name: 'STEP_BAR.COMMON.CHECK' }
                    // 結果
                    , {
                        id: 'result', name: 'STEP_BAR.COMMON.RESULT',
                        // 執行此步驟時是否隱藏step bar
                        hidden: true
                    }
                ];
            } else if (this.setData === 'onepage') {
                // 顯示one page step bar
                this.setData = [
                    // 填寫資料
                    { id: 'edit', name: 'STEP_BAR.COMMON.EDIT' }
                    // 結果
                    , {
                        id: 'result', name: 'STEP_BAR.COMMON.RESULT',
                        // 執行此步驟時是否隱藏step bar
                        hidden: true
                    }
                ];
            }
        }
        if (typeof this.setData === 'undefined' || !(this.setData instanceof Array)) {
            this._logger.step('StepBar', '_modifyData error', this._formateService.transClone(this.setData));
            this.errorHandler.handleError({
                type: 'dialog',
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
            return false;
        }
        this.allData.setData = this.setData;

        let mainMenu = {
            list: {},
            data: []
        };

        this.setData.forEach((menu, index) => {
            let tmp = this._modifyItemMenu(menu, index, true);
            if (!tmp || tmp.id === '') {
                this._logger.step('StepBar', 'menu error', menu, tmp);
                return false;
            }

            mainMenu.list[tmp.id] = tmp;
            mainMenu.data.push(tmp);
        });

        this.allData.menuData = mainMenu.list;
        this.menuData = this._formateService.transArraySort(mainMenu.data, ['sort', 'ASC']);

        // Default值設定
        if (typeof this.defaultKey === 'string') {
            this.allData.showType = this.defaultKey;
        } else if (this.defaultKey instanceof Array) {
            this.allData.showType = (typeof this.defaultKey[0] !== 'undefined') ? this.defaultKey[0] : '';
        }
        // sub Default值設定
        if (!this.allData.menuData.hasOwnProperty(this.allData.showType)) {
            // default選擇
            const tmp_data = (typeof this.menuData[0] !== 'undefined') ? this.menuData[0] : {};
            this.allData.showType = this._formateService.checkField(tmp_data, 'id');
        }
    }

    /**
     * menu整理
     * @param menu menu資料
     * @param index array index
     * @param check_sub true檢查子層, false 不檢查子層
     */
    private _modifyItemMenu(menu: object, index: number, check_sub: boolean) {
        if (typeof menu !== 'object') {
            return false;
        }
        let output = this._formateService.transClone(menu);
        output['id'] = this._formateService.checkField(output, 'id');
        output['name'] = this._formateService.checkField(output, 'name', { empty_str: '- -' });
        output['sort'] = this._formateService.checkField(output, 'sort', { empty_str: index });
        return output;
    }

    /**
     * 預設選擇
     * @param set_key 指定第一層
     */
    private _reset(set_key?: string) {
        if (this.menuData.length <= 0) {
            return false; // 無資料不處理
        }
        if (typeof set_key === 'undefined' || !this.allData.menuData.hasOwnProperty(set_key)) {
            // 全部預設值
            if (this.allData.menuData.hasOwnProperty(this.allData.showType)) {
                this.onGoEvent(this.allData.menuData[this.allData.showType]);
            } else {
                this._logger.step('StepBar', 'reset error', set_key, this.allData.showType);
                this.errorHandler.handleError({
                    type: 'dialog',
                    title: 'ERROR.TITLE',
                    content: 'ERROR.STEP_BAR.MISS_KEY' // 指定步驟不存在
                });
            }
        } else {
            const now_chose = this.allData.menuData[set_key];
            this.onGoEvent(now_chose);
        }
    }


}
