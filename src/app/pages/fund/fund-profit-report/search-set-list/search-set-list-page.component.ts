/**
 * 我的願望清單
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { FundGroupSetService } from '@pages/fund/shared/service/fund-group-set.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { FundPurchaseTagService } from '@pages/fund/shared/service/fund-purchase-tag.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CacheService } from '@core/system/cache/cache.service';


@Component({
  selector: 'app-search-set-list',
  templateUrl: './search-set-list-page.component.html',
  styleUrls: [],
  providers: [FundGroupSetService, FundPurchaseTagService]

})
export class SearchSetListPageComponent implements OnInit {


  goSubject = 'select-page';  //控制頁面切換
  bookmarkData = []; // 頁籤設定
  nowPageType = '1D'; // 當前頁面名稱
  groupName;  //bookmark
  rangeType;  //當前group array=>index
  rangeName: any; //當前漲跌幅
  searchTime = '';
  showData = false;
  showAllData = false;
  all_data: any = [
    {
      wishList: []
    },
    {
      wishList: []
    },
    {
      wishList: []
    }
  ];

  group_data: any = {}; //畫面

  // 子層需要
  reqObj = {
    id: ''
  };


  constructor(
    private _logger: Logger
    , private router: Router
    , private _mainService: FundGroupSetService
    , private _formateServcie: FormateService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private confirm: ConfirmService
    , private fundPurchaseTagService: FundPurchaseTagService
    , private alert: AlertService
    , private _headerCtrl: HeaderCtrlService
    , private _cacheService: CacheService
  ) {
  }

  ngOnInit() {
    this._cacheService.removeGroup('fund-group-set');
    this.bookmarkData = this._mainService.getBookmark();
    console.error('this.bookmarkData', this.bookmarkData);
    this.getData('1', '1D', '0');

  }
  getData(type, pageType, setType?) {
    this._mainService.getData(type, setType).then(
      (res) => {
        console.log('getData Res', res);
        this.showAllData = true;
        if (res['info_data'].hasOwnProperty('fundLists') && res['info_data']['fundLists'] && res.info_data.fundLists.hasOwnProperty('fundList') &&
          res.info_data.fundLists.fundList.length > 0) {
          this.showData = true;
          this.all_data[parseInt(res.groupType) - 1].wishList = res.info_data.fundLists.fundList;
          this.group_data = this._formateServcie.transClone(this.all_data[parseInt(res.groupType) - 1]);
          if (this.all_data[this.rangeType] && this.all_data[this.rangeType].wishList) {
            this.group_data.wishList = this.sortArr(this._formateServcie.transClone(this.all_data[this.rangeType].wishList), pageType);
          } else {
            this.group_data.wishList = this.sortArr([], pageType);
          }
        } else {
          this.showData = false;
        }
        this.searchTime = res.headerTime;
        this.groupName = 'group' + parseInt(res.groupType);
        if (setType == '0') { //首次
          this.onChangePage('1D', this.bookmarkData[res.groupType - 1], this.groupName);
        }
      },
      (err) => {
        console.error('errrr', err);
        if (err['resultCode'] == 'F001') {
          this.group_data.wishList = [];
          this.showData = false;
        } else {
          err['type'] = 'message';
          this._handleError.handleError(err);
        }
      }
    )
  }
  onBookMarkBack(e) {
    console.error('onBookMarkBack', e);
    let set_data: any;
    let set_id: any;
    let level: any;  //第一層
    if (typeof e === 'object' && e.hasOwnProperty('data')) {
      set_data = e.data;
      if (set_data.hasOwnProperty('id')) {
        set_id = set_data.id;
      }
    }
    if (typeof e === 'object' && e.hasOwnProperty('level')) {
      level = e.level;
    }

    this.onChangePage(set_id, set_data, level);
  }
  /**
   * @param pageType 頁面切換判斷參數
    *        '1D' : 最近一天
    *        '1M' : 最近一月
    *        '6M' : 最近六月
    *        '12' : 最近一年
    * @param pageData 其他資料 
  */
  onChangePage(pageType: string, pageData?: any, level?: any) {
    console.error('pageType , pageData', pageType, pageData, level);
    switch (level) {
      case 'group1':
        this.rangeType = 0;
        break;
      case 'group2':
        this.rangeType = 1;
        break;
      case 'group3':
        this.rangeType = 2;
        break;
    }
    if (this.all_data[this.rangeType] && this.all_data[this.rangeType].wishList) {
      this.group_data = this._formateServcie.transClone(this.all_data[this.rangeType]);
      this.group_data.wishList = this.sortArr(this._formateServcie.transClone(this.all_data[this.rangeType].wishList), pageType);
      // this.showData = true;
    } else {
      // this.showData = false;
    }
    if (level) {  //點擊組合才發電文
      this.getData(this.rangeType + 1, pageType);
    }
    this.reqObj = { //子層需要
      id: pageType,
    };
    if (pageType.indexOf('group') < 0) {  // 切換查詢期間
      this.nowPageType = pageType;
    }
  }



  sortArr(arr, range) {
    if (arr) {
      console.log('sortArr', arr, range);
      let i: any, j: any, temp: any;
      let len = arr.length;
      let type;
      switch (range) {
        case '1D':
          type = 'riseDown';
          this.rangeName = '前日漲跌幅';
          break;
        case '1M':
          type = 'monthEffect';
          this.rangeName = '一個月漲跌幅';
          break;
        case '6M':
          type = 'halfYearEffect';
          this.rangeName = '六個月漲跌幅';
          break;
        case '12M':
          type = 'yearEffect';
          this.rangeName = '一年漲跌幅';
          break;
        default:
          break;
      }

      for (i = 0; i < len - 1; i++) {
        console.error(i);

        for (j = 0; j < len - 1 - i; j++) {
          console.log('before', arr[j][type], arr[j + 1][type]);
          if (isNaN(parseFloat(arr[j][type]))) {
            let NaNtmp = arr.splice([j], 1);
            arr.push(NaNtmp[0]);
            console.error('NAN', arr[j][type]);
          } else if (isNaN(parseFloat(arr[j + 1][type]))) {
            let NaNtmp = arr.splice([j + 1], 1);
            arr.push(NaNtmp[0]);
            console.error('NAN', arr[j + 1][type]);
          } else {
            if (parseFloat(arr[j][type]) <= parseFloat(arr[j + 1][type])) {
              temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
            }
            console.log('NNN', arr[j][type], arr[j + 1][type]);
          }
        }
      }
      return arr;
    }
  }

  //申購回傳
  onPageBackEvent(e) {
    console.error('e backEvent', e);
    this.navgator.push('fund-purchase', { path: 'fund-purchase', fundCode: e.fundCode })
  }
  //理財金庫
  onBackWebEvent(e) {
    console.error('e backEvent', e);
    this.navgator.push('web:fundCashBox', {}, { FUNDID: e.fundCode, FILE: '02' });
  }


}
