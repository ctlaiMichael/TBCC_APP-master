/**
 * 基本資料填寫
 */
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { Router } from '@angular/router';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { FundKYCService } from '@pages/fund/shared/service/fund-KYC.service';


@Component({
  selector: 'app-base-data-page',
  templateUrl: './base-data-page.component.html',
  styleUrls: [],

})
export class BaseDataPageComponent implements OnInit {


  @Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() backPageEmitLeft: EventEmitter<any> = new EventEmitter<any>();
  @Input() info_data;
  baseData = {
    step: 'next',
    child: '',
    injury: ''
  }
  errorSelect = {
    child: false,
    injury: false
  }
  constructor(
    private _logger: Logger
    , private router: Router
    , private navgator: NavgatorService
    , private _authService: AuthService
    , private _handleError: HandleErrorService
    , private _headerCtrl: HeaderCtrlService
    , private _checkSecurityService: CheckSecurityService
    , private _mainService: FundKYCService

  ) {
  }

  ngOnInit() {
    this._headerCtrl.updateOption({
      'leftBtnIcon': 'back'
    });
    if (this.info_data.isFirstKYC == 'N') {
      this._headerCtrl.setLeftBtnClick(() => {
        this.backPageEmitLeft.emit('personal-capital');
      });
    } else {
      this._headerCtrl.setLeftBtnClick(() => {
        this.backPageEmitLeft.emit('safe-check');
      });
    }


  }
  prevStep() {
    this.baseData.step = 'prev';
    this.backPageEmit.emit(this.baseData);
  }
  nextStep() {
    this.baseData.step = 'next';
    if (this.baseData.child == '') {
      this.errorSelect.child = true;
    } else {
      this.errorSelect.child = false;
    }
    if (this.baseData.injury == '') {
      this.errorSelect.injury = true;
    } else {
      this.errorSelect.injury = false;
    }

    if (!this.errorSelect.child && !this.errorSelect.injury) {
      this.backPageEmit.emit(this.baseData);
    }
  }
  goFund() {
    this.navgator.push('fund');
  }
}
