# 社群分享
## plugin
`cordova-sqlite-storage`

[version] `2.3.3`

[url] `https://github.com/xpbrew/cordova-sqlite-storage`

### 功能說明
提供sqlite介面

---

## 引用

    import { SqlitePluginService } from '@lib/plugins/socialsharing-plugin.service';

    constructor(
        private sqliteService: SqlitePluginService
    ) {
    }

---

## ErrorCode
### MISS_DB
找不到DB物件

sqlitePlugin.openDatabase 執行失敗


### MISS_DB_METHOD
找不到sqlitePlugin.openDatabase提供的method

### DATA_FORMAT_ERROR
參數錯誤


---


## search 查詢
### 呼叫方法

    this.sqliteService.search();





