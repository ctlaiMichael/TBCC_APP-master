/**
 * [模擬]當日匯入匯款明細查詢
 */
import { f2000402_res_01 } from './f2000402-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';



export class F2000402SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    let output_data = PaginatorSimlationUtil.getResponse(f2000402_res_01, paginatedInfo, 'details.detail');
    return output_data;
  }

}
