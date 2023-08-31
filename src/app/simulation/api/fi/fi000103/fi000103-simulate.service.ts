/**
 * [模擬]基金庫存總覽
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000103_res_01 } from './fi000103-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000103SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000103_res_01;
  }

}
