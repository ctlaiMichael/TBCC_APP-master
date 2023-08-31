import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { ConfirmOptions } from '@shared/popup/confirm/confirm-options';
import { AlertService } from '@shared/popup/alert/alert.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { GoldtermsEditPageComponent } from '@pages/gold-business/goldterms/edit/goldterms-edit-page.component';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ReplaceUtil } from '@shared/util/formate/string/replace-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';
@Component({
  selector: 'app-goldterms-statement',
  templateUrl: 'goldterms-statement.component.html'
})

export class GoldtermsStatementComponent implements OnInit {
  @ViewChild(GoldtermsEditPageComponent) goldtermsEdit: GoldtermsEditPageComponent;

  agree = false; // 同意事項狀態
  pageType = 'statement';
  returnObj = {
    'pageName': 'selectacct',
    'data': {}
  };
  successMsg = '';
  successContent = [];
  goldtermsInfo: any;
  subObj = [];

  editObj:any; // 儲存編輯頁，confirm -> edit 使用

  constructor(
    private confirm: ConfirmService,
    private alert: AlertService,
    private navgator: NavgatorService,
    private _headerCtrl: HeaderCtrlService,
  ) {}

  ngOnInit() {
    // 設定title文字
    this._headerCtrl.updateOption({
      'title': 'GOLD.TERMS.TITLE_STATEMENT'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.doCancel();
    });
  }

  changePage(obj) {
    // logger.debug('changePage:' + JSON.stringify(obj));
    if (obj.pageName === 'statement'){
      this.ngOnInit();
    }
    if (obj.pageName === 'edit') {
      if (!!obj.fromConfirm) { // 從confirm頁回到編輯
        this.goldtermsInfo = this.editObj;
      } else { // 從選擇帳號來到編輯
        this.goldtermsInfo = obj.data;
        this.editObj = obj.data;
      }
    }
    if (obj.pageName === 'confirm') {
      this.goldtermsInfo = obj.data;
    }
    if (obj.pageName === 'result') {
      this.goldtermsInfo = obj;
    }
    this.pageType = obj.pageName;
  }

  // 已閱讀?
  haveReadStatus() {
    if (this.agree === false) {
      this.agree = true;
    }else {
      this.agree = false;
    }
  }

  // 返回
  doCancel() {
    // logger.debug('doCancel:' + this.pageType);
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
      .catch(() => {});
    }
  }

  // 下一頁
  goNext() {
    if (!this.agree) {
      // logger.debug('dialog');
      return this.alert.show('請同意使用者條款', { title: '' })
      .then( () => {});
    }else {
      this.changePage(this.returnObj);
    }
  }

  // 帳號format
  accountNoFormate(str: string|number) {
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
