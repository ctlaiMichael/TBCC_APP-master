/**
 * [模擬]最新消息列表
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fb000501_res_01 } from './fb000501-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FB000501SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    const paginatedInfo = PaginatorSimlationUtil.getPaginatedInfo(reqObj);
    let output_data = PaginatorSimlationUtil.getResponse(fb000501_res_01, paginatedInfo, 'details.detail');
    return output_data;
  }

}
