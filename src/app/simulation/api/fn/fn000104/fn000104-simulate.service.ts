import { fn000104_res_01 } from './fn000104-res-01';
import { fn000104_res_02 } from './fn000104-res-02';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FN000104SimulateService implements SimulationApi{
  getResponse(reqObj) {
    if ( !!reqObj && reqObj.recType == 'A') {
      return fn000104_res_01;
    } else {
      return fn000104_res_02;
    }
  }

  constructor() { }

}
