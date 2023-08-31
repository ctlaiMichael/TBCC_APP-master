/**
 * [模擬]變更現金收益存入帳號
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000712_res_01 } from './fi000712-res-01';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000712SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return fi000712_res_01;
  }

}
