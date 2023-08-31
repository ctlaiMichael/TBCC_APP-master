import { fh000302_res_01 } from './fh000302-res-01';
import { fh000302_res_02 } from './fh000302-res-01';
import { fh000302_res_03 } from './fh000302-res-01';
import { fh000302_res_04 } from './fh000302-res-01';
import { fh000302_res_05 } from './fh000302-res-01';
import { fh000302_res_06 } from './fh000302-res-01';
import { fh000302_res_07 } from './fh000302-res-01';
import { fh000302_res_08 } from './fh000302-res-01';
import { fh000302_res_09 } from './fh000302-res-01';
import { fh000302_res_10 } from './fh000302-res-01';
import { fh000302_res_11 } from './fh000302-res-01';
import { fh000302_res_12 } from './fh000302-res-01';
import { fh000302_res_13 } from './fh000302-res-01';
import { fh000302_res_14 } from './fh000302-res-01';
import { fh000302_res_15 } from './fh000302-res-01';
import { fh000302_res_16 } from './fh000302-res-01';
import { fh000302_res_17 } from './fh000302-res-01';
import { fh000302_res_18 } from './fh000302-res-01';
import { fh000302_res_19 } from './fh000302-res-01';
import { fh000302_res_20 } from './fh000302-res-01';
import { fh000302_res_21 } from './fh000302-res-01';
import { fh000302_res_22 } from './fh000302-res-01';
import { fh000302_res_23 } from './fh000302-res-01';
import { fh000302_res_24 } from './fh000302-res-01';
import { fh000302_res_25 } from './fh000302-res-01';
import { SimulationApi } from '@api-simulation/simulation-api';

export class FH000302SimulateService implements SimulationApi {
  /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
  public getResponse(reqObj) {
    if (reqObj.hasOwnProperty("hospitalId") && reqObj.hasOwnProperty("branchId")) {
        //判斷台大(分院)
        if (reqObj['hospitalId'] == "NTUH") {
          if (reqObj['branchId'] == "Y0") {
            return fh000302_res_01;
          }
          else if (reqObj['branchId'] == "T0") {
            return fh000302_res_02;
          }
        }
        //判斷長庚(分院)
        if (reqObj['hospitalId'] == "CGMH") {
          if (reqObj['branchId'] == "3") {
            return fh000302_res_03;
          }
          else if (reqObj['branchId'] == "1") {
            return fh000302_res_04;
          }
          else if (reqObj['branchId'] == "2") {
            return fh000302_res_05;
          }
          else if (reqObj['branchId'] == "5") {
            return fh000302_res_06;
          }
          else if (reqObj['branchId'] == "M") {
            return fh000302_res_07;
          }
          else if (reqObj['branchId'] == "6") {
            return fh000302_res_08;
          }
          else if (reqObj['branchId'] == "8") {
            return fh000302_res_09;
          }
          else if (reqObj['branchId'] == "T") {
            return fh000302_res_10;
          }
          else if (reqObj['branchId'] == "E") {
            return fh000302_res_11;
          }
          else if (reqObj['branchId'] == "B") {
            return fh000302_res_12;
          }
        }
        //台北榮民
        if (reqObj['hospitalId'] == "VGHTP") {
          return fh000302_res_13;
        }
        //三總松山
        if (reqObj['hospitalId'] == "TSGH") {
          return fh000302_res_14;
        }
        //光田綜合
        if (reqObj['hospitalId'] == "KTGH") {
          return fh000302_res_15;
        }
        //亞東紀念
        if (reqObj['hospitalId'] == "FEMH") {
          return fh000302_res_16;
        }
        //羅東博愛
        if (reqObj['hospitalId'] == "POHAI") {
          return fh000302_res_17;
        }
        //童綜合
        if (reqObj['hospitalId'] == "TUNG") {
          return fh000302_res_18;
        }
        //彰基
        if (reqObj['hospitalId'] == "CCH") {
          return fh000302_res_19;
        }
        //仁愛
        if (reqObj['hospitalId'] == "JAH") {
          return fh000302_res_20;
        }

        //旺旺
        if (reqObj['hospitalId'] == "WWU") {
          return fh000302_res_21;
        }
        //合庫
        else if (reqObj['hospitalId'] == "TCBL") {
          return fh000302_res_22;
        }
        //新安東京海上
        else if (reqObj['hospitalId'] == "TMNN") {
          return fh000302_res_23;
        }
        //台灣產物保險
        else if (reqObj['hospitalId'] == "TFMI") {
          return fh000302_res_24;
        }
        //第一產險
        else if (reqObj['hospitalId'] == "FSTIS") {
          return fh000302_res_25;
        }
    }
  }

}

