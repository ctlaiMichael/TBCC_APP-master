# Simulation使用說明

## 加入模擬電文機制方式
- 在core.module.ts中import SimulationModule
- 依實際判斷serviceId方式調整simulation.service
- 在simulations目錄中加入對應模擬電文並加入index.ts


## 目錄結構

注意事項：
* 依照API編號進行歸類，每一個API有一個專屬自己資料夾
* 檔案命名請以全小寫為主
* 請建立檔案
    * xxxxxxxx-simulation.service.ts
    * xxxxxxxx-req-01.ts (依照需求追加01~99)
* index.ts請追加
    * 每個目錄下都有個index.ts，請把新加的檔案放入
* 請搭配 app/api

### 資料夾層級
FX000101 API:

fx
-
├─ index.ts

└─ fx000101


fx000101
-
├─ fx000101-simulation.service.ts

└─ fx000101-res-01.ts (依照需求追加)



---

# 各檔案內容

## index.ts


    // ---------------------- import Start ---------------------- //
    import { FX000101SimulateService } from './fx000101/fx000101-simulate.service';

    // ---------------------- import End ---------------------- //

    // ---------------------- export Start ---------------------- //
    export {
        // ----- 功能名稱: ----- //
        FX000101SimulateService
    };

### export Simulation Class
import Simulation Class，且 export


## xxxxxxxx-res-OO.ts

    export const f100_0_res_01 = {

    }

### import檔案:
N/A

### 變數命名：
自定義


---

## xxxxxxxx-simulation.service.ts

    import { SimulationApi } from '@api-simulation/simulation-api';
    // == 自定義response == //
    import { fx000101_res_01 } from './fx000101-res-01';

    export class FX000101SimulateService implements SimulationApi {
        /** 在此做不同 request Object 判斷邏輯, 回傳不同客製化 response  **/
        public getResponse(reqObj, reqHeader?: any) {
            // reqObj => 取得request co:MNBRequest.co:body
            // reqHeader => 取得request co:MNBRequest.co:reqHeader
            return FX000101_res_01;
        }

    }


### import檔案:
* @angular/core:
    N/A
* 框架基本:
    * @api-simulation/simulation-api => SimulationApi
* 同層目錄
    * xxxxxxxx-res-01.ts (01~99)

### Class命名：
`[API編號大寫]SimulateService`

FX000101SimulateService

### 繼承父類別: SimulationApi

    export class FX000101SimulateService implements SimulationApi

### 建構子的super
    N/A

