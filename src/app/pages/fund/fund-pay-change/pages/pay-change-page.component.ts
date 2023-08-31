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
import { FundDepositAccountService } from '@pages/fund/shared/service/fundDepositAccount.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';
import { FundDeleteService } from '@pages/fund/shared/service/fund-delete.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
@Component({
  selector: 'app-pay-change-page',
  templateUrl: './pay-change-page.component.html',
  providers: [FundDepositAccountService]
})
export class PayChangePageComponent implements OnInit {
  /**
   * 參數處理
   */
  @Input() unitType: string;
  @Input() doReset: number;
  @Input() page: string | number = 1;
  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorPageEmit: EventEmitter<any> = new EventEmitter<any>();
  data: any;
  debitStatusName = [
    {
      name: '正常扣款',
      value: null
    },
    {
      name: '正常扣款',
      value: ''
    },
    {
      name: '暫停扣款',
      value: 'S'
    },
    {
      name: '終止扣款',
      value: 'T'
    }
  ];
  nowType: any;
  deleteList = [];
  checkFlag = false
  private oldnum: number;

  // 送request的物件(fi000701)

  constructor(
    private _logger: Logger
    , private _mainService: FundDepositAccountService
    , private _handleError: HandleErrorService
    , public authService: AuthService
    , private _fundDeleteService: FundDeleteService
    , private alert: AlertService
    , private confirm: ConfirmService
    , private navgator: NavgatorService
  ) { }

  ngOnInit() {
    this._logger.log("into ngOnInit");
    if (typeof this.unitType === 'undefined') {
      this.unitType = 'A';
    }
    this.getData();
  }

  ngOnChanges() {
    this._logger.log("into ngOnChanges");
    if(typeof this.oldnum != 'undefined' && this.doReset>this.oldnum) {
      this._logger.log("into do ngOnChanges");
      this.getData();
    }
  }


  getData() {
    this._logger.log("into getData");
    this.oldnum = this.doReset;
    let page = 1;
    if (typeof this.page === 'undefined') {
      page = 1;
    } else {
      page = parseInt(this.page.toString(), 5);
    }
    const reqData = {
      unitType: this.unitType,
      filterFlag: 'Y',
      investType: '2' // 定期(不)定額
    };
    //701
    this._mainService.getData(reqData, page).then(
      (result) => {
        this._logger.log("into do getData success");
        this.data = result.data;
        this.data.forEach(item => {
          item['selected'] = false;
        });
        this.onBackPageData(result);
      },
      (errorObj) => {
        this.onErrorBackEvent(errorObj);
      }
    );

  }


  addToDeleteList(item, deleteFlag, itemData) {
    // let checkF = true;
    // for (let i = 0; i < this.deleteList.length; i++) {
    //   if (item.fundCode == this.deleteList[i]) {
    //     checkF = false;
    //   }
    // }
    // if (checkF == true) {
    //   this.deleteList.push(item);
    // }
    // const output = {
    //   'page': 'list-item',
    //   'type': 'delete_item',
    //   'data': this.deleteList
    // };
    // 20190510 待改，已列出問題單，目前無法多選刪除項目，先以當前勾選的項目做刪除，待合庫確認需求時，再將選取的項目放到陣列
    // if (NEW_FUND_TRNS_FLAG  == 'Y') {

    // }
    // const output = {
    //   'page': 'list-item',
    //   'type': 'delete_item',
    //   'data': item
    // };
    // //output回父層，output['data']裡儲存交易編號，FI000711刪除request用
    // this.backPageEmit.emit(output);
    if(itemData['selected'] == true) {
      itemData['selected'] = false;
    } else {
      itemData['selected'] = true;
    }

    //2019/08/27 目前規格刪一筆，點擊該筆資料直接刪除
    this.confirm.show('您是否要刪除交易', {
      title: '提醒您',
      btnYesTitle: '繼續',
      btnNoTitle: '取消'
  }).then(
      () => {
          //繼續(popup)內層
          if(itemData['selected'] == true) {
            itemData['selected'] = false;
          } else {
            itemData['selected'] = true;
          }
          this.sendDelete(item);
      },
      () => {
          //離開(popup)內層
          if(itemData['selected'] == true) {
            itemData['selected'] = false;
          } else {
            itemData['selected'] = false;
          }
      }
  );
    // const output = {
    //   'page': 'list-item',
    //   'type': 'delete_item',
    //   'data': item
    // };
    // //output回父層，output['data']裡儲存交易編號，FI000711刪除request用
    // this.backPageEmit.emit(output);
  }

  private sendDelete(deleteTransCode) {
    const userData = this.authService.getUserInfo();
    let deleteObj = {
      custId: userData.custId,
      transCode: deleteTransCode
    };
    this._fundDeleteService.getData(deleteObj).then(
      (success) => {
        this._logger.log("success:", success);
        this.alert.show('基金刪除成功', {
          title: '提醒您',
          btnTitle: '確認',
        }).then(
          () => {
            const output = {
              'page': 'list-item',
              'type': 'delete_success',
              'data': {},
              'count': 0
            };
            //output回父層，output['data']裡儲存交易編號，FI000711刪除request用
            this.backPageEmit.emit(output);
            // this.navgator.push('fund-pay-change');
          }
        );
      },
      (erorrObj) => {
        this._logger.log("erorrObj:", erorrObj);
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
