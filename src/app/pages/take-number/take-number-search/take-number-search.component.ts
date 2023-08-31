import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs/observable/timer';
import { Logger } from '@core/system/logger/logger.service';
import { branchDetail, serviceLocation } from '@pages/location/location-search-page/locationobject';
import { NavgatorService } from '@core/navgator/navgator.service';
import { CurrentPositionService } from '@lib/plugins/currentposition.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { TicketRecordQueryService } from '@pages/take-number/shared/service/ticket-record-query.service';
import { TicketItem } from '@pages/take-number/shared/component/number-ticket/number-ticket.interface';
import { TakeNumLocationService } from '../shared/service/take-num-location.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import {FO000102ReqBody} from '@api/fo/fo000102/fo000102-req';
import {LoadingSpinnerService} from '@core/layout/loading/loading-spinner.service';
import {TranslateService} from '@ngx-translate/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { TakeNumberRequired } from '@core/auth/take-number-required.service';
import { HeaderOptions } from '@core/layout/header/header-options';

@Component({
  selector: 'app-take-number-search',
  templateUrl: './take-number-search.component.html',
  styleUrls: ['./take-number-search.component.css']
})
export class TakeNumberSearchComponent implements OnInit {

  bookmarkData = [];                    // 頁籤設定
  nowPage = 'take-number';              // 指定頁面
  showTakeNumber = true;                // 取號查詢

  textTicketRecordUpdateTime: string;   // 取號查詢-查詢時間
  ticketRecords: TicketItem[] = [];     // 取號查詢-查詢資料
  paramsItem = {};                      // 取號查詢-線上取號查詢條件參數

  isBusinessDate: boolean;               // 是否為營業時間

  myFaveBranches: branchDetail[] = [];  // 常用分行
  showFavoriteAddToast = false;         // 是否加入/移除常用分行提示訊息之控制器
  favoriteAddToastTimer;                // 加入/移除常用分行訊息顯示時間之計時器
  textFavoriteAddToast: string;         // 常用分行提示訊息之內容

  selectServiceLocation = '1';          // 自選縣市，被挑選的縣市
  selectServiceLocationGPS = '0';       // GPS啟用時，被挑選的縣市
  selectServiceDistrct = '';            // 被挑選的區域，初始請為空
  inputSearch;                          // 查詢地區的文字內容
  countriesList = [];                   // 縣市區域總清單
  serviceDistrcts = [];                 // 區域選單
  serviceLocations: serviceLocation[] = [];         // 縣市選單
  serviceAddressesOriginal: branchDetail[] = [];    // 記錄前一次搜尋分行清單
  serviceAddresses: branchDetail[] = [];            // 當前搜尋分行清單

  // 判斷該裝置的GPS是否啟用
  isEnabledGPS = '';
  getFirstGPS = '';                     // 取得首次定位狀態
  // GPS定位回傳資料
  gpsRes: any;
  // GPS定位失敗代碼
  gpsErrorCode = '';
  // GPS位置資訊
  currentGpsPosition = {
    name: '',
    address: '',
    tel: '',
    lon: '',
    lat: ''
  };

  // 裝置判斷: android / iOS
  u = navigator.userAgent;
  isAndroid = this.u.indexOf('Android') > -1 || this.u.indexOf('Adr') > -1;

  fo000101Res: any;         // fo000101 回傳資料

  constructor(
    private _logger: Logger,
    private navgator: NavgatorService,
    private alert: AlertService,
    private currentPostion: CurrentPositionService,
    private queryTicketApi: TicketRecordQueryService,
    private takeNumLocationService: TakeNumLocationService,
    private _handleError: HandleErrorService,
    private _loadingSpinner: LoadingSpinnerService,
    private translate: TranslateService,
    private headerCtrl: HeaderCtrlService,
    private takeNumberRequired: TakeNumberRequired
  ) {
  }

