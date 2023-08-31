/**
 * [模擬]基金庫存總覽
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000304_res_01 } from './fi000304-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000304SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000304_res_01;
  }

}
