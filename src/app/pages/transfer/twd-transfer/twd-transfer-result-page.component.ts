/**
 * Header
 */
import { Component, OnInit, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';
import { FormateService } from '@shared/formate/formate.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';

@Component({
	selector: 'app-twd-transfer-result-page',
	templateUrl: './twd-transfer-result-page.component.html',
	styleUrls: [],
	providers: [SocialsharingPluginService]
})
export class TwdTransferResultPageComponent implements OnInit {

	@Input() allTransferData: any;
	@Input() twdTransferResult: any;

	trnsfrInBankCode = '';         // 轉入行庫代碼
	trnsfrInAccntPipeChange :Boolean = false;  // 轉入帳號本行做pipe


	constructor(
		private navgator: NavgatorService,
		private _headerCtrl: HeaderCtrlService,
		private _formateService:FormateService,
		private socialShare: SocialsharingPluginService
		) { }

	ngOnInit() {
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'menu',
			'title': 'FUNC_SUB.TRANSFER.TWD',
			'style': 'result'
		});

		this.trnsfrInBankCode = this.twdTransferResult.trnsfrInBank;
		if(this.trnsfrInBankCode == '006'){
			this.trnsfrInAccntPipeChange = true ;
		}else{
			this.trnsfrInAccntPipeChange = false ;
		}

	}
	socialSharing1() {
		let trnsfrOutAcct = AccountMaskUtil.socailSharingAccntFormat(this.twdTransferResult.trnsfrOutAccnt);   // 轉出帳號
		let trnsfrAmount = AmountUtil.amount(this.twdTransferResult.trnsfrAmount, 'TWD');
		let params = {
            result: 'Ｈi,新春發大財，我用合庫APP送您紅包' + trnsfrAmount + '元(轉出帳號末五碼' + trnsfrOutAcct + ')祝您新的一年有～“鼠”不盡的財富！“鼠”不盡的幸福！'
        };
		this.navgator.push('qrcodeRed', params);
	}

	socialSharing() {
		let trnsfrAmount = AmountUtil.amount(this.twdTransferResult.trnsfrAmount,'TWD');
		let trnsfrOutAccnt = AccountMaskUtil.socailSharingAccntFormat(this.twdTransferResult.trnsfrOutAccnt);
		let trnsfrDate = this.twdTransferResult.trnsfrDate;
		let trnsfrDate_current = this.allTransferData.trnsfrDate;
		// Hi, 我已轉帳新台幣$1元給你了(帳號末五碼99999), 請看看有沒有收到喔! 
		// Hi, 我預計11/11轉帳新台幣$1元給你(帳號末五碼99999), 到時請看看有沒有收到喔!
		let show_msg = [];
		if (this.twdTransferResult.recordDate) {
			show_msg.push('Hi, 我已於'+this._formateService.transDate(trnsfrDate_current, 'yyyy/MM/dd'));
			show_msg.push('轉帳新台幣$'+trnsfrAmount);
			show_msg.push('元給你了(帳號末五碼' + trnsfrOutAccnt + '), 請看看有沒有收到喔!');
		} else if (this.twdTransferResult.trnsfrDate) {
			show_msg.push('Hi, 我預計');
			show_msg.push(this._formateService.transDate(trnsfrDate, 'yyyy/MM/dd'));
			show_msg.push('轉帳新台幣$');
			show_msg.push(trnsfrAmount);
			show_msg.push('元給你(帳號末五碼' + trnsfrOutAccnt + '), 到時請看看有沒有收到喔!');
		}

		this.socialShare.shareMsg({
			subject: '',
			message: show_msg.join('')
		}).then(
			(success) => {
				// success
			},
			(error) => {
				// error
			}
		);

	}

	accountView() {
		this.navgator.push('deposit-overview');
	}

}
