import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { CheckSecurityService } from './check-security.srevice';
import { CheckService } from '@shared/check/check.service';
import { Logger } from '@core/system/logger/logger.service';
@Component({
  selector: 'app-check-security',
  templateUrl: './check-security.component.html',
  providers: [CheckService],

})
export class CheckSecurityComponent implements OnChanges {

  @Input() securityObj: any;
  @Output() stepObj: EventEmitter<any> = new EventEmitter<any>();
  ulClass = 'inner_table_frame';

  securityType = '';
  SSL_val: string = ''; // 輸入的ssl值
  SSL_error_msg: string = ''; // ssl錯誤訊息

  returnObj = {
    otpObj: {
      custId: '',
      fnctId: '',
      depositNumber: '',
      depositMoney: '',
      OutCurr: '',
      transTypeDesc: ''
    },
    signText: {
    },
    serviceId: '',
    securityType: '',
    transAccountType: '',
    showCaptcha: false,
    SSL_val: '',
    status: false
  }
  constructor(
    private _logger: Logger,
    private checkService: CheckService
  ) {

  }

  ngOnChanges() {
    this._logger.log(this.securityObj);
    this.returnObj.securityType = this.securityObj.sendInfo.selected;
    this.returnObj.transAccountType = this.securityObj.sendInfo.transAccountType;
    if (this.securityObj.sendInfo.hasOwnProperty('showCaptcha')) {
      this.returnObj.showCaptcha = this.securityObj.sendInfo.showCaptcha;
    }
    // 按鈕確認後邏輯
    if (this.securityObj.action === 'submit') {

      switch (this.returnObj.securityType) {
        case '1': // SSL檢核
          // 檢核邏輯
          this.returnObj.status = false;
          let checkEmpty = this.checkService.checkEmpty(this.SSL_val, true, false);
          if (!checkEmpty) {
            this.ulClass = 'inner_table_frame active_warnning';
            this.SSL_error_msg = '請輸入SSL轉帳密碼';
          } else {

            let check_max = this.checkService.checkLength(this.SSL_val, 16, 'max');
            // let check_min = this.checkService.checkLength(this.SSL_val, 8, 'min');
            // let check_english_number = this.checkService.checkEnglish(this.SSL_val, 'english_number');
            if (!check_max.status) {
            // if (!check_max.status || !check_min.status || !check_english_number.status) {
              this.ulClass = 'inner_table_frame active_warnning';
              this.SSL_error_msg = 'SSL轉帳密碼必須為8-16位英數字，請重新輸入';
            } else {
              this.returnObj.status = true;
              this.returnObj.SSL_val = this.SSL_val;
              this.ulClass = 'inner_table_frame';
            }
          }
          this.stepObj.emit(this.returnObj);
          break;
        case '2':  // 其他
          this.returnObj.status = true;
          this.returnObj.serviceId = this.securityObj.sendInfo.serviceId;
          this.stepObj.emit(this.returnObj);
          break;
        case '3':
          this.returnObj.otpObj.custId = this.securityObj.sendInfo.custId,
          this.returnObj.otpObj.fnctId = this.securityObj.sendInfo.serviceId,
          this.returnObj.status = true;
          this.stepObj.emit(this.returnObj);

          break;
      }

    }
  }



}
