/**
 * 定期(不)定額查詢變更-列表
 * (單頁)
 *     fundCode	投資代碼
    fundName	投資標的名稱
    investType	投資型態
    investDesc	投資型態說明
    iNCurrency	投資幣別
    invenAmount	庫存金額(信託本金)
    transCode	交易編號
    trustAcnt	信託帳號
    unit	單位數
    account	贖回預設存入帳號
    code	定期不定額套餐代碼
    debitStatus	扣款狀態
 */
import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FundConvertService } from '@pages/fund/shared/service/fund-convert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { logger } from '@shared/util/log-util';
@Component({
  selector: 'app-fund-convert-page',
  templateUrl: './fund-convert-page.component.html',
  providers: [FundConvertService]
})
export class FundConvertPageComponent implements OnInit {
  /**
   * 參數處理
   */
  @Input() page: string | number = 1;
  @Input() trnsType: string | number;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  data: any;
  nowType: any;

  // 送request的物件(fi000501)

  constructor(
    private _logger: Logger
    , private _handleError: HandleErrorService
    , private _mainService: FundConvertService
    , private navgator: NavgatorService
    , private confirm: ConfirmService
  ) { }

  ngOnInit() {

    if (typeof this.page === 'undefined') {
      this.page = 1;
    } else {
      this.page = parseInt(this.page.toString(), 5);
    }
    let trnsType: string | number = '3'
    if (this.trnsType) {
      trnsType = this.trnsType;
    }


    this._mainService.getAccount(trnsType, this.page).then(
      (result) => {
        this.data = result.data;
        this.onBackPageData(result);
      },
      (errorObj) => {
        logger.error('errorObj', errorObj)
        if (errorObj.resultCode == 'ERR1C115') {
          this.confirm.show('現在已超過本日交易時間，或非營業日，如您欲以預約方式轉換請點選「繼續」！', {
            title: '提醒您',
            btnYesTitle: '繼續',
            btnNoTitle: '離開'
          }).then(
            () => {
              this._mainService.getAccount('5', this.page).then(
                (res) => {
                  this.data = res.data;
                  res['reserveFlag']=true;
                  this.onBackPageData(res);
                },
                (fail) => {
                  logger.error('fail')
                  fail['type']='message';
                  this.onErrorBackEvent(errorObj);
                }
              )
            },
            () => {
              this.navgator.push('fund');
            }
          );

        } else {
          this.onErrorBackEvent(errorObj);
        }
      }
    );
  }

  /**
   * 顯示內容頁
   * @param item 內容頁資料
   */
  onContentEvent(item) {
    const output = {
      'page': 'list-item',
      'type': 'content',
      'data': item
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