  ngOnInit() {
    this.setResetHeaderStyle();
    this.initPage();
    this.getBusinessDate().then((isBusRes) => {
      this.getPosition(0, 200).then((_res) => {
        this.isEnabledGPS = _res.isEnabledGPS;
        if ( !this.isAndroid && !!_res.gpsErrorCode && !!_res.PERMISSION_DENIED) {
          // [iOS]，用於修正第一次定位存取權限，同意後且GPS啟用但取不到定位之問題
          this._logger.debug('Second GET GPS');
          this._logger.debug('Second GET isEnabledGPS:', this.isEnabledGPS);
          this.getPosition(30000, 2000).then((res) => {
            if (!!res.gpsErrorCode && this.getFirstGPS == 'Y') {
              this.takeNumberRequired.setGpsStatus(this.isEnabledGPS);
              this.alert.show('POPUP.LOCATION.NO_POSTION', { title: 'POPUP.LOCATION.NO_HIGH_ACCURACY_TITLE' })
              .then(() => {
                this._logger.debug('Second GET serviceAddresses:', this.serviceAddresses);
                if (this.serviceAddresses.length == 0) {
                  // 取得縣市區域清單
                  this._logger.debug('getServiceLocation');
                  this.getServiceLocation(this.isEnabledGPS);
                }
              });
            } else {
              this.isEnabledGPS = res.isEnabledGPS;
              this.takeNumberRequired.setGpsStatus(this.isEnabledGPS);
              this.gpsErrorCode = res.gpsErrorCode;
              // 取得縣市區域清單
              this.getServiceLocation(this.isEnabledGPS);
            }
          });
        } else if (!!_res.gpsErrorCode) {
          // [Android]，用於修正第一次定位存取權限，同意後且GPS啟用但取不到定位之問題
          this._logger.debug('Second GET GPS');
          this._logger.debug('Second GET isEnabledGPS:', this.isEnabledGPS);
          this.getPosition(30000, 1000).then((res) => {
            if (!!res.gpsErrorCode && this.getFirstGPS == 'Y') {
              this.takeNumberRequired.setGpsStatus(this.isEnabledGPS);
              this.alert.show('POPUP.LOCATION.NO_POSTION', { title: 'POPUP.LOCATION.NO_HIGH_ACCURACY_TITLE' })
              .then(() => {
                this._logger.debug('Second GET serviceAddresses:', this.serviceAddresses);
                if (this.serviceAddresses.length == 0) {
                  // 取得縣市區域清單
                  this._logger.debug('getServiceLocation');
                  this.getServiceLocation(this.isEnabledGPS);
                }
               });
            } else {
              this.isEnabledGPS = res.isEnabledGPS;
              this.takeNumberRequired.setGpsStatus(this.isEnabledGPS);
              this.gpsErrorCode = res.gpsErrorCode;
              // 取得縣市區域清單
              this.getServiceLocation(this.isEnabledGPS);
            }
          });
        } else {
          // 取得縣市區域清單
          this.getServiceLocation(this.isEnabledGPS);
        }
      });
     });
  }

  // 重新複寫頁首樣式
  // 避免首頁樣式跑版
  setResetHeaderStyle() {
    const headerOptions = new HeaderOptions();
    headerOptions.style = 'normal';
    headerOptions.backPath = 'home';
    headerOptions.title = 'TAKE_NUMBER.COMMON.TITLE';
    this.headerCtrl.updateOption(headerOptions);
  }

  // 切換我的分行分頁
  onFavoriteBranchSwitchClick() {
    // 新增參數, 紀錄挑選的地區別
    let params = {
      country : (this.isEnabledGPS == 'Y') ? this.selectServiceLocationGPS : this.selectServiceLocation,
      district: this.selectServiceDistrct,
      searchText: this.inputSearch
    };
    if (this.takeNumLocationService.getFaveBranch().length > 0) {
      this.navgator.push('take-number-my-branch', ['take-number-my-branch',
       this.takeNumLocationService.getFaveBranch(), this.isEnabledGPS, this.isBusinessDate, params, this.currentGpsPosition]);
    } else {
      this.navgator.push('take-number-my-branch', params);
    }
  }

