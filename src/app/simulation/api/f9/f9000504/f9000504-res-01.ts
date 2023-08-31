// 期間與利率及是否為員工
export const f9000504_res_01 = {
	"MNBResponse": {
		"@xmlns:sch": "http://mnb.hitrust.com/service/schema",
		"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
		"resHeader": {
			"requestNo": "2010_12_22_13_32_21_531_12345",
			"requestTime": "2010-12-22T13:32:21.578+08:00",
			"responseTime": "2010-12-22T13:32:21.750+08:00",
			"custId": null
		},
		"result": {
			"@xmlns:f50": "http://mnb.hitrust.com/service/schema/F9000504",
			"@xsi:type": "f80:F9000504ResultType",
			"isStaff": "Y", // Y or N
			"aprprd_yymm": "0700", // YYMMapramt
			"aprrefund_yymm1":"0100",
			"aprrefund_yymm2":"0600",
			"aprlimit":"1", // 1 無限制清償期間 2:限制清償期間
			
			"aprfee":"70,000",
			"aprJcIcFee":"900,000",
			"apraprde":"1081202",
			"trnsToken":"qewf23123rfqwr1211",
			"aprrefundWay":'2',
			"aprrefundWayot":'other',
			"details":
			//    null
			{
				"detail": [
					{
						"aprintNo": "1", // 利率期數幾期
						"aprintBgn": "1", // 利率期數起點(月)
						"aprintEnd": "12", // 利率期數迄(月)
						"aprintTy": "4", // 指標利率別(1,2,34,5,6,7,8,9)
//（固定4或7)
// 1:定儲指數利率
// 2:基準利率
// 3:央行重點現率
// 4:定儲指數月指標利率
// 5:月基準利率
// 6:郵儲一年期定儲
// 7:郵儲二年期定儲
// 9:其他
						"aprint": "1.300", // 本授信指標利率
						"apraint": "1.510", // 本授信加碼年息
						"aprRate": "2.810", // 本授信計息利率(合計)

					},
					{
						"aprintNo": "2",
						"aprintBgn": "13",
						"aprintEnd": "24",
						"aprintTy": "4",
						"aprint": "1.300",
						"apraint": "2.330",
						"aprRate": "3.630",

					},
					{
						"aprintNo": "3",
						"aprintBgn": "25",
						"aprintEnd": "84",
						"aprintTy": "4",
						"aprint": "1.300",
						"apraint": "2.830",
						"aprRate": "4.130",

					}

				]
			},
			"agree_details":
			//    null
			{
				"agree_detail": [
					{
						"dataType": "H1",
						"verno": "v1051",
						"blobData": "<DIV style=\"HEIGHT: 18px\">&nbsp;</DIV>\n<TABLE border=0 cellSpacing=0 cellPadding=0 width=740 align=center height=1030>\n<TBODY>\n<TR vAlign=top>\n<TD>\n<DIV style=\"FONT-FAMILY: 新細明體; FONT-SIZE: 20pt\" align=center><BR>$Logo_img$&nbsp;借 款 契 約<BR></DIV><!-- Put your stuff here -->\n<DIV style=\"LINE-HEIGHT: 20px; FONT-FAMILY: 新細明體; FONT-SIZE: 10pt\" id=divcontent>\n<P>借款人資訊<BR><BR><FONT color=#0060a0>借款人</FONT><BR><B>丙一般本國人</B><BR><BR><FONT color=#0060a0>身分證字號</FONT><BR><B>B121194483</B><BR><BR>借款人（以下簡稱「甲方」）茲向合作金庫商業銀行（以下簡稱「乙方」）辦理借款，雙方約定確實遵守下列各條款： <BR><BR><FONT color=#800080><INPUT value=1 type=hidden name=%%Surrogate_check0><LABEL> <INPUT id=check0 class=text-8pt value=Y type=checkbox name=check0 $check0$>借款人</LABEL></FONT><FONT color=#800080>已於合理期間內審閱(契約審閱期間至少五日)合作金庫商業銀行信貸借款契約書內容，並充分瞭解及確認，雙方約定確實遵守所列各條款。</FONT><BR><BR><FONT color=#0060a0>第一條 (契約類型)</FONT><BR>本借款契約類型為一次撥付型，係指乙方核給甲方一借款金額，而乙方將該借款金額一次撥付予甲方。<BR><FONT color=#0060a0>第二條 (借款金額)</FONT><BR>甲方借款金額為新臺幣 <B><U>參佰參拾萬元整</U></B> 。<BR><FONT color=#0060a0>第三條 (借款之交付)</FONT><BR>甲方同意依下列方式作為本借款之交付：<BR>撥入甲方於合作金庫商業銀行 <B><U>$ACCOUNTBRCN$</U></B> <B><U>$ACCOUNTCD$</U></B> 第 <B><U>$ACCOUNT$</U></B> 帳戶（存戶姓名：<B><U>丙一般本國人</U></B>）<BR><FONT color=#0060a0>第四條 (借款期間)</FONT><BR>本借款期間 <B><U>07</U></B> 年 <B><U>00</U></B> 月，自民國 <B><U>$BY$</U></B> 年 <B><U>$BM$</U></B> 月 <B><U>$BD$</U></B> 日起至民國 <B><U>$EY$</U></B> 年 <B><U>$EM$</U></B> 月 <B><U>$ED$</U></B> 日止。<BR><FONT color=#0060a0>第五條 (借款利息計付方式)</FONT><BR>本借款之利息以下列方式計付：<!--B不分期加年利率分期加年利率1.7003.700--><BR>自民國 <B><U>$BY1_1$</U></B> 年 <B><U>$BM1_1$</U></B> 月 <B><U>$BD1_1$</U></B> 日起至民國 <B><U>$EY1_1$</U></B> 年 <B><U>$EM1_1$</U></B> 月 <B><U>$ED1_1$</U></B> 日止，按乙方當時公告之定儲指數月指標利率加年利率 <B><U>1.700</U></B> ％計算。<BR>自民國 <B><U>$BY1_2$</U></B> 年 <B><U>$BM1_2$</U></B> 月 <B><U>$BD1_2$</U></B> 日起至民國 <B><U>$EY1_2$</U></B> 年 <B><U>$EM1_2$</U></B> 月 <B><U>$ED1_2$</U></B> 日止，按乙方當時公告之定儲指數月指標利率加年利率 <B><U>3.700</U></B> ％計算。<BR>自民國 <B><U></U></B>年 <B><U></U></B>月 <B><U></U></B>日起至民國 <B><U></U></B>年 <B><U></U></B>月 <B><U></U></B>日止，按乙方當時公告之定儲指數月指標利率加年利率 <B><U></U></B>％計算。<BR>前開利率嗣後隨乙方之定儲指數月指標利率變動而調整，並自調整日起，按調整後之年利率計算。<BR>有關乙方定儲指數月指標利率之定義、調整方式詳如其他說明。<BR>第一項之利息計算方式為 <B><U>按月計息</U></B> ，係本金乘以年利率，再除以十二即得每月之利息額。不足一個月之畸零天數部分，則按日計息，即：一年(含閏年)以三百六十五日為計息基礎，以本金乘以年利率、天數，再除以三百六十五即得畸零天數部分之利息額。<BR><FONT color=#0060a0>第六條 (利率調整之通知)</FONT><BR>乙方應於指標利率調整時十五日內將調整後之指標利率告知甲方。未如期告知者，其為利率調升時，仍按原約定利率計算利息、遲延利息；其為利率調降時，則按調降之利率計算利息、遲延利息。<BR>前項公告方式，乙方除應於營業場所及網站公告外，雙方另約定應以 <B><U>存摺登錄</U></B> 之方式告知。甲方同意以存摺登錄告知時，以系統上線日視為已告知。(本項為個別商議條款)<BR>乙方調整指標利率時，甲方得請求乙方提供該筆借款按調整後利率計算之本息攤還方式及本息攤還表。<BR><BR><FONT color=#800080><INPUT value=1 type=hidden name=%%Surrogate_check6><LABEL> <INPUT id=check6 class=text-8pt value=Y type=checkbox name=check6 $check6$>立約人</LABEL></FONT><FONT color=#800080>已審閱、瞭解貴行個別商議條款，並同意遵守本契約條款所載之規範事項。</FONT><BR><BR><FONT color=#0060a0>第七條 (本息攤還方式與還款方式)</FONT><BR>本借款本息攤還方式係自實際撥款日起，依年金法計算，按月本息平均攤還。（即本息定額攤還方式）<BR>甲方授權乙方得免憑甲方之存摺及取款憑條或支票，利用自動化設備或由乙方任一有權簽章人員簽發存款支出憑證，逕自開設於乙方 <B><U>$ACCOUNTBRCN$</U></B> <B><U>$ACCOUNTCD$</U></B> 第 <B><U>$ACCOUNT$</U></B> 帳戶內逕行轉帳繳付甲方借款之有關債務及費用（包括本金、利息、開辦費、聯徵查詢費、遲延利息、違約金等）。借款到期後應辦之一切手續仍當照辦，絕不以已委託轉帳繳納本息等為由不辦理轉期還款手續，否則由本人自負一切責任，另如乙方認有代為扣繳有疑義時，得不代為扣繳，甲方一經接獲通知當即自行繳納款項，絕無異議。<BR>繳付期間悉依乙方規定辦理，無需甲方之存摺、取款條或甲方簽發之本票、支票等支付憑證，若因而發生與第三人間之糾紛與乙方無涉，甲方願負一切責任，倘存款不足繳納期付金額時甲方承諾將前往繳納且依約負擔逾期之違約金及遲延利息。<BR>乙方應提供甲方借款本息計算方式及攤還表，並應告知網路或其他查詢方式。<BR><FONT color=#0060a0>第八條 (費用之收取)</FONT><BR>本借款之費用約定如下：<BR>開辦費:新台幣 <B><U>伍仟元整</U></B> 。<BR>前項所列費用均以收取一次為限。且除前項所列費用之項目與金額外，乙方不得另外收取其他費用，但甲乙雙方依消費者保護法第15條規定，個別磋商者，不在此限。<BR>依授信利率及相關費用標準計算之應付所有總費用，以信用額度借款本金計算之年百分率： <B><U>7.000</U></B> %。<BR>(年百分率計算基準日及日後年百分率會依實際借款期間、利率調整等因素而變動)<BR><FONT color=#0060a0>第九條 (消費者資訊之利用) </FONT><BR>乙方僅得於履行本契約之目的範圍內，蒐集、處理及利用甲方之個人資料及與金融機構之往來資料。但相關法令另有規定者，不在此限。<BR>甲方：<BR>(二者擇一勾選；未勾選者，視為不同意)<BR><FONT color=#800080><INPUT value=1 type=hidden name=%%Surrogate_check9N><LABEL> <INPUT id=check9N class=text-8pt value=N type=checkbox name=check9N $check9N$>不同意(甲方如不同意，乙方將無法提供本項借款服務)</LABEL></FONT><BR><FONT color=#800080><INPUT value=1 type=hidden name=%%Surrogate_check9Y><LABEL> <INPUT id=check9Y class=text-8pt value=Y type=checkbox name=check9Y $check9Y$>同意</LABEL></FONT><BR>乙方得將甲方與乙方之個人與授信往來資料提供予財團法人金融聯合徵信中心及受乙方遵循相關法令委任代為處理事務之人。但乙方經甲方同意而提供予前述機構之甲方與乙方往來資料如有錯誤或變更時，乙方應主動適時更正或補充，並要求前述機構或單位回復原狀，及副知甲方。<BR>甲方提供乙方之相關資料，如遭乙方以外之機構或人員竊取、洩漏、竄改或其他侵害者，應儘速以適當方式通知甲方，且甲方向乙方要求提供相關資料流向情形時，乙方應即提供甲方該等資料流向之機構或人員名單。<BR><FONT color=#0060a0>第十條 (個別商議條款)</FONT><BR>一、甲方同意繳付聯徵查詢費新台幣 <B><U>貳佰元整</U></B> 。<BR>二、甲方如有下列情形之一，經乙方於合理期間書面通知或催告，乙方得隨時停止甲方未動用之授信金額、減少對甲方之授信金額或視為全部到期：<BR>　(一) 甲方於乙方授信前，提供不實財務報告或資料致乙方為錯誤評估者。<BR>　(二) 甲方或其負責人使用之票據有退票未經清償或到期未能兌現者。<BR>　(三) 甲方在其他金融機構之授信案件有逾期未清償款項之情事者。<BR>　(四) 違反與乙方簽訂之授信契據或對乙方所為之聲明、切結、承諾事項者。<BR>　甲方如發生前述情事，將可能導致已核准之金額無法動用或減少金額或喪失期限利益而被主張提前到期。<BR>三、甲方同意有法律上利害關係之第三人代為履行債務前，乙方得於該第三人代為履行債務之目的範圍內提供借款人之貸款餘額、利率、利息、違約金、清償日及放款帳戶之歷史交易紀錄等個人資料予該第三人。<BR><BR><FONT color=#800080><INPUT value=1 type=hidden name=%%Surrogate_check10><LABEL> <INPUT id=check10 class=text-8pt value=Y type=checkbox name=check10 $check10$>立約人</LABEL></FONT><FONT color=#800080>已審閱、瞭解貴行個別商議條款，並同意遵守本契約條款所載之規範事項。</FONT><BR><BR><FONT color=#0060a0>第十一條 </FONT><BR>甲方同意乙方於撥款時倘經再次查詢聯徵中心後，發現甲方有其他新增核准應計入DBR22倍規範之授信額度，甲方同意乙方保留核貸與否之權利。DBR 22倍規範：係指「金融機構對於債務人於全體金融機構之無擔保債務(包括信用卡、現金卡及信用貸款)歸戶後之總餘額除以平均月收入，不宜超過22倍」(簡稱DBR 22倍)。<BR><FONT color=#0060a0>第十二條 (線上簽署契約適用條款)：</FONT> <BR>一、貸款申請書為本契約之一部分，與本契約具有相同之效力。<BR>二、乙方及甲方同意以電子文件作為表示方法，依本契約交換之電子文件，其效力與書面文件相同。<BR>三、乙方、甲方應保存所有電子融資相關之文件紀錄，並應確保其真實性及完整性。乙方對於前項紀錄之保存，應盡善良管理人之注意義務，保存期限至少為授信全數清償後十五年。<BR>四、乙方及甲方同意以符合電子簽章法之簽章，或以「金融機構辦理電子銀行業務安全控管作業基準」所訂之安全規範，作為甲方身分識別與同意本契約條款之依據，無須另行簽名或蓋章。 <BR>五、契約之交付：甲方同意本契約由乙方以電子通路或雙方約定之方式提供收執，視同實體契約文件交付，並同意以銀行保存或列印之資料作為雙方借款之憑證。前項電子通路係指電子郵件通知、網路銀行、行動銀行或雙方約定之其他電子通路之一。 <BR>六、甲方同意乙方及受乙方委任代為處理事務之人皆得就與本申請書及各項業務往來有關事項之雙方口頭及電話談話予以錄音，並得自行決定保存電話錄音之期間。在任何爭訟程序中，並得以該錄音作為證據以資對抗申請人或任何利害關係人。<BR>七、為維護甲方權益，甲方對本服務有所疑義時，除書面外，亦得透過下列方式向乙方提出申訴或反映意見： 電話：(04)2227-3131、0800-033175 或各營業單位 或網址：www.tcb-bank.com.tw<BR>上開資料如有變更，乙方應於營業場所或網站公告。 乙方受理申訴後，將由專人與甲方溝通說明釐清原因，並將處理結果回覆甲方。<BR><BR><FONT color=#800080><INPUT value=1 type=hidden name=%%Surrogate_check12><LABEL> <INPUT id=check12 class=text-8pt value=Y type=checkbox name=check12 $check12$>立約人</LABEL></FONT><FONT color=#800080>已審閱、瞭解上述契約條款，並同意遵守本契約條款所載之規範事項。</FONT><BR><BR><FONT color=#0060a0>第十三條 (遲延利息及違約金)</FONT><BR>甲方如延遲還本或付息時，應自逾期之日起照應還款額按本借款利率計付遲延期間之遲延利息並收取違約金。違約金計收方式為：自逾期之日起六個月以內者，按原借款利率之百分之十，逾期超過六個月部分，按原借款利率之百分之二十，按期計收違約金，每次違約狀態最高連續收取期數為九期。<BR><FONT color=#0060a0>第十四條 (加速條款)</FONT><BR>甲方對乙方任一借款所負之支付一切本息及費用之債務，均應依約定期限如數清償。<BR>甲方如有下列情形之一，乙方得酌情縮短借款期限，或視為全部到期。但乙方依下列第二款、第六款及第七款之任一事由為前揭主張時，應於合理期間以書面通知甲方後，始生縮短借款期限，或視為全部到期之效力：<BR>一、任何一宗債務不依約清償本金者。<BR>二、任何一宗債務不依約支付利息、費用、其他應付款項者。<BR>三、依破產法或消費者債務清理條例聲請和解、聲請宣告破產、經票據交換所通知拒絕往來、停止營業，清理債務者。<BR>四、因債務人死亡而其繼承人聲明為拋棄繼承者。<BR>五、因刑事而受沒收主要財產之宣告者。<BR>六、甲方對乙方所負債務，其實際資金用途與乙方核定用途不符者。<BR>七、受強制執行或假扣押、假處分或其他保全處分，致乙方有不能受償之虞者。<BR><FONT color=#0060a0>第十五條 (抵銷權之行使)</FONT><BR>甲方不依本契約之約定按期攤付本息時，債權債務屆期或依前條規定視為到期，乙方得將甲方寄存乙方之各種存款及對乙方之其他債權於必要範圍內期前清償，並將期前清償款項抵銷甲方對乙方所負本契約之債務。<BR>乙方依前項為抵銷，其抵銷之意思表示應以書面方式通知甲方，其內容應包括行使抵銷權之事由、抵銷權之種類及數額，並以下列順序辦理抵銷：<BR>一、甲方對乙方之債權先抵銷。<BR>二、已屆清償期者先抵銷，未屆清償期者後抵銷。<BR>三、抵銷存款時，以存款利率低者先抵銷。<BR><FONT color=#0060a0>第十六條 (住所變更之告知)</FONT><BR>甲方之住所如有變更，應即以書面通知乙方，如未為通知，乙方將有關文書於向本約定書所載或甲方最後通知乙方之住所發出後，經通常之郵遞期間即視為到達。<BR><FONT color=#0060a0>第十七條 (委外催收之告知)</FONT><BR>甲方如發生延滯逾期返還本金或利息時，乙方得將債務催收作業委外處理，並應於債務委外催收前以書面通知甲方。通知內容應依相關法令規定，載明受委託機構名稱、催收金額、催收錄音紀錄保存期限，及其他相關事項。<BR>乙方應將受委託機構基本資料公佈於乙方營業場所及網站。<BR>乙方未依第一項規定通知或受委託機構未依相關法令規定辦理催收，致甲方受損者，乙方應負連帶賠償責任。<BR><FONT color=#0060a0>第十八條 (委外業務之處理)</FONT><BR>乙方依主管機關相關法令規定，得將交易帳款收付業務、電腦處理業務或其他與本契約有關之附隨業務，委託第三人(機構)辦理。<BR>乙方依前項規定委外處理業務時，應督促並確保該等資料利用人遵照銀行法及其他相關法令之保密規定，不得將該等有關資料洩漏予第三人。<BR>受乙方委託處理資料利用人，違反個人資料保護法規定，致個人資料遭不法蒐集、處理、利用或其他侵害甲方權利者，甲方得依民法、個人資料保護法或其他相關法令規定，向乙方及其委託處理資料利用人請求連帶賠償。<BR><FONT color=#0060a0>第十九條 (服務專線)</FONT><BR>乙方之服務專線如下：<BR>　■電話：(04)2227-3131；0800-033175<BR>　■傳真：(04)2227-9191<BR>　■電子信箱(E-MAIL)：https://www.tcb-bank.com.tw/quickarea/Pages/sevmail.aspx<BR>　■網址：http://www.tcb-bank.com.tw<BR>　□其他：<BR>上開資料如有變更，乙方應於營業場所或網站公告。<BR><FONT color=#0060a0>第二十條 (管轄法院)</FONT><BR>倘因本契約涉訟者，雙方同意以 <B><U>臺灣臺北地方法院</U></B> 第一審管轄法院，但不得排除消費者保護法第四十七條或民事訴訟法第二十八條第二項、第四百三十六條之九小額訴訟管轄法院之適用。<BR><FONT color=#0060a0>第二十一條 (契約之交付)</FONT><BR>本契約正本乙式貳份，由甲乙雙方各執乙份為憑。<BR><BR><FONT color=#0060a0>【其他說明】</FONT><BR>「定儲指數月指標利率」定義、調整方式 ：<BR>(一) 以台銀、土銀、華銀、彰銀、一銀及乙方等六家銀行一年期定期儲蓄存款機動利率之平均利率訂定之。<BR>(二) 每月調整一次，其公告生效日為每月十五日，並於生效日前第十天（即各當月五日）依中央銀行公告上開六家銀行之一年期定儲機動利率以算術平均法計算平均利率訂定（小數點後取三位以下四捨五入），如生效日遇假日以次營業日為生效日，又如遇有不可抗力因素發生（如上開銀行被合併、消滅‧‧‧等）乙方保有變更定儲指數月指標利率構成標的與調整頻率之權利。<BR><BR><FONT color=#800080><INPUT value=1 type=hidden name=%%Surrogate_checkall><LABEL> <INPUT id=checkall class=text-8pt value=Y type=checkbox name=checkall $checkall$>立約人</LABEL></FONT><FONT color=#800080>已充分瞭解本契約條款，並同意遵守本契約條款所載之規範事項。</FONT><BR><BR>認證方式：網銀<B>20151216PONL0001066</B> 簽署日期：中華民國 <B>$SignY$</B> 年 <B>$SignM$</B> 月 <B>$SignD$</B>日\n<DIV align=right><BR>線上版v10412<BR></DIV>乙 方：合作金庫商業銀行股份有限公司 <BR>代 表 人：董事長 <BR>地 址：臺北市中正區館前路77號 <BR>代 理 人：<B> 測試分行一 </B>經理 <BR>地 址： <BR>電 話：<BR><BR>\n<TABLE style=\"BORDER-BOTTOM: black 2px solid; BORDER-LEFT: black 2px solid; FONT-FAMILY: 新細明體; FONT-SIZE: 10pt; BORDER-TOP: black 2px solid; BORDER-RIGHT: black 2px solid\" border=0 cellSpacing=0 width=\"100%\">\n<TBODY>\n<TR vAlign=top>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\">\n<DIV align=center>貸放種類</DIV></TD>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\">\n<DIV align=center>核准號碼</DIV></TD>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\">\n<DIV align=center>科目</DIV></TD>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\">\n<DIV align=center>帳號</DIV></TD>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\">\n<DIV align=center>經辦</DIV></TD>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\">\n<DIV align=center>核章</DIV></TD></TR>\n<TR vAlign=top>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\"><BR><BR><BR></TD>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\"><IMG border=0 alt=\"\" src=\"/icons/ecblank.gif\" width=1 height=1></TD>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\"><IMG border=0 alt=\"\" src=\"/icons/ecblank.gif\" width=1 height=1></TD>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\"><IMG border=0 alt=\"\" src=\"/icons/ecblank.gif\" width=1 height=1></TD>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\"><IMG border=0 alt=\"\" src=\"/icons/ecblank.gif\" width=1 height=1></TD>\n<TD style=\"BORDER-BOTTOM: black 1px solid; BORDER-LEFT: black 1px solid; BORDER-TOP: black 1px solid; BORDER-RIGHT: black 1px solid\" width=\"17%\"><IMG border=0 alt=\"\" src=\"/icons/ecblank.gif\" width=1 height=1></TD></TR></TBODY></TABLE></DIV><!-- <div style='FONT-SIZE:9pt;text-align:right'></div> --><!-- Put your stuff here --></TD></TR></TBODY></TABLE>"
					},
					{
						"dataType": "H2",
						"verno":"V123123",
						"blobData": "<DIV style=\"HEIGHT: 18px\">&nbsp;</DIV><STYLE>dl{clear:left;}dt,dd{float:left;margin-left:0px;}</STYLE><TABLE height=500 cellSpacing=0 cellPadding=0 width=740 align=center border=0><TBODY><TR vAlign=top><TD><DIV style=\"FONT-SIZE: 20pt; FONT-FAMILY: 新細明體\" align=center><BR>合作金庫商業銀行&nbsp;&nbsp;員工貸款增補條款契約書<BR></DIV><!-- Put your stuff here --><DIV id=divcontent style=\"FONT-SIZE: 12pt; FONT-FAMILY: 新細明體; LINE-HEIGHT: 20px\"><BR><TABLE style=\"LINE-HEIGHT: 30px\" cellSpacing=0 cellPadding=0 width=\"100%\" border=0><TBODY><TR vAlign=top><TD width=\"4%\">一、</TD><TD width=\"96%\" colSpan=2>借款人 <B>曾浩呆</B> 於中華民國 <B><U>$BY$</U></B> 年 <B><U>$BM$</U></B> 月 <B><U>$BD$</U></B> 日向貴行申請員工貸款新台幣 <B><U>玖拾玖萬玖仟玖佰玖拾玖元整</U></B> ，立有借據或借款契約為憑。</TD></TR><TR vAlign=top><TD width=\"4%\">二、</TD><TD width=\"96%\" colSpan=2>茲借款人經洽貴行同意，就原借據或借款契約條款增補如下，並同意依下列規定辦理：</TD></TR><TR vAlign=top><TD width=\"4%\"><IMG border=0 alt=\"\" src=\"/icons/ecblank.gif\" width=1 height=1></TD><TD width=\"3%\">(一)</TD><TD width=\"93%\">「自民國 <B><U>$BY1_1$</U></B> 年 <B><U>$BM1_1$</U></B> 月 <B><U>$BD1_1$</U></B> 日起至民國 <B><U>$EY1_1$</U></B> 年 <B><U>$EM1_1$</U></B> 月 <B><U>$ED1_1$</U></B> 日止按貴行員工貸款規定利率（目前為年利率<B><U>5.000</U></B> %）計付利息，嗣後隨該項貸款利率調整而調整」。</TD></TR><TR vAlign=top><TD width=\"4%\"><IMG border=0 alt=\"\" src=\"/icons/ecblank.gif\" width=1 height=1></TD><TD width=\"3%\">(二)</TD><TD width=\"93%\">借款人願遵守貴行因應經營政策改變而調整之員工貸款相關授信條件，包括優惠利率、適用優惠利率之最高貸款金額等。</TD></TR><TR vAlign=top><TD width=\"4%\"><IMG border=0 alt=\"\" src=\"/icons/ecblank.gif\" width=1 height=1></TD><TD width=\"3%\">(三)</TD><TD width=\"93%\">員工擔保貸款：於貸款未全部清償前，如借款人中途離職（退休除外）時，借款人應即一次全部清償本筆借款本息或改依貴行其他相關貸款規定辦理。</TD></TR><TR vAlign=top><TD width=\"4%\"><IMG border=0 alt=\"\" src=\"/icons/ecblank.gif\" width=1 height=1></TD><TD width=\"3%\">(四)</TD><TD width=\"93%\">員工無擔保消費者貸款：於貸款未全部清償前，如借款人中途離職（包括辭職、退休、死亡、資遣等或其他原因離職）時，借款人應即一次全部清償本筆借款本息。</TD></TR><TR vAlign=top><TD width=\"4%\">三、</TD><TD width=\"96%\" colSpan=2>除前開增補部分外，原借據或借款契約等其他約定仍繼續有效。</TD></TR></TBODY></TABLE><BR>此致<BR>合作金庫商業銀行股份有限公司<BR><BR><FONT color=#800080><INPUT type=hidden value=1 name=%%Surrogate_checkall><LABEL> <INPUT id=checkall class=text-8pt type=checkbox value=Y name=checkall $checkall$>立約人</LABEL></FONT><FONT color=#800080>已充分瞭解本增補契約條款，並同意遵守所載之規範事項。</FONT><BR><BR>認證方式：網銀<B>20151128PONL0000727</B> 簽署日期：中華民國 <B>$SignY$</B> 年 <B>$SignM$</B> 月 <B>$SignD$</B>日<DIV align=right><BR>（本切結書請併同借款憑證妥善保管）<BR><BR>線上版v10601</DIV></DIV><!-- <div style='FONT-SIZE:9pt;text-align:right'></div> --><P><!-- Put your stuff here --></P></TD></TR></TBODY></TABLE>"
					}
				]
			}

		}
	}
};
