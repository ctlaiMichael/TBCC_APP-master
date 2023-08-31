import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { SelectSecurityService } from './select-security.srevice';
import { AuthService } from '@core/auth/auth.service';
import { Logger } from '@core/system/logger/logger.service';
@Component({
  selector: 'app-select-security',
  templateUrl: './select-security.component.html'
})
export class SelectSecurityComponent implements OnChanges {
  @Input() transactionObj: any;
  @Output() securityObj: EventEmitter<any> = new EventEmitter<any>();

  userInfo: any; // F1000101 使用者資訊
  showData: any;
  ulClass = 'inner_table_frame_ssl';
  ulStyle = {};
  showCaptcha = false;
  customOption: any;
  // "{'min-height':" + getHeight() + "px;}"

  constructor(
    private _logger: Logger,
    private selectSecurityService: SelectSecurityService,
    private authService: AuthService
  ) {
    this.showData = {
      ERROR: {
        title: 'ERROR.TITLE',
        content: '',
        message: '',
        type: 'message'
      },
      sendInfo: {
        selected: '',
        custId: '',
        serviceId: '',
        securityType: '',
        transAccountType: '',
        showCaptcha: this.showCaptcha
      },
      status: false,
      list: []
    };
  }

  ngOnChanges() {
    this._logger.log("security step?", this.transactionObj);
    this.doSecurityList();
  }

  doSecurityList() {
    this.userInfo = this.authService.getUserInfo();
    if (!this.userInfo || !this.transactionObj) {
      // 無法取得使用者資訊 || 無回傳資料
      this.showData.ERROR.content = '傳遞參數錯誤';
      this.showData.ERROR.message = '傳遞參數錯誤';

    } else {
      //
      this.customOption = this.selectSecurityService.doSelectOption(
        this.userInfo,
        this.transactionObj
      );
      this._logger.log(this.customOption);
      
      //------------20191009 因應台幣轉帳修改--------//
      // 有客製CSS
      if (
        this.transactionObj.hasOwnProperty('ulStyle') &&
        typeof this.transactionObj.ulStyle === 'object'
      ) {
        this.ulStyle = this.transactionObj.ulStyle;
      }
      //-------------------------------------------//

      if (this.customOption[0].length <= 0) {
        // 無可使用交易安控項目
        // 組錯誤訊息
        let funNameStr = '';
        if (this.customOption[2] !== null) {
          let transDefaultOptionLen = this.customOption[2].length;
          // 須改拉設定檔
          let funName = { 1: 'SSL', 2: '憑證', 3: 'OTP', 4: '生物辨識' };
          for (let i = 0; i < transDefaultOptionLen; i++) {
            if (i === 0) {
              funNameStr = '「' + funName[this.customOption[2][i]] + '」';
            } else {
              funNameStr += '或「' + funName[this.customOption[2][i]] + '」';
            }
          }
        }
        // 組錯誤訊息
        this.showData.ERROR.content = '本項服務需使用' + funNameStr + '轉帳機制始得進行交易，請洽本行各營業單位辦理。';
        this.showData.custId = this.userInfo.custId;
        this.showData.serviceId = this.transactionObj.serviceId;
        this.showData.transAccountType = this.transactionObj.transAccountType;

      } else {
        
        if (this.transactionObj.hasOwnProperty('showCaptcha')) {
          this.showCaptcha = this.transactionObj.showCaptcha;
        }

        this.showData = {
          ERROR: {
            title: '',
            content: '',
            message: '',
            type: ''
          },
          status: true,
          list: this.customOption[0],
          sendInfo: {
            status: this.customOption[0][0].status,
            popObj: this.customOption[0][0].popObj,
            selected: this.customOption[0][0].securityType,
            securityType: this.customOption[0][0].securityType,
            custId: this.userInfo.custId,
            serviceId: this.transactionObj.serviceId,
            transAccountType: this.transactionObj.transAccountType,
            showCaptcha: this.showCaptcha

          }
        };
      }
    }
    // 只有一個安控項目 下拉不可選擇
    this.ulClass =
      this.showData.list.length <= 1
        ? 'inner_table_frame normal_disable'
        : 'inner_table_frame';
    // 回傳父層
    this.securityObj.emit(this.showData);
  }

  onChange(e) {
    // 設定選的安控項目
    this.showData.sendInfo.selected = e.target.value;
    this.showData.sendInfo.status = this.customOption[1][e.target.value].status;
    this.showData.sendInfo.popObj = this.customOption[1][e.target.value].popObj;
    this.showData.sendInfo.securityType = this.customOption[1][e.target.value].securityType;
    // // 回傳父層
    this._logger.log(this.showData);
    this.securityObj.emit(this.showData);
  }
}
