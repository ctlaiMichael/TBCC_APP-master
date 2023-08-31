import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { GoldSellBuyService } from '@pages/gold-business/shared/service/gold-sell-buy.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { GoldSellConfirmPageComponent } from '../gold-sell-confirm-page/gold-sell-confirm-page.component';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';

@Component({
  selector: 'app-gold-sell-edit-page',
  templateUrl: './gold-sell-edit-page.component.html'
})
export class GoldSellEditPageComponent implements OnInit {
  @Output() goldsellPage: EventEmitter<string> = new EventEmitter<string>();
  @Output() goldsellConfirm: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(GoldSellConfirmPageComponent) goldSellConfirmPageComponent: GoldSellConfirmPageComponent;

  goldAccounts: Array<Object> = []; // 黃金存摺帳號
  trnsfrAccts: Array<Object> = []; // 回售存入帳號
  selectedGold: string; // 選擇之黃金存摺帳號
  selectedTrnsfr: string; // 選擇之回售存入帳號
  sellType: string = '0'; // 0 - 全部回售，1 - 部分回售
  goldBalance: string = '0'; // 黃金存摺剩餘黃金克數
  trnsWeight: string = ''; // 回售克數

  // 加入安控機制
  transactionObj = {
    serviceId: 'FB000709',  // FB000709 黃金存摺買進回售
    categoryId: '7',
    transAccountType: '1',  // 回傳1 (約轉)。 2 為(非約轉)。
  };

  // request
  goldsellInfo = {
    'USER_SAFE': '',
    'SEND_INFO': ''
  };

  // 編輯頁全部資料準備送至確認頁

  constructor(
    private goldSellBuyService: GoldSellBuyService,
    private navigator: NavgatorService,
    private _handleError: HandleErrorService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    let reqObj = {
      // 2020-02-17 回售會取到別人的帳號，改用2(買進)
      queryType: '2' // 黃金回售帶3
    };
    this.goldSellBuyService.getGoldAcctList(reqObj).then(
      (resObj) => {
        this.goldAccounts = resObj['goldAccts']['detail'];
        if (this.goldAccounts.length > 0) {
          this.selectedGold = '0'; // 預設為第0筆
          this.updateBalance();
          this.trnsWeight = this.goldAccounts[this.selectedGold]['usefulBalance'];
        } else {
          this.goldAccounts = [];
        }
        if (!!resObj['trnsfrAccts'] && !!resObj['trnsfrAccts']['detail'] && resObj['trnsfrAccts']['detail'].length > 0) {
          this.trnsfrAccts = resObj['trnsfrAccts']['detail'];
          this.selectedTrnsfr = '0'; // 預設為第0筆
        } else {
          let handleErrorOptions = new HandleErrorOptions('您尚未設定台幣帳戶');
          handleErrorOptions.type = 'message';
          this.navigator.push(`result`, handleErrorOptions);
          return;
        }
      },
      (errObj) => {
        this._handleError.handleError(errObj);
        this.navigator.push('gold-business');
      }
    )
  }

  /**
   * 更新黃金存摺剩餘黃金克數
   */
  updateBalance() {
    this.goldBalance = this.goldAccounts[this.selectedGold]['usefulBalance'];
    this.updateSellType(); // 回售克數一起更新
  }

  /**
   * 切換回售部分/全部
   */
  updateSellType() {
    if (this.sellType === '0') { // 全部回售
      document.getElementById('sellbackGram').classList.add('normal_disable');
      this.trnsWeight = this.goldAccounts[this.selectedGold]['usefulBalance'];
    } else { // 部分回售
      document.getElementById('sellbackGram').classList.remove('normal_disable');
      this.trnsWeight = '';
    }
  }

  /**
	 * 	安控選擇
	 * @param e
	 */
  // 安控檢核
  securityOptionBak(e) {
    if (e.status) {
      // 取得需要資料傳遞至下一頁子層變數
      this.goldsellInfo.SEND_INFO = e.sendInfo;
      this.goldsellInfo.USER_SAFE = e.sendInfo.selected;
    } else {
      // do errorHandle 錯誤處理 推業或POPUP
      // e.ERROR['type'] = 'message';
      // this._handleError.handleError(e);
      let error_obj: any = (!!e.ERROR) ? e.ERROR : e;
      error_obj['type'] = 'message';
      this._handleError.handleError(error_obj);
    }
  }


  /**
   * 上一步
   */
  previous() {
    this.goldsellPage.emit('statement');
  }

  /**
   * 確定
   */
  nextStep() {
    if (this.sellType === '1') { // 部分回售的話檢查售出克數
      // check trnsWeight
      if (this.trnsWeight.length <= 0) {
        this.alertService.show('GOLD.SELL.ENTER_QUANTITY'); // 請輸入回售克數
        return;
      } else if (Number(this.trnsWeight) <= 0) {
        this.alertService.show('GOLD.SELL.MUST_POSITIVE'); // 回售克數必須大於零
        return;
      } else if (Number(this.trnsWeight) > Number(this.goldBalance)) {
        this.alertService.show('GOLD.SELL.MUST_LESS_THAN_ACCOUNT'); // 回售克數不得大於帳號之剩餘黃金克數
        return;
      } else if (!Number.isInteger(Number(this.trnsWeight))) {
        this.alertService.show('GOLD.SELL.MUST_N'); // 回售克數必須為1之整倍數
        return;
      }
    } else if (Number(this.trnsWeight) <= 0) { // 全部回售檢查是否售出克數 > 0
      this.alertService.show('GOLD.SELL.MUST_POSITIVE'); // 回售克數必須大於零
      return;
    }

    if (!this.goldsellInfo.SEND_INFO['status']) {
      // error handle
      let errorObj = {
        type: 'dialog',
        content: this.goldsellInfo.SEND_INFO['message'],
        message: this.goldsellInfo.SEND_INFO['message']
      };
      this._handleError.handleError(errorObj);
      return;
    }

    this.trnsWeight = Number(this.trnsWeight).toString(); // 去除最前面的0
    let reqObj = {
      recType: '2', // 2 - 黃金回售
      goldAccount: this.goldAccounts[this.selectedGold]['acctNo'],
      trnsfrAccount: this.trnsfrAccts[this.selectedTrnsfr]['acctNo'],
      goldQuantity: this.trnsWeight,
    };
    this.goldSellBuyService.getTransConfirm(reqObj).then(
      (resObj) => {
        this.goldsellInfo = { ...resObj, ...this.goldsellInfo };
        this.goldsellConfirm.emit(this.goldsellInfo);
        this.goldsellPage.emit('confirm');
      },
      (errObj) => {
        errObj['type'] = 'message';
        this._handleError.handleError(errObj);
      }
    )
  }
}
