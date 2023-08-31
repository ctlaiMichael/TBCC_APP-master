import { Component, OnInit } from '@angular/core';
import { EPayService } from '@pages/epay/shared/epay.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { PadUtil } from '@shared/util/formate/string/pad-util';
import { CommonUtil } from '@shared/util/common-util'
import { CommonModule } from '@angular/common';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { logger } from '@shared/util/log-util';
import { FormateService } from '@shared/formate/formate.service';
@Component({
  selector: 'app-show-receipt',
  templateUrl: './show-receipt.component.html',
  styleUrls: ['./show-receipt.component.css']
})


export class ShowReceiptComponent implements OnInit {

  defaultTrnsOutAcct: any;
  myAcct = '';
  result = {
    respCode: ''
  };
  qrsize = window.screen.width - 40;
  qrposition = 20;
  mobileBarcode: any;
  cardNoFlag: any;
  genQRCode: any;
  onBigCode = false;
  constructor(
    private epay: EPayService,
    private navgator: NavgatorService,
    private handleError: HandleErrorService,
    private headerCtrl: HeaderCtrlService,
    private formateService: FormateService
  ) {
    this.headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': '出示收款碼(帳號收款)'
    });
    this.headerCtrl.setLeftBtnClick(() => {
      this.clickCancel();
    });
  }

  ngOnInit() {
    if (this.qrsize >= 400) {
      this.qrsize = 400;
      this.qrposition = ((window.screen.width - 400) / 2);
    }
    this._init();
  }

  async _init() {
    this.genQRCode = '';
    this.defaultTrnsOutAcct = '';
    try {
      const fq000101Data: any = await this.epay.sendFQ000101('T');
      let trnsOutAcct = this.formateService.checkField(fq000101Data, 'defaultTrnsOutAcct');
      this.defaultTrnsOutAcct = PadUtil.padLeft(trnsOutAcct, 16);
      // 帳號模糊化 ex:"0560-***-***456"
      let trnsAcctReFmt = trnsOutAcct;
      if (trnsOutAcct.length > 13) {
        trnsAcctReFmt = trnsOutAcct.substr(-13, 13);
      }
      this.myAcct = this.formateService.transAccount(trnsAcctReFmt, 'mask');
      this.result = {
        respCode: fq000101Data.trnsRsltCode
      };
      // logger.debug(this.defaultTrnsOutAcct + ' ' + this.defaultTrnsOutAcct.length);
      if ((fq000101Data.mobileBarcode == '') || (typeof fq000101Data.mobileBarcode == 'undefined')) {
        this.mobileBarcode = ''; // 發票載具條碼 目前沒有值
        this.cardNoFlag = 'N';
      } else {
        this.mobileBarcode = fq000101Data.mobileBarcode;
        this.cardNoFlag = 'Y';
      }

      // 處理一維二維條碼
      this.genQRCode = 'TWQRP://個人轉帳/158/02/V1?D5=006&D6=' + this.defaultTrnsOutAcct;
      this.genQRCode = this.encodeURI(this.genQRCode);
      logger.error('this.genQRCode', this.genQRCode);
      CommonUtil.wait(1800000).then(() => {
        this.clickCancel();
      });
    } catch (error) {
      this.mobileBarcode = '';
      this.cardNoFlag = 'N';
      CommonUtil.wait(1800000).then(() => {
        this.clickCancel();
      });
    }
  }

  // 顯示大圖 - QRCode
  showBigQrcode() {
    this.onBigCode = true;
  }
  closeBigCode() {
    this.onBigCode = false;
  }

  encodeURI(str) {
    return encodeURIComponent(str);
  }

  /**
		* 點選取消
	  */
  clickCancel() {
    this.navgator.push('epay');
  }
}
