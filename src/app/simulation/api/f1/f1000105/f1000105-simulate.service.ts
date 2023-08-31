import { Injectable } from '@angular/core';
import { f1000105_res_01 } from './f1000105-res-01'

@Injectable()
export class F1000105SimulateService {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return f1000105_res_01;
  }

}
