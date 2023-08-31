/**
 * Header
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';
import { DateUtil } from '@shared/util/formate/date/date-util';
import { Logger } from '@core/system/logger/logger.service';
import { FormateService } from '@shared/formate/formate.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
	selector: 'app-twd-transfer-confirm-page',
	templateUrl: './twd-transfer-confirm-page.component.html',
	styleUrls: [],
	providers: []
})
export class TwdTransferConfirmPageComponent implements OnInit {

	@Input() twdTransferConfirm;
	@Input() currentTimeData;            // 拿到當下時間
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();  // 確認頁即將送往電文
	@Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();    // 返回編輯頁

	allTransferData = {
		trnsfrOutAccnt: '',        // 轉出帳號
		trnsfrAmount: '',          // 轉帳金額
		trnsfrInBankName: '',      // 轉入行庫
		trnsfrInAccnt: '',         // 轉入帳號
		trnsfrType: '',            // 轉帳方式
		trnsfrDate: '',            // 轉帳日期
		notePayer: '',             // 付款人自我備註
		notePayee: ''              // 給收款人訊息
	};

	trnsfrInBankCode = '';         // 轉入行庫代碼
	trnsfrInAccntPipeChange :Boolean = false;  // 轉入帳號本行做pipe

	// 安控機制
	securityObj = {
		'action': 'init',
		'sendInfo': {}
	}
	constructor(
        private _logger: Logger,
		private _checkSecurityService: CheckSecurityService,
		private _headerCtrl: HeaderCtrlService,
		private _authService: AuthService,
		private _handleError: HandleErrorService,
		private _formateService: FormateService
	) {
	}

	ngOnInit() {
		this.securityObj = {
			'action': 'init',
			'sendInfo': this.twdTransferConfirm.SEND_INFO
		}
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'back'
		});
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});

		/** 轉入帳號為本行行時進行pipe */
		this.trnsfrInBankCode = this.twdTransferConfirm.trnsfrInBank.substring(0,3);
		if(this.trnsfrInBankCode == '006'){
			this.trnsfrInAccntPipeChange = true ;
		}else{
			this.trnsfrInAccntPipeChange = false ;
		}
		/**----------------------- */

		if (this.twdTransferConfirm.trnsfrDate == this.currentTimeData) {
			this.allTransferData.trnsfrType = '即時轉帳';
		} else {
			this.allTransferData.trnsfrType = '預約轉帳';
		}
	}

	// 跳出popup是否返回
	cancelEdit() {
		this.backToEdit.emit({
			type: 'goEdit',
			value: true
		});
	}

	/**
	 * 資料送出＋安控執行
	 * userTrnsInSetType: 1,2 約定; 3 非約
	 * userSecurity: 1 SSL; 2 憑證; 3 OTP
	 */
	finalCheck() {
		let check_allow = true;
		let error_msg = {
			type: 'dialog',
			title: 'ERROR.INFO_TITLE',
			content: ''
		};
		// 檢查可進行交易
		let userInfo = this._authService.getUserInfo();
		let userTrnsInSetType = this._formateService.checkField(this.twdTransferConfirm, 'trnsInSetType');
		let userSecurity = '';
		let isNAAcct = this._formateService.checkField(userInfo, 'isNAAcct');
		if (!!this.twdTransferConfirm && typeof this.twdTransferConfirm.SEND_INFO == 'object') {
			userSecurity = this._formateService.checkField(this.twdTransferConfirm.SEND_INFO , 'securityType');
		}
		if (userTrnsInSetType == '' || userSecurity == '') {
			check_allow = false;
			error_msg.content = '資料檢查錯誤，請再次檢核您的資料是否填寫正確！';
		} else if (userTrnsInSetType != '3' && userSecurity == '3') {
			// 約定禁止使用OTP
			check_allow = false;
			error_msg.content = '約定轉帳須使用「SSL」或「憑證」轉帳機制始得進行交易，請重新確認與選擇您的轉帳機制。';
		} else if (userTrnsInSetType == '3') {
			if (isNAAcct != '1') {
				check_allow = false;
				// 您未開啟非約定交易功能，請洽本行營業單位辦理。
				error_msg.content = 'TRANS_SECURITY.ERROR.558';
			} else if (userSecurity == '1') {
				// 非約定禁止使用SSL
				check_allow = false;
				error_msg.content = '約定轉帳須使用「憑證」或「OTP」轉帳機制始得進行交易，請重新確認與選擇您的轉帳機制。';
			}
		}
		if (check_allow) {
			this.securityObj = {
				'action': 'submit',
				'sendInfo': this.twdTransferConfirm.SEND_INFO
			};
		} else {
			this._handleError.handleError(error_msg).then(
				() => {
					this.cancelEdit();
				}
			);
		}
	}
	
	stepBack(e) {
		if (e.status) {
			// OTP須帶入的欄位
			if (e.securityType === '3') {
				e.otpObj.depositNumber = (this.twdTransferConfirm.trnsfrInAccnt).replace(/-/g,''); // 轉出帳號
				e.otpObj.depositMoney = this.twdTransferConfirm.trnsfrAmount; // 金額
				e.otpObj.OutCurr = 'TWD'; // 幣別
				e.transTypeDesc = ''; // 
			} else if (e.securityType === '2') {
				
				// 憑證須帶入的欄位，並依即時或預約發不同電文
				if (e.serviceId == 'f4000102') {
					// 即時
					e.signText = {
						'custId': this._authService.getUserInfo().custId,
						'trnsfrOutAccnt': (this.twdTransferConfirm.trnsfrOutAccnt).replace(/-/g, ''),
						'trnsfrInBank': this.twdTransferConfirm.trnsfrInBank.slice(0, 3),
						'trnsfrInAccnt': this.twdTransferConfirm.trnsfrInAccnt,
						'trnsInSetType': this.twdTransferConfirm.trnsInSetType,
						'trnsfrAmount': this.twdTransferConfirm.trnsfrAmount,
						'notePayer': this.twdTransferConfirm.notePayer,
						'notePayee': this.twdTransferConfirm.notePayee,
						'businessType': this.twdTransferConfirm.businessType,
						'trnsToken': this.twdTransferConfirm.trnsToken
					};
					this._logger.error('即時憑證送出內容',e.signText);
				} else {
					// 預約 f4000401
					e.signText = {
						'custId': this._authService.getUserInfo().custId,
						'trnsfrDate': DateUtil.transDate(this.twdTransferConfirm.trnsfrDate, ['yyyMMdd', 'chinaYear']),
						'trnsfrOutAccnt': (this.twdTransferConfirm.trnsfrOutAccnt).replace(/-/g, ''),
						'trnsfrInBank': this.twdTransferConfirm.trnsfrInBank.slice(0, 3),
						'trnsfrInAccnt': this.twdTransferConfirm.trnsfrInAccnt,
						'trnsInSetType': this.twdTransferConfirm.trnsInSetType,
						'trnsfrAmount': this.twdTransferConfirm.trnsfrAmount,
						'notePayer': this.twdTransferConfirm.notePayer,
						'notePayee': this.twdTransferConfirm.notePayee,
						'businessType': this.twdTransferConfirm.businessType,
						'trnsToken': this.twdTransferConfirm.trnsToken
					};
					this._logger.error('預約憑證送出內容',e.signText);
				}
				
			}
			// 統一叫service 做加密
			this._checkSecurityService.doSecurityNextStep(e).then(
				(S) => {
					// 把S做為output傳回
					this.backPageEmit.emit({
						type: 'goResult',
						value: true,
						serviceId: e.serviceId,
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
