import {Component, OnInit} from '@angular/core';
import {NavgatorService} from '@core/navgator/navgator.service';
import {serviceAddress} from '@pages/location/location-search-page/locationobject';
import {timer} from 'rxjs/observable/timer';
import { TakeNumLocationService } from '../shared/service/take-num-location.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
  selector: 'app-take-number-my-branch',
  templateUrl: './take-number-my-branch.component.html',
  styleUrls: ['./take-number-my-branch.component.css']
})
export class TakeNumberMyBranchComponent implements OnInit {

  myBranchList = [];                  // 常用分行清單
  showFavoriteAddToast = false;       // 是否加入/移除常用分行提示訊息之控制器
  favoriteAddToastTimer;              // 加入/移除常用分行訊息顯示時間之計時器
  textFavoriteAddToast: string;       // 常用分行提示訊息之內容
  isEnabledGPS = 'N';                 // 是否啟用GPS
  isBusinessDate = false;             // 是否為營業日
  recordSearchTerm = '';              // 紀錄查詢條件: 選擇縣市, 選擇地區

  currentGpsPosition = {              // GPS位置資訊
    name: '',
    address: '',
    tel: '',
    lon: '',
    lat: ''
  };
  constructor(
    private navigator: NavgatorService,
    private takeNumLocationService: TakeNumLocationService,
    private _handleError: HandleErrorService,
    private headerCtrl: HeaderCtrlService
  ) {
    const getPrePageSet = this.navigator.getPrePageSet();

    this.headerCtrl.setLeftBtnClick(() => {
      if (getPrePageSet['path'] == 'take-number-my-branch' || getPrePageSet['path'] == 'take-number') {
        this.navigator.push('take-number', ['take-number-back', this.recordSearchTerm]);
      } else {
        this.navigator.pop();
      }
    });
  }

  ngOnInit() {
    this.initPage();
  }

  initPage() {
    const params = this.navigator.getParams();

    if (params[0] === 'take-number-my-branch') {
      this.myBranchList = params[1];
      this.isEnabledGPS = params[2];
      this.isBusinessDate = params[3];
      this.recordSearchTerm = params[4];
      this.currentGpsPosition = params[5];

      // GPS啟用，分行清單排序依照距離升冪排序
      if (this.isEnabledGPS == 'Y') {
        this.myBranchList =  this.takeNumLocationService.sortOutMyFaveBranchList(this.myBranchList,
           this.isEnabledGPS, this.currentGpsPosition);
        this.myBranchList =  this.myBranchList.sort((a, b ) => Number(a.distance) > Number(b.distance) ? 1 : -1);
      } else {
        this.myBranchList =  this.myBranchList.sort((a, b) => Number(a.postalCode) > Number(b.postalCode) ? 1 : -1);
      }
    } else {
      this.recordSearchTerm = params;
    }
  }

  // 點選地圖按鈕
  onGoMapClick(item: serviceAddress) {
    this.navigator.push('take-number-map', [true, item, true, this.isBusinessDate, this.recordSearchTerm]);
  }

  // 點選我要取號按鈕
  onTakeNumberClick(item: serviceAddress) {
    // === 取得該分行業務清單 === //
    this.takeNumLocationService.getBusinessList(item.branchId).then(
      (res) => {
        // this.navigator.push('take-number-operate', ['take-number-operate', item, res]);
        this.navigator.push('take-number-operate', ['take-number-operate', item, this.isBusinessDate, this.recordSearchTerm]);
      },
      (err) => {
        this._handleError.handleError(err);
      }
    );
  }

  // 移除我的分行
  onLocationAddFavoriteClick(item: serviceAddress, index) {
    this.onShowAddFavoriteToastEvent(!item.active ? 'TAKE_NUMBER.COMMON.JOIN_MYFAVE_BRANCH' : 'TAKE_NUMBER.COMMON.REMOVE_SUCCESS');
    this.myBranchList[index].active = false;
    this.myBranchList = this.myBranchList.filter(listItem => listItem.active);
    this.myBranchList = this.getFavoriteBranchList();
  }

  // 新增/移除我的分行提示
  onShowAddFavoriteToastEvent(text: string) {
    this.showFavoriteAddToast = true;
    this.textFavoriteAddToast = text;

    if (this.favoriteAddToastTimer) {
      this.favoriteAddToastTimer.unsubscribe();
    }

    this.favoriteAddToastTimer = timer(1.5 * 1000).subscribe(() => {
      this.showFavoriteAddToast = false;
    });
  }

  // 取得我的分行清單
  getFavoriteBranchList() {
    this.takeNumLocationService.addFaveBranchToLocal(this.myBranchList);
    return this.myBranchList;
  }
}
