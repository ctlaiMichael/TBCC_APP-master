/**
 * 基金損益(detail第二層)
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';


@Component({
  selector: 'app-fund-detail-loss',
  templateUrl: './fund-detail-loss-page.component.html',
  styleUrls: [],
  providers: []
})
export class FundDetailLossPageComponent implements OnInit {

  @Input() lossData: any;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  // showNTD = false;

  constructor(
    private _logger: Logger
    ,private router: Router
    ,private confirm: ConfirmService
    ,private _handleError: HandleErrorService
    ,private navgator: NavgatorService
    ,private _headerCtrl: HeaderCtrlService

  ) {
  }

  ngOnInit() {
    this._initEvent();

    // if(this.lossData.iNCurrency == 'NTD'
    //  || this.lossData.iNCurrency == 'JPY') {
    //   this.showNTD = true;
    // } else {
    //   this.showNTD = false;
    // }

    //目前得知不需發電文，帶前一頁資料
    // this._detailService.getData(this.reqObj,this.page).then(
    //   (result)=>{
    //     this.info_data = result.info_data;
    //     this.data = result.data;
    //     this._logger.log("info_data:",this.info_data);
    //     this.onBackPageData(result);
    //   },
    //   (errorObj)=>{
    //     this.onErrorBackEvent(errorObj);
    //   });
  }

 /**
   * 重新設定page data
   * @param item
   */
  onBackPageData(item,page?) {
    const output = {
      'page': 'list-item',
      'type': 'page_info',
      'data': item,
      'info_data': {}
    };
    if(page == 'detail-back') {
      output.page = page;
    }
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

          /**
     * 啟動事件
     */
    private _initEvent() {
      //設定header
        this._headerCtrl.updateOption({
          'leftBtnIcon': 'back',
          'title': '基金投資損益報告'
      });
      this._headerCtrl.setLeftBtnClick(() => {
        let page = 'detail-back'
        this.onBackPageData({},page);
      });
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

}