  // 加入/移除我的分行
  onLocationAddFavoriteClick(item, index) {
    this.onShowAddFavoriteToastEvent(!item.active ? 'TAKE_NUMBER.COMMON.JOIN_MYFAVE_BRANCH' : 'TAKE_NUMBER.COMMON.REMOVE_SUCCESS');
    this.serviceAddresses[index]['active'] = !item.active;

    this._logger.debug('[DEBUG] myFaveBranches', this.myFaveBranches);

    if (this.myFaveBranches.length < 0) {
      this.myFaveBranches = [];
    }
    let tempIndex = this.myFaveBranches.map(b => b.branchId).indexOf(this.serviceAddresses[index].branchId);
    // 加入常用分行
    if (!!item.active) {
      if (tempIndex < 0) {
        this.myFaveBranches.push(item);
      }
      this.getFavoriteBranchList();
    } else {
      // 移除分行
      this.myFaveBranches.splice(tempIndex, 1);
      this.getFavoriteBranchList();
    }
  }

  // 服務據點下拉選單項目變更
  onServiceLocationChange(event) {
    const serviceItem = this.serviceLocations.filter(item => item.id == event).pop();
    this.selectServiceLocation = event.toString();
    this.selectServiceLocationGPS = event.toString();
    this.inputSearch = '';
    if (event == 0) {
      // GPS是否啟用
      this.isEnabledGPS = '';
      this.checkGpsEnabledOrNot(0, 1600);
    } else {
      // GPS是否啟用
      this.checkGpsEnabledOrNot();
    }
  }

  // 地區別選單變更
  onServiceDistributionChange(event) {
    this.selectServiceDistrct = event;
    this.inputSearch = '';
    // ==== 取得服務據點查詢 ==== //
    this.getQueryServiceLocation('1');
  }

  // 地圖按鈕
  onGoMapClick(item: branchDetail, showTakeNumber = true) {
    // 新增轉導頁參數，紀錄挑選的地區別
    let params = {
      country : (this.isEnabledGPS == 'Y') ? this.selectServiceLocationGPS : this.selectServiceLocation,
      district: this.selectServiceDistrct,
      searchText: this.inputSearch
    };
    this.setBookmarkData();
    this.navgator.push('take-number-map', [true, item, showTakeNumber, this.isBusinessDate, params]);
  }

  // 取號按鈕
  onTakeNumberClick(item: branchDetail) {
    // 新增轉導頁參數，紀錄挑選的地區別
    let params = {
      country : (this.isEnabledGPS == 'Y') ? this.selectServiceLocationGPS : this.selectServiceLocation,
      district: this.selectServiceDistrct,
      searchText: this.inputSearch
    };
    // === 取得該分行業務清單 === //
    this.navgator.push('take-number-operate', ['take-number-operate', item, this.isBusinessDate, params]);
  }

  // 搜尋按鈕
  onSearchClick(keyword: string, showMessage: boolean = true) {
    // ==== 取得服務據點查詢 ==== //
    let localType = (this.isEnabledGPS == 'Y') ? '0' : '1';
    if (keyword === '' || !keyword) {
      this.serviceAddresses = this.serviceAddressesOriginal;
      return;
    } else {
      // 不發電文，僅搜尋現有的項目
      const filterList = this.serviceAddressesOriginal.filter(item => {
        return item.branchName.indexOf(keyword) > -1 ||
               item.branchAddr.indexOf(keyword) > -1 ||
               item.telephone.indexOf(keyword) > -1;
      });

      this.inputSearch = '';

      if (filterList.length < 1  && showMessage) {
        this.alert.show('POPUP.LOCATION.NO_INFO');
        return;
      }

      if (filterList.length < 1 && !showMessage) {
        return;
      }

      this.serviceAddresses = filterList;
    }
  }

  // 新增/移除我的分行提示
  onShowAddFavoriteToastEvent(text: string) {
    this.translate.get(text).subscribe(val => {
      this.showFavoriteAddToast = true;
      this.textFavoriteAddToast = val;

      if (this.favoriteAddToastTimer) {
        this.favoriteAddToastTimer.unsubscribe();
      }

      this.favoriteAddToastTimer = timer(1.5 * 1000).subscribe(() => {
        this.showFavoriteAddToast = false;
      });
    });
  }

