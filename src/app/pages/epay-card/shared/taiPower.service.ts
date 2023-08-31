import { Injectable } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { FQ000501ApiService } from "@api/fq/fq000501/fq000501-api.service";
import { FQ000502ApiService } from "@api/fq/fq000502/fq000502-api.service";


@Injectable()
export class TaiPowerService {
  constructor(
    private _logger: Logger,
    private FQ000501: FQ000501ApiService,
    private FQ000502: FQ000502ApiService
  ) { }

  /**
     * 取得FQ000501之電文
     * 
     */
  getTaiPowerFeeUrl(obj): Promise<any> {
    return this.FQ000501.getData(obj).then(
      (output) => {

        return Promise.resolve(output);
      },
      (error_obj) => {

        return Promise.reject(error_obj);
      }
    );
  }

  /**
   * 
   * @param date ex:10809 -> 108年09月
   */
  public trnsDate(date: string) {
    return date.substr(0, 3) + '年' + date.substr(3) + '月';
  }
}
