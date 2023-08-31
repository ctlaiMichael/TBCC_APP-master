import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
/**
 * 註冊手機條碼結果
 */
@Component({
  selector: 'app-bc-reg-result-page',
  templateUrl: './bc-reg-result-page.component.html'
})
export class BcRegResultPageComponent implements OnInit {
  barcodeWidth = 1.8; // barcode寬度設定
  result: any; // 結果物件
  mobileBarcode: string = '';
  constructor(
    private navigator: NavgatorService
  ) { }

  ngOnInit() {
    this.result = this.navigator.getParams();
    this.mobileBarcode = this.result.GeneralCarrierCode;
  }

  // 確定
  clickSubmit() {
    if (this.result.respCode == 0) {
      this.navigator.push('invoiceeditbarcodekey', this.mobileBarcode); // back to 設定手機條碼並將註冊的手機條碼帶入
    } else {
      this.navigator.push('invoicebcregedit'); // back to 註冊手機條碼編輯頁
    }
  }
}
