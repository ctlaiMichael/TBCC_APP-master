/**
 * 申請網路理財
 */
import { Component, OnInit, ViewChild, HostListener, ViewContainerRef } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
// == 分頁 == //
import { FormateService } from '@shared/formate/formate.service';
import { CheckService } from '@shared/check/check.service';
import { FI000401ApiService } from '@api/fi/fI000401/fI000401-api.service'; // alex0520

// == 分頁 End == //
@Component({
  selector: 'app-fund-network',
  templateUrl: './fund-network.component.html'
})
export class FundNetworkComponent implements OnInit {
  resultData: any; // 結果
  nowStep = '';
  info_401: any = {}; // alex0520
  reqData = {
    custId: '',
    trnsType: '5', // 1單筆申購, 2小額申購(定期、不定期), 3預約單筆申購
    pwd: ''
  };
  constructor(
    private _logger: Logger
    , private _headerCtrl: HeaderCtrlService
    , private _uiContentService: UiContentService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _formateService: FormateService
    , private _checkService: CheckService
    , private _fi000401Service: FI000401ApiService // alex0520
  ) { }

  ngOnInit() {
  }

  clickDisAgree () {
    this.navgator.push('home');
  }

  clickAgree () {
    this.reqData.pwd = this.reqData.pwd;
    this._fi000401Service.getData(this.reqData).then(
      (resObj) => {
        let info_data = [];
        let errbt_msg = '';
        if (resObj.status) {
          info_data.push({
            title: '網路理財申請', // 推薦人編號
            content: '申請成功'
          });
        } else {
          errbt_msg = '網路理財申請失敗';
        }
        this.resultData = {
            title: resObj.title, // 結果狀態
            content_params: { }, // 副標題i18n
            content: resObj.msg, // 結果內容
            classType: resObj.classType, // 結果樣式
            detailData: info_data,
            button: '返回首頁', // 返回合庫E Pay
            buttonPath: 'home',
            err_btn: errbt_msg
        };
        this.onChangeStep('result');
      },
      (errorObj) => {
        this.resultData = {
          title: '申請失敗', // 結果狀態
          content: errorObj.content, // 結果內容
          classType: errorObj.classType, // 結果樣式
          err_btn: '返回首頁'
        };
        this.onChangeStep('result');
      }
    );
  }

  onChangeStep(step) {
    this.nowStep = step;
  }

  resultBack() {
    this.navgator.push('home');
  }
}
