/**
 * Header
 * P1000001-已讀訊息
 *     
 */
import { Injectable } from '@angular/core';
import { TelegramService } from '@core/telegram/telegram.service';
import { ApiBase } from '@base/api/api-base.class';
import { P1000002ReqBody } from './p1000002-req';
import { P1000002ResBody } from './p1000002-res';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { AuthService } from '@core/auth/auth.service';


@Injectable()
export class P1000002ApiService extends ApiBase<P1000002ReqBody, P1000002ResBody> {
	constructor(
		public telegram: TelegramService<P1000002ResBody>,
		public errorHandler: HandleErrorService,
		public authService: AuthService) {
		super(telegram, errorHandler, 'P1000002');
	}

	send(reqObj: P1000002ReqBody): Promise<any> {
		return super.send(reqObj).then(res => {
			return !!res.body ? res.body : res;
		})
	}
}
