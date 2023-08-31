/**
 * Header
 */
import { Component, OnInit, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { SocialsharingPluginService } from '@lib/plugins/socialsharing/socialsharing-plugin.service';
import { AmountUtil } from '@shared/util/formate/number/amount-util';
import { FormateService } from '@shared/formate/formate.service';


@Component({
	selector: 'app-taxes-detail-result-page',
	templateUrl: './taxes-detail-result-page.component.html',
	styleUrls: [],
	providers: [SocialsharingPluginService]
})
export class TaxesDetailResultPageComponent implements OnInit {

	@Input() taxesResult: any;
	@Input() taxesData: any;

	constructor(
		private navgator: NavgatorService,
		private _headerCtrl: HeaderCtrlService,
		private socialShare: SocialsharingPluginService,
		private _formateService: FormateService) { }

	ngOnInit() {
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'menu',
			'title': '交易結果',
			'style': 'result'
		});
	}
	socialSharing() {
		let trnsfrAmount = AmountUtil.amount(this.taxesResult.trnsfrAmount, 'TWD');
		let trnsDateTime = this._formateService.transDate(this.taxesResult.trnsDateTime, 'yyyy/MM/dd');
		// Hi, 我已經繳完XXX費X,XXXX元囉!
		let show_msg = [];
		show_msg.push('Hi, 我已於' + trnsDateTime);
		show_msg.push('繳完' + this.taxesData.taxName);
		// 繳交汽機車燃料使用費時會多一個'費'字，故加入判斷。
		if ('16' != this.taxesData.taxId) {
			show_msg.push('費');
		}
		show_msg.push(trnsfrAmount);
		show_msg.push('元囉!');

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
		this.navgator.push('home');
	}

}
