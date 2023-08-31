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
	selector: 'app-labor-health-national-result-page',
	templateUrl: './labor-health-national-result-page.component.html',
	styleUrls: [],
	providers: [SocialsharingPluginService]
})
export class LaborHealthNationalResultPageComponent implements OnInit {

	@Input() type_name: any;   // 取得使用者選擇何種費用(健保/勞保/國民年金)
	@Input() laborHealthNationalResult: any;

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
		let trnsDateTime = this._formateService.transDate(this.laborHealthNationalResult.trnsDateTime, 'yyyy/MM/dd');
		let trnsfrAmount = AmountUtil.amount(this.laborHealthNationalResult.trnsfrAmount, 'TWD');
		// Hi, 我已經繳完健保/勞保/國民年金費X,XXXX元囉!
		let show_msg = [];
		show_msg.push('Hi, 我已於' + trnsDateTime + '繳完');
		if (this.type_name == 'labor') {
			show_msg.push('勞保費');
		} else if (this.type_name == 'national') {
			show_msg.push('國民年金費');
		} else if (this.type_name == 'health') {
			show_msg.push('健保費');
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
