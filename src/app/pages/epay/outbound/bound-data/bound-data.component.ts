import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { AuthService } from '@core/auth/auth.service';
import { QRTpyeService } from '@pages/epay/shared/qrocdeType.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FQ000421ApiService } from '@api/fq/fq000421/fq000421-api.service';
import { logger } from '@shared/util/log-util';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
@Component({
  selector: 'app-bound-data',
  templateUrl: './bound-data.component.html',
  styleUrls: []
})
export class BoundDataComponent implements OnInit {

  custId: any;
  result: any;
  constructor(
    private navgator: NavgatorService,
    private confirm: ConfirmService,
    private auth: AuthService,
    private qrcode: QRTpyeService,
    private handleError: HandleErrorService,
    private fq000421: FQ000421ApiService,
    private _headerCtrl: HeaderCtrlService
  ) { }

  ngOnInit() {
    const userData = this.auth.getUserInfo();
    this.custId = userData.custId
    this.result = this.navgator.getParams().result;
    logger.error("bound-data, result:", this.result);

    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back',
      'title': '同意跨境匯出'
    });
    this._headerCtrl.setLeftBtnClick(() => {
      this.navgator.push('epay');
    });
  }

  clickSubmit() {
    let form = {
      custId: '',
      P33z: '',
      p33phone: '',
      authz: '',
      trnsToken: ''
    };
    if (this.result.cixP33Flg == 'Y') {
      form.P33z = '';
    } else {
      form.P33z = 'Y';
    }
    if (this.result.cixp3Cid == 'Y') {
      form.authz = '';
    } else {
      form.authz = 'Y';
    }
    form.custId = this.custId;
    logger.error("summit(), form.custId:",form.custId);
    form.p33phone = this.result.phoneMobile;
    form.trnsToken = this.result.trnsToken;
    let defaultSecurityType = { key: 'OTP', name: 'OTP' };

    const CA_Object = {
      securityType: '',
      serviceId: 'FQ000421',
      signText: form,
      otpObj: {
        custId: '',
        fnctId: '',
        depositNumber: '',
        OutCurr: '',
        transTypeDesc: ''
      }
    };
    this.qrcode.getSecurityInfo(CA_Object, defaultSecurityType).then(
      resSecurityInfo => {
        let reqHeader = {
          header: resSecurityInfo.headerObj
        };
        logger.error("getSecurityInfo(), success resSecurityInfo:",resSecurityInfo);
        this.fq000421.send(resSecurityInfo.responseObj.signText, reqHeader).then(
          (res) => {
            logger.error("fq000421 return success, res:",res);
            let params = {
              result: res
            };
            this.navgator.push('outboundResult', params);
          }).
          catch(
            error => {
              logger.error("fq000421 return failed, error:",error);
              this.handleError.handleError(error);
            });
      },
      errorSecurityInfo => {
        logger.debug('errorSecurityInfo');
        logger.error("getSecurityInfo(), error errorSecurityInfo:",errorSecurityInfo);
      },
    );
  }


  clickBack() {
    this.confirm.show('取消身分認證程序').then(
      res => {
        this.navgator.pop();
      },
      error => {
      }
    );
  }
}
