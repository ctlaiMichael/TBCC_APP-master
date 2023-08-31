/**
 * 借款查詢: 查詢條件頁面
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { DateMonth } from '../../account-search/taiwan-deposit-a11y-page/search-a11y-page/Dateobject';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

import { Logger } from '@core/system/logger/logger.service';
import { A11yAlertService } from '@shared/popup/a11y/alert/alert.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { CreditInquiryService } from '@pages/credit/shared/service/credit-inquiry.service';
import { AuthService } from '@core/auth/auth.service';
import { DeviceService } from '@lib/plugins/device.service';
import { DateCheckUtil } from '@shared/util/check/date-check-util';

@Component({
  selector: 'app-loan-search-a11y-page',
  templateUrl: './loan-search-a11y-page.component.html',
  providers: [CreditInquiryService]
})
export class LoanSearchA11yPageComponent implements OnInit {

  // -- 分頁start -- 這部分應該在detail-a11y-page//
  pageCounter: number; // 當前頁次
  totalPages: number; // 全部頁面
  // -- 分頁end -- //

  data_info = {};    // 輸出值
  today: any;       // 當日-日期
  curr_year: any;   // 當日-年
  curr_month: any;  // 當日-月
  curr_date: any;   // 當日-日
  start_year: any;  // 起始年
  start_month: any; // 起始月
  start_day: any;   // 起始日
  end_year: any;    // 結束年
  end_month: any;   // 結束月
  end_day: any;     // 結束日
  start_date: string;  // 起始日期-民國年月日
  end_date: string;    // 結束日期-民國年月日
  rangeNum: number = 0;  // 快篩範圍設定： 一週/一月/二月/自訂(起迄僅相差90天)
  rangeType: string;      // 快篩範圍設定： 7D/1M/2M/custom
  result_sDate: string; // 最後送出資料-開始日期
  result_eDate: string; // 最後送出資料-結束日期

  // == 各預設值 == //
  mychoose: any;   // 快篩選擇項，預設為 1
  default_sY: any;  // 預設 起始年
  default_sM: any;  // 預設 起始月
  default_sD: any;  // 預設 起始日
  default_eY: any;  // 預設 結束年
  default_eM: any;  // 預設 結束月
  default_eD: any;  // 預設 結束日

  DateYears: number[] = [];
  DateMonths: DateMonth[] = [
    { id: 1, num: 1 },
    { id: 2, num: 2 },
    { id: 3, num: 3 },
    { id: 4, num: 4 },
    { id: 5, num: 5 },
    { id: 6, num: 6 },
    { id: 7, num: 7 },
    { id: 8, num: 8 },
    { id: 9, num: 9 },
    { id: 10, num: 10 },
    { id: 11, num: 11 },
    { id: 12, num: 12 },
  ];
  DateDays: number[] = [];

  platform: any; // iOS 或 Android 平台

  loanObj: any;
  headerObj = {
    'style': 'normal_a11y',
    'showMainInfo': false,
    'leftBtnIcon': 'back',
    'rightBtnIcon': 'noshow',
    'title': '借款查詢',
    'backPath': 'a11yloankey'
  };

  constructor(
    private _logger: Logger,    // overview
    private headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private alert: A11yAlertService,
    private _handleError: HandleErrorService,
    private creditInquiryService: CreditInquiryService,
    private authService: AuthService,
    private _device: DeviceService
  ) {
    this._device.devicesInfo().then((device) => {
      this.platform = device.platform.toLowerCase();
    });
  }

  ngOnInit() {
    this.headerCtrl.setOption(this.headerObj);
    this.loanObj = this.navgator.getParams();
    // == 取得日期 == //
    this.getDate();
    // 預設為最近一週
    this.oneweekClick();
    this.headerCtrl.setLeftBtnClick(() => { // 左邊button
      this.gobackPage();
    });
  }



  /**
  * 取得 日期 選單
  */
  getDate() {
    var count_year = 0;
    this.today = new Date();
    this.curr_year = (this.today.getFullYear() - 1911);
    this.curr_month = (this.today.getMonth() + 1);
    this.curr_date = this.today.getDate();

    this.default_sY = this.curr_year;
    this.default_sM = this.curr_month;
    this.default_sD = this.curr_date;
    this.default_eY = this.curr_year;
    this.default_eM = this.curr_month;
    this.default_eD = this.curr_date;

    // 年 -3年
    for (var count = (this.curr_year - 3); count <= (this.curr_year); count++) {
      this.DateYears[count_year] = count;
      count_year++;
    }
    this.checkYear(this.curr_year, this.curr_month);
  }

  /**
   * 閏月判斷
   * @param year
   * @param month
   */
  checkYear(year: string, month: string) {
    this.DateDays = [];  // 清空日期
    var myyear = parseInt(year) + 1911;
    if (((myyear % 100 != 0) || (myyear % 400 === 0)) && (myyear % 4 == 0)) { // 閏年
      if (month == '2') {
        for (var count_day = 1; count_day <= 29; count_day++) {
          this.DateDays[count_day - 1] = count_day;
        }
      } else if ((month == '4') || (month == '6') || (month == '9') || (month == '11')) {
        for (var count_day = 1; count_day <= 30; count_day++) {
          this.DateDays[count_day - 1] = count_day;
        }
      } else {
        for (var count_day = 1; count_day <= 31; count_day++) {
          this.DateDays[count_day - 1] = count_day;
        }
      }
    } else {
      // 平年
      if ((month == '4') || (month == '6') || (month == '9') || (month == '11')) {
        for (var count_day = 1; count_day <= 30; count_day++) {
          this.DateDays[count_day - 1] = count_day;
        }
      } else if (month == '2') {
        for (var count_day = 1; count_day <= 28; count_day++) {
          this.DateDays[count_day - 1] = count_day;
        }
      } else {
        for (var count_day = 1; count_day <= 31; count_day++) {
          this.DateDays[count_day - 1] = count_day;
        }
      }
    }
  }
  /**
   * 判斷使用者選擇日期
   * 使用預設或是自訂
   */
  getChoseDate() {
    if (!this.start_year) {
      this.start_year = this.default_sY;
    }
    if (!this.start_month) {
      this.start_month = this.default_sM;
    }
    if (!this.start_day) {
      this.start_day = this.default_sD;
    }
    if (!this.end_year) {
      this.end_year = this.default_eY;
    }
    if (!this.end_month) {
      this.end_month = this.default_eM;
    }
    if (!this.end_day) {
      this.end_day = this.default_eD;
    }
    let aaa: string = this.start_month;
    this.start_year = this.start_year;
    this.start_month = this.paddingLeft(aaa);
    this.start_day = this.paddingLeft(this.start_day);
    this.end_year = this.end_year;
    this.end_month = this.paddingLeft(this.end_month);
    this.end_day = this.paddingLeft(this.end_day);
    this.start_date = this.start_year + '/' + this.start_month + '/' + this.start_day;
    this.end_date = this.end_year + '/' + this.end_month + '/' + this.end_day;
  }

  /**
   * 月、日要補零
   * @param year
   */
  paddingLeft(str): string {
    let str1 = str.toString();
    if (str1.length >= 2)
      return str1;
    else
      return str1 = '0' + str1;
  }



  /**
   * 下拉選單點擊動作-年/月/日
   */
  onChangeSYear(year: HTMLSelectElement) {
    this.start_year = year.value;
  }
  onChangeSMonth(month: HTMLSelectElement) {
    this.start_month = month.value;
    if (this.start_year == null) {
      this.start_year = this.default_sY;
    }
    this.checkYear(this.start_year, this.start_month);
  }
  onChangeSDay(day: HTMLSelectElement) {
    this.start_day = day.value;
  }
  onChangeEYear(year: HTMLSelectElement) {
    this.end_year = year.value;
  }
  onChangeEMonth(month: HTMLSelectElement) {
    this.end_month = month.value;
    if (this.end_year == null) {
      this.end_year = this.default_eY;
    }
    this.checkYear(this.end_year, this.end_month);
  }
  onChangeEDay(day: HTMLSelectElement) {
    this.end_day = day.value;
  }

  /**
  * 選擇日期區間-皆以當日算起
  */
  oneweekClick() {
    // 一週
    this.getChoseDate();
    this.end_date = this.curr_year + '/' + this.curr_month + '/' + this.curr_date;
    this.mychoose = 1;   // 調整畫面呈現
    this.rangeNum = 7;  // 日期區間參數判斷-天
    // 進行一周調整
    this.plusandminus(this.end_date, this.rangeNum);
  }
  onemonthClick() {
    // 一個月
    this.getChoseDate();
    this.end_date = this.curr_year + '/' + this.curr_month + '/' + this.curr_date;
    this.mychoose = 2;
    this.rangeNum = 30;  // 日期區間參數判斷-天
    // 進行一個月調整
    this.plusandminus(this.end_date, this.rangeNum);
  }
  twomonthClick() {
    // 兩個月
    this.getChoseDate();
    this.end_date = this.curr_year + '/' + this.curr_month + '/' + this.curr_date;
    this.mychoose = 3;
    this.rangeNum = 60;  // 日期區間參數判斷-天
    // 進行兩個月調整
    this.plusandminus(this.end_date, this.rangeNum);
  }

  /**
   * 加減日期
   */
  plusandminus(enddate, day) {
    let array1 = enddate.split('/');
    let oweDay = new Date((parseInt(array1[0]) + 1911), (parseInt(array1[1]) - 1), parseInt(array1[2]));
    let time1 = oweDay.getTime();
    let pre = (time1 - (day * 86400000));
    let _date = new Date(pre);
    let _year = _date.getFullYear();
    let _month = _date.getMonth() + 1;
    let _day = _date.getDate();
    let daysLen = this.DateDays.length - 1;
    if (_day > this.DateDays[daysLen]) {
      _day = this.DateDays[daysLen];
    }
    this.default_sY = _year - 1911;
    this.default_sM = _month;
    this.default_sD = _day;
    this.start_year = this.default_sY;
    this.start_month = this.default_sM;
    this.start_day = this.default_sD;
    this.start_date = this.start_year + '/' + this.start_month + '/' + this.start_day;

    this.default_eY = this.curr_year;
    this.default_eM = this.curr_month;
    this.default_eD = this.curr_date;
    this.end_year = this.default_eY;
    this.end_month = this.default_eM;
    this.end_day = this.default_eD;
  }

  /**
  * 回上一頁/進入交易明細頁
  */
  goDetail() {
    // // 換頁並把資料帶到下一頁面
    this.getChoseDate();  // 是否使用預設或自訂日期檢核
    // 有通過日期檢核的話發送詳細內容電文
    if (this.checkDate(this.start_date, this.end_date)) {
      let reqObj = {
        'id': this.rangeType, // 快篩類別
        'acctType': '',
        'account': this.loanObj.acctNo,
        'startDate': Number(this.start_year + 1911).toString() + '/' + this.start_month + '/' + this.start_day,
        'endDate': Number(this.end_year + 1911).toString() + '/' + this.end_month + '/' + this.end_day
      };
      this.navgator.push('a11yloanresultkey', reqObj);
      // this.creditInquiryService.getDetailData(reqObj).then(
      //   (resObj) => {
      //     this.loanObj.info_data = resObj.info_data;
      //     this.loanObj.data = resObj.data;
      //     this.navgator.push('a11yloanresultkey', this.loanObj);
      //   },
      //   (errObj) => {
      //     this._handleError.handleError(errObj);
      //   }
      // );
    }
  }


  /**
   * 檢核日期規則
   */
  checkDate(startdate, enddate): boolean {
    let array_s = startdate.split('/');
    let array_e = enddate.split('/');
    let sDay = new Date((parseInt(array_s[0]) + 1911), (parseInt(array_s[1]) - 1), parseInt(array_s[2]));
    let eDay = new Date((parseInt(array_e[0]) + 1911), (parseInt(array_e[1]) - 1), parseInt(array_e[2]));
    let time1 = sDay.getTime();         // 起始時間
    let time2 = eDay.getTime();         // 結束時間
    let today = new Date();   // 當日時間
    let toDay = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + 1));
    let time3 = toDay.getTime();
    let invl_time = (time3 - time1);

    // 判斷快篩： 7D/1M/2M/custom
    if (this.rangeNum === 7) {
      this.rangeType = '7D';
      // this.rangeType = 'custom';
    } else if (this.rangeNum === 30) {
      this.rangeType = '1M';
    } else if (this.rangeNum === 60) {
      this.rangeType = 'custom';
    } else {
      this.rangeType = 'custom';
    }
    this.transferYear(startdate, enddate);
    const endDate = this.endDateTransferYear(enddate);
    const dateRange = DateCheckUtil.checkDateRange('M', this.result_sDate, endDate, 2);
    // 判斷查詢區間是否超過限制
    if (time1 > time2) {
      this.alert.show('開始日期不可大於結束日期');
      return false;
    } else if (!dateRange.status) {
      // 確認查詢區間是否超過二個月(比較起始日與結束日)
      this.alert.show('選擇日期區間不可超過2個月!');
      return false;
    } else {
      return true;
    }
  }

  /**
   * 返回上一頁
   */
  gobackPage() { // 左邊button
    const params = { back: true };
    this.navgator.push('a11yloankey', params);
  }



  /**
     * 失敗回傳
     * @param error_obj 失敗物件
     */
  onErrorBackEvent(error_obj) {
    let output = {
      'page': 'list-item',
      'type': 'error',
      'data': error_obj
    };
    this._handleError.handleError(error_obj);
    // this.errorPageEmit.emit(output);
  }

  /************************************************************************
     *                                                                      *
     *            可共用模組       TODO      改寫成service                    *
     *                                  *                                   *
     ************************************************************************/

  /**
   * 民國年轉換西元年，供取電文使用
   * @param startdate
   * @param enddate
   */
  transferYear(startdate, enddate) {
    let array_s = startdate.split('/');
    let array_e = enddate.split('/');
    this.result_sDate = (parseInt(array_s[0])+ 1911) + '/' + array_s[1] + '/' + array_s[2];
    this.result_eDate = (parseInt(array_e[0])+ 1911) + '/' + array_e[1] + '/' + array_e[2];
    // this.result_sDate = (parseInt(array_s[0])) + array_s[1] + array_s[2];
    // this.result_eDate = (parseInt(array_e[0])) + array_e[1] + array_e[2];
  }

  // 供html呼叫，帳號格式化
  formatAccount(account: string) {
    return AccountMaskUtil.accountNoFormate(account);
  }

  /**
   * 結束日期改為 - 格式，用以判斷區間
   * @param enddate
   */
  endDateTransferYear(enddate): string {
    let array_e = enddate.split('/');
    return (parseInt(array_e[0]) + 1911) + '-' + array_e[1] + '-' + array_e[2];
  }
}
