import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';
import { TaiPowerService } from '../shared/taiPower.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { QRTpyeCardService } from '../shared/qrocdeType-card.service';
import { EPayCardService } from '../shared/epay-card.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { AuthService } from '@core/auth/auth.service';
import { ObjectCheckUtil } from '@shared/util/check/object-check-util';
import { FQ000302ReqBody } from '@api/fq/fq000302/fq000302-req';
import { logger } from '@shared/util/log-util';
import { FQ000302ApiService } from '@api/fq/fq000302/fq000302-api.service';
import { FQ000502ReqBody } from '@api/fq/fq000502/fq000502-req';
import { FQ000502ApiService } from '@api/fq/fq000502/fq000502-api.service';
import { DateUtil } from '@shared/util/formate/date/date-util';

@Component({
  selector: 'app-sume-fee-card',
  templateUrl: './sume-fee-card.component.html',
  styleUrls: ['./sume-fee-card.component.css']
})
export class SumeFeeCardComponent implements OnInit {

  constructor(
    private qrcode: QRTpyeCardService,
    public navgator: NavgatorService,
    private epay: EPayCardService,
    private auth: AuthService,
    private alert: AlertService,
    private errorHandler: HandleErrorService,
    private _formateService: FormateService,
    private taiPowerService: TaiPowerService,
    private fq000502: FQ000502ApiService,
    private handleerror: HandleErrorService,
    private confirm: ConfirmService
  ) { }
  returnData;
  electricityFee = [];
  trnsToken = "";
  securityTypes: any = [];//安控
  selectSecurityType: any;//安控
  defaultSecurityType: any;
  paymentData: any;
  form: any = {
    trnsfrOutAcct: '',
    secureCode: '',
    acqInfo: ''
  };
  defaultBarcode: any;
  electricinfoData: Array<any> = [];
  taiPowerFee = [];//台電帳單
  totalMoney: number = 0; // 總計金額
  transactionAccount = ""//交易帳號
  transactionObj = {
    serviceId: 'F9000303',
    categoryId: '3',
    transAccountType: '1',
  };
  typeAndFee; // FQ000501 res typeAndFee
  typeAndFee2; // 手續費 typeAndFee.substr(1) * 100
  ngOnInit() {
    this.securityServices();
    this.electricinfoData = this.navgator.getParams()[0];
    this.transactionAccount = this.electricinfoData[2];
    this.electricityFee = this.navgator.getParams()[1];
    // 加總計算
    for (let i = 0; i < this.electricityFee.length; i++) {
      this.taiPowerFee[i] = this.electricityFee[i].efeeStyle + " " + this.electricityFee[i].billDateDisplay;
      this.totalMoney = this.totalMoney + this.electricityFee[i].totalAmount; // 總計金額
    }
    this.electricinfoData[3] = this.totalMoney;
    this.typeAndFee = this.electricinfoData[8];
    this.typeAndFee2 = String(this.typeAndFee).substr(1);
  }
  transactionResult() {

		// 安控資料取得
		// let security_data = this.qrcode.getSecurityData();
		// this.securityTypes = security_data.securityTypes;
		// if (this.securityTypes.length > 0 && !!this.securityTypes[0]) {
    //   this.onChangeSecurity(this.securityTypes[0]);
		// }

    this.epay.sendFQ000101('E').then(
      resfq000101 => {
        let FQ000502req = new FQ000502ReqBody();
        let res: object = this.auth.getUserInfo();
        FQ000502req.custId = res['custId'];
        FQ000502req.txnAmt = String(this.totalMoney) + '00'; // 交易金額含手續費、含小數兩位(? 包含手續費
        FQ000502req.typeAndFee = this.typeAndFee; // F0、C87 之類的字串
        FQ000502req.trnsToken = this.electricinfoData[7];
        // mobileBarcode處理
        if (typeof resfq000101['defaultBarcode'] == "undefined" || resfq000101['defaultBarcode'] == "") {
          FQ000502req.mobileBarcode = "";
        } else if (resfq000101['defaultBarcode'] && resfq000101['defaultBarcode'] == "2" && !!resfq000101['loveCode']) {
          FQ000502req.mobileBarcode = resfq000101['loveCode'];
        } else if (resfq000101['defaultBarcode'] && resfq000101['defaultBarcode'] == "1" && !!resfq000101['mobileBarcode']) {
          FQ000502req.mobileBarcode = resfq000101['mobileBarcode'];
        } else {
          FQ000502req.mobileBarcode = "";
        }
        FQ000502req.custInfo = this.electricinfoData[0]; // scan就做過substr(99)
        FQ000502req.trnsfrOutBank = '006';
        FQ000502req.trnsfrOutAcct = this.transactionAccount;
        FQ000502req.noticeNbr = this.electricinfoData[4];
        FQ000502req.typeAndFee = this.typeAndFee;
        FQ000502req.feeSessionId = this.electricinfoData[6];
        if (this.electricityFee.length >= 1) {
          FQ000502req.billDate1 = this.electricityFee[0].billDate;
          FQ000502req.chargeDate1 = this.electricityFee[0].efeePayDate;
          FQ000502req.chargeAmt1 = String(this.electricityFee[0].totalAmount);
          FQ000502req.feeType1 = this.electricityFee[0].feeType;
        }
        if (this.electricityFee.length >= 2) {
          FQ000502req.billDate2 = this.electricityFee[1].billDate;
          FQ000502req.chargeDate2 = this.electricityFee[1].efeePayDate;
          FQ000502req.chargeAmt2 = String(this.electricityFee[1].totalAmount);
          FQ000502req.feeType2 = this.electricityFee[1].feeType;
        }
        if (this.electricityFee.length == 3) {
          FQ000502req.billDate3 = this.electricityFee[2].billDate;
          FQ000502req.chargeDate3 = this.electricityFee[2].efeePayDate;
          FQ000502req.chargeAmt3 = String(this.electricityFee[2].totalAmount);
          FQ000502req.feeType3 = this.electricityFee[2].feeType;
        }
        let CA_Object: object = {};
        switch (this.selectSecurityType.key) {
          case "NONSET":
            CA_Object = {
              securityType: '',
              serviceId: 'FQ000502',
              signText: JSON.parse(JSON.stringify(FQ000502req))
            };
            break;
          case "OTP":
            CA_Object = {
              securityType: '',
              serviceId: 'FQ000502',
              signText: JSON.parse(JSON.stringify(FQ000502req)),
              otpObj: {
                custId: '',
                fnctId: '',
                depositNumber: '',
                depositMoney: '',
                OutCurr: '',
                transTypeDesc: ''
              }
            };
        }
        this.qrcode.getSecurityInfo(CA_Object, this.selectSecurityType).then(
          resSecurityInfo => {
            let reqHeader = {
              header: resSecurityInfo.headerObj
            };
            // let reqbody = new FQ000502ReqBody();
            //  reqbody.custId = this.auth.getCustId();
            //  reqbody.trnsfrOutAcct = resultFQ000101.defaultTrnsOutAcct;

            this.fq000502.send(FQ000502req, reqHeader).then(
              (resfq000502) => {
                if (resfq000502 != null) {
                  this.returnData = ObjectCheckUtil.modifyTransArray(resfq000502.body);
                } else {
                  this.returnData = null;
                }
                this.navgator.push('cardlogin-eFeeResult', this.returnData[0]);
              },
              (error) => {
                this.handleerror.handleError(error);
              });
          },
          errorSecurityInfo => {
            logger.debug('errorSecurityInfo');
          },
        );
        // }
      }

    ).catch(
      error => {
        //this.errorHandler.handleError(error);
      }
    );





  }
  /**
   * 初始化驗證模式
   */
  securityServices() {
    // let res: any = this.auth.getUserInfo();
    // if (res.AuthType.indexOf('2') > -1) {
    //   let cnEndDate: any;
    //   if (res.cnEndDate === null) {
    //     cnEndDate = DateUtil.transDate(new Date());
    //   } else {
    //     cnEndDate = DateUtil.transDate(res.cnEndDate, 'date');
    //   }
    //   let todayDate = DateUtil.transDate(new Date());
    //   if (res.cn == null || res.cn == '' || DateUtil.compareDate(todayDate, cnEndDate) == -1) {
    //   } else {
    //     this.securityTypes.push({ name: '憑證', key: 'NONSET' });
    //   }
    // }
    // if (res.AuthType.indexOf('3') > -1) {
    //   if (res.BoundID == '4' && res.OTPID == '2') {
    //     this.securityTypes.push({ name: 'OTP', key: 'OTP' });
    //   }
    // }
    // // this.securityTypes.push({ name: 'OTP', key: 'OTP' }); // 測試OTP用
    // this.selectSecurityType = this.securityTypes[0];

		let security_data = this.qrcode.getSecurityData({
			biometric: false
		});
		this.securityTypes = security_data.securityTypes;
		if (!!security_data.selectSecurityType) {
			this.onChangeSecurity(security_data.selectSecurityType);
		}
  }

  onChangeSecurity(security) {
    this.selectSecurityType = security;
  }
  ///
  //安控檢核
  securityOptionBak(e) {
    if (e.status) {
      // 取得需要資料傳遞至下一頁子層變數

    } else {
      // do errorHandle 錯誤處理 推業或POPUP
    }
  }
  //跳出popup是否返回
  cancelEdit() {
    this.confirm.show('您是否放棄此次編輯?', {
      title: '提醒您'
    }).then(
      () => {
        //確定
        this.navgator.push('epay-card');
      },
      () => { }
    );
  }
}