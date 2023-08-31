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
	selector: 'app-electricity-result-page',
	templateUrl: './electricity-result-page.component.html',
	styleUrls: [],
	providers: [SocialsharingPluginService]
})
export class ElectricityResultPageComponent implements OnInit {

	@Input() electricityResult: any;


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
		let trnsDateTime = this._formateService.transDate(this.electricityResult.trnsDateTime, 'yyyy/MM/dd');
		let trnsfrAmount = AmountUtil.amount(this.electricityResult.trnsfrAmount, 'TWD');
		// Hi, 我已經繳完電費X,XXXX元囉!
		let show_msg = [];
		show_msg.push('Hi, 我已於' + trnsDateTime);
		show_msg.push('繳完電費' + trnsfrAmount);
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
