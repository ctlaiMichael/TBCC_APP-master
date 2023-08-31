/**
 * Header
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { HandleErrorService } from '@core/handle-error/handle-error.service';


@Component({
	selector: 'app-taxes-detail-confirm-page',
	templateUrl: './taxes-detail-confirm-page.component.html',
	styleUrls: [],
	providers: []
})
export class TaxesDetailConfirmPageComponent implements OnInit {

	@Input() taxesConfirm;        // 編輯頁全部資料
	@Input() taxesDetailConfirm;  // 為了取得subName(繳款類別)
	@Input() allFuelFee;           // 汽機車燃料費特規
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();  // 確認頁即將送往電文
	@Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();    // 返回編輯頁


	// 汽機車燃料使用費Flag(預設不是)
	isFuelFee = false;

	// 安控機制
	securityObj = {
		'action': 'init',
		'sendInfo': {}
	};

	constructor(
		private _checkSecurityService: CheckSecurityService,
		private _headerCtrl: HeaderCtrlService,
		private _authService: AuthService,
		private _handleError: HandleErrorService
	) { }

	ngOnInit() {
		this.securityObj = {
			'action': 'init',
			'sendInfo': this.taxesConfirm.SEND_INFO
		};
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'back'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});

		// 汽機車燃料費特規
		if (this.allFuelFee.payCategory == '40005') {
			this.isFuelFee = true;
		} else {
			this.isFuelFee = false;
		}
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
			'sendInfo': this.taxesConfirm.SEND_INFO
		};

	}


	stepBack(e) {
		if (e.status) {
			let send_data: any = {};
			if (this.allFuelFee.payCategory == '40005') {
				// 40005 為汽機車燃料費特規
				send_data = {
					'custId': this._authService.getCustId(),
					'trnsfrOutAccnt': this.allFuelFee.trnsfrOutAccnt.replace(/-/g, ''),
					'payCategory': this.allFuelFee.payCategory,
					'payNo': this.allFuelFee.payNo,
					//汽車燃料費(特規)，做日期轉換
					'payEndDate': DateUtil.transDate(this.allFuelFee.payEndDate, ['yyyMMdd', 'chinaYear']),
					'trnsfrAmount': this.allFuelFee.trnsfrAmount,
					'businessType': this.allFuelFee.businessType,
					'taxType': this.allFuelFee.taxType,
					'trnsToken': this.allFuelFee.trnsToken,
					'identificationCode': ''
				};
			} else {
				// 使用者輸入什麼就是什麼
				send_data = {
					'custId': this._authService.getCustId(),
					'trnsfrOutAccnt': this.taxesConfirm.trnsfrOutAccnt.replace(/-/g, ''),
					'payCategory': this.taxesDetailConfirm.atmCode,
					'payNo': this.taxesConfirm.payNo,
					'payEndDate': this.taxesConfirm.payEndDate,
					'trnsfrAmount': this.taxesConfirm.trnsfrAmount,
					'businessType': this.taxesConfirm.businessType,
					'taxType': this.taxesConfirm.taxType,
					'trnsToken': this.taxesConfirm.trnsToken
				};
			}
			// OTP須帶入的欄位
			if (e.securityType === '3') {
				if (this.allFuelFee.payCategory == '40005') {
					e.otpObj.depositNumber = send_data.trnsfrOutAccnt; // 轉出帳號
					e.otpObj.depositMoney = this.allFuelFee.trnsfrAmount; // 金額
				} else {
					e.otpObj.depositNumber = send_data.trnsfrOutAccnt; // 轉出帳號
					e.otpObj.depositMoney = this.taxesConfirm.trnsfrAmount; // 金額
				}
				e.otpObj.OutCurr = 'TWD'; // 幣別
				e.transTypeDesc = ''; //
			} else if (e.securityType === '2') {
				// 憑證須帶入的欄位
				e.signText = send_data;
			}
			// 統一叫service 做加密
			this._checkSecurityService.doSecurityNextStep(e).then(
				(S) => {
					// 把S做為output傳回
					this.backPageEmit.emit({
						type: 'goResult',
						value: true,
						securityResult: S,
						sendData: send_data
					});
				}, (F) => {
					F['type'] = 'dialog';
					this._handleError.handleError(F);
				}
			);
		} else {
			// no do(SSL會直接在頁面上顯示)
			return false;
		}
	}


}
