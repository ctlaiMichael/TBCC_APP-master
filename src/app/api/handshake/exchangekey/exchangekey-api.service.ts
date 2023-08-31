import { Injectable } from '@angular/core';
import { ExchangekeyReqBody } from './exchangekey-req';
import { ExchangekeyResBody } from './exchangekey-res';
import { HandshakeTelegramService } from '@core/telegram/handshake-telegram.service';
import { HandshakeApiBase } from '@base/api/handshake-api-base.class';

@Injectable()
export class ExchangekeyApiService extends HandshakeApiBase<ExchangekeyReqBody, ExchangekeyResBody> {

  constructor(public telegram: HandshakeTelegramService<ExchangekeyResBody>) {
    super(telegram);
  }

}
