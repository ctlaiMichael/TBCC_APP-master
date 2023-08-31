/**
 * [樣版] 頁籤選單
 */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { DeviceService } from '@lib/plugins/device.service';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: [],
  providers: []
})
export class BookmarkComponent implements OnInit {
  /**
   * 參數處理
   */
  @Input() setData: Array<object>; // 選單資料(all)
  @Input() defaultKey: any; // 預設選單
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>(); // 返回事件
  menuData = [];     // 選單資料(all)
  showType = 'spot'; // 第一頁籤選擇項目

  tabs: any;     // catch li elements
  panels: any;   // catch content
  platform: any; // iOS 或 Android 平台

  private allData = {
    showType: '',
    menuData: {}
  };

  constructor(
    private _logger: Logger,
    private errorHandler: HandleErrorService,
    private _formateService: FormateService,
    private _device: DeviceService
  ) { }

  ngOnInit() {
    this._device.devicesInfo().then((device) => {
      this.platform = device.platform.toLowerCase();
    });
    this._modifyData();
    this._logger.log('Bookmark', 'all data', this.allData, this.menuData);
  }

  /**
   * 選單事件(主頁籤)
   * @param menu 選單
   */
  onGoEvent(menu, index?) {
    let output = {
      'page': 'bookmark',
      'type': 'content',
      'data': this._formateService.transClone(menu)
    };

    this.menuData.forEach((item) => {
      item.selected = false;
    });
    this.menuData[index].selected = true;

    this.showType = this._formateService.checkField(menu, 'id');
    this._logger.step('Bookmark', 'showType', this.showType, menu);
    if (menu.hasOwnProperty('data') && menu['data']) {
      // 顯示子選單
      const sub_default = this._formateService.checkField(menu, 'default');
      if (menu['data_list'].hasOwnProperty(sub_default)) {
        this.onSubGoEvent(menu['data_list'][sub_default]);
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
  onSubGoEvent(menu) {
    let output = {
      'page': 'bookmark-sub',
      'type': 'content',
      'data': this._formateService.transClone(menu)
    };
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

    this.setData.forEach((menu, index) => {
      let tmp = this._modifyItemMenu(menu, index, false);
      if (!tmp || tmp.id === '') {
        this._logger.step('Bookmark', 'menu error', menu, tmp);
        return false;
      }

      // 匯率試算
      if (tmp.id !== 'count') {
        mainMenu.list[tmp.id] = tmp;
        mainMenu.data.push(tmp);
      }
    });

    this.allData.menuData = mainMenu.list;
    this.menuData = this._formateService.transArraySort(mainMenu.data, ['sort', 'ASC']);

    // Default值設定
    if (typeof this.defaultKey === 'string') {
      this.allData.showType = this.defaultKey;
    } else if (this.defaultKey instanceof Array) {
      this.allData.showType = (typeof this.defaultKey[0] !== 'undefined') ? this.defaultKey[0] : '';
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
    if (this.defaultKey === output['id']) {
      output['selected'] = true;
    } else {
      output['selected'] = false;
    }
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
}
