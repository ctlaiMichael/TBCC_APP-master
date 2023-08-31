import { Injectable } from '@angular/core';
import { HandshakeReqBody } from './handshake-req';
import { HandshakeResBody } from './handshake-res';
import { HandshakeTelegramService } from '@core/telegram/handshake-telegram.service';
import { HandshakeApiBase } from '@base/api/handshake-api-base.class';

@Injectable()
export class HandshakeApiService extends HandshakeApiBase<HandshakeReqBody, HandshakeResBody> {

  constructor(public telegram: HandshakeTelegramService<HandshakeResBody>) {
    super(telegram);
  }

}
