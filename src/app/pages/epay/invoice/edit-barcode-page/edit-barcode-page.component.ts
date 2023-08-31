import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { InvoiceService } from '@pages/epay/shared/service/invoice/invoice.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
  selector: 'app-edit-barcode-page',
  templateUrl: './edit-barcode-page.component.html'
})
export class EditBarcodePageComponent implements OnInit {
  mobileBarcode: string = '';

  constructor(
    private navigator: NavgatorService,
    private alertService: AlertService,
    private epayService: InvoiceService,
    private _headerCtrl: HeaderCtrlService
  ) {
      //手機條碼設定頁面，左上固定返回發票載具條碼首頁
      this._headerCtrl.updateOption({
          'leftBtnIcon': 'back'
      });
      this._headerCtrl.setLeftBtnClick(() => {
          this.navigator.push('invoice', {}, {changeDefaultCode: '1'});
      });
  }

  ngOnInit() {
    this.mobileBarcode = this.navigator.getParams();
    if(typeof this.mobileBarcode == 'object'){
      this.mobileBarcode = '';
    }
  }

  // 查詢手機條碼
  clickQuery() {
    this.navigator.push('invoicequerymobilebckey');
  }

  // 註冊手機條碼
  clickReg() {
    this.navigator.push('invoicebcregedit');
  }

  // 確定
  clickSubmit() {
    if (this.mobileBarcode.length != 8) {
      this.alertService.show('手機條碼長度需等於 8 碼');
      return;
    }
    if (this.mobileBarcode.substring(0, 1) != "/") {
      this.alertService.show('手機條碼第1碼須為 / ');
      return;
    }
    var checkStr = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+-.";
    for (var i = 1; i < this.mobileBarcode.length; i++) {
      if (checkStr.indexOf(this.mobileBarcode.substring(i, i + 1)) == -1) {
        this.alertService.show('手機條碼格式錯誤');
        return;
      }
    }
    let reqObj = {
      'mobileBarcode': this.mobileBarcode,
      'loveCode': '',
      'socialWelfareName': '',
      'defaultBarcode': '1' // 發票預設值 =1為雲端發票條碼，發票預設值 = 2為捐贈愛心碼
    }
    this.epayService.sendFQ000301(reqObj).then(
      (resObj) => {
        this.alertService.show("手機條碼設定成功").then(
          () => {
            this.navigator.push('invoice', {}, {changeDefaultCode: '1'});
            return;
          },
          () => { }
        );

      },
      () => {
        this.alertService.show("手機條碼設定失敗");
      }
    )
  }
}
