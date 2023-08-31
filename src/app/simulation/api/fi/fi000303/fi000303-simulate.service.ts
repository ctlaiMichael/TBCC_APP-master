/**
 * [模擬]基金庫存總覽
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000303_res_01 } from './fi000303-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000303SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000303_res_01;
  }

}
