import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { TaiPowerService } from '../shared/taiPower.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { electricityFee } from './taipowerobject';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { DateUtil } from '@shared/util/formate/date/date-util';

@Component({
  selector: 'app-tai-power-payment',
  templateUrl: './tai-power-payment.component.html',
  styleUrls: ['./tai-power-payment.component.css']
})
export class TaiPowerPaymentComponent implements OnInit {
  agreeChecked = false;
  isGoToResult = false;//判斷是否多於三個
  isMoreefeeStyle = false;//判斷是否都是接電費
  electricityFee: Array<electricityFee> = []; // 所有繳費帳單
  accout = 0;//選擇計數
  myAcct = '';
  qrCodeString = "";
  electricinfoData: any = [];
  electricityFeePrepay: any = []; // 已選擇之繳費帳單
  earliestEle: string = ""; // 最早之電費帳單，必須先繳

  constructor(
    private Alert: AlertService,
    public navgator: NavgatorService,
    public taiPower: TaiPowerService,
    private handleerror: HandleErrorService,
    private confirm: ConfirmService,
    private headerCtrl: HeaderCtrlService,
    private auth: AuthService,
  ) {
    this.qrCodeString = this.navgator.getParams()[0];
    this.myAcct = this.navgator.getParams()[1];

  }

  ngOnInit() {
    this.headerCtrl.setLeftBtnClick(() => this.cancelEdit());
    this.getTaiPowerData(this.qrCodeString);
  }
  //規則判斷與勾選
  isConformRules(id) {
    if (this.accout >= 3 && this.electricityFee[id].check == false) {
      this.Alert.show('單次繳費至多可繳納3筆電費(含接電費)，您已選擇三筆電費。');
    } else {
      this.electricityFee[id].check = !this.electricityFee[id].check;
      if (this.electricityFee[id].check == false) {
        this.accout--;
      }
    }
    if (this.electricityFee[id].check == true) {
      this.accout++;
    }


  }
  getTaiPowerData(url) {
    this.taiPower.getTaiPowerFeeUrl(url).then(
      (res) => {
        if (!!res[2] && res[2] !== '0') { // rtnCode != 0 -> 電費查詢結果不成功
          let errorString: string;
          switch (res[2]) {
            case '2':
              errorString = "token錯誤。";
              break;
            case '1':
              errorString = "系統維護中。";
              break;
            case '-1':
              errorString = "無此電號。";
              break;
            case '-2':
              errorString = "用電戶名不符合。";
              break;
            case '-3':
              errorString = "未開票。";
              break;
          }
          this.Alert.show(errorString).then(() => {
            this.navgator.push('epay');
          })
        }

        if (!!res[3] && res[3] !== '0') { // canPayment != 0 -> 不可繳費
          let errorString: string;
          switch (res[3]) {
            case '1':
              errorString = "該電號有約定以金融存部或信用卡扣款，故無法使用行動支付繳費\n1.此帳單費用委託金融機構代扣繳電費。\n2.當您有以下情形將無法繳費：銀行代繳戶、已終止契約用電戶、包燈戶、高壓戶或非正常繳費情況等。\n3.如有電費疑問，請電洽台電24小時課服專線1911。";
              break;
            case '2':
              errorString = '非屬正常繳費情況，故無法使用行動支付繳費\n1.當您有以下情形將無法繳費：銀行代繳戶、已終止契約用電戶、包燈戶、高壓戶或非正常繳費情況等。\n2.如有電費疑問，請電洽台電24小時課服專線1911。';
              break;
          }
          this.Alert.show(errorString).then(() => {
            this.navgator.push('epay');
            return;
          })
        }
        if (!res[1]) {
          this.Alert.show('查無繳費資訊').then(() => {
            this.navgator.push('epay')
          })
        }
        this.checkCN(); // 有繳電費資訊後再檢查轉帳機制
        this.electricinfoData = [this.qrCodeString, '006', this.myAcct, 0, res[0][0], res[0][1], res[0][2], res[4], res[5]]; // 帶到電費繳費總計頁面，用於FQ000502
        this.earliestEle = "99999"; // YYYMM
        for (let i = 0; i < res[1].length; i++) {
          if (this.electricityFee.length < res[1].length) {
            this.electricityFee.push(res[1][i]);
          }
          this.electricityFee[i].id = i;
          this.electricityFee[i].check = false;
          this.electricityFee[i].efeePayDate = res[1][i].chargeDate;
          this.electricityFee[i].billDateDisplay = this.taiPower.trnsDate(res[1][i].billDate);
          if (res[1][i].feeType == "J") {
            this.electricityFee[i].efeeStyle = "線路設置費";
          } else if (res[1][i].feeType == "F") {
            this.electricityFee[i].efeeStyle = "接電費";
          } else {
            this.electricityFee[i].efeeStyle = "電費";
            // 找出最早電費
            if (res[1][i].billDate < this.earliestEle) {
              this.earliestEle = res[1][i].billDate;
            }
          }
          this.electricityFee[i].totalAmount = Number(res[1][i].chargeAmt);
          this.electricityFee[i].consumption = Number(res[1][i].degrees);
        }
      },
      (error) => {
        this.handleerror.handleError(error).then(() => {
          this.navgator.push('epay');
        });
      });
  }
  gotoSumeFee() {
    this.electricityFeePrepay = [];
    let countefeeStyle: number = 0; // 選擇"電費"數量計數
    let countefeeStyleF: number = 0; // 選擇"接電費"數量計數
    let countefeeStyleJ: number = 0; // 選擇"線路設置費"數量計數
    let notSelectEarliest: boolean = false; // 是否有選到最早的電費帳單
    for (let i = 0; i < this.electricityFee.length; i++) {
      // 已選擇之帳單
      if (this.electricityFee[i].check == true) {
        this.electricityFeePrepay.push(this.electricityFee[i]);
        switch (this.electricityFee[i].efeeStyle) {
          case '電費':
            countefeeStyle++;
            break;
          case '接電費':
            countefeeStyleF++;
            break;
          case '線路設置費':
            countefeeStyleJ++;
            break;
        }
        // 將以選擇之帳單加入 electricityFeePrepay
      } else if (this.electricityFee[i]['billDate'] === this.earliestEle) { // 沒選到最早的電費帳單
        notSelectEarliest = true;
      }
    }
    // 選擇帳單筆數判斷
    if (this.electricityFeePrepay.length == 0) {
      this.Alert.show("至少選擇一筆交易");
      return;
    } else if (countefeeStyle == 0) { // 沒有選擇"電費"且此查詢有電費
      switch (countefeeStyleF) { // 接電費
        case 0: // 接電費 = 0
          // 只有選擇"線路設置費"
          this.Alert.show("帳單不能單獨繳交線路設置費，需包含電費帳單");
          return;
        default: // 有選擇"接電費"
          switch (countefeeStyleJ) { // 線路設置費
            case 0: // 線路設置費 = 0
              // 只有選擇"接電費"
              this.Alert.show("帳單不能單獨繳交接電費，需包含電費帳單");
              return;
            default: // 有"接電費"、"線路設置費"，沒"電費"
              this.Alert.show("帳單不能只單獨繳接電費與線路設置費，需包含電費帳單");
              return;
          }
      }
    }
    if (notSelectEarliest) { // 有選電費，但沒選最早之電費
      this.Alert.show("電費帳單請依照出帳時間勾選");
      return;
    }
    this.navgator.push('taipowerSumFee', [this.electricinfoData, this.electricityFeePrepay]);
  }