  // 取號查詢重新整理
  onRefreshTicketRecordClick() {
    return new Promise((resolv, reject) => {
      this.queryTicketApi.getQueryTicketRecords()
        .then(result => {
          this.textTicketRecordUpdateTime = result.updateTime;
          this.ticketRecords = result.data;
          return resolv();
        })
        .catch(err => {
          let msg = (err && err['info_data'] && err['info_data'].rtnMsg && err['info_data'].rtnMsg !== '')
            ? err['info_data'].rtnMsg
            : 'RE_TAKE_NUMBER.POPUP.QUERY_RECORDS_FAIL';

          this._handleError.handleError({ content: msg });
          return resolv();
        });
    });
  }

  /**
   * 頁籤回傳
   * @param e
   */
  onBookMarkBack(e) {
    this._logger.step('take-number', 'onBookMarkBack', e);
    let page = '';
    let set_data: any;
    let set_id: any;
    if (typeof e === 'object') {
      if (e.hasOwnProperty('page')) {
        page = e.page;
      }
      if (e.hasOwnProperty('data')) {
        set_data = e.data;
        if (set_data.hasOwnProperty('id')) {
          set_id = set_data.id;
        }
      }
    }

    this.onChangePage(set_id);
  }

  initPage() {
    this.fo000101Res = this.takeNumberRequired.getFo000101();
    this._logger.info('[GET] fo000101Res:', this.fo000101Res);

    this.isEnabledGPS = this.takeNumberRequired.getGpsStatus();
    this.getFirstGPS = this.isEnabledGPS;
    this._logger.debug('[DEBUG] GPS Status:', this.isEnabledGPS);

    this.bookmarkData = [
      {
        id: 'take-number',
        name: 'TAKE_NUMBER.COMMON.TITLE', // 線上取號
        sort: 1
      }
      , {
        id: 'take-number-query',
        name: 'TAKE_NUMBER.COMMON.QUERY', // 取號查詢
        sort: 2
      }
    ];

    const params = this.navgator.getParams();
    this._logger.debug('[GET] params:', params);
    if (params !== undefined && params[0] === 'take-number-search') {
      this.onChangePage(params[1]);
    } else if (params !== undefined && params[0] === 'take-number-back') {
      // 左上角返回鍵事件，紀錄上一次查詢條件
      this.selectServiceLocation = params[1]['country'];
      this.selectServiceLocationGPS = params[1]['country'];
      this.selectServiceDistrct = params[1]['district'];
      // this.inputSearch = params[1]['searchText'];

      this.serviceAddressesOriginal = this.takeNumLocationService.getServiceAddressesOriginal();
      this._logger.debug('[GET] serviceAddressesOriginal:', this.serviceAddressesOriginal);
      if (!!this.isEnabledGPS && this.isEnabledGPS == 'Y') {
        if (!!this.serviceAddressesOriginal) {
          this.serviceAddresses = this.takeNumLocationService.getServiceAddressesOriginal();
          this._logger.debug('[GET] serviceAddresses:', this.serviceAddresses);
        }
      }
    }
    this.serviceAddresses = this.serviceAddressesOriginal;
    this.myFaveBranches = this.takeNumLocationService.getFaveBranch();
    this._logger.info('[INFO] INIT myFaveBranches:', this.myFaveBranches);
  }

