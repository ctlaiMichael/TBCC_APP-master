/**
 * Header
 * P1000001-已讀訊息
 *     
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { P1000001ReqBody } from './p1000001-req';
import { P1000001ResBody } from './p1000001-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';


@Injectable()
export class P1000001ApiService extends ApiBase<P1000001ReqBody, P1000001ResBody> {
	constructor(
		public telegram: TelegramService<P1000001ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService) {
		super(telegram, errorHandler, 'P1000001');
	}
}
