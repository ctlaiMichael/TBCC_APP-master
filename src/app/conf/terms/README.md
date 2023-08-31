# 條款說明
## 層級說明
* system: 系統相關
* forex: 外匯相關
* fund: 基金相關

---

# system: 系統相關
## PermisionInfo
* tcb_dev_permision_url
* tcb_production_permision_url

---
# deposit: 台幣存摺
## PermisionInfo
* tcb_dev_permision_url
* tcb_production_permision_url

---
# forex: 外匯相關
## ForexCurrencyLimitDeposit
* MSG_F6000301_1_URL: 綜活存轉綜定存轉存限制資訊視窗URL
## TwdToForexInfo
* MSG_F5000103_1_URL: 台幣轉外幣提示語/警語視窗URL



 * tcb_dev_permision_url: http://210.200.4.11/MobileBank/AppView/msg/TCBDeclaration.html
 * tcb_production_permision_url: https://mbbank.tcb-bank.com.tw/NMobileBank/AppView/msg/TCBDeclaration.html


	/******************* 第二階段相關訊息網址 ****************************************/
	MSG_F5000103_1_URL;// 台幣轉外幣提示語/警語視窗URL
	MSG_F5000103_2_URL;// 外幣轉台幣提示語/警語視窗URL
	MSG_F5000104_1_URL;// 外匯存款轉帳提示語/警語視窗URL
	MSG_F6000301_1_URL;// 綜活存轉綜定存轉存限制資訊視窗URL
	MSG_F6000301_2_URL;// 綜活存轉綜定存綜活轉綜定之優惠視窗URL

	MSG_F6000403_1_URL;// 外匯綜定存中途解約提示語/警語視窗URL
	EXMP_F7000201_URL;// 台灣省自來水費帳單範例視窗URL
	EXMP_F7000301_URL;// 電費帳單範例視窗URL
	EXMP_F7000701_URL;// 健保費帳單範例視窗URL
	EXMP_F7000501_URL;// 勞保費帳單範例視窗URL
	EXMP_F7000601_URL;// 國民年金帳單範例視窗URL
	EXMP_F7001001_URL;// 臺北市自來水費帳單範例視窗URL

	/******************* 第二階段相關訊息網址 ****************************************/
	/************************************ 外匯相關功能的FLAG **************************************************/
	NTD_CD_FLAG;// 台幣綜定存業務開放註記 Y:開放/ N:未開放
	FRGNEX_TRNS_FLAG;// 外匯轉帳業務開放註記 Y:開放/ N:未開放
	FRGNEX_CD_FLAG;// 外匯綜定存業務開放註記 Y:開放/ N:未開放

	/**************************************************************************************/
	/****************** 外匯交易部分 *************************/
	MSG_F5000103_3_URL;// 結購匯款性質別說明URL_台轉外
	MSG_F5000103_4_URL;// 結售匯款性質別說明URL_外轉台
	/****************** 外匯交易部分 *************************/

	CLINIC_ONLINE_URL;// 台大醫院看診進度查詢URL
	REG_QUERY_URL;// 台大醫院掛號查詢URL
	MSG_NTUH;// 台大醫院資訊
	REG_URL;// 台大醫院資訊
	NTUH_TRNS_FLAG;// 台大醫療繳費業務開放註記
	FUND_URL;// 基金金庫URL

	FUND_TRNS_FLAG;// 基金業務開放註記 Y:開放/ N:未開放
	cPayDay;// 國內標的小額每月扣款日 String 1 多個時使用逗號隔開
	fPayDay;// 國外標的小額每月扣款日 String 1 多個時使用逗號隔開
	FUND01_URL;// 基金申購/贖/轉 注意事項URL
	FUND02_URL;// 單筆申購說明URL
	FUND03_URL;// 小額申購說明URL
	FUND04_URL;// 定期不定額套餐說明URL_個網URL:
								// https://ebank.tcb-bank.com.tw/netbank/html/ib/pages/c3/IB_FundPurchasePeriod/IB_FundPurchasePeriod_Notice.jsp
	FUND05_URL;// 贖回/轉換 備註說明URL
	FUND06_URL;// 基金贖回說明URL
	FUND07_URL;// 贖回之限制URL
	FUND08_URL;// 基金轉換說明URL
	FUND09_URL;// 轉換之限制URL
	FUND10_URL;// 集管/智富 備註說明URL
	FUND_MOPS_URL;// 基金公開說明書URL
								// http://mops.twse.com.tw/mops/web/index
	FUND_CHNL_URL;// 基金通路報酬揭露資訊URL
								// http://www.tcb-bank.com.tw/product/trust/Pages/fundchanneldetail.aspx?p=xxxx
								// (XXXX為基金代碼)
	HIGH_YIELD_URL;// 高收益債券類型基金URL
									// http://tcbbankfund.moneydj.com/SaveFile/high_yield.pdf
	HIGH_YIELD_URL2;// 以投資高收益債券為訴求之基金風險預告書URL

	public String	maxPayDate;		// 20140415 Vincent Add 小額每月最多扣款日

