/**
 * Header
 * 
 * 臺北自來水費
 * 水號及應繳總金額由掃描條碼或手動輸入條碼而得
 * 不由使用者輸入。
 * 
 * 條碼一：
 * 代收期限YYMMDD (6) + 代收項目168(3)
 * 
 * 條碼二：
 * 水單類別(2) +分單序號(1) +序號(1) +抄表日(dd)(2) +水號(10)
 * 
 * 條碼三：
 * 抄表日yymm(4)(收費年月) + 檢查碼(2) + 帳單金額(9)
 * 
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';


@Component({
	selector: 'app-taipei-water-confirm-page',
	templateUrl: './taipei-water-confirm-page.component.html',
	styleUrls: [],
	providers: []
})
export class TaipeiWaterConfirmPageComponent implements OnInit {

	@Input() taipeiWaterConfirm;        // 編輯頁全部資料
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();  // 確認頁即將送往電文
	@Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();    // 返回編輯頁

	billDate = ''; // 收費年月

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
			'sendInfo': this.taipeiWaterConfirm.SEND_INFO
		}
		// 收費年月
		this.billDate = '1' + this.taipeiWaterConfirm.barcode3.substring(0, 4);
		this.billDate = (parseInt(this.billDate.substr(0,3))+1911) +'/'+this.billDate.substr(3);
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
			'sendInfo': this.taipeiWaterConfirm.SEND_INFO
		}

	}


	stepBack(e) {
		if (e.status) {
			// OTP須帶入的欄位
			if (e.securityType === '3') {
				e.otpObj.depositNumber = (this.taipeiWaterConfirm.account).replace(/-/g,''); // 轉出帳號
				e.otpObj.depositMoney = this.taipeiWaterConfirm.payAmount; // 金額
				e.otpObj.OutCurr = 'TWD'; // 幣別
				e.transTypeDesc = ''; // 
			} else if (e.securityType === '2') {

				// 憑證須帶入的欄位
				e.signText = {
					'custId': this._authService.getUserInfo().custId,
					'account': this.taipeiWaterConfirm.account.replace(/-/g, ''),
					'barcode1': this.taipeiWaterConfirm.barcode1,
					'barcode2': this.taipeiWaterConfirm.barcode2,
					'barcode3': this.taipeiWaterConfirm.barcode3,
					'businessType': this.taipeiWaterConfirm.businessType,
					'trnsToken': this.taipeiWaterConfirm.trnsToken,
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
