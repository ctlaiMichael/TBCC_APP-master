# 主要區塊說明
## 功能: Date


### 功能說明



---

# DateRangeUtil
* getRange

## getRange
### 參數
set_date 基礎日
* 2017/1/1
* new Date()


dateObj 物件設定
* returnType: 依照設定格式，所有日期格式會轉成DateUtil.transDate的回傳格式(預設date)
* rangeType: M 月份, D 日期
* rangeNum: 差異時間(負值代表計算最小日，正值代表計算最大日)
* rangeBaseDate: 當rangeType為M時，的基礎日期

### 範例

取得下一個月(同日)

    this._formateService.transDateRange('NOW_TIME', {
        returnType: 'date',
        rangeType: 'M',
        rangeNum: 1,
        rangeBaseDate: ''
    });

    baseDate: "2019/04/17"
    rangeDate: "2019/05/17"
    rangeNum: 1
    rangeType: "M"


取得下一個月(月初)

    this._formateService.transDateRange('NOW_TIME', {
        returnType: 'date',
        rangeType: 'M',
        rangeNum: 1,
        rangeBaseDate: '01'
    });

    baseDate: "2019/04/17"
    rangeDate: "2019/05/01"
    rangeNum: 1
    rangeType: "M"


取得指定日期前兩個月

    this._formateService.transDateRange('2019/04/16', {
        returnType: 'date',
        rangeType: 'M',
        rangeNum: '-2',
        rangeBaseDate: ''
    });

    baseDate: "2019/04/16"
    rangeDate: "2019/02/16"
    rangeNum: -2
    rangeType: "M"

取得指定日期前兩個月(月初)

    this._formateService.transDateRange('2019/04/16', {
        returnType: 'date',
        rangeType: 'M',
        rangeNum: '-2',
        rangeBaseDate: '01'
    });

    baseDate: "2019/04/16"
    rangeDate: "2019/02/01"
    rangeNum: -2
    rangeType: "M"

取得前7天

    this._formateService.transDateRange('NOW_TIME', {
        returnType: 'date',
        rangeType: 'D',
        rangeNum: -7,
        rangeBaseDate: ''
    });

    baseDate: "2019/04/17"
    rangeDate: "2019/04/10"
    rangeNum: -7
    rangeType: "D"


取得前1天

    this._formateService.transDateRange('NOW_TIME', {
        returnType: 'date',
        rangeType: 'D',
        rangeNum: -1,
        rangeBaseDate: ''
    });

    baseDate: "2019/04/17"
    rangeDate: "2019/04/16"
    rangeNum: -1
    rangeType: "D"

### 範例code

    console.warn('取得下一個月(同日)',
        this._formateService.transDateRange('NOW_TIME', {
            returnType: 'date',
            rangeType: 'M',
            rangeNum: 1,
            rangeBaseDate: ''
        })
    );
    console.warn('取得下一個月(月初)',
        this._formateService.transDateRange('NOW_TIME', {
            returnType: 'date',
            rangeType: 'M',
            rangeNum: 1,
            rangeBaseDate: '01'
        })
    );
    console.warn('取得指定日期前兩個月', 
        this._formateService.transDateRange('2019/04/16', {
            returnType: 'date',
            rangeType: 'M',
            rangeNum: '-2',
            rangeBaseDate: ''
        })
    );
    console.warn('取得指定日期前兩個月(月初)', 
        this._formateService.transDateRange('2019/04/16', {
            returnType: 'date',
            rangeType: 'M',
            rangeNum: '-2',
            rangeBaseDate: '01'
        })
    );
    console.warn('取得前7天',
        this._formateService.transDateRange('NOW_TIME', {
            returnType: 'date',
            rangeType: 'D',
            rangeNum: -7,
            rangeBaseDate: ''
        })
    );
    console.warn('取得前1天',
        this._formateService.transDateRange('NOW_TIME', {
            returnType: 'date',
            rangeType: 'D',
            rangeNum: -1,
            rangeBaseDate: ''
        })
    );