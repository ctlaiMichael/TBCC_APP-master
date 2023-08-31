
/**
 * [模擬]台幣帳戶查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { f2000101_res_01 } from './f2000101-res-01';
import { f2000101_res_real } from './f2000101-res-real';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class F2000101SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    // let output_data = PaginatorSimlationUtil.getResponse(f2000101_res_real, paginatedInfo, 'details.detail'); // 實際api測試
    let output_data = PaginatorSimlationUtil.getResponse(f2000101_res_01, paginatedInfo, 'details.detail');
    return output_data;
  }

}
