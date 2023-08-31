import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FormateService } from '@shared/formate/formate.service';
import { Logger } from '@core/system/logger/logger.service';

@Component({
  selector: 'app-nocard-result-page',
  templateUrl: './nocard-result-page.component.html'
})
export class NocardResultComponent implements OnInit {

  // == 首頁物件 == //
  headerObj = {
    title: 'FUNC_SUB.CARDLESS.ACCOUNT_SET',
    style: 'result',
    leftBtnIcon: 'menu',
  };

  resultData: any;                        // 結果頁資料
  isReserve = false;                      // 是否為預約無卡提款
  iconType: number;                       // icon圖示，0-失敗、1-成功、2-驚嘆號
  resultTitle: any;                       // 結果頁title
  resultContent: any;                     // 結果頁內容
  showAccountList: boolean;               // 是-秀出帳號清單，否-秀出結果訊息

  resultContStyle: any;                   // resultContent樣式
  setLeft = {'text-align': 'left'};       // 設置靠左
  setCenter = {'text-align': 'Center'};   // 設置置中
  constructor(
    private _headerCtrl: HeaderCtrlService,
    private navigator: NavgatorService,
    private logger: Logger,
    public _formateService: FormateService,
  ) {
    this._headerCtrl.setOption(this.headerObj);
  }

  ngOnInit() {

    // 取得確認頁資料
    this.resultData = this.navigator.getParams();
    this.logger.debug('resultData:', this.resultData);
    this.resultTitle = this.resultData['resultTitle'];
    this.showAccountList = this.resultData['showAccountList'];
    if (this.resultTitle == '停用成功') {
      this.resultContent = '停用ATM無卡提款服務立即生效，如欲重新申請本服務，請透過本行ATM或OTP認證碼方式重新申請。';
    } else {
      this.resultContent = this.resultData['resultContent'];
    }
    this.iconType = this.resultData['iconType'];
    // this.showAccountList = (typeof this.resultData['resultContent'] == 'string') ? false : true;
    if ( this.resultData['transType'] == 'reserve') {
      // == 預約無卡提款 == //
      // 變更header名稱：預約無卡提款
      this.headerObj['title'] = 'FUNC_SUB.CARDLESS.RESERVE_TRANS';
      this._headerCtrl.setOption(this.headerObj);
      // 判斷預約無卡提款是否成功
      if (this.resultData.hasOwnProperty('transRslt') && this.resultData['transRslt'] == 'failed') {
        this.resultContStyle = this.setCenter;
        this.iconType = 0;
      } else {
        this.resultContStyle = this.setLeft;
        this.iconType = 1;        // icon圖示，0-失敗、1-成功、2-驚嘆號
        this.resultData.deadlineTime = this._formateService.transDate(this.resultData.deadlineTime, 'yyyy/MM/dd HH:mm:ss');
        this.isReserve = true;
      }
    } else if ( this.resultData['transType'] == 'accountSet') {
      // == 無卡提款帳號設定---新增 == //
      this.isReserve = false;
      if (this.iconType == 2) { // 如果是驚嘆號圖示，resultTitle要變黃色的
        document.getElementById('resultTitleDiv').classList.add('exclamation_active');
      }
    }
  }

  // 返回無卡提款按鈕事件
  goBack() {
    if ( this.resultData['transType'] == 'reserve') {
      // 判斷預約無卡提款是否成功
      if (this.resultData.hasOwnProperty('transRslt') && this.resultData['transRslt'] == 'failed') {
        this.navigator.push('nocard');
      } else {
        let output = {
          hasTransation: true
        };
        this.navigator.push('nocard', output);
      }
    } else {
      this.navigator.push('nocard');
    }
  }

  // 服務據點按鈕事件
  goLocation() {
    this.navigator.push('locationkey');
  }
}
