import { Injectable } from '@angular/core';
import { f100_0_res_02 } from './f1000103-res-02';

@Injectable()
export class F1000103SimulateService {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    // return { status: 200, body: { 'hello': 'world' } };
    return f100_0_res_02;
  }

}
