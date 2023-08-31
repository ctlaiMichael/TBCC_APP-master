/**
 * 信託對帳單查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000707_res_01 } from './fi000707-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000707SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return fi000707_res_01;
  }

}
