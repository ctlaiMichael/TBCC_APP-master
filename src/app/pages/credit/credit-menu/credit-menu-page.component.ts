/**
 * 授信業務-選單
 */
import { Component, OnInit } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-credit-menu',
	templateUrl: './credit-menu-page.component.html',
	styleUrls: [],
	providers: []
})
export class CreditMenuComponent implements OnInit {

	constructor() { }

	ngOnInit() { }

}
