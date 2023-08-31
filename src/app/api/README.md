# API使用說明
## 目錄結構

注意事項：
* 依照API編號進行歸類，每一個API有一個專屬自己資料夾
* 檔案命名請以全小寫為主
* 請建立三個檔案
    * xxxxxxxx-api.service.ts
    * xxxxxxxx-req.ts
    * xxxxxxxx-res.ts
* 請記得建立模擬電文 app/simulation

### 資料夾層級
FX000101 API:

fx
-
└─ fx000101

fx000101
-
├─ fx000101-api.service.ts


├─ fx000101-req.ts

└─ fx000101-res.ts



---

# 各檔案內容

## xxxxxxxx-req.ts

    import { ReqBody } from '@base/api/model/req-body';

    export class FX000101ReqBody extends ReqBody {
        field1: string;
        field2: string;
        field3: string;
        constructor() {
            super();
            this.field1 = '';
            this.field2 = '';
            this.field3 = '';
        }
    }

### import檔案:
* 框架基本:
    * @base/api/model/req-body => ReqBody

### Class命名：
`[API編號大寫]ReqBody`

FX000101ReqBody


### 繼承父類別: ReqBody
    export class FX000101ReqBody extends ReqBody 

### 建構子的super

    constructor() {
        super();
    }

### 實作
請依照api規格文件，建立body部分的參數

譬如FX000101的request.body如下:

    {
        field1: '',
        field2: '',
        field3: ''
    }

必須建立變數

    field1: string;
    field2: string;
    field3: string;

並於建構子提供Default

    constructor() {
        super();
        this.field1 = '';
        this.field2 = '';
        this.field3 = '';
    }

---

## xxxxxxxx-res.ts

    import { ResBody } from '@base/api/model/res-body';

    export class FX000101ResBody extends ResBody {
        body: any;
    }

### import檔案:
* 框架基本:
    * @base/api/model/res-body => ResBody


### Class命名：
`[API編號大寫]ResBody`

FX000101ResBody


### 繼承父類別: ReqBody
    export class FX000101ResBody extends ResBody

### 建構子的super

    constructor() {
        super();
    }

### 實作
請依照api規格文件，建立body部分的參數

譬如FX000101的response.body如下:

    {
        field1: '',
        field2: '',
        field3: ''
    }

必須建立變數

    請完成範例

並於建構子提供Default

    請完成範例

---

## xxxxxxxx-api.service.ts

    import { Injectable } from '@angular/core';
    import { TelegramService } from '@core/telegram/telegram.service';
    import { ApiBase } from '@base/api/api-base.class';
    import { FX000101ReqBody } from './fx000101-req';
    import { FX000101ResBody } from './fx000101-res';

    @Injectable()
    export class FX000101ApiService extends ApiBase<FX000101ReqBody, FX000101ResBody> {

        constructor(public telegram: TelegramService<FX000101ResBody>) {
            super(telegram, 'FX000101');
        }

    }

### import檔案:
* @angular/core:
    * Injectable
* 框架基本:
    * @core/telegram/telegram.service => TelegramService
    * @base/api/api-base.class => ApiBase
* 同層目錄
    * xxxxxxxx-req.ts
    * xxxxxxxx-res.ts

### Class命名：
`[API編號大寫]ApiService`

FX000101ApiService

### 繼承父類別: ApiBase
並且將父類別的Requst和Response取代為此API的xxxxxxxx-req.ts和xxxxxxxx-res.ts

    export class FX000101ApiService extends ApiBase<FX000101ReqBody, FX000101ResBody>

### 建構子的super

    constructor(public telegram: TelegramService<FX000101ResBody>) {
        super(telegram, 'FX000101');
    }


---

## xxxxxxxx-api.service.ts 客製化處理
針對api需要做特殊處理，諸如年份要改成民國年等




    import { Injectable } from '@angular/core';
    import { TelegramService } from '@core/telegram/telegram.service';
    import { ApiBase } from '@base/api/api-base.class';
    import { FX000101ReqBody } from './fx000101-req';
    import { FX000101ResBody } from './fx000101-res';
    import { TelegramOption } from '@core/telegram/telegram-option';

    @Injectable()
    export class FX000101ApiService extends ApiBase<FX000101ReqBody, FX000101ResBody> {

        constructor(public telegram: TelegramService<FX000101ResBody>) {
            super(telegram, 'FX000101');
        }


        send(data: FX000101ResBody): Promise<any> {
            data.field1 = 'test';
            
            return super.send(data);
        }
    }
