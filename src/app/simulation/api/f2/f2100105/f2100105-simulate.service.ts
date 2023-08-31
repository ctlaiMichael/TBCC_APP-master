
/**
 * [模擬]台幣粽存明細查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { f2100105_res_01 } from './f2100105-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class F2100105SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    let output_data = PaginatorSimlationUtil.getResponse(f2100105_res_01, paginatedInfo, 'details.detail');
    return output_data;
  }

}
