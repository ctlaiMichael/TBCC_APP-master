import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
// import { LocalStorageService } from '@lib/storage/local-storage.service';
import { RateInformObj } from '@pages/msg-overview/rate-inform-page/rate-inform-page.component';
import { SessionStorageService } from '@lib/storage/session-storage.service';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { MsgOverviewService } from '../shared/service/msg-overview.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { RateInformService } from '../shared/service/rate-inform.service';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { CheckService } from '@shared/check/check.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { UiContentService } from '@core/layout/ui-content/ui-content.service';

@Component({
  selector: 'app-edit-rate-inform-page',
  templateUrl: './edit-rate-inform-page.component.html',
  styleUrls: ['./edit-rate-inform-page.component.css',
    '../component/msg-overview-page/msg-overview-page.component.css'],
  providers: [CheckService]
})
export class EditRateInformPageComponent implements OnInit {

  currencyOption = []; // 所有幣別選項
  cashCurrencyOption = []; // 有現鈔的幣別選項
  hasCashCurrency = ['USD', 'HKD', 'CAD', 'JPY', 'EUR', 'CNY']; // 只有這些幣別有現鈔匯率
  selectingPromptCurrency = false; // 選擇只有即期的幣別
  selectingCash = false; // 選擇 現鈔匯率
  // 買賣
  typeOption = [{
    title: '買外幣(台幣換外幣)',
    value: 'TWDExchange'
  }, {
    title: '賣外幣(外幣換台幣)',
    value: 'ForeignExchange'
  }];
  // 種類
  exchangeTypeOption = [{
    title: '即期匯率',
    value: 'PROMPT'
  }, {
    title: '現鈔匯率',
    value: 'CASH'
  }];
  onlyPromptExchangeTypeOption = [{
    title: '即期匯率',
    value: 'PROMPT'
  }];
  conditionOption = [{
    title: '高於',
    value: 'Big'
  }, {
    title: '低於',
    value: 'Small'
  }];
  frequencyOption = [{
    title: '只通知1次',
    value: 'OnlyOnce'
  }, {
    title: '每營業日通知1次',
    value: 'BusinessOnce'
  }];


  isEdit: boolean = false; // 編輯(true) or 新增(false)
  // 預設值
  rateInformObj: RateInformObj = {
    id: "", // 編號
    currency: '-1', // 幣別
    type: 'TWDExchange', // 買賣別 台幣換外幣
    exchangeType: 'PROMPT', // 種類
    condition: 'Big', // 條件
    exchange: '', // 匯率
    frequency: 'OnlyOnce' // 頻率
  };

  exchange: any; // 匯率，綁定html input number

  showResult = false; // 顯示編輯結果
  rateInformList: Array<RateInformObj> = []; // 編輯/新增完成後，畫面呈現的所有到價通知
  disableConfirm = false; // 防止連點兩次confirm()
  constructor(
    private navigator: NavgatorService,
    private msgOverviewService: MsgOverviewService,
    private headerCtrl: HeaderCtrlService,
    private rateInformService: RateInformService,
    private _logger: Logger,
    private _handleError: HandleErrorService,
    private alert: AlertService,
    private checkService: CheckService,
    private uiContentService: UiContentService
  ) { }

  ngOnInit() {
    // FB000201取得幣別
    this.rateInformService.getCurrency().then(res => {
      if (res['status'] && !!res['data']) {
        res['data'].forEach(element => {
          this.currencyOption.push(element['currency']);
          if (this.hasCashCurrency.indexOf(element['currency']) >= 0) {
            this.cashCurrencyOption.push(element['currency']);
          }
        });
      }
    }).catch(err => {
      this._handleError.handleError(err);
    });
    let getParams = this.navigator.getParams();
    this.isEdit = getParams.edit;
    if (this.isEdit) {
      this.rateInformObj = getParams.rateInformObj;
      this.onCurrencyChange();
      this.onExchangeTypeChange();
    }
    this._logger.log(`this.rateInformOb = ${JSON.stringify(this.rateInformObj)}`);
  }

  cancel() {
    this.navigator.back();
  }

  confirm() {
    if (this.disableConfirm) {
      return;
    }

    // input type="number" 轉成 string
    this.rateInformObj.exchange = String(this.rateInformObj.exchange);
    this._logger.log(`this.isEdit = ${this.isEdit}`);
    this._logger.log(`this.rateInformObj = ${JSON.stringify(this.rateInformObj)}`);
    if (this.rateInformObj.currency === '-1') {
      this.alert.show(`CHECK.CURRENCY`); // 請選擇幣別
      return;
    }
    let checkMoney;
    if (this.rateInformObj.currency === 'JPY') {
      checkMoney = this.checkService.checkMoney(this.rateInformObj.exchange,
        { currency: 'USD', maxDocNum: '4' }
      );
    } else {
      checkMoney = this.checkService.checkMoney(this.rateInformObj.exchange,
        { currency: this.rateInformObj.currency, maxDocNum: '4' }
      );
    }
    if (!checkMoney['status']) {
      this.alert.show(checkMoney['msg']);
      return;
    }
    this.disableConfirm = true;
    this.rateInformService.add_edit_RateInform(this.isEdit, this.rateInformObj).then(res => {
      if (!!this.rateInformService.modify_p1000002(res)) {
        this.alert.show(this.rateInformService.modify_p1000002(res)).then(() => {
          this.cancel();
        });
      } else {
        // 重新取得到價通知清單
        this.rateInformService.queryRateInform().then(queryRes => {
          if (!!queryRes.details && queryRes.details.detail) {
            this.rateInformList = ObjectCheckUtil.modifyTransArray(queryRes.details.detail);
          } else {
            this.rateInformList = [];
          }
          this.showResult = true;
          this.uiContentService.scrollTop();
          // window.scroll(0, 0);
        }).catch(err => {
          this._handleError.handleError(err);
        });
      }
    }).catch(err => {
      this._handleError.handleError(err);
    });
  }

  // 變更幣別
  onCurrencyChange() {
    // 選到只有PROMPT的幣別
    if (this.hasCashCurrency.indexOf(this.rateInformObj.currency) < 0) {
      this.selectingPromptCurrency = true;
    } else {
      this.selectingPromptCurrency = false;
    }
  }

  // 變更 即期匯率/現鈔匯率
  onExchangeTypeChange() {
    if (this.rateInformObj.exchangeType === 'CASH') {
      this.selectingCash = true;
    } else {
      this.selectingCash = false;
    }
  }

  // 前往牌告匯率
  goFinancialExchange() {
    this.navigator.push('exchange');
  }

  backToRateInform() {
    this.navigator.push('rate-inform');
  }

  public showTypeTitle(originText) {
    return this.rateInformService.showTypeTitle(originText);
  }

  public showTypeRow(originText) {
    return this.rateInformService.showTypeRow(originText);
  }

  public showExchangeType(originText) {
    return this.rateInformService.showExchangeType(originText);
  }

  public showCondition(originText) {
    return this.rateInformService.showCondition(originText);
  }
}
