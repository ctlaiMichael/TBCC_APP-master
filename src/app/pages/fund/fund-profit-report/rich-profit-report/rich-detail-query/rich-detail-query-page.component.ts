/**
 * 基金庫存明細
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FundRichDetailService } from '@pages/fund/shared/service/fundRichDetail.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { logger } from '@shared/util/log-util';


@Component({
  selector: 'app-rich-detail-query',
  templateUrl: './rich-detail-query-page.component.html',
  styleUrls: [],
  providers: [FundRichDetailService]
})
export class RichDetailQueryPageComponent implements OnInit {
  @Input() inputData: any = {};
  @Input() backData: any = []; //前一頁回傳(為了判斷台幣、日幣)
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  showTag = false;
  info_data: any = {};
  data: any = [];

  constructor(
    private _logger: Logger
    , private router: Router
    , private confirm: ConfirmService
    , private _handleError: HandleErrorService
    , private navgator: NavgatorService
    , private _mainService: FundRichDetailService
    , private _headerCtrl: HeaderCtrlService

  ) {
  }

  ngOnInit() {
    //設定header
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': '智富損益明細'
    });
    //左側返回
    this._headerCtrl.setLeftBtnClick(() => {
      this.onBackPageData({});
    });
    let reqQuery = {
      custId: '',
      fundCode: '',
      enrollDate: '',
      inCurrency: '',
      invenAmountT: '',
      trustAcnt: '',
      transCode: ''
    }

    reqQuery.fundCode = this.inputData.fundCode;
    reqQuery.enrollDate = this.inputData.enrollDate;
    reqQuery.inCurrency = this.inputData.inCurrency;
    reqQuery.invenAmountT = this.inputData.invenAmountT;
    reqQuery.trustAcnt = this.inputData.trustAcnt;
    reqQuery.transCode = this.inputData.transCode;

    this._mainService.getQueryData(reqQuery).then(
      (resultQuery) => {
        this.info_data = resultQuery.info_data;
        this.data = resultQuery.data;
      },
      (errorObjQuery) => {
        this.onErrorBackEvent(errorObjQuery);
      }
    );
  }

  /**
 * 重新設定page data
 * @param item
 */
  onBackPageData(item) {
    const output = {
      'page': 'rich-detail-query',
      'type': 'detail-query',
      'data': item
    };

    this.backPageEmit.emit(output);
  }


  /**
 * 失敗回傳
 * @param error_obj 失敗物件
 */
  onErrorBackEvent(error_obj) {
    const output = {
      'page': 'list-item',
      'type': 'error',
      'data': error_obj
    };

    this.errorPageEmit.emit(output);
  }

}




/**
 * go
 *
 */

  // --------------------------------------------------------------------------------------------
  //  ____       _            _         _____                 _
  //  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
  //  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
  //  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
  //  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
  // --------------------------------------------------------------------------------------------
