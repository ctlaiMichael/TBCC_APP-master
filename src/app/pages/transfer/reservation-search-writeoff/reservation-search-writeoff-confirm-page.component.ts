/**
 * Header
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { DateUtil } from '@shared/util/formate/date/date-util';

@Component({
	selector: 'app-reservation-search-writeoff-confirm-page',
	templateUrl: './reservation-search-writeoff-confirm-page.component.html',
	styleUrls: [],
	providers: []
})
export class ReservationSearchWriteoffConfirmPageComponent implements OnInit {


	@Input() reservationConfirm;         // 承接編輯頁資料
	@Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();    // 確認頁返回編輯頁
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();  // 確認頁資料全部送往編輯頁，準備發電文

	// 安控機制
	securityObj = {
		'action': 'init',
		'sendInfo': {}
	}

	constructor(
		private _checkSecurityService: CheckSecurityService,
		private _headerCtrl: HeaderCtrlService,
		private _authService: AuthService) { }

	ngOnInit() {
		this.securityObj = {
			'action': 'init',
			'sendInfo': this.reservationConfirm.SEND_INFO
		}
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	}


	// 跳出popup是否返回
	cancelEdit() {
		this.backToEdit.emit({
			value: true
		});
	}

	finalCheck() {
		this.securityObj = {
			'action': 'submit',
			'sendInfo': this.reservationConfirm.SEND_INFO
		}

	}

	stepBack(e) {
		if (e.status) {
			// OTP須帶入的欄位
			if (e.securityType === '3') {
				e.otpObj.depositNumber = ''; // 轉出帳號
				e.otpObj.depositMoney = ''; // 金額
				e.otpObj.OutCurr = 'TWD'; // 幣別
				e.transTypeDesc = ''; // 
			} else if (e.securityType === '2') {
				// 憑證須帶入的欄位
				e.signText = {
					'custId': this._authService.getUserInfo().custId,
					'trnsfrDate' : DateUtil.transDate(this.reservationConfirm.trnsfrDate, ['yyyMMdd', 'chinaYear']),
					'orderDate' : this.reservationConfirm.orderDate,   
					'orderNo' : this.reservationConfirm.orderNo,
					'trnsToken' : this.reservationConfirm.trnsToken,
					'trnsfrOutAccnt' : this.reservationConfirm.trnsfrOutAccnt,
					'trnsfrInBank' : this.reservationConfirm.trnsfrInBank,
					'trnsfrInAccnt' : this.reservationConfirm.trnsfrInAccnt,
					'trnsfrAmount' : this.reservationConfirm.trnsfrAmount,
				};
			}
			// 統一叫service 做加密
			this._checkSecurityService.doSecurityNextStep(e).then(
				(S) => {
					// 把S做為output傳回;
					this.backPageEmit.emit({
						type: 'goResult',
						value: true,
						securityResult: S
					});
				}, (F) => {
					this.backPageEmit.emit({
						type: 'goResult',
						value: false,
						securityResult: F
					});
				}
			);
		} else {
			return false;
		}
	}

}
