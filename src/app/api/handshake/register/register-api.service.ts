import { Injectable } from '@angular/core';
import { RegisterReqBody } from './register-req';
import { RegisterResBody } from './register-res';
import { HandshakeTelegramService } from '@core/telegram/handshake-telegram.service';
import { HandshakeApiBase } from '@base/api/handshake-api-base.class';

@Injectable()
export class RegisterApiService extends HandshakeApiBase<RegisterReqBody, RegisterResBody> {

  constructor(public telegram: HandshakeTelegramService<RegisterResBody>) {
    super(telegram);
  }

}
