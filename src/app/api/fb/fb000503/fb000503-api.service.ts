import { Injectable } from '@angular/core';
import { Fb000503Req } from './fb000503-req';
import { ApiBase } from '@base/api/api-base.class';
import { Fb000503Res, BannerDetail } from './fb000503-res';
import { TelegramService } from '@core/telegram/telegram.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Injectable()
export class Fb000503ApiService extends ApiBase<Fb000503Req, Fb000503Res> {

  constructor(
    public telegram: TelegramService<Fb000503Res>,
    public errorHandler: HandleErrorService
  ) {
    super(telegram, errorHandler, 'FB000503');
  }

  getData(data): Promise<BannerDetail[]> {
    return this.send(data).then(
      (resObj) => {
        const returnData = this.modifyTransArray(resObj.body['BannerDetails']['BannerDetail']);
        return Promise.resolve(returnData);
      },
      (errorObj) => {
        return Promise.reject(errorObj);
      }
    );
  }

}
