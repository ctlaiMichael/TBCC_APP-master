/**
 * 繳納借款本息確認頁
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { AuthService } from '@core/auth/auth.service';


@Component({
	selector: 'app-payment-confirm',
	templateUrl: './payment-confirm-page.component.html',
	styleUrls: [],
})



export class PaymentConfirmPageComponent implements OnInit {
	/**
	 *參數設定
	 */
	@Input() inputView;
	@Input() infodata;
	@Input() data;
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();  //返回上一頁
	ConfirmView = {
		repayTrnsAcnt: '',
		approvalMoney: '',
		repayMoney: '',
		repayMethod: '',
		trnsAcnt: '',
		money: ''
	};
	securityObj = {
		'action': 'init',
		'sendInfo': {}
	}
	constructor(
		private _logger: Logger
		, private _checkSecurityService: CheckSecurityService
		, private _headerCtrl: HeaderCtrlService
		, private confirm: ConfirmService
		, private navgator: NavgatorService
		, private _authService: AuthService
	) {
		// this._logger.step('Financial', 'hi');
	}

	ngOnInit() {
		this.ConfirmView.repayTrnsAcnt = this.data.borrowAccount;
		this.ConfirmView.approvalMoney = this.data.oriBorrowCapital;
		this.ConfirmView.repayMoney = this.data.nowBorrowCapital;
		this.ConfirmView.repayMethod = this.inputView.repayRadio;
		this.ConfirmView.trnsAcnt = this.inputView.trnsAcnt;
		this.ConfirmView.money = this.inputView.money;

		this.securityObj = {
			'action': 'init',
			'sendInfo': this.inputView.SEND_INFO
		}
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	};

	//跳出popup是否返回
	cancelEdit() {
		// this.confirm.show('您是否放棄此次編輯?', {
		//   title: '提醒您'
		// }).then(
		//   () => {
		//     //確定
		//     this.navgator.push('credit');
		//   },
		//   () => {

		//   }
		// );
		this.backToEdit.emit({
			type: 'goEdit',
			value: true
		});
	};
	/**
	 * go
	 *
	 */




	// --------------------------------------------------------------------------------------------
	//  ____       _            _         _____                 _
	//  |  _ \ _ __(_)_   ____ _| |_ ___  | ____|_   _____ _ __ | |_
	//  | |_) | '__| \ \ / / _` | __/ _ \ |  _| \ \ / / _ \ '_ \| __|
	//  |  __/| |  | |\ V / (_| | ||  __/ | |___ \ V /  __/ | | | |_
	//  |_|   |_|  |_| \_/ \__,_|\__\___| |_____| \_/ \___|_| |_|\__|
	// --------------------------------------------------------------------------------------------
	onNextPage() {
		// this.showNextPage = true;
		this.securityObj = {
			'action': 'submit',
			'sendInfo': this.inputView.SEND_INFO
		}
	}
	stepBack(e) {
		if (e.status) {
			if (e.securityType === '3') {
				e.otpObj.depositNumber = ''; // 轉出帳號
				e.otpObj.depositMoney = ''; // 金額
				e.otpObj.OutCurr = ''; // 幣別
				e.transTypeDesc = ''; // 
			} else if (e.securityType === '2') {
				e.signText = {
					'custId': this._authService.getUserInfo().custId,
					// 'newZipCode': this.inputView.USER_ZIPCODE,
					// 'newAddress': this.inputView.USER_ADDRESS,
					// 'newTel': this.inputView.USER_TEL
					'borrowAccount': this.data.borrowAccount,
					'trnsfrOutAccnt': this.inputView.trnsAcnt,
					'trnsfrAmount': this.inputView.money,
					'issueSeq': this.inputView.repayRadio == '2' ? '00' : this.infodata.details.detail[this.inputView.periods].issueSeq,
					'trxType': this.inputView.repayRadio,
					'payType': this.data.payType,
					'businessType': this.infodata.businessType,
					'trnsToken': this.infodata.trnsToken

				};
			};
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
