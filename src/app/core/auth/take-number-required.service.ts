import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router, Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { CurrentPositionService } from '@lib/plugins/currentposition.service';
import { FO000101ApiService } from '@api/fo/fo000101/fo000101-api.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FO000101ReqBody } from '@api/fo/fo000101/fo000101-req';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { HeaderOptions } from '@core/layout/header/header-options';

@Injectable()
export class TakeNumberRequired implements CanActivate {

  fo000101Data: any;   // fo000101電文回傳資料
  isEnabledGPS = '';   // GPS 是否啟用
  gpsRes: any;         // GPS 回傳資料

  constructor(
    private fo000101: FO000101ApiService,
    private _handleError: HandleErrorService,
    private _formateService: FormateService,
    private currentPostion: CurrentPositionService,
    private headerCtrl: HeaderCtrlService,
    private _logger: Logger,
  ) {
  }

  /**
   * 設定 fo000101 回傳值
   */
  setFo000101(data: any) {
    this.fo000101Data = data;
  }

  /**
   * 取得 fo000101 回傳值
   */
  getFo000101() {
    let output = this._formateService.transClone(this.fo000101Data);
    return output;
  }

  /**

  /**
   * 設定 GPS 回傳值
   */
  setGpsRes(data: any) {
    this.gpsRes = data;
    this._logger.debug('[Required] setGpsRes:', this.gpsRes);
  }

  /**
   * 設定 GPS 回傳值
   */
  getGpsRes() {
    return this.gpsRes;
  }

  /**
   * 取得定位狀態
   */
  setGpsStatus(data) {
    this.isEnabledGPS = data;
    this._logger.debug('[Required] setGpsStatus:', this.isEnabledGPS);
  }

  /**
   * 取得定位狀態
   */
  getGpsStatus() {
    return this.isEnabledGPS;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.setHeaderStyle();
    const url: string = state.url; // 來源url
    let checkStatus = this.checkTakeNumberBusinessDate(url);
    return checkStatus;
  }

  checkTakeNumberBusinessDate(url: string) {
    const form = new FO000101ReqBody();
    return this.fo000101.send(form).then((fo000101res) => {
      if (fo000101res.info_data.rtnCode == '0001') {
        // 非營業時間
        // 轉導至其他頁面
        let option = {
          type: 'message',
          content: 'RE_TAKE_NUMBER.POPUP.ERROR.0002'
        };
        this._handleError.handleError(option);
        return false;
      } else {
        // 營業時間
        this.setFo000101(fo000101res);
        const timeout = (!!this.isEnabledGPS) ? 200 : 2000;
        this._logger.debug('[Required] timeout:', timeout);
        if (!!this.isEnabledGPS && this.isEnabledGPS == 'Y') {
          return true;
        } else {
          return this.currentPostion.getCurrentPosition(30000, timeout).then((res) => {
            if (!!res.longitude && !!res.latitude) {
              this.isEnabledGPS = 'Y';
              let output = {
                timeStamp: Date.now(),
                isEnabledGPS: 'Y',
                gpsErrorCode: '',
                PERMISSION_DENIED: ''
              };
              this.setGpsRes(output);
              return true;
            }
          },
          (err) => {
            this.isEnabledGPS = 'N';
            let output = {
              timeStamp: Date.now(),
              isEnabledGPS: 'N',
              gpsErrorCode: err.code,
              PERMISSION_DENIED: err.PERMISSION_DENIED
            };
            this.setGpsRes(output);
            return true;
          });
        }
      }
    });
  }

  // 避免首頁樣式跑版
  setHeaderStyle() {
    const headerOptions = new HeaderOptions();
    headerOptions.style = 'login';
    this.headerCtrl.updateOption(headerOptions);
  }

}
