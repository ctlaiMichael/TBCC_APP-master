/**
 * Header
 */
import { Component, OnInit, Input } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { FormateService } from '@shared/formate/formate.service';
import { AccountMaskUtil } from '@shared/util/formate/mask/account-mask-util';
import { AmountUtil } from '@shared/util/formate/number/amount-util';

@Component({
	selector: 'app-current-to-fixed-result-page',
	templateUrl: './current-to-fixed-result-page.component.html',
	styleUrls: [],
})
export class CurrentToFixedResultPageComponent implements OnInit {

	@Input() currentFixedResultData: any;

	constructor(
		private navgator: NavgatorService,
		private _headerCtrl: HeaderCtrlService,
		private _formateService: FormateService,
	) { }

	ngOnInit() {
		this._headerCtrl.updateOption({
			'leftBtnIcon': 'menu',
			'title': '交易結果'
		});
		console.log(this.currentFixedResultData);
	}

	goMenu() {
		this.navgator.push('transfer', {});
	}
}
