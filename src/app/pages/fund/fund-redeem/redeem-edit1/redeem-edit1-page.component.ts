/**
 * 基金贖回-列表-單一筆資料 [分頁模式]
 * AppView/msg/FUND05.html
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FundRedeemService } from '@pages/fund/shared/service/fund-redeem.service';
import { logger } from '@shared/util/log-util';
import { AlertService } from '@shared/popup/alert/alert.service';

@Component({
  selector: 'app-redeem-edit1',
  templateUrl: './redeem-edit1-page.component.html',
  styleUrls: [],
  providers: [FundRedeemService]
})
export class RedeemEdit1PageComponent implements OnInit, OnChanges {
  @Input() page: string | number = 1;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() trnsType: string; // 主層傳來，接errorCode，轉預約
  // trnsType: string = '1';
  info_data: any = {}; // fi000501存電文回傳
  data: any = []; // 存fi000501電文回傳

  // 是否為預約轉換
  resverFlag = false;
  oldType: string; // oldType本來的()
  constructor(
    private _logger: Logger
    , private router: Router
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _mainService: FundRedeemService
    , private _headerCtrl: HeaderCtrlService
    , private alert: AlertService
  ) {
  }

  ngOnInit() {
    if (this.oldType != this.trnsType) {
      this.getData();
    }
  }

  ngOnChanges() {
    if (this.oldType != this.trnsType) {
      this.getData();
    }
  }

  /**
   * 取得贖回資料
   * 發501電文
   */
  getData() {
    this.oldType = this.trnsType; // trnsType有無改變
    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString(), 10);
    }
    this._mainService.getAccount(this.trnsType, this.page).then(
      (result) => {
        this.info_data = result.info_data;
        this.data = result.data;
        this.onBackPageData(result);
      },
      (errorObj) => {
        this._logger.error('errorObj:', errorObj);
        this.onErrorBackEvent(errorObj, 'list-item');
      }
    );
  }


  /**
   * 贖回點擊事件
   * @param item
   */
  onRedeem(item) {
    const output = {
      'page': 'redeem-edit1',
      'type': 'page_info',
      'data': item,
      'trnsType': this.trnsType
    };
    this.backPageEmit.emit(output);
  }

  /**
   * 重新設定page data
   * @param item
   */
  onBackPageData(item) {
    const output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item,
      'trnsType': this.trnsType
    };
    this.backPageEmit.emit(output);
  }

  /**
   * 失敗回傳
   * @param error_obj 失敗物件
   */
  onErrorBackEvent(error_obj, page) {
    const output = {
      'page': 'list-item',
      'type': 'error',
      'data': error_obj
    };
    switch (page) {
      case 'edit1':
        output.page = page;
        break;
    }
    this.errorPageEmit.emit(output);
  }


  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------

}