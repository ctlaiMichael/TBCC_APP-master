/**
 * [模擬]當日匯入匯款列表查詢
 */
import { f2000401_res_01 } from './f2000401-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';


export class F2000401SimulateService implements SimulationApi {

  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    let output_data = PaginatorSimlationUtil.getResponse(f2000401_res_01, paginatedInfo, 'details.detail');
    return output_data;
  }

}
