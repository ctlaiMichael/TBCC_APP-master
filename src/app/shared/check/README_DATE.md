# 常用檢核- Date
* checkDate
* checkSelectedDate
* getDateSet
* checkDateRange

---
## checkDate 日期檢查
### 參數
* str: 日期字串
* return_flag: true只回傳檢查成功與否
### 回傳(boolean) (return_flag=true)
* true: 是日期
* true: 不是日期
### 回傳(Object)
    {
        status: true/false, // 判斷結果
        msg: 'Error Msg', // 錯誤原因
        formate: '', // formate的日期格式
        time: 0, // 日期time
        data_list: {
            'y': '',
            'm': '',
            'd': '',
            'h': '',
            'i': '',
            's': ''
        },
        date: {} // Date物件
    }

---

## checkSelectedDate 選擇日期檢查
### 參數
* data1: 日期
* data2: 日期
* checkType: 檢查類別
    *  `>` : check data1 > data2
    *  `<` : check data1 < data2
    *  `=` : check data1 = data2
    *  `>=` : check data1 >= data2
    *  `<=` : check data1 <= data2
* return_flag: true只回傳檢查成功與否
### 回傳(boolean) (return_flag=true)
* true: 符合
* true: 不符合
### 回傳(Object)
    {
        status: true/false, // 判斷結果
        msg: 'Error Msg' // 錯誤原因
    }

---
## getDateSet 取得日期設定資料
取得日期設定資料，可用於之後的檢查
可從回傳

### 參數
#### dateObj
* rangeType: 
    * 查詢範圍類型 M/D
* rangeNum: 
    * 查詢範圍限制 number
* rangeDate:
    * 指定日期
* baseDate:
    * 系統日
    * 未設定或設定today，為今天
#### dataType
* strict
    * (Default) 檢查範圍、最早起日、最晚迄日 [多為查詢使用]
    * 最小日： 指定時間
    * 最大日： 系統日，預設今天
* future
    * 查詢未來時間
    * 最小日： 系統日，預設今天
    * 最大日： 指定時間
* simple
    * 基本日期檢核
    * 最小日： 不限制
    * 最大日： 不限制

### 回傳(Object)
#### minDate
* 最小可輸入日期，空值表示不限制 
#### maxDate
* 最大可輸入日期，空值表示不限制
#### baseDate
* 最大可輸入日期，空值表示不限制
#### check_type
功能並不會使用!請直接往後送
* strict
    * (Default) 檢查範圍、最早起日、最晚迄日 [多為查詢使用]
    * 最小日： 指定時間
    * 最大日： 系統日，預設今天
* future
    * 查詢未來時間
    * 最小日： 系統日，預設今天
    * 最大日： 指定時間
* simple
    * 基本日期檢核
    * 最小日： 不限制
    * 最大日： 不限制
#### check_set
功能並不會使用!請直接往後送

日期對照設定檔，可比照(DateCheckUtil.getDateTypeSet)
#### type
功能並不會使用!請直接往後送

* 查詢範圍類型 M/D
#### rang
功能並不會使用!請直接往後送

* 查詢範圍限制 number
#### QuryLimt
功能並不會使用!請直接往後送

* 指定日期
#### SysDate
功能並不會使用!請直接往後送

* 系統日
* 未設定或設定today，為今天


### 範例
取得設定值:

    import { CheckService } from '@shared/check/check.service';

    let set_data = {
        rangeType: 'M', // "查詢範圍類型" M OR D
        rangeNum: '2', // 查詢範圍限制
        rangeDate: '', // 比較日
        baseDate: 'today' // 系統當日
    };
    let dateSet = this._checkService.getDateSet(set_data, 'strict');

console.log dateSet:

    {
        "check_type": "strict",
        "check_set": {
            "id": "strict",
            "check": true,
            "min": "range",
            "max": "today",
            "range": true
        },
        "type": "M",
        "rang": "2",
        "QuryLimt": "2019/02/01",
        "SysDate": "2019/04/18",
        "minDate": "2019/02/01",
        "maxDate": "2019/04/18",
        "baseDate": "2019/04/18"
    }

* minDate : 可檢查最小日
* maxDate : 可檢查最大日
* baseDate: 可顯示default日



---
## checkDateRange 日期比較
### 參數
* setDate: 
    * Array: ['startDate', 'endDate']
    * Object: {startDate: 'startDate', endDate: 'endDate'}  
* dateObj:
    * 可直接帶入 getDateSet 取得之return object
    * 可設定以下參數進行設定(同getDateSet的參數 dateObj)

參數：

    {
        rangeType: 'M', // "查詢範圍類型" M OR D
        rangeNum: '2', // 查詢範圍限制
        rangeDate: '', // 比較日
        baseDate: 'today', // 系統當日
        check_type: 'strict'
    }

### 回傳(Object)
* status 結果
* err_flag 日期比較結果
    * startDate : 起始日是否正確
    * endDate: 結束日是否正確
