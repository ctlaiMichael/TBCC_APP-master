/**
 * [模擬]停損獲利點通知
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000605_res_01 } from './fi000605-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000605SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);


    const output_data = PaginatorSimlationUtil.getResponse(fi000605_res_01, paginatedInfo, 'details.detail');
    return output_data;
  }

}
