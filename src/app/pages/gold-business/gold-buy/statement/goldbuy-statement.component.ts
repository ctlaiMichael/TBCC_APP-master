import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { GoldbuyEditPageComponent } from '@pages/gold-business/gold-buy/edit/goldbuy-edit-page.component';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { GoldSellBuyService } from '@pages/gold-business/shared/service/gold-sell-buy.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { ReplaceUtil } from '@shared/util/formate/string/replace-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { HandleErrorOptions } from '@core/handle-error/handlerror-options';
import { logger } from '@shared/util/log-util';
@Component({
  selector: 'app-goldbuy-statement',
  templateUrl: 'goldbuy-statement.component.html'
})

export class GoldbuyStatementComponent implements OnInit {
  @ViewChild(GoldbuyEditPageComponent) goldbuyEdit: GoldbuyEditPageComponent;

  agree = false; // 同意事項狀態
  pageType = 'statement';
  returnObj = {
    'pageName': 'edit',
    'data': {}
  };
  successMsg = '';
  successContent = [];
  goldbuyInfo: any;
  subObj = [];

  constructor(
    private confirm: ConfirmService,
    private alert: AlertService,
    private navgator: NavgatorService,
    private _headerCtrl: HeaderCtrlService,
    private goldSellBuy: GoldSellBuyService,
    private _handleError: HandleErrorService,
    private _formateService: FormateService,
  ) { }

  ngOnInit() {
    this._headerCtrl.setLeftBtnClick(() => {
      this.doCancel();
    });
  }

  changePage(obj) {
    // logger.debug('changePage:' + JSON.stringify(obj));
    if (obj.pageName === 'statement') {
      this.ngOnInit();
    }
    if (obj.pageName === 'edit') {
      this._headerCtrl.updateOption({
        'leftBtnIcon': 'back',
        'title': '黃金買進'
      });
    }
    if (obj.pageName === 'confirm') {
      this.goldbuyInfo = obj.data;
    }
    if (obj.pageName === 'result') {
      this.onSend(obj);
      return;
    }
    this.pageType = obj.pageName;
  }

  onSend(obj) {
    // logger.debug('onSend:' + JSON.stringify(obj));
    this.goldSellBuy.goldTransSend(obj.data, obj.security)
      .then(
        (res) => {
          // logger.debug('onSend res:' + JSON.stringify(res));

          if (res.trnsRsltCode === '0' && (res.hostCode === '0000' || res.hostCode === '4001')) {
            // result頁顯示內容
            let tmpContent = [];
            tmpContent['黃金存摺帳號'] = this.accountNoFormate(res.goldAccount);
            tmpContent['買進公克數'] = res.goldQuantity;
            tmpContent['新台幣約定轉出帳號'] = this.accountNoFormate(res.trnsfrAccount);
            tmpContent['牌告時間'] = DateUtil.transDate(res.goldRateTime);
            tmpContent['牌告單價'] = this._formateService.currencyAmount(res.gold1GAmt, 'TWD');
            tmpContent['扣款金額'] = this._formateService.currencyAmount(res.transAmt, 'TWD');
            tmpContent['大批買進折讓金額'] = this._formateService.currencyAmount(res.discountAmt, 'TWD');

            // logger.debug('tmpContent', tmpContent);
            for (let key in tmpContent) {
              let temp_data = {
                title: '',
                detail: ''
              };
              temp_data.title = key;
              temp_data.detail = tmpContent[key];
              this.successContent.push(temp_data);
            }

            this.successMsg = '交易成功';
            this.pageType = obj.pageName;
          } else {
            let err = new HandleErrorOptions(res.hostCodeMsg, 'ERROR.TITLE');
            err.resultCode = res.hostCode;
            err.resultData = res;
            err['type'] = 'message';
            this._handleError.handleError(err);
          }
        },
        (err) => {
          // logger.debug('onSend err:' + JSON.stringify(err));
          err['type'] = 'message';
          this._handleError.handleError(err);
        });
  }

  // 已閱讀?
  haveReadStatus() {
    if (this.agree === false) {
      this.agree = true;
    } else {
      this.agree = false;
    }
  }

  // 返回
  doCancel() {
    // logger.debug('doCancel:' + this.pageType);
    logger.debug('this.pageType:' + this.pageType);
    if (this.pageType === 'result') {
      this.navgator.popTo('gold-business');
    } else {
      const confirmOpt = new ConfirmOptions();
      confirmOpt.btnYesTitle = 'BTN.CHECK';
      confirmOpt.btnNoTitle = 'BTN.CANCEL';
      confirmOpt.title = 'POPUP.CANCEL_EDIT.TITLE';
      this.confirm.show('POPUP.CANCEL_EDIT.CONTENT', confirmOpt)
        .then(() => {
          this.navgator.popTo('gold-business');
        })
        .catch(() => { });
    }
  }

  // 下一頁
  goNext() {
    if (!this.agree) {
      // logger.debug('dialog');
      return this.alert.show('請同意使用者條款', { title: '' })
        .then(() => { });
    } else {
      this.changePage(this.returnObj);
    }
  }

  // 帳號format
  accountNoFormate(str: string | number) {
    if (typeof str === 'number') {
      str = str.toString();
    }
    if (typeof str !== 'string') {
      return str;
    }
    str = ReplaceUtil.baseSymbol(str, '');
    // 去除前面的0
    str = ReplaceUtil.replaceLeftStr(str, '0', '');
    if (str === '') {
      return '';
    }

    if (str.length < 13) {
      str = PadUtil.padLeft(str, 13); // 左補0
    }
    return str.substr(0, 4) + '-' + str.substr(4, 3) + '-' + str.substr(7);
  }
}