  /**************************************************************************************
   * 取得定位資訊
   * @param maxiMumAge   上一次取得GPS資料保留時間
   * @param timeOut     逾時時間測試
   **************************************************************************************/
  getPosition(maxiMumAge, timeOut): Promise<any> {
    return new Promise((resolve, reject) => {
      this._loadingSpinner.show(this.nowPage);
      // this.currentPostion.getCurrentPosition(maxiMumAge, timeOut).then(
      this.currentPostion.getCurrentPosition(30000).then(
        (res) => {
          this._loadingSpinner.hide(this.nowPage);
          // ==== 取得定位成功 ==== //
          this._logger.debug('[TAKE NUMBER res] ', res);
          this.currentGpsPosition.lon = res.longitude;
          this.currentGpsPosition.lat = res.latitude;
          if (!!this.currentGpsPosition.lon && !!this.currentGpsPosition.lat) {
            this.takeNumberRequired.setGpsStatus('Y');
            let output = {
              isEnabledGPS: 'Y',
              gpsErrorCode: '',
              PERMISSION_DENIED: ''
            };
            return resolve(output);
          }
        },
        (err) => {
          this._loadingSpinner.hide(this.nowPage);
          this._logger.debug('[TAKE NUMBER err] ', err);
          this.takeNumberRequired.setGpsStatus('N');
          let output = {
            isEnabledGPS: 'N',
            gpsErrorCode: err.code,
            PERMISSION_DENIED: err.PERMISSION_DENIED
          };
          return resolve(output);
        });
    });
  }

  /**************************************************************************************
  * 是否為營業日
  ***************************************************************************************/
  getBusinessDate() {
    return new Promise((resolve, reject) => {
    this.takeNumLocationService.initServiceLocation(this.fo000101Res).then(
      (res) => {
        this.countriesList = res.counties;
        this.serviceLocations = res.serviceLocations;
        if (!!res.isBusinessDate && res.isBusinessDate == 'Y') {
          // === 為營業時間 === //
          this.isBusinessDate = true;
          resolve();
        } else {
          // === 非營業時間 === //
          this.isBusinessDate = false;
          // 轉導至其他頁面
          let option = {
            type: 'message',
            content: 'RE_TAKE_NUMBER.POPUP.ERROR.0002'
          };
          this._handleError.handleError(option);
        } // end of 營業時間判斷
      },
      (err) => {
        this._logger.error(err);
        this._handleError
          .handleError({content: 'RE_TAKE_NUMBER.POPUP.ERROR.0004'})
          .then(() => {
            this.navgator.pop();
          });
      });
    });
  }

  /**************************************************************************************
  * 取得縣市區域清單
  * @param isEnabledGPS GPS是否啟用(Y/N)
  ***************************************************************************************/
  getServiceLocation(isEnabledGPS) {
    // === 為營業時間 === //
    // 判斷GPS是否啟用
    if (isEnabledGPS == 'Y') {
      if (this.selectServiceLocationGPS !== '0') {
        this.regulateDistrictList(isEnabledGPS);
      } else {
        // ==== 取得服務據點查詢 ==== //
        this.getQueryServiceLocation('0');
      }
    } else {
      if (this.serviceLocations.length < 1) {
        // 回覆訊息「線上取號功能查詢失敗，請稍後再試，謝謝。」
        this.alert.show('RE_TAKE_NUMBER.POPUP.ERROR.0004');
      } else {
        this.regulateDistrictList(isEnabledGPS);
      }
    }
  }

