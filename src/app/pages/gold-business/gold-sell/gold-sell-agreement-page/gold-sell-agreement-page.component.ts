import { Component, OnInit, ViewChild } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { GoldSellEditPageComponent } from '../gold-sell-edit-page/gold-sell-edit-page.component';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';

@Component({
  selector: 'app-gold-sell-agreement-page',
  templateUrl: './gold-sell-agreement-page.component.html'
})
export class GoldSellAgreementPageComponent implements OnInit {
  @ViewChild(GoldSellEditPageComponent) activationIdentityComponent: GoldSellEditPageComponent;
  agree: boolean = false; // 已同意條款
  pageType = 'statement';
  goldsellInfo = {}; // 傳到確認頁
  successMsg: string = '';
  successDetail: string = '';
  successContent: any = [
    { title: '黃金存摺帳號', detail: '' },
    { title: '黃金回售存入帳號', detail: '' },
    { title: '回售公克數', detail: '' },
    { title: '牌告時間', detail: '' },
    { title: '牌告單價', detail: '' },
    { title: '入帳金額', detail: '' },
  ];
  isSuccess: boolean; // 交易是否成功
  constructor(
    private navigator: NavgatorService,
    private alertService: AlertService,
    private headerCtrl: HeaderCtrlService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit() {
    this.headerCtrl.setLeftBtnClick(
      () => {
        this.cancel();
      }
    )
    let getParams = this.navigator.getParams();
    if (!!getParams && getParams['agree']) {
      this.agree = true;
    }
  }


  changePage(pageName) {
    this.pageType = pageName;
    switch (pageName) {
      case 'statement':
        this.ngOnInit();
        return;
      case 'edit':
        this.headerCtrl.setLeftBtnClick(() => { this.changePage('statement') });
        return;
      case 'result':
        this.headerCtrl.updateOption({
          'leftBtnIcon': 'menu',
          'title': '交易結果'
        });
        return;
    }
  }

  /**
   * 取消
   */
  cancel() {
    this.confirmService.show("是否放棄此次編輯", {
      title: 'GOLD.ACTIVATION_STATUS.TITLE'
    }).then(
      () => {
        this.navigator.push('gold-business'); // 返回黃金存摺menu
      },
      () => { }
    );
  }

  /**
   * 下一步
   */
  nextStep() {
    if (!this.agree) {
      this.alertService.show('CHECK.AGREE_PROVISION_ONE'); // 請同意條款
      return;
    } else {
      this.changePage('edit');
    }
  }

  getGoldsellConfrim(e) {
    if (e) {
      this.goldsellInfo = e;
    }
  }

  getGoldsellResult(e) {
    if (e) {
      this.successMsg = e.trnsRsltMsg; // 交易結果之訊息

      // 交易成功
      if (e.trnsRsltCode === '0') {
        this.isSuccess = true;
        this.successContent[0]['detail'] = AccountMaskUtil.accountNoFormate(e["goldAccount"]);
        this.successContent[1]['detail'] = AccountMaskUtil.accountNoFormate(e["trnsfrAccount"]);
        this.successContent[2]['detail'] = e["goldQuantity"] + '公克';
        this.successContent[3]['detail'] = DateUtil.transDate(e["goldRateTime"]);
        this.successContent[4]['detail'] = AmountUtil.currencyAmount(e['gold1GAmt'], 'TWD');
        this.successContent[5]['detail'] = AmountUtil.currencyAmount(e['transAmt'], 'TWD');
      } else {
        // 交易失敗
        this.isSuccess = false;
        this.successDetail = e.hostCodeMsg;
      }
    }
  }
}
