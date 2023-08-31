
import { f9000101_res_01 } from './f9000101-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class F9000101SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
      const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
      let output_data = PaginatorSimlationUtil.getResponse(f9000101_res_01, paginatedInfo, 'details.detail');
      return output_data;
  }

}
