/**
 * [模擬]外幣帳戶查詢
 */
import { f2000201_res_01 } from './f2000201-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class F2000201SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    let output_data = PaginatorSimlationUtil.getResponse(f2000201_res_01, paginatedInfo, 'details.detail');
    return output_data;
  }

}
