# 各種鏈結說明
部分取代 f1000103 系統參數設定檔
notApplyUrl	尚未申辦URL
firstUse	首次使用URL
MSG_F5000103_1_URL	台幣轉外幣提示語/警語視窗URL
MSG_F5000103_2_URL	外幣轉台幣提示語/警語視窗URL
MSG_F5000103_3_URL	結購匯款性質別說明URL
MSG_F5000103_4_URL	結售匯款性質別說明URL
MSG_F5000104_1_URL	外匯存款轉帳提示語/警語視窗URL
MSG_F6000301_1_URL	綜活存轉綜定存轉存限制資訊視窗URL
MSG_F6000301_2_URL	綜活存轉綜定存綜活轉綜定之優惠視窗URL
MSG_F6000403_1_URL	外匯綜定存中途解約提示語/警語視窗URL
EXMP_F7000201_URL	台灣省自來水費帳單範例視窗URL
EXMP_F7000301_URL	電費帳單範例視窗URL
EXMP_F7000701_URL	健保費帳單範例視窗URL
EXMP_F7000501_URL	勞保費帳單範例視窗URL
EXMP_F7000601_URL	國民年金帳單範例視窗URL
ACTIVITY_01	優惠活動資訊URL
ACTIVITY_02	信用卡活動訊息URL
INDEX_URL	合庫首頁URL
CLINIC_ONLINE_URL	台大醫院看診進度查詢URL
REG_QUERY_URL	台大醫院掛號查詢URL
MSG_NTUH	台大醫院資訊
REG_URL	台大醫院網路掛號URL
EXMP_F7001001_URL	台北市自來水費帳單範例視窗URL
FUND_URL	基金金庫URL
FUND01_URL	基金申購/贖/轉 注意事項URL
FUND02_URL	單筆申購說明URL
FUND03_URL	小額申購說明URL
FUND04_URL	定期不定額套餐說明URL
FUND05_URL	贖回/轉換 備註說明URL
FUND06_URL	基金贖回說明URL
FUND07_URL	贖回之限制URL
FUND08_URL	基金轉換說明URL
FUND09_URL	轉換之限制URL
FUND10_URL	集管/智富 備註說明URL
FUND_MOPS_URL	基金公開說明書URL
FUND_CHNL_URL	基金通路報酬揭露資訊URL
HIGH_YIELD_URL	高收益債券類型基金URL
HIGH_YIELD_URL2	以投資高收益債券為訴求之基金風險預告書URL
BANNER1	iPad/WP7首頁Banner圖1
BANNER2	iPad/WP7首頁Banner圖2
BANNER_URL1	iPad/WP7首頁Banner圖1URL
BANNER_URL2	iPad/WP7首頁Banner圖2URL
FUND12_URL	後收型基金參考利害關係人告知URL
EBILL_URL	eBill繳費網頁URL
BannerDetail	查詢Banner明細

## 參數設定方法

    'url_key': {
        url: 'url鏈結',
        target: '請參考下列說明' 
    }

* target
    - _blank : InnerApp
    - _self : 本身(原則上禁止使用)
    - _system: 系統，另開鏈結
 

## 功能名稱: 優惠活動資訊
(url key:) `
abouthot
`

鏈結類型： `
innerApp
`

鏈結: `
https://www.tcb-bank.com.tw/abouthot/Pages/activity02.aspx
`

### 功能說明
優惠活動資訊

## 登入權限
`免登入`

## 出現功能
* 最新消息

---
## 功能名稱: 信用卡活動資訊
(url key:) `
creditcard
`

鏈結類型： `
innerApp
`

鏈結: `
https://www.tcb-bank.com.tw/creditcard/discount_news/Pages/activity.aspx
`

### 功能說明
信用卡活動資訊

## 登入權限
`免登入`

## 出現功能
* 最新消息

---
## 功能名稱: 金庫e證券
(url key:) `
N/A
`

鏈結類型： `
innerApp
`

鏈結: `
https://www.tcb-bank.com.tw/creditcard/discount_news/Pages/activity.aspx
`

### 功能說明
信用卡活動資訊

## 登入權限
`免登入`

## 出現功能
* 最新消息

---
## 功能名稱: e-Bill全國繳費網
(url key:) `
ebill
`

鏈結類型： `
innerApp
`

鏈結: `
https://ebill.ba.org.tw/
`

### 功能說明
e-Bill全國繳費網
待確認是否收納在最新消息內

## 登入權限
`免登入`

## 出現功能
* 最新消息
* 轉帳服務