//	20141227CR 遇到合庫投信的基金才需要出現此選項(Link) @20150301 Vincent Start
	FUND12_URL; //後收型基金參考利害關係人告知URL
//	20141227CR 遇到合庫投信的基金才需要出現此選項(Link) @20150301 Vincent End

//	20150804 eBill繳費網頁URL、偵測破解/防毒Flag、簡訊OTP秒數、廣告BANNER Start
	public String	EBILL_URL;			// eBill繳費網頁URL
		JB_CHECK_FLAG;	 // 開啟JB檢核註記 Y：開啟；N：關閉
		VIRUS_CHECK_FLAG;	// 開啟病毒檢核註記 Y：開啟；N：關閉
//	20150804 eBill繳費網頁URL、偵測破解/防毒Flag、簡訊OTP秒數、廣告BANNER End
	
	
//	****** 201706013:共同行銷CR Start ************************************		
	MarketingDescURL ;
	
	MarketingAgreementURL;
	
	MarketingTransactionURL;
	
//	****** 20170613:共同行銷CR End ***********************************



<sch:MNBResponse xmlns:sch="http://mnb.hitrust.com/service/schema">
    <sch:resHeader>
        <sch:requestNo>123456</sch:requestNo>
        <sch:requestTime>2019-05-10T09:50:56.338+08:00</sch:requestTime>
        <sch:responseTime>2019-05-10T09:50:56.338+08:00</sch:responseTime>
        <sch:custId/>
    </sch:resHeader>
    <sch:result xsi:type="f10:f1000103ResultType" xmlns:f10="http://mnb.hitrust.com/service/schema/f1000103" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <f10:custServiceTel>04-22273131</f10:custServiceTel>
        <f10:notApplyUrl>https://www.tcb-bank.com.tw/product/electronic_banking/Documents/01.html</f10:notApplyUrl>
        <f10:firstUse>https://www.tcb-bank.com.tw/product/electronic_banking/Documents/02.html</f10:firstUse>
        <f10:verRemind>0</f10:verRemind>
        <f10:MSG_F5000103_1_URL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/F5000103_1.html</f10:MSG_F5000103_1_URL>
        <f10:MSG_F5000103_2_URL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/F5000103_2.html</f10:MSG_F5000103_2_URL>
        <f10:MSG_F5000103_3_URL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/F5000103_3.html</f10:MSG_F5000103_3_URL>
        <f10:MSG_F5000103_4_URL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/F5000103_4.html</f10:MSG_F5000103_4_URL>
        <f10:MSG_F5000104_1_URL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/F5000104_1.html</f10:MSG_F5000104_1_URL>
        <f10:MSG_F6000301_1_URL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/F6000301_1.html</f10:MSG_F6000301_1_URL>
        <f10:MSG_F6000301_2_URL>https://www.tcb-bank.com.tw/aboutnews/Documents/100y.jpg</f10:MSG_F6000301_2_URL>
        <f10:MSG_F6000403_1_URL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/F6000403_1.html</f10:MSG_F6000403_1_URL>
        <f10:EXMP_F7000201_URL>http://210.200.4.11/MobileBank_P2/AppView/example/F7000201.html</f10:EXMP_F7000201_URL>
        <f10:EXMP_F7000301_URL>http://210.200.4.11/MobileBank_P2/AppView/example/F7000301.html</f10:EXMP_F7000301_URL>
        <f10:EXMP_F7000701_URL>http://210.200.4.11/MobileBank_P2/AppView/example/F7000701.html</f10:EXMP_F7000701_URL>
        <f10:EXMP_F7000501_URL>http://210.200.4.11/MobileBank_P2/AppView/example/F7000501.html</f10:EXMP_F7000501_URL>
        <f10:EXMP_F7000601_URL>http://210.200.4.11/MobileBank_P2/AppView/example/F7000601.html</f10:EXMP_F7000601_URL>
        <f10:NTD_CD_FLAG>Y</f10:NTD_CD_FLAG>
        <f10:FRGNEX_TRNS_FLAG>Y</f10:FRGNEX_TRNS_FLAG>
        <f10:FRGNEX_CD_FLAG>Y</f10:FRGNEX_CD_FLAG>
        <f10:NTUH_TRNS_FLAG>Y</f10:NTUH_TRNS_FLAG>
        <f10:ACTIVITY_01>https://www.tcb-bank.com.tw/abouthot/Pages/activity02.aspx</f10:ACTIVITY_01>
        <f10:ACTIVITY_02>https://www.tcb-bank.com.tw/creditcard/discount_news/Pages/activity.aspx</f10:ACTIVITY_02>
        <f10:INDEX_URL>https://www.tcb-bank.com.tw/</f10:INDEX_URL>
        <f10:CLINIC_ONLINE_URL>https://reg.ntuh.gov.tw/webadministration/SimpleLogin.aspx</f10:CLINIC_ONLINE_URL>
        <f10:REG_QUERY_URL>https://reg.ntuh.gov.tw/webadministration/Query.aspx</f10:REG_QUERY_URL>
        <f10:MSG_NTUH>https://www.ntuh.gov.tw/information/default.aspx</f10:MSG_NTUH>
        <f10:REG_URL>https://reg.ntuh.gov.tw/webadministration/ClinicTable.aspx</f10:REG_URL>
        <f10:FUND_URL>http://tcbbankfundtest.moneydj.com/mobile/</f10:FUND_URL>
        <f10:EXMP_F7001001_URL>http://210.200.4.11/MobileBankDev_P2/AppView/example/F7001001.html</f10:EXMP_F7001001_URL>
        <f10:FUND_TRNS_FLAG>Y</f10:FUND_TRNS_FLAG>
        <f10:cPayDay>6,16,26</f10:cPayDay>
        <f10:fPayDay>8,18,28</f10:fPayDay>
        <f10:FUND01_URL>http://210.200.4.11/MobileBankDev_P2/AppView/msg/FUND01.html</f10:FUND01_URL>
        <f10:FUND02_URL>http://210.200.4.11/MobileBankDev_P2/AppView/msg/FUND02.html</f10:FUND02_URL>
        <f10:FUND03_URL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/FUND03.html</f10:FUND03_URL>
        <f10:FUND04_URL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/FUND04.html</f10:FUND04_URL>
        <f10:FUND05_URL>http://210.200.4.11/MobileBankDev_P2/AppView/msg/FUND05.html</f10:FUND05_URL>
        <f10:FUND06_URL>http://210.200.4.11/MobileBankDev_P2/AppView/msg/FUND06.html</f10:FUND06_URL>
        <f10:FUND07_URL>http://210.200.4.11/MobileBankDev_P2/AppView/msg/FUND07.html</f10:FUND07_URL>
        <f10:FUND08_URL>http://210.200.4.11/MobileBankDev_P2/AppView/msg/FUND08.html</f10:FUND08_URL>
        <f10:FUND09_URL>http://210.200.4.11/MobileBankDev_P2/AppView/msg/FUND09.html</f10:FUND09_URL>
        <f10:FUND10_URL>http://210.200.4.11/MobileBankDev_P2/AppView/msg/FUND10.html</f10:FUND10_URL>
        <f10:FUND_MOPS_URL>https://mops.twse.com.tw/mops/web/index</f10:FUND_MOPS_URL>
        <f10:FUND_CHNL_URL>http://www.tcb-bank.com.tw/product/trust/Pages/fundchanneldetail.aspx?p=</f10:FUND_CHNL_URL>
        <f10:HIGH_YIELD_URL>http://tcbbankfund.moneydj.com.tw/SaveFile/high_yield.xls</f10:HIGH_YIELD_URL>
        <f10:HIGH_YIELD_URL2>http://210.200.4.11/MobileBankDev_P4/AppView/msg/FUND11.html</f10:HIGH_YIELD_URL2>
        <f10:BANNER1>http://210.200.4.11/MobileBank_P2/AppView/example/banner1.jpg</f10:BANNER1>
        <f10:BANNER2>http://210.200.4.11/MobileBank_P2/AppView/example/banner2.jpg</f10:BANNER2>
        <f10:BANNER_URL1>https://www.facebook.com/TCBebank</f10:BANNER_URL1>
        <f10:BANNER_URL2>http://www.tcb-bank.com.tw/Pages/Home.aspx</f10:BANNER_URL2>
        <f10:maxPayDate>5</f10:maxPayDate>
        <f10:FUND12_URL>http://210.200.4.11/MobileBank_P2/AppView/msg/FUND12.html</f10:FUND12_URL>
        <f10:EBILL_URL>https://ebill.ba.org.tw/MPP/MobileDefault.aspx</f10:EBILL_URL>
        <f10:MarketingDescURL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/MarketingDesc.html</f10:MarketingDescURL>
        <f10:MarketingAgreementURL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/MarketingAgreement.html</f10:MarketingAgreementURL>
        <f10:MarketingTransactionURL>http://210.200.4.11/MobileBankDev_P4/AppView/msg/MarketingTransaction.html</f10:MarketingTransactionURL>
        <f10:JB_CHECK_FLAG>Y</f10:JB_CHECK_FLAG>
        <f10:VIRUS_CHECK_FLAG>Y</f10:VIRUS_CHECK_FLAG>
        <f10:BannerDetails>
            <f10:BannerDetail>
                <f10:BANNER_ID>297edff867a133af0167a52d47d7001a01</f10:BANNER_ID>
                <f10:BANNER_URL>https://www.tcb-bank.com.tw/creditcard/discount_news/Documents/最新活動/104movie/index.html</f10:BANNER_URL>
            </f10:BannerDetail>
            <f10:BannerDetail>
                <f10:BANNER_ID>297edff867a133af0167a52dfdbd000c01</f10:BANNER_ID>
                <f10:BANNER_URL>https://www.tcb-bank.com.tw/creditcard/discount_news/Documents/%E6%9C%80%E6%96%B0%E6%B4%BB%E5%8B%95/104movie/index.html</f10:BANNER_URL>
            </f10:BannerDetail>
        </f10:BannerDetails>
    </sch:result>
</sch:MNBResponse>
