
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MicroInteractionService } from '@core/layout/micro-interaction.service';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
})

export class DateSelectComponent implements OnInit {

  @Input() dateArr;
  @Input() dateType;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();

  nowPageType = 'month';
  dateVal = []; // 目前選擇項目
  promise: Promise<any>;
  title: string;
  btnYesTitle: string;
  btnNoTitle: string;
  // 資料格式
  rowData = {
    list: {},
    data: [],
    more: [],
    df_sel: []
  };
  rowNum = 3; // 每一組幾個項目
  canSelFlag = false; // 是否可多選
  numberData = {
    total: 0,
    chose: 0
  };
  showPopupFlag = true; // 是否顯示popup class
  i18n_list = {};

  constructor(
    private _logger: Logger,
    private _formateService: FormateService,
    private translate: TranslateService,
    private microInteraction: MicroInteractionService
  ) {
    this.promise = new Promise((resolve, reject) => {
      this.onClickEvent = (res) => {
          resolve(res);
      };
      this.onCancleEvent = (error_res) => {
          reject(error_res);
      };
    });
  }

  onClickEvent(res) {}
  onCancleEvent(error_res) {}

  ngOnInit() {
    this.microInteraction.hideMicroBox(true); // 微交互隱藏

    if (this.dateType == '1') {
      // 月份處理
      this.canSelFlag = true;
      this.title = '每月扣款設定';
      this._initSet({ type: 'month', range: 31 }, this.dateArr);
      this.nowPageType = 'month';
    } else {
      // 週期處理
      this.canSelFlag = true;
      this.title = '每週扣款設定';
      this._initSet({ type: 'week', range: 5 }, this.dateArr);
      this.nowPageType = 'week';

      this.translate.get('WEEK').subscribe((val) => {
        this.i18n_list = val;
      });
    }
  }

  /**
   * click event
   */
  onItemClickEvent(item) {
    if (!item.hasOwnProperty('num') || !item.num
      || !this.rowData.list.hasOwnProperty(item.num)
    ) {
      this._logger.error('miss item', item);
      return false;
    }
    let old_flag = (item.ch) ? true : false;
    let change_flag = (!old_flag) ? true : false;

    this.rowData.list[item.num]['ch'] = change_flag;
    item.ch = change_flag;
    if (change_flag) {
      this.numberData.chose++;
    } else if (!change_flag && old_flag) {
      this.numberData.chose--;
    }
  }

  /**
   * 重新設定page data
   * @param item
   */
  onBackPageData() {
    let sel_data = this._formateService.transArraySort(this.dateVal, { reverse: 'ASC' });
    let output = {
      'page': 'date-select',
      'type': 'success',
      'data': this.dateVal,
      'show': ''
    };

    let show_list = [];
    if (this.dateVal.length > 0) {
      if (this.nowPageType === 'month') {
        show_list = this.dateVal;
        output.show = '每月 ' + show_list.join(',') + ' 日';
      } else {
        this.dateVal.forEach((val) => {
          let val_str = 'evey_' + (val).toString();
          if (this.i18n_list.hasOwnProperty(val_str) && this.i18n_list[val_str]) {
            show_list.push(this.i18n_list[val_str]);
          } else {
            show_list.push(val_str);
          }
        });
        output.show = show_list.join(',');
      }
    }

    this.microInteraction.hideMicroBox(false); // 微交互開啟
    this._logger.step('FUND', 'date-select back output:', output);
    this.backPageEmit.emit(output);
    this.onClickEvent(output);
  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(error_obj) {
    let output = {
      'page': 'date-select',
      'type': 'error',
      'data': error_obj
    };
    this._logger.error('DATE', 'date select', error_obj);
    this.errorPageEmit.emit(output);
    this.onCancleEvent(output);
  }

  /**
   * 確認設定
   */
  setFinish() {
    this.dateVal = [];
    let tk: any;
    for (tk in this.rowData.list) {
      if (this.rowData.list.hasOwnProperty(tk) && this.rowData.list[tk]) {
        let item = this.rowData.list[tk];
        let chose = (item.hasOwnProperty('ch') && item['ch']) ? true : false;
        if (chose) {
          this.dateVal.push(item['num']);
        }
      }
    }
    this.onBackPageData();
  }

  /**
   * 取消設定
   */
  setCancel() {
    this.dateVal = this._formateService.transClone(this.rowData.df_sel);
    this.onBackPageData();
  }

  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

  /**
   * 整理物件
   * @param old_data
   */
  private _initSet(set_data: Object, sel_data: Array<string | number>) {
    let output = {
      list: {},
      data: [],
      more: [],
      df_sel: []
    };
    let date_type = (set_data.hasOwnProperty('type') && set_data['type'] !== 'month') ? set_data['type'] : 'month';
    // tslint:disable-next-line:radix
    let date_range = (set_data.hasOwnProperty('range') && set_data['range']) ? parseInt(set_data['range']) : 0;
    if (date_range === 0) {
      date_range = (date_type === 'month') ? 31 : 7;
    }
    this.numberData.total = date_range;
    this.numberData.chose = 0;

    let i = 1;
    let sub_data = [];
    for (i = 1; i <= date_range; i++) {
      let row_count = i % this.rowNum;
      let i_str = (i).toString();
      let tmp_data = {
        num: i,
        name: i_str,
        ch: false
      };
      if (row_count === 1) {
        sub_data = [];
      }

      if (date_type === 'week') {
        // 週一~週日
        tmp_data.name = 'WEEK.' + i_str;
      }

      // 預設選擇
      // if(i<10){
      //   i_str=('0'+(i+'')).toString();
      // };
      //中台回個位數日期，沒補0
      if (sel_data.indexOf(i) > -1 || sel_data.indexOf(i_str) > -1 ) {
        tmp_data.ch = true;
      }

      sub_data.push(tmp_data);
      if (row_count === 0) {
        output.data.push(sub_data);
      }
      output.list[tmp_data.num] = tmp_data;
      if (tmp_data.ch) {
        output.df_sel.push(tmp_data.num);
        this.numberData.chose++;
      }
    }
    // last row
    let not_fill = this.rowNum - sub_data.length;
    if (not_fill > 0) {
      output.data.push(sub_data);
      output.more = Array(not_fill).fill(not_fill);
    }
    this._logger.log(this.canSelFlag, sel_data, output);

    this.rowData = output;
  }

}
