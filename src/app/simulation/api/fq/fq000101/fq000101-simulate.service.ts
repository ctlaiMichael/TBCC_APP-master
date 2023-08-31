import { fq000101_res_01 } from './fq000101-res-01';
import { fq000101_res_02 } from './fq000101-res-02';
import { SimulationApi } from '@api-simulation/simulation-api';
import { IfStmt } from '@angular/compiler';

export class FQ000101SimulateService implements SimulationApi {
  static count: number = 0;
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    return fq000101_res_01;
    // FQ000101SimulateService.count++;
    // if (FQ000101SimulateService.count == 1) {
    //   return fq000101_res_01;
    // } else {
    //   return fq000101_res_02;
    // }
  }
}
