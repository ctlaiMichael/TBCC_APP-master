import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { EPayService } from '../../shared/epay.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { StringCheckUtil } from '@shared/util/check/string-check-util';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { FQ000103ApiService } from '@api/fq/fq000103/fq000103-api.service';
import { logger } from '@shared/util/log-util';
import { FormateService } from '@shared/formate/formate.service';
import { LocalStorageService } from '@lib/storage/local-storage.service';
import { TcbbService } from '@lib/plugins/tcbb/tcbb.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';

@Component({
  selector: 'app-smart-pay',
  templateUrl: './smart-pay.component.html',
  styleUrls: ['./smart-pay.component.css']
})
export class SmartPayComponent implements OnInit {

  accts: any;
  isAgreeQRCode: any;
  defaultTrnsOutAcct: any;
  popup_open = true;
  popupheight = window.screen.height - 380;
  popupcontent_MarginTop = 0;
  selectedAcct: any;
  formPaySetting = {
    custId: '',
    acctNo: '',
    verifyCode: '',
    isOpenSmartPay: '',
    isAgreeQRCode: 'Y'
  };
  originAcct: any;
  openpwd = false;
  verifyCodeInput: any;
  errorMsg = {
    verifyCode: ''
  };
  inpSetData = {

  };
  popup_flag = true; //控制popup是否開啟
  cancelBtn = true;

  constructor(
    private navgator: NavgatorService,
    private auth: AuthService,
    private handleError: HandleErrorService,
    private epay: EPayService,
    private alert: AlertService,
    private confirm: ConfirmService,
    private fq000103: FQ000103ApiService,
    private formateService: FormateService,
    private headerCtrl: HeaderCtrlService
  ) { }

  ngOnInit() {
    if (this.popupheight >= 380) {
      this.popupheight = 380;
    }
    this.popupcontent_MarginTop = this.popupheight / 5;
    this._init();
    this.headerCtrl.setLeftBtnClick(() => {//右邊button
      this.navgator.push('epay');
    });
  }

  _init() {
    this.epay.sendFQ000101('S').then(
      resfq000101 => {
        // tslint:disable-next-line: no-shadowed-variable
        let fq000101res: any = resfq000101;
        if (fq000101res.trnsOutAccts.trnsOutAcct.length === 0) {
          this.alert.show('未開通晶片金融卡，請臨櫃申請').then(
            res => {
              this.navgator.push('epay');
            }
          );
        }
        let acts = fq000101res.trnsOutAccts.trnsOutAcct;
        acts = this.epay.TransArray(fq000101res.trnsOutAccts, fq000101res.trnsOutAccts.trnsOutAcct);
        // 取得進行SmartPay開通功能開關
        // tslint:disable-next-line: max-line-length
        this.isAgreeQRCode = (fq000101res.isAgreeQRCode != null && typeof (fq000101res.isAgreeQRCode) == 'string' && fq000101res.isAgreeQRCode.toUpperCase() == 'Y');
        this.accts = [];
        let count = 0;
        for (let key in acts) {
          // 檢查是否為預設SmartPay帳戶
          if (acts[key].acctNo == fq000101res.defaultTrnsOutAcct) {
            acts[key].selected = true;
            count++;
          }
          if (typeof (acts[key].enabledSmartPay) !== 'string') {
            acts[key].enabledSmartPay = '';
          }
          this.accts.push(acts[key]);
        }
        //按鈕不顯示
        if (count == 0 && this.accts.length != 0) {
          this.cancelBtn = false;
        }
        if (this.accts.length == 0) {
          this.alert.show('未開通晶片金融卡，請臨櫃申請').then(
            res => {
              this.navgator.push('epay');
            }
          );
        }
        this.defaultTrnsOutAcct = fq000101res.defaultTrnsOutAcct;
      },
      errorfq000101 => {
        this.handleError.handleError(errorfq000101);
        this.navgator.push('epay');
      }
    );
  }

  /**
 * 輸入返回事件
 * @param e
 */
  onInputBack(e) {
    logger.step('OTP', 'onInputBack', e);
    this.verifyCodeInput = e;
  }

