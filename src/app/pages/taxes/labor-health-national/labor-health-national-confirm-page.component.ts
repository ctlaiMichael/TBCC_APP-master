/**
 * Header
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';


@Component({
	selector: 'app-labor-health-national-confirm-page',
	templateUrl: './labor-health-national-confirm-page.component.html',
	styleUrls: [],
	providers: []
})
export class LaborHealthNationalConfirmPageComponent implements OnInit {

	@Input() laborHealthNationalConfirm;        // 編輯頁全部資料
	@Input() trnsfrAmount;                      // 繳款金額
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();  // 確認頁即將送往電文
	@Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();    // 返回編輯頁

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
			'sendInfo': this.laborHealthNationalConfirm.SEND_INFO
		}
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'back'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	}
	// 跳出popup是否返回
	cancelEdit() {
		this.backToEdit.emit({
			type: 'goEdit',
			value: true
		});
	}

	finalCheck() {
		this.securityObj = {
			'action': 'submit',
			'sendInfo': this.laborHealthNationalConfirm.SEND_INFO
		}
	}


	stepBack(e) {
		if (e.status) {
			// OTP須帶入的欄位
			if (e.securityType === '3') {
				e.otpObj.depositNumber = this.laborHealthNationalConfirm.account // 轉出帳號
				e.otpObj.depositMoney = this.trnsfrAmount; // 金額
				e.otpObj.OutCurr = 'TWD'; // 幣別
				e.transTypeDesc = ''; // 
			} else if (e.securityType === '2') {

				// 憑證須帶入的欄位
				e.signText = {
					'custId': this._authService.getUserInfo().custId,
					'account': this.laborHealthNationalConfirm.account.replace(/-/g,''),
					'barcode1': this.laborHealthNationalConfirm.barcode1,
					'barcode2': this.laborHealthNationalConfirm.barcode2,
					'barcode3': this.laborHealthNationalConfirm.barcode3,
					'businessType': this.laborHealthNationalConfirm.businessType,
					'trnsToken': this.laborHealthNationalConfirm.trnsToken,
				};
			}
			// 統一叫service 做加密
			this._checkSecurityService.doSecurityNextStep(e).then(
				(S) => {
					// 把S做為output傳回
					this.backPageEmit.emit({
						type: 'goResult',
						value: true,
						securityResult: S
					});
				}, (F) => {
					
				}
			);
		} else {
			return false;
		}
	}
}
