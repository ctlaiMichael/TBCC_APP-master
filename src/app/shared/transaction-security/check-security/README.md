#########說明########

#安控設定值 可改為設定檔 目前寫死於service 內
1: { name: 'SSL', securityType: '1' },
2: { name: '憑證', securityType: '2' },
3: { name: 'OTP', securityType: '3' },
4: { name: '生物辨識', securityType: '4' }

#交易類型 categoryId
* 1:轉帳服務
* 2:繳交各項費用及稅款
* 3:授信業務
* 4:外匯業務
* 5:信用卡業務
* 6:基金業務
* 7:其他服務
* 8:醫療服務
* 9:產壽險服務

#########說明########

#########使用 Start ########

* 1.加入HTML
* 2.設定傳入物件參數
* 3.設定接收方法

## 1. 父層HTML 安控區塊 使用下列結構 #

<app-select-security (securityObj)="securityOptionBak($event)" [transactionObj]="transactionObj">
</app-select-security> 

##2. 父層Component 建立 安控設定參數 transactionObj :object 傳入子層

* transactionObj.serviceId => 交易結果電文 (非必要)
* transactionObj.categoryId=> 交易類型 (必要)
* transactionObj.transAccountType=> 1= 約轉 , 2= 非約轉 (必要)
* transactionObj.ulStyle => 客製CSS設定 (非必要)

* EX:
 transactionObj = {
    serviceId: 'F6000301',
    categoryId: '4',
    transAccountType: '1',
    ulStyle: { 'width': '50%' }
  };
##3. 父層Component 建立 securityOptionBak()方法 接子層回傳物件

* 回傳物件說明
    ERROR:{}, (ERROR Handle 控制錯誤物件)
    status:boolean, (安控選項狀態)
    list:[], (可選安控選項物件) 
    selected:string (所選擇的安控項目)

* EX:{
    ERROR: {
        title: '',
        content: '',
        message: '',
        type: ''
    },
    status: true,
    list:[{name:SSL,securityType:1},{name:憑證,securityType:2},{name:OTP,securityType:3}],
    selected: '1'
  };
-------------
* 建立回傳方法

* EX:
  securityOptionBak(e) {
    if (e.status) {
      // 取得需要資料傳遞至下一頁子層變數

    } else {
      // do errorHandle 錯誤處理 推業或POPUP
    }
  }

#########使用 End ########