  /**
     * 點選同意
     */
  clickAgree() {
    this.popup_open = false;
    this.popup_flag = false;
    this.PaySetting();
  }

  PaySetting() {
    this.formPaySetting.isAgreeQRCode = 'Y';
    for (let i in this.accts) {
      if (this.accts[i].selected) {
        this.originAcct = this.accts[i];
      }
    }
  }

  /**
	 * 點選取消約定
	 */
  cancelAgree() {
    let fmtAcct = this.formateService.transAccount(this.defaultTrnsOutAcct.toString());
    // let cancelAgreeString = '請問是否取消帳號' + fmtAcct + ' QR Code消費扣款約定?\n *若要取消金融卡消費扣款功能，請洽臨櫃申請。';
    let cancelAgreeString = '請問是否取消帳號' + fmtAcct + ' 合庫E Pay之帳號約定?';
    
    this.confirm.show(cancelAgreeString).then(
      res => {
        this.formPaySetting.acctNo = this.defaultTrnsOutAcct;
        this.formPaySetting.isOpenSmartPay = 'N';
        this.formPaySetting.isAgreeQRCode = 'N';
        this.popup_open = true;
        this.popup_flag = false;
        this.openpwd = true;
      },
      error => {
        this.navgator.push('epay');
      }
    );
  }

  /**
	 * 點選不同意
	 */
  clickDisAgree() {
    this.navgator.push('epay');
    this.popup_open = false;
  }

  /**
	 * 點選帳號動作(設定為單選)
	 */
  selectAcct(acctHtml) {
    this.selectedAcct = acctHtml;
    for (let i in this.accts) {
      if (this.accts[i] === acctHtml) {
        this.accts[i].selected = true;
      } else {
        this.accts[i].selected = false;
      }
    }
  }

  /**
	 * 點選確認
	 */
  clickNextStep() {
    // 未變更
    if (this.selectedAcct == null || this.originAcct == this.selectedAcct) {
      this.alert.show('無變更');
      return;
    }
    // 檢查所選帳戶是否開通SmartPa
    if (this.checkAcctPermission(this.selectedAcct)) {
      this.nextSetp();
    } else {
      this.confirm.show('您所選取之交易帳號尚未進行SmartPay開通，請問您是否同意開通?').then(
        res => {
          this.nextSetp();
        },
        error => {
          return;
        }
      );
    }
  }

  nextSetp() {
    this.formPaySetting.acctNo = this.selectedAcct.acctNo;
    this.formPaySetting.isOpenSmartPay = this.selectedAcct.enabledSmartPay === 'Y' ? 'N' : 'Y';
    // 進入密碼輸入
    this.openpwd = true;
  }

  checkAcctPermission(acct) {
    if (acct.enabledSmartPay.toUpperCase() == 'Y') {
      return true;
    }
    return false;
  }

  verifyCodeCheck() {
    let code = this.verifyCodeInput;
    if (code == null || code.length == 0) {
      this.errorMsg.verifyCode = '請輸入密碼';
      return false;
    }
    this.errorMsg.verifyCode = '';
    return true;
  }

  submit() {
    // 發送設定
    this.formPaySetting.custId = this.auth.getCustId();
    this.fq000103.send(this.formPaySetting).then(
      resfq000103 => {
        let params = {
          result: resfq000103,
          isAgreeQRCode: this.formPaySetting.isAgreeQRCode
        };
        this.navgator.push('qrcodePaySettingResult', {}, params.result.body);
      },
      errorfq000103 => {
        this.handleError.handleError({
          type: 'message',
          title: '設定失敗',
          content: errorfq000103.content
        });
        this.verifyCodeInput = ''; //失敗清空畫面欄位
        this.openpwd = false;
      }
    );
  }
  /**
	 * 點選確認
	 */
  clickSubmit() {
    if (!this.verifyCodeCheck()) {
      return;
    }
    this.auth.digitalEnvelop(this.verifyCodeInput).then(
      res => {
        this.formPaySetting.verifyCode = res.value;
        this.submit();
      },
      error => {
        logger.error('digitalEnvelop Error');
      }
    );
  }



}