  //跳出popup是否返回
  cancelEdit() {
    this.confirm.show('您是否放棄此次編輯?', {
      title: '提醒您'
    }).then(
      () => {
        //確定
        this.navgator.push('epay');
      },
      () => { }
    );
  }

  /**
   * 檢查是否有轉帳機制  沒有就返回epay
   */
  checkCN() {
    let haveCN = false;
    let res: any = this.auth.getUserInfo();
    if (res.AuthType.indexOf('2') > -1) {
      let cnEndDate: any;
      if (res.cnEndDate === null) {
        cnEndDate = DateUtil.transDate(new Date());
      } else {
        cnEndDate = DateUtil.transDate(res.cnEndDate, 'date');
      }
      let todayDate = DateUtil.transDate(new Date());
      if (res.cn == null || res.cn == '' || DateUtil.compareDate(todayDate, cnEndDate) == -1) {
      } else {
        // this.securityTypes.push({ name: '憑證', key: 'NONSET' });
        haveCN = true;
      }
    }
    if (res.AuthType.indexOf('3') > -1) {
      if (res.BoundID == '4' && res.OTPID == '2') {
        // this.securityTypes.push({ name: 'OTP', key: 'OTP' });
        haveCN = true;
      }
    }
    if (!haveCN) {
      this.Alert.show('EPAY.ERROR.NO_SECURITY').then(() => {
        this.navgator.push('epay');
      });
    }
  }
}
