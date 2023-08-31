import { fn000105_res_01 } from './fn000105-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FN000105SimulateService implements SimulationApi{
  getResponse(reqObj) {
    return fn000105_res_01;
  }

  constructor() { }

}
