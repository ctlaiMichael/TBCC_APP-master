
/**
 * [模擬]台幣活存支存明細查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { f2100101_res_01 } from './f2100101-res-01';
import { simulation_res_error } from './f2100101-res-error';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class F2100101SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    let output_data = PaginatorSimlationUtil.getResponse(f2100101_res_01, paginatedInfo, 'details.detail');

    // output_data = simulation_res_error;
    return output_data;
  }

}
