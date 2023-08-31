/**
 * 線上餘額證明選單
 */
import { Component, OnInit, Input, Renderer2, NgZone } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';

@Component({
  selector: 'app-acnt-bla-cert-result',
  templateUrl: './acnt-bla-cert-result-page.component.html',
  styleUrls: [],
  providers: []
})
export class AcntBlaCertResultComponent implements OnInit {

  @Input() formObj;
  presentData: any;
  constructor(
    private _logger: Logger
    , private navgator: NavgatorService
    , private _headerCtrl: HeaderCtrlService
  ) {
    // this._logger.step('Financial', 'hi');
  }

  ngOnInit() {
    
    this.doData(this.formObj);
    
    this._headerCtrl.setLeftBtnClick(() => {
      this.backMenu();
    });
  }

  /**
   * go
   *
   */

  backMenu() {
    this.navgator.push('front-desk');
  }
  doData(data) {

    this.presentData = data.showData;
    this.presentData['hostCodeMsg'] = data.resData.data.hostCodeMsg;
    // 申請方式
    if (this.presentData.balanceType === '1') {
      this.presentData['balanceName'] = '單帳號／單幣別／全部餘額';
    } else if (this.presentData.balanceType === '2') {
      this.presentData['balanceName'] = '單帳號／單幣別／部分餘額';
    } else if (this.presentData.balanceType === '3') {
      this.presentData['balanceName'] = '全部餘額（帳號所屬ID／分行歸戶';
    } else if (this.presentData.balanceType === '4') {
      this.presentData['balanceName'] = '部分餘額（帳號所屬ID／分行歸戶）';
    } else if (this.presentData.balanceType === '5') {
      this.presentData['balanceName'] = '全部餘額（帳號所屬ID歸戶）';
    } else if (this.presentData.balanceType === '6') {
      this.presentData['balanceName'] = '部分餘額（帳號所屬ID歸戶）';
    }
    if (this.presentData.moneyPresentType === '1') {
      this.presentData['moneyPresentName'] = '中文';
    } else if (this.presentData.moneyPresentType === '2') {
      this.presentData['moneyPresentName'] = '英文';
    }

    if (this.presentData.receiveAddress === '4') {
      this.presentData.sendAddr = this.presentData.otherReceiveAddress;
    } else if (this.presentData.receiveAddress === '5') {
      this.presentData.sendAddr = this.presentData.city + ' ' + this.presentData.bankBranchName;
    } else {
      this.presentData.sendAddr = data.reqData.sendAddr;
    }
    if (this.presentData.whyApply === '4') {
      this.presentData.whyApply = this.presentData.otherApplyReason;
    }




    


  }

  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------
  oncheckEvent() {

    // this.showPage = this.showPage ? false : true;
  }
}
