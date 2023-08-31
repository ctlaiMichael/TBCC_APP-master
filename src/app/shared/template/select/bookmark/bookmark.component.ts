/**
 * [樣版] 頁籤選單
 */
import { Component, OnInit, Input, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { BookmarkService } from './bookmark.service';
@Component({
    selector: 'app-bookmark',
    templateUrl: './bookmark.component.html',
    styleUrls: [],
    providers: []
})
export class BookmarkComponent implements OnInit, OnChanges {
    /**
     * 參數處理
     */
    @Input() setData: Array<object>; // 選單資料(all)
    @Input() defaultKey: any; // 預設選單
    @Input() setKey: any; // 指定選單
    @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>(); // 返回事件
    menuData = []; // 選單資料(all)
    subMenuData = [];
    showType = ''; // 第一頁籤選擇項目
    showSubType = ''; // 第二頁籤選擇項目
    subscriptionChangeMenuData: any;

    private allData = {
        showType: '',
        menuData: {}
    };

    constructor(
        private _logger: Logger,
        private errorHandler: HandleErrorService,
        private _formateService: FormateService,
        private bookmarkService: BookmarkService
    ) { }

    ngOnInit() {
        this._modifyData();
        this._logger.log('Bookmark', 'all data', this.allData, this.menuData);
        this._reset(this.setKey); // 預設顯示default
        this.subscriptionChangeMenuData = this.bookmarkService.changeMenuDataSubject.subscribe((menu) => {
            this.onGoEvent(menu);
        }
        );
    }
    ngOnDestroy() {
        this.subscriptionChangeMenuData.unsubscribe();
    }
    ngOnChanges() {
        if (this.showType !== '' && this.setKey != this.showType && this.allData.menuData.hasOwnProperty(this.setKey)) {
            // this.showType = this.setKey;
            this.onGoEvent(this.allData.menuData[this.setKey]);
            this._logger.log('Bookmark', 'change key', this.defaultKey, this.setKey, this.showType);
        }
    }


    /**
     * 選單事件(主頁籤)
     * @param menu 選單
     */
    onGoEvent(menu) {
        let output = {
            'page': 'bookmark',
            'type': 'content',
            'data': this._formateService.transClone(menu)
        };

        this.showType = this._formateService.checkField(menu, 'id');
        this._logger.step('Bookmark', 'showType', this.showType, menu);
        if (menu.hasOwnProperty('data') && menu['data']) {
            // 顯示子選單
            const sub_default = this._formateService.checkField(menu, 'default');
            if (menu['data_list'].hasOwnProperty(sub_default)) {
                //點第一層時把第一層的id傳回
                if(menu.hasOwnProperty('level')&& menu['level']=='1'){
                    this.onSubGoEvent(menu['data_list'][sub_default], this._formateService.checkField(menu, 'id'));
                }else{
                    this.onSubGoEvent(menu['data_list'][sub_default]);
                }
            } else {
                this._logger.step('Bookmark', 'onGoEvent error', sub_default, menu['data_list']);
                this.errorHandler.handleError({
                    type: 'dialog',
                    title: 'ERROR.TITLE',
                    content: 'ERROR.DATA_FORMAT_ERROR'
                });
            }
        } else {
            // 回傳
            this.backPageEmit.emit(output);
        }
    }


    /**
     * 選單事件(子頁籤)
     * @param menu 選單
     */
    onSubGoEvent(menu,level?) {
        let output = {
            'page': 'bookmark-sub',
            'type': 'content',
            'data': this._formateService.transClone(menu)
        };
        this.showSubType = this._formateService.checkField(menu, 'id');
        this._logger.step('Bookmark', 'showSubType', this.showSubType, menu);
        //level=>第一層的id
        if(level){
            output['level']=level;
        }
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
        if (typeof this.setData === 'undefined' || !(this.setData instanceof Array)) {
            this._logger.step('Bookmark', '_modifyData error', this.setData);
            this.errorHandler.handleError({
                type: 'dialog',
                title: 'ERROR.TITLE',
                content: 'ERROR.DATA_FORMAT_ERROR'
            });
            return false;
        }

        let mainMenu = {
            list: {},
            data: []
        };
        let subMenu = [];

        this.setData.forEach((menu, index) => {
            let tmp = this._modifyItemMenu(menu, index, true);
            if (!tmp || tmp.id === '') {
                this._logger.step('Bookmark', 'menu error', menu, tmp);
                return false;
            }
            if (tmp['data']) {
                // 子層檢查
                let sub_menu = {
                    list: {},
                    data: []
                };
                tmp['data'].forEach((subitem, subindex) => {
                    const sub_tmp = this._modifyItemMenu(subitem, subindex, false);
                    if (!sub_tmp || sub_tmp.id === '') {
                        this._logger.step('Bookmark', 'sub menu error', subitem, sub_tmp);
                        return false;
                    }
                    sub_menu.list[sub_tmp.id] = sub_tmp;
                    sub_menu.data.push(sub_tmp);
                });

                tmp['data'] = this._formateService.transArraySort(sub_menu.data, ['sort', 'ASC']);
                tmp['data_length'] = tmp['data'].length;
                tmp['data_list'] = sub_menu.list;
                subMenu.push({
                    id: tmp.id,
                    data_length: tmp['data_length'],
                    default: tmp['default'],
                    data: tmp['data']
                });
            }

            mainMenu.list[tmp.id] = tmp;
            mainMenu.data.push(tmp);
        });

        this.allData.menuData = mainMenu.list;
        this.menuData = this._formateService.transArraySort(mainMenu.data, ['sort', 'ASC']);
        this.subMenuData = subMenu;

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
        if (check_sub) {
            output['data'] = this._formateService.checkField(output, 'data');
            output['default'] = this._formateService.checkField(output, 'default');
            if (!output['data'] || !(output['data'] instanceof Array)) {
                output['data'] = false;
                output['default'] = '';
            } else if (output['default'] == '') {
                output['default'] = (typeof output['data'][0] !== 'undefined') ? output['data'][0] : '';
            }
        }
        return output;
    }

    /**
     * 預設選擇
     * @param set_key 指定第一層
     */
    private _reset(set_key?: string) {
        if (typeof set_key === 'undefined' || !this.allData.menuData.hasOwnProperty(set_key)) {
            // 全部預設值
            if (this.allData.menuData.hasOwnProperty(this.allData.showType)) {
                this.onGoEvent(this.allData.menuData[this.allData.showType]);
            } else {
                this._logger.step('Bookmark', 'reset error', set_key, this.allData.showType);
                this.errorHandler.handleError({
                    type: 'dialog',
                    title: 'ERROR.TITLE',
                    content: 'ERROR.DATA_FORMAT_ERROR'
                });
            }
        } else {
            const now_chose = this.allData.menuData[set_key];
            this.onGoEvent(now_chose);
        }
    }


}
