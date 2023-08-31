/**
 * [模擬]已實現損益明細
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000202_res_01 } from './fi000202-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000202SimulateService implements SimulationApi {

  public getResponse(reqObj) {
      return fi000202_res_01;
  }

}
