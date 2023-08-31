import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-smart-pay-result',
  templateUrl: './smart-pay-result.component.html',
  styleUrls: ['./smart-pay-result.component.css']
})
export class SmartPayResultComponent implements OnInit {

  sucTitle;
  classType;
  content = '';
  sucFlag=false;
  constructor(
    private navgator: NavgatorService
    , private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.trnsRsltCode == '0') {
        this.sucTitle = '設定成功';
        this.classType = 'success';
        this.sucFlag=true;
      } else if (params.trnsRsltCode == '1') {
        this.sucTitle = '設定失敗';
        this.classType = 'fault_active';
      } else if (params.trnsRsltCode == 'X') {
        this.sucTitle = '設定異常';
        this.classType = 'exclamation_active';
      } else {
        this.sucTitle = '設定不明';
        this.classType = 'fault_active';
      }
      this.content = params.hostCodeMsg;
    });
  }

  cancel() {
    this.navgator.push('epay');
  }

  qrcode() {
    this.navgator.push('epay-scan');
  }

}
