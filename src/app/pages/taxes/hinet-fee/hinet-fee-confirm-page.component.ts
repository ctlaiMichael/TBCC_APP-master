/**
 * Header
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { FormateService } from '@shared/formate/formate.service';

@Component({
	selector: 'app-hinet-fee-confirm-page',
	templateUrl: './hinet-fee-confirm-page.component.html',
	styleUrls: [],
	providers: []
})
export class HinetFeeConfirmPageComponent implements OnInit {

	@Input() hinetFeeConfirm;        // 列表頁所選全部資料
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
		private _authService: AuthService,
		private _formateService: FormateService) {
	}

	ngOnInit() {
		this.securityObj = {
			'action': 'init',
			'sendInfo': this.hinetFeeConfirm.SEND_INFO
		}
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'back'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		}); 
		//------ 20191029 Boy 進行資料檢查-----//
		this.hinetFeeConfirm.customerId = this._formateService.checkField(this.hinetFeeConfirm,'customerId');
		this.hinetFeeConfirm.areaBranchNo = this._formateService.checkField(this.hinetFeeConfirm,'areaBranchNo');
		this.hinetFeeConfirm.phone = this._formateService.checkField(this.hinetFeeConfirm,'phone');
		this.hinetFeeConfirm.authCode = this._formateService.checkField(this.hinetFeeConfirm,'authCode');
		this.hinetFeeConfirm.billDt = this._formateService.checkField(this.hinetFeeConfirm,'billDt');
		this.hinetFeeConfirm.billType = this._formateService.checkField(this.hinetFeeConfirm,'billType');
		this.hinetFeeConfirm.accountType = this._formateService.checkField(this.hinetFeeConfirm,'accountType');
		this.hinetFeeConfirm.payableAmount = this._formateService.checkField(this.hinetFeeConfirm,'payableAmount');
		this.hinetFeeConfirm.checkCode = this._formateService.checkField(this.hinetFeeConfirm,'checkCode');
		this.hinetFeeConfirm.dueDt = this._formateService.checkField(this.hinetFeeConfirm,'dueDt');
		//----------------------------------//
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
			'sendInfo': this.hinetFeeConfirm.SEND_INFO
		}

	}

	stepBack(e) {
		if (e.status) {
			// OTP須帶入的欄位
			if (e.securityType === '3') {
				e.otpObj.depositNumber = (this.hinetFeeConfirm.trnsfrOutAccnt).replace(/-/g,''); // 轉出帳號
				e.otpObj.depositMoney = this.hinetFeeConfirm.payableAmount; // 金額
				e.otpObj.OutCurr = 'TWD'; // 幣別
				e.transTypeDesc = ''; // 
			} else if (e.securityType === '2') {
				// 憑證須帶入的欄位

				e.signText = {
					'custId': this._authService.getUserInfo().custId,
					'customerId': this.hinetFeeConfirm.customerId,
					'areaBranchNo': this.hinetFeeConfirm.areaBranchNo,
					'phone': this.hinetFeeConfirm.phone,
					'authCode': this.hinetFeeConfirm.authCode,
					'billDt': this.hinetFeeConfirm.billDt,
					'billType': this.hinetFeeConfirm.billType,
					'accountType': this.hinetFeeConfirm.accountType,
					'payableAmount': this.hinetFeeConfirm.payableAmount,
					'checkCode': this.hinetFeeConfirm.checkCode,
					'dueDt': this.hinetFeeConfirm.dueDt,
					'trnsfrOutAccnt': (this.hinetFeeConfirm.trnsfrOutAccnt).replace(/-/g,''),
					'trnsToken': this.hinetFeeConfirm.trnsToken,
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
