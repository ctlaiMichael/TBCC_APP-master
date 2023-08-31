/**
 * [模擬]外幣帳戶查詢
 */
import { fb000707_res_01 } from './fb000707-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FB000707SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    let output_data = PaginatorSimlationUtil.getResponse(fb000707_res_01, 'result');
    return output_data;
  }

}
