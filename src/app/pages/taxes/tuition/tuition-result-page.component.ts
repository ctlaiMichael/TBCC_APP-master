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
	selector: 'app-tuition-result-page',
	templateUrl: './tuition-result-page.component.html',
	styleUrls: [],
	providers: [SocialsharingPluginService]
})
export class TuitionResultPageComponent implements OnInit {

	@Input() tuitionResult: any;

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
		let trnsDateTime = this._formateService.transDate(this.tuitionResult.trnsDateTime, 'yyyy/MM/dd');
		let payAmount = AmountUtil.amount(this.tuitionResult.payAmount, 'TWD');
		// Hi, 我已經繳完學費X,XXXX元囉!
		let show_msg = [];
		show_msg.push('Hi, 我已於' + trnsDateTime);
		show_msg.push('繳完學費' + payAmount);
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