  /*****************************************************************************************
   *  檢查GPS是否啟用
   * @param maxiMumAge 上一次取得GPS資料保留時間
   * @param timeOut 等待時間
   *****************************************************************************************/
  checkGpsEnabledOrNot(maxiMumAge?, timeOut?) {
    // 清空所有參數
    this.selectServiceDistrct = '';
    // this.isEnabledGPS = '';
    this.gpsErrorCode = '';

    this._loadingSpinner.show(this.nowPage);
    // this.currentPostion.getCurrentPosition(maxiMumAge, timeOut).then(
    this.currentPostion.getCurrentPosition(30000, 3000).then(
      (res) => {
        this._loadingSpinner.hide(this.nowPage);
        // ==== 取得定位成功 ==== //
        this._logger.debug('[TAKE NUMBER res] ', res);
        this.currentGpsPosition.lon = res.longitude;
        this.currentGpsPosition.lat = res.latitude;

        if (!!this.currentGpsPosition.lon && !!this.currentGpsPosition.lat) {
          this.isEnabledGPS = 'Y';

          // ==== 取得服務據點查詢 ==== //
          if (this.selectServiceLocationGPS == '0') {
            this.getQueryServiceLocation('0');
          } else {
            this.regulateDistrictList(this.isEnabledGPS);
          }
        }
      },
      (err) => {
        this._loadingSpinner.hide(this.nowPage);
        this._logger.debug('[TAKE NUMBER error] ', err);
        this.isEnabledGPS = 'N';
        this.gpsErrorCode = err['code'];
        this._logger.debug('isAndroid:', this.isAndroid);
        this._logger.debug('gpsErrorCode:', this.gpsErrorCode);
        if ((!!this.isAndroid && this.gpsErrorCode == '3' && this.selectServiceLocation == '0')
          || (!this.isAndroid && this.gpsErrorCode == '1' && this.selectServiceLocation == '0')) {
          // GPS未啟用提示
          this.alert.show('POPUP.LOCATION.NO_POSTION', { title: 'POPUP.LOCATION.NO_HIGH_ACCURACY_TITLE' })
            .then(() => { });
        } else if (this.serviceLocations.length < 1) {
          // 回覆訊息「線上取號功能查詢失敗，請稍後再試，謝謝。」
          this.alert.show('RE_TAKE_NUMBER.POPUP.ERROR.0004');
        } else {
          // 根據縣市選擇變更地區別選單
          this.regulateDistrictList(this.isEnabledGPS);
        }
      }
    ).catch(
      (exception) => {
        this._loadingSpinner.hide(this.nowPage);
        this._logger.debug('[TAKE NUMBER exception] ', exception);
        this._handleError.handleError(exception);
      }
    );
  }

  /*****************************************************************************************
   * 根據縣市選擇變更地區別選單
   * @param isEnabledGPS 是否啟用GPS
   ****************************************************************************************/
  regulateDistrictList(isEnabledGPS) {
    this.serviceDistrcts = [];  // 清空地區別選單
    let tempDistrcts = [];
    let tempServiceLocation = (isEnabledGPS == 'Y') ? this.selectServiceLocationGPS : this.selectServiceLocation;

    // 2020/03/02 預設顯示縣市內所有分行列表
    this.serviceDistrcts.push({
      id: 0,
      regionCode: '',
      regionName: '全區'
    });

    if (tempServiceLocation != '0') {
      // '0' 為目前位置查詢，不需要地區清單
      tempDistrcts = this.countriesList[Number(tempServiceLocation) - 1].regions;
    }
    for (let count = 0; count < tempDistrcts.length; count++) {
      let distrcts = {
        id: count + 1,
        regionCode: tempDistrcts[count].regionCode,
        regionName: tempDistrcts[count].regionName
      };
      this.serviceDistrcts.push(distrcts);
    }

    // if (!!this.serviceDistrcts && tempServiceLocation == '1' && !this.selectServiceDistrct) {
    //   // 台北市，預設地區為松山區
    //   let tempIndex = this.serviceDistrcts.map(b => b.regionName).indexOf('松山區');
    //   this.selectServiceDistrct = tempIndex.toString();
    // } else if ((!!this.serviceDistrcts && tempServiceLocation != '0' && !this.selectServiceDistrct)) {
    //   // 其他縣市，預設地區為第一筆
    //   this.selectServiceDistrct = '0';
    // }
    // 一律預設顯示全區
    if ((!!this.serviceDistrcts && !this.selectServiceDistrct)) {
        this.selectServiceDistrct = '0';
    }

    // ==== 取得服務據點查詢 ==== //
    this.getQueryServiceLocation('1');
  }

