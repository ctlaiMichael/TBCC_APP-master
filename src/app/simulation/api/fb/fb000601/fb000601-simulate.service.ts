import { Injectable } from '@angular/core';
import { SimulationApi } from '@api-simulation/simulation-api';
import { fb000601_res_01 } from './fb000601-res-01';

export class FB000601SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  getResponse(req: any, header?: any) {
    return fb000601_res_01;
  }
}