* msg: 錯誤原因
* errorMsg: 錯誤訊息清單
* inputData (Object): 傳入的日期
* rangData (Object): 比對的參數
#### 範例:
    {
        'status': true,
        'err_flag': {
            'startDate': false,
            'endDate': false
        },
        'msg': '',
        'errorMsg': [],
        'inputData': {
            'startDate': '',
            'endDate': ''
        },
        'rangData': {
            'type': 'M',
            'rang': '24',
            'QuryLimt': '', // minDay
            'QuryLimtMax': '', // maxDay
            'SysDate': '' // today
        }
    }

### 範例
#### 範例一:

    let set_data = {
        returnType: 'date',
        rangeType: 'M', // "查詢範圍類型" M OR D
        rangeNum: '2', // 查詢範圍限制
        rangeDate: '', // 比較日
        baseDate: 'today' // 系統當日
    };
    let dateset = this._checkService.getDateSet(set_data, 'strict');

    let simple_check = this._checkService.checkDateRange({
        startDate: '2019/01/01',
        endDate: '2019/03/03'
    }, dateset);
    console.log(JSON.stringify(simple_check), simple_check, dateset);

console:

    {
        "status": false,
        "msg": "查詢日期的查詢範圍已超出系統設定範圍!<br>【查詢日期起日】不得小於最早查詢日期!((2019/02/01))",
        "errorMsg": [
            "查詢日期的查詢範圍已超出系統設定範圍!",
            "【查詢日期起日】不得小於最早查詢日期!((2019/02/01))"
        ],
        "err_flag": {
            "endDate": true,
            "startDate": true
        },
        "inputData": {
            "endDate": "2019/03/03",
            "startDate": "2019/01/01"
        },
        "rangData": {
            "type": "M",
            "rang": "2",
            "QuryLimt": "2019/02/01",
            "QuryLimtMax": "",
            "SysDate": "2019/04/18"
        }
    }

#### 範例二: 直接指定條件(strict)

    let simple_check = this._checkService.checkDateRange({
        startDate: '',
        endDate: ''
    }, {
        returnType: 'date',
        rangeType: 'M', // "查詢範圍類型" M OR D
        rangeNum: '2', // 查詢範圍限制
        rangeDate: '', // 比較日
        baseDate: 'today', // 系統當日
        check_type: 'strict'
    });

console:
    {
        "status": false,
        "msg": "【查詢日期起日】不得為空白!<br>【查詢日期迄日】不得為空白!",
        "errorMsg": [
            "【查詢日期起日】不得為空白!",
            "【查詢日期迄日】不得為空白!"
        ],
        "err_flag": {
            "endDate": true,
            "startDate": true
        },
        "inputData": {
            "endDate": "",
            "startDate": ""
        },
        "rangData": {
            "type": "M",
            "rang": "2",
            "QuryLimt": "2019/02/01",
            "QuryLimtMax": "2019/04/18",
            "SysDate": "2019/04/18"
        }
    }

#### 範例三: 直接指定條件(future)

    let simple_check2 = this._checkService.checkDateRange({
        startDate: '',
        endDate: ''
    }, {
        returnType: 'date',
        rangeType: 'M', // "查詢範圍類型" M OR D
        rangeNum: '2', // 查詢範圍限制
        rangeDate: '', // 比較日
        baseDate: 'today', // 系統當日
        check_type: 'future'
    });

console:
    {
        "status": false,
        "msg": "【查詢日期起日】不得為空白!<br>【查詢日期迄日】不得為空白!",
        "errorMsg": [
            "【查詢日期起日】不得為空白!",
            "【查詢日期迄日】不得為空白!"
        ],
        "err_flag": {
            "endDate": true,
            "startDate": true
        },
        "inputData": {
            "endDate": "",
            "startDate": ""
        },
        "rangData": {
            "type": "M",
            "rang": "2",
            "QuryLimt": "2019/04/18",
            "QuryLimtMax": "2019/06/01",
            "SysDate": "2019/04/18"
        }
    }


#### 範例四: 直接指定條件(simple)

    let simple_check3 = this._checkService.checkDateRange({
        startDate: '',
        endDate: ''
    }, {
        returnType: 'date',
        rangeType: 'M', // "查詢範圍類型" M OR D
        rangeNum: '2', // 查詢範圍限制
        rangeDate: '', // 比較日
        baseDate: 'today', // 系統當日
        check_type: 'simple'
    });

console:
    {
        "status": false,
        "msg": "【查詢日期起日】不得為空白!<br>【查詢日期迄日】不得為空白!",
        "errorMsg": [
            "【查詢日期起日】不得為空白!",
            "【查詢日期迄日】不得為空白!"
        ],
        "err_flag": {
            "endDate": true,
            "startDate": true
        },
        "inputData": {
            "endDate": "",
            "startDate": ""
        },
        "rangData": {
            "type": "M",
            "rang": "2",
            "QuryLimt": "2019/06/01",
            "QuryLimtMax": "",
            "SysDate": "2019/04/18"
        }
    }