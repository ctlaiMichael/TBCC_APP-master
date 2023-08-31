import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { FormateService } from '@shared/formate/formate.service';

@Component({
  selector: 'app-efee-result',
  templateUrl: './efee-result.component.html',
  styleUrls: ['./efee-result.component.css']
})
export class EfeeResultComponent implements OnInit {
  electricityFeeResult;
  taiPowerFee = [];
  resultDesc: Array<any> = []; // 交易結果訊息
  trnsRsltCode = '';
  trnsRslt: string; // 交易結果
  trnsRsltClass: string; // 交易結果圖案
  constructor(
    private _headerCtrl: HeaderCtrlService,
    private _formateService: FormateService,
    public navgator: NavgatorService,
  ) {
    this._headerCtrl.updateOption({
      style: 'result',
      leftBtnIcon: 'menu'
    });
  }

  ngOnInit() {
    this.electricityFeeResult = this.navgator.getParams();
    this.trnsRsltCode = this.electricityFeeResult.trnsRsltCode;
    // 顯示結果文字 ex: 電費 107年03月
    if (!!this.electricityFeeResult.feeType1 && this.electricityFeeResult.feeType1 != '')
      this.taiPowerFee.push(this.feeTypetoString(this.electricityFeeResult.feeType1) + " " + this.trnsDate(this.electricityFeeResult.billDate1));
    if (!!this.electricityFeeResult.feeType2 && this.electricityFeeResult.feeType2 != '')
      this.taiPowerFee.push(this.feeTypetoString(this.electricityFeeResult.feeType2) + " " + this.trnsDate(this.electricityFeeResult.billDate2));
    if (!!this.electricityFeeResult.feeType3 && this.electricityFeeResult.feeType3 != '')
      this.taiPowerFee.push(this.feeTypetoString(this.electricityFeeResult.feeType3) + " " + this.trnsDate(this.electricityFeeResult.billDate3));
    // 交易結果訊息
    if (!!this.electricityFeeResult.resultDesc1 && this.electricityFeeResult.resultDesc1 != '') {
      this.resultDesc.push(this.electricityFeeResult.resultDesc1);
    }
    if (!!this.electricityFeeResult.resultDesc2 && this.electricityFeeResult.resultDesc2 != '') {
      this.resultDesc.push(this.electricityFeeResult.resultDesc2);
    }
    if (!!this.electricityFeeResult.resultDesc3 && this.electricityFeeResult.resultDesc3 != '') {
      this.resultDesc.push(this.electricityFeeResult.resultDesc3);
    }
    // 去除最後兩個0(多的)
    this.electricityFeeResult.txnAmt = this.electricityFeeResult.txnAmt.substr(0, String(this.electricityFeeResult.txnAmt).length - 2);
    let trnsRsltMap = new Map();
    trnsRsltMap.set('0', { msg: '交易成功', class: 'icon_success' });
    trnsRsltMap.set('1', { msg: '交易失敗', class: 'icons_fault' });
    trnsRsltMap.set('X', { msg: '交易異常', class: 'icons_exclamation' });
    this.trnsRslt = trnsRsltMap.get(this.electricityFeeResult.trnsRsltCode).msg;
    this.trnsRsltClass = trnsRsltMap.get(this.electricityFeeResult.trnsRsltCode).class;
  }
  feeTypetoString(feeType) {
    if (feeType == "J") {
      return "線路設置費";
    } else if (feeType == "F") {
      return "接電費";
    } else if (feeType == "1") {
      return "電費";
    } else {
      return null;
    }
  }
  gotohome() {
    this.navgator.push('home');
  }

  /**
   * 
   * @param date ex:10809 -> 108年09月
   */
  private trnsDate(date: string) {
    return date.substr(0, 3) + '年' + date.substr(3) + '月';
  }
}
