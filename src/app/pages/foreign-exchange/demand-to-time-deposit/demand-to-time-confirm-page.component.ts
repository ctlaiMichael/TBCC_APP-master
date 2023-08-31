/**
 * 外幣綜活存轉綜定存
 */
import { Component, OnInit, transition, Input, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { CheckSecurityService } from '@shared/transaction-security/check-security/check-security.srevice';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
	selector: 'app-demand-to-time-confirm',
	templateUrl: './demand-to-time-confirm-page.component.html',
	styleUrls: [],
})



export class DemandToTimePageConfirmComponent implements OnInit {
	/**
	 *參數設定
	 */
	@Input() showNextPage;
	@Input() formObj;
	@Output() backPageEmit: EventEmitter<any> = new EventEmitter<any>();
	@Output() backToEdit: EventEmitter<any> = new EventEmitter<any>();  //返回上一頁
	securityObj = {
		'action': 'init',
		'sendInfo': {}
	}
	constructor(
		private _logger: Logger
		, private _checkSecurityService: CheckSecurityService
		, private _headerCtrl: HeaderCtrlService
		, private _authService: AuthService
	) {
		this._headerCtrl.setLeftBtnClick(() => {
			this.cancelEdit();
		});
	}

	ngOnInit() {
		this.securityObj = {
			'action': 'init',
			'sendInfo': this.formObj.SEND_INFO
		}
	}
	//返回至確認頁面
	cancelEdit() {
		this.backToEdit.emit({
			type: 'goEdit',
			value: true
		});
	};

	onNextPage() {
		this.securityObj = {
			'action': 'submit',
			'sendInfo': this.formObj.SEND_INFO
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
					'trnsfrOutAccnt': this.formObj.trnsfrOutAccnt,
					'trnsfrOutCurr': this.formObj.trnsfrOutCurr,
					'transfrTimes': this.formObj.transfrTimes,
					'autoTransCode': this.formObj.autoTransCode,
					'transfrAmount': this.formObj.transfrAmount,
					'businessType': this.formObj.businessType,
					'trnsToken': this.formObj.trnsToken,
					'computeIntrstType': this.formObj.computeIntrstType
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
