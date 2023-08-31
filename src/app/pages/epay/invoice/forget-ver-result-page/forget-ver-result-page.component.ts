import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';

@Component({
  selector: 'app-forget-ver-result-page',
  templateUrl: './forget-ver-result-page.component.html'
})
export class ForgetVerResultPageComponent implements OnInit {
  result; // 查詢結果
  email; // 電子發票整合服務平台發送驗證碼至此信箱
  constructor(
    private navigator: NavgatorService
  ) { }

  ngOnInit() {
    this.result = this.navigator.getParams();
    this.email = this.result['email'];
  }

  // 確定
  clickSubmit() {
    if (this.result.respCode == 0) {
      this.navigator.push('invoicequerymobilebckey');  //back to 查詢手機條碼顯示頁
    } else {
      this.navigator.push('invoiceforgetveredit');  //back to 查詢驗證碼編輯頁
    }
  }

}
