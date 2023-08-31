/**
 * [模擬]信託業務推介查詢
 */
import { SimulationApi } from '@api-simulation/simulation-api';
import { fi000607_res_01 } from './fi000607-res-01';
import { fi000607_res_02 } from './fi000607-res-02';
import { fi000607_res_03 } from './fi000607-res-03';
import { PaginatorSimlationUtil } from '@api-simulation/util/paginator-simulation-util';

export class FI000607SimulateService implements SimulationApi {

  public getResponse(reqObj) {
    return fi000607_res_01;
  }

}
