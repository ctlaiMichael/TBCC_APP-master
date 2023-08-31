# 主要區塊說明
## 功能: 合庫epay-主掃
(pages floder:) `
onscan
`

### 功能說明
合庫epay

### 登入權限
`須登入`

且必須判斷有OTP和憑證才可使用本功能!!!

---

# 主掃流程
## 功能流程
* 開啟相機Scan偵測
* 解析QR Code類別
* QR Code解析 (中台)
* 功能分派

## 主要程式: OnscanService
### 開啟相機: openScan
執行相機並開始scan

若scan成功，會回傳scan string

請注意!當scan成功時，即須重啟scan作業
1. 重新scan
2. 關閉相機

### 1. 解析QR Code: analyzeCode
當取得QR Code後，需要進行資料解析


#### 2. 判斷QR Code類型: analyzeQrcodeType
取得回傳資訊

    {
        type: '',
        jsonObj: '傳進來的字串',
        preCheckQrcode: 'decodeURIComponent的jsonObj'
    }

* type:
    * TWQRP
    * EMV

#### 3. 解析整合程式: modifyAnalyzeReq
依照各種metod判斷當前最適宜的流程。

依靠analyzeQrcodeType回傳的type值


#### 3.1 EMV規格處理: modifyAnalyzeEmv
EMV解析(FQ000102)

### 4: processAnalyze
依照狀況，送資料至FQ000104進行解析

---

# 如何模擬測試
## 抓加方法
* QR Code Case追加
* 測試案例預設
* 模擬電文追加

### QR Code Case追加
請異動檔案 QRCodeTestCase

@pages/epay/shared/service/qrcode-testcase

    '自定義key name': '掃描時預計回傳的qrcode'

### 測試案例預設
如果在PC上開發，想要模擬情境，請調整 pages\epay\shared\service\onscan.service.ts

OnscanService::_testQrcode

    test_case = '自定義key name';

### 模擬電文追加
新增 app\simulation\api\fq\fq000104\fq000104-res-real.ts

設定模擬response

    tmp_list['自定義key name'] = {}; 


如果執行的是environmert.nat.ts，掃到相同QRCodeTestCase內設定的code，即依照模擬電文對應回傳對應response



---
## 子功能名稱: 請輸入子功能名稱
(pages floder:) `
請輸入pages floder
`

### 子功能說明
請輸入子功能說明

## 登入權限
<!-- `免登入` -->
<!-- `須登入` -->

