import { Injectable } from '@angular/core';
import { FN000104ApiService } from '@api/fn/fn000104/fn000104-api.service';
import { FN000105ApiService } from '@api/fn/fn000105/fn000105-api.service';
import { Logger } from '@core/system/logger/logger.service';

@Injectable()
export class NocardRecordService {

  constructor(
    private _fn000104: FN000104ApiService,
    private _fn000105: FN000105ApiService,
    private _logger: Logger) { }

  // 取得 預約紀錄清單
  getDatas(page?: number, sort?: Array<any>, option?: Object, pageSize?: string | number): Promise<any> {
    return this._fn000105.getPageData(page, sort, pageSize).then(
      (S) => {
        return Promise.resolve(S);
      },
      (F) => {
        return Promise.reject(F);
      }
    );
  }

  // 取消預約交易
  cancelTrns(trnsData, trnsToken): Promise<any> {
    return this._fn000104.cancelTrns(trnsData, trnsToken).then(
      (S) => {
        return Promise.resolve(S);
      },
      (F) => {
        return Promise.reject(F);
      }
    );
  }
}