  /***************************************************************************************
   * 查詢對應的服務據點，localType為定位類型
   ***************************************************************************************/
  getQueryServiceLocation(localType, searchText?) {
    let output = new FO000102ReqBody();
    this._logger.debug('localType', localType);
    // // 記錄前一次搜尋結果
    // if (!!this.serviceAddresses) {
    //   this.serviceAddressesOriginal = this.serviceAddresses;
    // }
    if (localType == '0') {
      // === GPS === //
      output.localType = '0';
      output.lon = this.currentGpsPosition.lon;
      output.lat = this.currentGpsPosition.lat;
      output.searchScope = '15';
      output.searchText = '';
      this._logger.debug('GPS_req output:', output);
    } else {
      // === 自選縣市 === //
      let tempServiceLocation = (this.isEnabledGPS == 'Y') ? this.selectServiceLocationGPS : this.selectServiceLocation;
      output.localType = '1';
      output.county = this.countriesList[Number(tempServiceLocation) - 1].countyCode;
      output.region = this.serviceDistrcts[this.selectServiceDistrct].regionCode;
      output.searchText = '';
      this._logger.debug('selectCounty_req output:', output);
    }

    this.takeNumLocationService.getServiceLocationList(output).then(
      (res) => {
        // === 分行清單整理 serviceAddresses === //
        this.serviceAddresses = []; // 清空分行清單
        this.serviceAddresses = this.takeNumLocationService.sortOutBranchList(res, this.isEnabledGPS, this.currentGpsPosition);

        // 判斷是否為搜尋特定分行
        // this.serviceAddresses = this.takeNumLocationService.searchCheck(this.serviceAddresses, searchText);

        // GPS升冪排序
        if (this.isEnabledGPS == 'Y') {
          this.serviceAddresses = this.serviceAddresses.sort((a, b) => Number(a.distance) > Number(b.distance) ? 1 : -1);
        } else {
          // 若有'營業部'則排在最前面，否則皆依據PostCode排序
          this.serviceAddresses = this.serviceAddresses.sort((a, b) => Number(a.postalCode) > Number(b.postalCode) ? 1 : -1);
          let tempIndex = this.serviceAddresses.map(b => b.branchName).indexOf('營業部');
          if (tempIndex > -1) {
            let tempServiceAddresses = this.serviceAddresses[tempIndex];
            this.serviceAddresses.splice(tempIndex, 1);
            this.serviceAddresses.splice(0, 0, tempServiceAddresses);
          }
        }

        // 儲存 Filter 前資料
        this.serviceAddressesOriginal = this.serviceAddresses;
        this.takeNumLocationService.setServiceAddressesOriginal(this.serviceAddressesOriginal);
        // this.onSearchClick(this.inputSearch, false);
      },
      (err) => {
        // 回覆訊息「線上取號功能查詢失敗，請稍後再試，謝謝。」
        this._handleError.handleError({ content: 'RE_TAKE_NUMBER.POPUP.ERROR.0004' });
        this._logger.error(err);
      }
    );
  }

  // 取得我的分行清單
  getFavoriteBranchList() {
    this._logger.debug('[DEBUG] ADD myFave:', this.myFaveBranches);
    this.takeNumLocationService.addFaveBranchToLocal(this.myFaveBranches);
    return this.myFaveBranches;
  }

  setBookmarkData() {
    this.navgator.setParams(['take-number-search', this.nowPage]);
  }


  /**
   * 頁面切換
   * @param pageType 頁面切換判斷參數
   *        'apply' : 申請綁定頁
   *        'bind' : 裝置綁定頁
   * @param pageData 其他資料
   */
  private onChangePage(pageType: string, pageData?: any) {

    let paramItem = {
      isBusinessDate: true,
      country : (this.isEnabledGPS == 'Y') ? this.selectServiceLocationGPS : this.selectServiceLocation,
      district: this.selectServiceDistrct
    };
    this.paramsItem = paramItem;
    this._logger.debug('[GET] paramsItem:', this.paramsItem);

    let set_page = pageType;
    switch (pageType) {
      case '2':
      case 'take-number-query': // 取號查詢
        this.onRefreshTicketRecordClick()
          .then(() => {
            set_page = 'take-number-query';
            this.showTakeNumber = false;
          });
        break;
      case '1':
      case 'take-number': // 線上取號
      default:
        set_page = 'take-number';
        this.showTakeNumber = true;
        break;
    }
    this.nowPage = set_page;
  }
}
