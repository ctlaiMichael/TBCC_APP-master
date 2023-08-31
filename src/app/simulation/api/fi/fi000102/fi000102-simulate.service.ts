/**
 * [模擬]基金庫存總覽
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000102_res_01 } from './fi000102-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000102SimulateService implements SimulationApi {

  public getResponse(reqObj) {


    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    // let output_data = PaginatorSimlationUtil.getResponse(f2000101_res_real, paginatedInfo, 'details.detail'); // 實際api測試
    let output_data = PaginatorSimlationUtil.getResponse(fi000102_res_01, paginatedInfo, 'details.detail');
    return output_data;
  }

}
