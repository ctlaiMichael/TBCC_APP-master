import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NocardAccountService } from '../shared/service/nocard-account.service';

@Component({
  selector: 'app-nocard-menu-page',
  templateUrl: './nocard-menu-page.component.html',
})
export class NocardMenuComponent implements OnInit {

  // == 首頁物件 == //
  headerObj = {
    title: 'FUNC.CARDLESS',
    leftBtnIcon: 'menu',
  };

  constructor(
    private _headerCtrl: HeaderCtrlService,
    private navgator: NavgatorService,
    private nocardaccountService: NocardAccountService,
  ) {
    this._headerCtrl.setOption(this.headerObj);
  }

  ngOnInit() {

    // 發送電文取得無卡提款申請狀態
    // 1. 回傳結果：已申請/未申請
    // 1.1 已申請：辨別裝置識別碼---->  相同====>  顯示無卡提款選單
    //                                不相同==>  顯示01-03-02提示訊息[點選確認]，進入無卡提款帳號設定
    // 1.2 未申請：發送電文，取得可綁定帳號清單
    //            若可綁定帳號為0，顯示01-03-03提示訊息==> 結束。
    //            若可綁定帳號不為0，顯示無卡提款選單。
  }

  goPage(pagekey) {
    if (pagekey == 'nocardreservationkey' || pagekey == 'nocardaddaccountkey') {

      // 無卡申請狀態判斷、裝置判斷
      this.nocardaccountService.checkAllStatus(pagekey);

    } else {
      this.navgator.push(pagekey);
    }
  }

}
