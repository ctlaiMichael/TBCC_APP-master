import { Component, OnInit, ViewChild } from '@angular/core';
import {CheckActivationService} from '@pages/gold-business/shared/service/check-activation.service';
import {ActivationStatementComponent} from 'app/pages/gold-business/activation/activation-statement.component';
@Component({
  selector: 'app-transaction-detail-list',
  templateUrl: 'transaction-detail-list.component.html',
  providers: [ ActivationStatementComponent ]
})

export class TransactionDetailListComponent implements OnInit {
  @ViewChild(ActivationStatementComponent) activationStatementComponent: ActivationStatementComponent;
  goldTxFlag: string;
  activation= false; // 預設啟動狀態
  activationPage= 'activation'; // 預設頁面 activation , statement , security  , result
  constructor(
    private _checkActivationService: CheckActivationService,
  ) {
  }
  ngOnInit() {
    this.checkActivationStatus();
  }

  changePage(pageName) {
    // 換頁邏輯
    if (pageName === 'identity') {
      // 顯示頁面
      // 電文驗證身分回來再往下走

    }

    this.activationPage = pageName;

  }

  verify(status) {
    if (status) {
      // 發異動電文
      this.changePage('result');

    }
  }

  doSwitch() {
    if (this.activation) {
      // 開啟=>轉關閉
      this.goldTxFlag = '0';
      this.changePage('identity');

    }else {
      // 關閉=>轉開啟
      this.goldTxFlag = '1';
      this.changePage('statement');

    }

  }
  sendActivationResult() {
    let req = {
      custId: 'B120281272',
      goldTxFlag: this.goldTxFlag,
   };

  //  this._checkActivationService.sendResult(req).then(
  //   (S)=> {

  //   },(F)=> {

  //   }
    // );
  }

  checkActivationStatus() {
    // 啟動狀態查詢
    let req = {
          custId: 'B120281272',
          trnsType: '8',
       };
    // this._checkActivationService.getStatus(req).then(
    //   (S) => {
    //     if (S.status === '1' ) {
    //       this.activation = true;
    //     }else {

    //       this.activation = false;
    //     }
    //   },(F)=> {
    //     // 錯誤處理
    //   }
    // );

  }
}
