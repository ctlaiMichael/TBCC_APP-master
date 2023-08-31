/**
 * [模擬]外幣帳戶查詢
 */
import { fb000706_res_01 } from './fb000706-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FB000706SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    let output_data = PaginatorSimlationUtil.getResponse(fb000706_res_01, paginatedInfo, 'details.detail');
    return output_data;
  }

}
