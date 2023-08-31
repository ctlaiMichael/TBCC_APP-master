/**
 * Header
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { Logger } from '@core/system/logger/logger.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
	selector: 'app-current-to-fixed-confirm-page',
	templateUrl: './current-to-fixed-confirm-page.component.html',
	styleUrls: [],
	providers: []
})
export class CurrentToFixedConfirmPageComponent implements OnInit {

	@Input() currentToFixedConfirm;
	@Input() currentTimeData;            // 拿到當下時間
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();  // 確認頁即將送往電文
	@Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();    // 返回編輯頁

	transfrAmount = 0;
	// 安控機制
	securityObj = {
		'action': 'init',
		'sendInfo': {}
	}
	constructor(
		private _logger: Logger,
		private _checkSecurityService: CheckSecurityService,
		private _headerCtrl: HeaderCtrlService,
		private _handleError: HandleErrorService,
		private _authService: AuthService) {
	}

	ngOnInit() {
		this.securityObj = {
			'action': 'init',
			'sendInfo': this.currentToFixedConfirm.sendInfo
		}
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'back'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});

		if (this.currentToFixedConfirm.hasOwnProperty('transfrAmount')) {
			this.transfrAmount = (parseInt(this.currentToFixedConfirm.transfrAmount.value, 10) );
			// this.currentToFixedConfirm.transfrAmount.value = (parseInt(this.currentToFixedConfirm.transfrAmount.value, 10) * 10000);
		}
		console.log(this.currentToFixedConfirm);

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
			'sendInfo': this.currentToFixedConfirm.sendInfo
		};

	}

	stepBack(e) {
		if (e.status) {
			// OTP須帶入的欄位
			if (e.securityType === '3') {
				e.otpObj.depositNumber = (this.currentToFixedConfirm.inteAccnt.value).replace(/-/g, ''); // 轉出帳號
				e.otpObj.depositMoney = this.transfrAmount; // 金額
				e.otpObj.OutCurr = 'TWD'; // 幣別
				e.transTypeDesc = ''; //
			} else if (e.securityType === '2') {

				// 憑證須帶入的欄位，並依即時或預約發不同電文
				// inteAccnt: { name: '', value: '' }, // 綜存帳號
				// transfrType: { name: '', value: '' }, // 轉存類別
				// transfrTimes: { name: '', value: '' }, // 轉存期別
				// transfrRateType: { name: '', value: '' }, // 轉存利率別
				// transfrAmount: { name: '', value: '' }, // 轉存金額
				// autoTransCode: { name: '', value: '' }, // 續存方式
				e.signText = {
					'custId': this._authService.getUserInfo().custId,
					'inteAccnt': (this.currentToFixedConfirm.inteAccnt.value).replace(/-/g, ''),
					'transfrType': this.currentToFixedConfirm.transfrType.value,
					'transfrTimes': this.currentToFixedConfirm.transfrTimes.value,
					'transfrRateType': this.currentToFixedConfirm.transfrRateType.value,
					'transfrAmount': this.transfrAmount,
					'autoTransCode': this.currentToFixedConfirm.autoTransCode.value,
					'businessType': this.currentToFixedConfirm.businessType,
					'trnsToken': this.currentToFixedConfirm.trnsToken
				};

			}

			// 統一叫service 做加密
			this._checkSecurityService.doSecurityNextStep(e).then(
				(S) => {
					// 把S做為output傳回
					this.backPageEmit.emit({
						type: 'result',
						value: true,
						serviceId: e.serviceId,
						securityResult: S
					});
				}, (F) => {
					this.backPageEmit.emit({
						type: 'result',
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
