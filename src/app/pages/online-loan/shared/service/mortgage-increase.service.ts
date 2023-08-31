/**
 * 房貸增貸用(其他貸款功能暫存資料也使用)
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';
import { F9000401ApiService } from "@api/f9/f9000401/f9000401-api.service";
import { FormateService } from "@shared/formate/formate.service";

@Injectable()

export class MortgageIncreaseService {
    allData: any = {}; //全部暫存資料,f9000409使用(暫存)
    personalData: any = {}; //個人基本資料(暫存)
    jobData: any = { //職業資料儲存
        apply_trade_detail: [], //行業別
        metier_detail: [], //職業別細項
        metier_sub_detail: [] //職業別分項
    };
    //使用者選擇之行業別相關資料，帶入申請書預設
    selected_job: any = {
        applyTrade: {}, //行業別
        applyTrade_Node: '', //行業別代號
        applyTrade_Name: '', //行業別中文
        metier: {}, //職業別細項
        metier_Node: '', //職業別細項代號
        metier_Name: '', //職業別細項中文
        metier_sub: {},  //職業別分項
        metier_sub_Node: '', //職業別分項代號
        metier_sub_Name: '' //職業別分項項中文
    };
    //財務收支年度，kyc儲存帶入申請書
    mYear = [];
    //資金用途
    selectLoanUsage = {};
    //預填單輸入之資料
    resverData = {
        name: '', //kyc 姓名
        repName: '', //姓名
        id_no: '', //身分證字號
        kycold: '', //年齡
        applyBir: '', //出生年月日
        sex: '', //性別
    };
    kycAllData: any = {}; //kyc暫存資料(未formate過)
    applyAllData: any = {}; //申請書暫存資料(未formate過)
    adressData: any = {}; //地址資料
    //同一關係人資料
    relationData = {
        family: [],
        company: [],
        consumer: []
    };
    //同意條款資訊
    termData: any = {};
    //分行暫存資料(信貸)
    creditBranchData: any = {};
    //分行暫存資料(房貸)
    houseBranchData: any = {};
    //縣市資料暫存
    cityData: any = {};
    //分行選擇狀態： true:信貸(台幣帳戶) 房貸(有委託扣款帳號)， false:信貸(自選) 房貸(無委託扣款帳號) 
    branchStatus: boolean;
    //判斷該階段是否有儲存過資料
    stageStaus = {
        term: false,
        kyc: false,
        apply: false,
        relation: false,
        branch: false,
        load: false
    };
    accountBind: any = {};

    constructor(
        private _logger: Logger,
        private f9000401: F9000401ApiService,
        private _formateService: FormateService
    ) { }

    //個人基本資料查詢 API f9000401
    public sendPersonalData(): Promise<any> {
        this._logger.log("into sendPersonalData");
        let req: any = {};
        return this.f9000401.getData(req).then(
            (success) => {
                this._logger.log("success:", success);
                return Promise.resolve(success);
            },
            (failed) => {
                this._logger.log("failed:", failed);
                return Promise.reject(failed);
            }
        );
    }

    //取得儲存階段資料
    getStageStaus() {
        this._logger.log("into getStageStaus, stageStaus:", this.stageStaus);
        return this.stageStaus;
    }

    //取得kyc暫存(未formate)
    getKycAllData() {
        this._logger.log("get kycAllData:", this.kycAllData);
        return this.kycAllData;
    }

    //重置基本資料
    resetPersonalData() {
        this.personalData = {};
    }
    setPersonalData(setData) {
        this.personalData = setData;
        this._logger.log("set personalData:", this.personalData);
    }
    getPersonalData() {
        this._logger.log("get personalData:", this.personalData);
        return this.personalData; //f9000401res無年齡欄位，待確認
    }
    //重置職業資料
    resetJobData() {
        this.jobData = { //職業資料儲存
            apply_trade_detail: [], //行業別
            metier_detail: [], //職業別細項
            metier_sub_detail: [] //職業別分項
        };
    }
    //重置使用者選擇之行業別相關資料，帶入申請書預設
    resetSelected_job() {
        this.selected_job = {
            applyTrade: {}, //行業別
            applyTrade_Node: '', //行業別代號
            applyTrade_Name: '', //行業別中文
            metier: {}, //職業別細項
            metier_Node: '', //職業別細項代號
            metier_Name: '', //職業別細項中文
            metier_sub: {},  //職業別分項
            metier_sub_Node: '', //職業別分項代號
            metier_sub_Name: '' //職業別分項項中文
        };
    }
    resetResverData() {
        this.resverData = {
            name: '', //kyc 姓名
            repName: '', //姓名
            id_no: '', //身分證字號
            kycold: '', //年齡
            applyBir: '', //出生年月日
            sex: '', //性別
        };
    }
    //重置財務收支年度，kyc儲存帶入申請書
    resetmYear() {
        this.mYear = [];
    }
    //重置資金用途
    resetSelectLoanUsage() {
        this.selectLoanUsage = {};
    }
    resetKycAllData() {
        this.kycAllData = {};
    }
    resetApplyAllData() {
        this.applyAllData = {};
    }
    resetAdressData() {
        this.adressData = {}; //地址資料
    }
    resetRelationData() {
        //同一關係人資料
        this.relationData = {
            family: [],
            company: [],
            consumer: []
        };
    }
    resetTermData() {
        //同意條款資訊
        this.termData = {};
    }
    resetCreditBranchData() {
        this.creditBranchData = {};
    }
    resetHouseBranchData() {
        this.houseBranchData = {};
    }
    resetCityData() {
        this.cityData = {};
    }
    //重置哪個階段階段暫存過資料
    resetStageStaus() {
        this.stageStaus = {
            term: false,
            kyc: false,
            apply: false,
            relation: false,
            branch: false,
            load: false
        };
    }

    //職業別資料暫存
    setJobData(apply_trade_detail, metier_detail, metier_sub_detail) {
        this.jobData.apply_trade_detail = apply_trade_detail; //行業別
        this.jobData.metier_detail = metier_detail; //職業別細項
        this.jobData.metier_sub_detail = metier_sub_detail; //職業別分項
        this._logger.log("set jobData:", this.jobData);
    }
    //取職業資料
    getJobData() {
        this._logger.log("set jobData:", this.jobData);
        return this.jobData; //kyc、申請書 使用
    }
    //取得使用者於kyc選擇的職業資料
    getKycJobData() {
        this._logger.log("selected_job:", this.selected_job);
        return this.selected_job;
    }
    //存財務收支年度
    getMYear() {
        this._logger.log("mYear:", this.mYear);
        return this.mYear;
    }
    //取得存財務收支年度
    setMYear(setData: any) {
        this.mYear = setData;
        this._logger.log("mYear:", this.mYear);
    }
    //取得輸入之預填單資訊
    getResverData() {
        this._logger.log("resverData:", this.resverData);
        return this.resverData;
    }
    //存入輸入之預填單資訊
    setResverData(setData) {
        this._logger.log("into setResverData, setData:",this._formateService.transClone(setData));
        this.resverData.name = this._formateService.checkField(setData, 'name'); //姓名 kyc(與下方值相同)
        this.resverData.repName = this._formateService.checkField(setData, 'repName'); //姓名
        this.resverData.id_no = this._formateService.checkField(setData, 'id_no'); //身分證字號
        this.resverData.kycold = this._formateService.checkField(setData, 'kycold'); //年齡
        this.resverData.applyBir = this._formateService.checkField(setData, 'applyBir'); //出生年月日
        this.resverData.sex = this._formateService.checkField(setData, 'sex'); //性別
        this._logger.log("resverData:", this.resverData);
    }

    //暫存地址資料
    saveAdressData(setData) {
        this.adressData = setData;
        this._logger.log("into saveAdressData, adressData:", this.adressData);
    }

    //取得地址資料
    getAdressData() {
        this._logger.log("into getAdressData, adressData:", this.adressData);
        return this.adressData;
    }

    //暫存同意條款資料
    setTermData(setData) {
        this._logger.log("into setTermData, setData:", this._formateService.transClone(setData));
        this.termData = setData;
        this._logger.log("into setTermData, termData:", this._formateService.transClone(this.termData));
    }

    //取得同意條款資料
    getTermData() {
        this._logger.log("into setTermData, termData:", this._formateService.transClone(this.termData));
        return this.termData;
    }

    //儲存關係人資料
    setRelationData(setData, soft: number) {
        this._logger.log("into setRelationData, setData:", setData);
        switch (soft) {
            case 1:
                this.relationData.family = setData;
                break;
            case 2:
                this.relationData.company = setData;
                break;
            case 3:
                this.relationData.consumer = setData;
        }
        this._logger.log("into setRelationData, relationData:", this._formateService.transClone(this.relationData));
    }

    //取得關係人暫存資料
    getRelationData() {
        this._logger.log("into getRelationData, relationData:", this._formateService.transClone(this.relationData));
        return this.relationData;
    }

    //存取信貸分行資料
    setCreditBranchData(setData) {
        this._logger.log("into setCreditBranchData, setData:", this._formateService.transClone(setData));
        this.creditBranchData = setData;
        this._logger.log("into setCreditBranchData, creditBranchData:", this._formateService.transClone(this.creditBranchData));
    }

    //取得信貸分行資料
    getCreditBranchData() {
        this._logger.log("into getCreditBranchData, creditBranchData:", this._formateService.transClone(this.creditBranchData));
        return this.creditBranchData;
    }

    //存取房貸分行資料
    setHouseBranchData(setData) {
        this.houseBranchData = setData;
        this._logger.log("into setHouseBranchData, houseBranchData:", this._formateService.transClone(this.houseBranchData));
    }

    //取得房貸分行資料
    getHouseBranchData() {
        this._logger.log("into getHouseBranchData, houseBranchData:", this._formateService.transClone(this.houseBranchData));
        return this.houseBranchData;
    }

    //存取縣市資料
    setCityData(setData) {
        this._logger.log("into setCityData, cityData:", this.cityData);
        this.cityData = setData;
    }

    //取得縣市資料
    getCityData() {
        this._logger.log("into getCityData, cityData:", this.cityData);
        return this.cityData;
    }

    //存取信貸分行狀態
    setBranchStatus(setData) {
        this._logger.log("into setBranchStatus, branchStatus:", this.branchStatus);
        this.branchStatus = setData;
    }

    //取得信貸分行狀態
    getBranchStatus() {
        this._logger.log("into getBranchStatus, branchStatus:", this.branchStatus);
        return this.branchStatus;
    }

    //存取查無帳號之帳號
    setAccountBind(setData) {
        this._logger.log("into setAccountBind, setData:", setData);
        this.accountBind = setData;
        this._logger.log("into setAccountBind, accountBind:", this.accountBind);
        return this.accountBind;
    }

    //取得查無帳號之帳號
    getAccountBind() {
        this._logger.log("into getAccountBind, accountBind:", this.accountBind);
        return this.accountBind;
    }



    //重置全部暫存資料
    resetData() {
        this._logger.log("into allService, resetData function");
        //送api409結果電文(一次全部送)
        this.allData = {
            custId: '', //客戶統一編號
            crdate: '', //案件建立日期
            ebkcaseno: '', //網銀案件編號
            txkind: '', //申請種類
            branchId: '', //受理分行代號
            branchName: '', //受理分行中文名稱
            giveAmt: '', //申請金額
            giveDurYymm: '', //貸款期間
            loanUsage: '', //資金用途
            refundWay: '', //償還方式
            graveYymm: '', //本金寬緩期
            repName: '', //申請人姓名
            repName_long: '', //長戶名
            sex: '', //性別
            applyBir: '', //出生日期
            levelOfEducation: '', //教育程度
            maritalStatus: '', //婚姻狀況
            supportChildren: '', //扶養子女數
            applyTelSun: '', //聯絡電話（日）
            applyTelNight: '', //聯絡電話（夜）
            applyTelWalk: '', //聯絡電話（行動）
            applyTelFax: '', //傳真電話
            eMail: '', //電子信箱
            houseStatus: '', //住宅狀況
            homeownership2: '', //住宅狀況-設質情形
            houseDurYymm: '', //現在房屋居住期間
            applyHouseAddr: '', //戶籍地址
            applyAddr: '', //通訊地址註記
            applyLiveAddr: '', //通訊地址
            applyServeUnit: '', //公司名稱
            applyBussitem: '', //營業項目
            applyWorker: '', //員工人數
            applyTelFirm: '', //公司電話
            applyTelExt: '', //公司電話分機
            applyDept: '', //所屬部門
            applyTrade: '', //行業別
            metier: '', //職業別細項
            metier_sub: '', //職業別分項
            applyFirmAddr: '', //公司地址
            applyPost: '', //擔任職務
            applyServeYymm: '', //服務年資
            applyServeMm: '', //服務年資-月
            serverdur: '', //現職服務年資
            serverdurMm: '', //現職服務年資-月
            mYear: '', //最近財務收支年度
            applyNt: '', //年收入-本人
            spouseNt: '', //年收入-配偶
            totalNt: '', //年收入-合計(家庭)
            expense: '', //年支出(家庭)
            frmPaylist: '', //繳息清單寄發註記
            account: '', //指定撥入帳號
            accountbrid: '', //指定撥入帳號分行代號
            accountbrcn: '', //指定撥入帳號分行名稱
            accountcd: '', //指定撥入帳號科目中文
            acctno: '', //原放款帳號
            rate: '', //利率
            kycyn: '', //本人識字且採用國語作為本次個人貸款客戶K Y C表之填答方式
            kycloanUsage: '', //借款用途
            kycold: '', //年齡
            kycetch: '', //票據帳戶使用狀況
            kycetchno: '', //票據帳戶使用狀況-退票未註銷張數
            kycbankel: '', //銀行貸款狀況
            kyccard: '', //信用卡使用狀況
            kycpaymo: '', //銀行貸款每月應繳金額
            kycelamt: '', //貸款餘額
            kycelmo: '', //原貸款總金額
            kycko: '', //本人已填妥「個人貸款客戶KYC表」無誤
            agree: '', //客戶同意事項文件種類+是否同意或取得(Y/N/O)內容版號
            agreeJc: '', //是否同意查詢聯徵
            agreeJcVer: '', //是否同意查詢聯徵版號
            agreeCt: '', //是否同意借款契約
            agreeCtVer: '', //是否同意借款契約版號
            agreeTr: '', //是否同意約定條款
            agreeTrVer: '', //是否同意約定條款版號
            agreeCm: '', //是否同意共同行銷
            agreeCmVer: '', //是否同意共同行銷版號
            agreeCp: '', //是否同意專人聯絡
            companyId: '', //公司統編
            relationKind1: '', //關係註記1
            relationKind2: '', //關係註記2
            relationKind3: '', //關係註記3
            trnsToken: '' //交易控制碼
        };

    }

    //檢查暫存物件，有問題就重置物件
    private checkAllData() {
        if (typeof this.allData != 'object'
            || !this.allData
            || Object.keys(this.allData).length <= 0
        ) {
            this.resetData();
        }
    }

    //分行暫存
    public saveBranchData(setData, type): Promise<any> {
        this.checkAllData();
        this._logger.log("into saveBranchData, setData:", setData);
        this._logger.log("into saveBranchData, type:", type);
        //房貸增貸
        if (type == 'mortgage') {
            this._logger.log("into type mortgage save");
            // this.allData['ebkcaseno'] = this._formateService.checkField(setData,''); //** */原案件編號(缺)
            this.allData['txkind'] = this._formateService.checkField(setData, 'txkind');
            this.allData['acctno'] = this._formateService.checkField(setData, 'outLaran'); //放款帳號
            this.allData['account'] = this._formateService.checkField(setData, 'outLargn'); //指定撥入帳號
            this.allData['branchId'] = this._formateService.checkField(setData, 'outBrch1'); //受理分行代號
            this.allData['branchName'] = this._formateService.checkField(setData, 'outBrchname1'); //受理分行中文名
            this.allData['accountbrid'] = this._formateService.checkField(setData, 'outBrch2');//指定撥入帳號分行代號
            this.allData['accountbrcn'] = this._formateService.checkField(setData, 'outBrchName2');//指定撥入帳號分行名稱
            this.allData['rate'] = this._formateService.checkField(setData, 'outRate'); //利率 
            if (setData['accountcd'] == '--') {
                this.allData['accountcd'] = '';
            } else {
                this.allData['accountcd'] = this._formateService.checkField(setData, 'accountcd'); //** */指定撥入帳號科目中文
            }
            //信貸
        } else {
            this._logger.log("into type credit save");
            // this.allData['ebkcaseno'] = this._formateService.checkField(setData,''); //** */原案件編號(缺)
            this.allData['txkind'] = this._formateService.checkField(setData, 'txkind');
            this.allData['account'] = this._formateService.checkField(setData, 'account');
            this.allData['acctno'] = this._formateService.checkField(setData, 'acctno');
            this.allData['branchId'] = this._formateService.checkField(setData, 'branchId');
            this.allData['branchName'] = this._formateService.checkField(setData, 'branchName');
            this.allData['accountbrid'] = this._formateService.checkField(setData, 'accountbrid');
            this.allData['accountbrcn'] = this._formateService.checkField(setData, 'accountbrcn');
            if (setData['accountcd'] == '--') {
                this.allData['accountcd'] = '';
            } else {
                this.allData['accountcd'] = this._formateService.checkField(setData, 'accountcd'); //** */指定撥入帳號科目中文
            }
        }

        let output = {
            data: this.allData,
            status: false,
            msg: 'error'
        };
        output.status = true;
        output.msg = 'success';
        this.stageStaus['branch'] = true; //分行階段儲存完畢
        this._logger.log("stage branch, allData:", this.allData);
        return Promise.resolve(output);
    }

    //同意選單暫存
    public saveTermData(setData): Promise<any> {
        this._logger.log("into save term, setData:", setData);
        this.checkAllData();
        //將長戶名儲存(mainComponent已有暫存)
        let personal = this.getPersonalData();
        if (personal.name_long == '' || personal.name_long == null || typeof personal.name_long == 'undefined') {
            personal.name_long = '';
        }
        this.allData.repName_long = personal.name_long;
        //agree欄位：不包含同意查詢聯徵及專人聯絡多重值,以分號分隔不同文件種類01Yv10406;02Yv10406;0HOv10601..是否同意或取得(Y/N/O)Y:同意 N:不同意 O:空白(英文O)
        this.allData['agree'] = this._formateService.checkField(setData, 'agree');
        this.allData['agreeJc'] = this._formateService.checkField(setData, 'agreeJc'); //是否同意查詢聯徵
        this.allData['agreeJcVer'] = this._formateService.checkField(setData, 'agreeJcVer'); //是否同意查詢聯徵版號
        this.allData['agreeTr'] = this._formateService.checkField(setData, 'agreeTr'); //是否同意借款契約
        this.allData['agreeTrVer'] = this._formateService.checkField(setData, 'agreeTrVer'); //是否同意借款契約版號
        this.allData['agreeCm'] = this._formateService.checkField(setData, 'agreeCm'); //是否同意共同行銷
        this.allData['agreeCmVer'] = this._formateService.checkField(setData, 'agreeCmVer'); //是否同意共同行銷版號
        this.allData['agreeCt'] = this._formateService.checkField(setData, 'agreeCt'); //是否同意借款契約
        this.allData['agreeCtVer'] = this._formateService.checkField(setData, 'agreeCtVer'); //是否同意借款契約版號
        this.allData['agreeCp'] = this._formateService.checkField(setData, 'agreeCp'); //是否同意專人聯絡
        this.allData['trnsToken'] = this._formateService.checkField(setData, 'trnsToken'); //交易控制碼
        let output = {
            data: this.allData,
            status: false,
            msg: 'error'
        };
        output.status = true;
        output.msg = 'success';
        this.stageStaus['term'] = true; //條款階段儲存完畢
        this._logger.log("stage term, allData:", this.allData);
        return Promise.resolve(output);
    }

    //kyc暫存
    public saveKycData(setData, resver): Promise<any> {
        this._logger.log("kyc, setData:", setData);
        this.checkAllData();
        this.allData['giveAmt'] = this._formateService.checkField(setData, 'give_amt'); //申請金額
        this.allData['giveDurYymm'] = this._formateService.checkField(setData, 'give_dur_yymm'); //申請期限
        this.allData['kycyn'] = this._formateService.checkField(setData, 'kycYn'); //本人識字且採用國語作為本次個人貸款客戶K Y C表之填答方式
        this.allData['kycko'] = this._formateService.checkField(setData, 'kycKo'); //本人已填妥「個人貸款客戶KYC表」無誤
        //非預填(登入)  => 無出生年月日，只有預填單有
        if (resver == 'N') {
            //將值存入資金用途(因為值須聯動)，申請書暫存後，中台會處理(借款用途欄位)
            this.allData['loanUsage'] = this._formateService.checkField(setData, 'kycloanUsage'); //借款用途
            //預填單
        } else {
            //預填單存各自欄位，後續中台不做處理
            this.allData['kycloanUsage'] = this._formateService.checkField(setData, 'kycloanUsage'); //借款用途
            //因預填單未選擇日期套件，因此這裡需要將'-'刪除，ex:1993-05-11 => 19930511
            if (setData['applyBir'].indexOf('/') > 0) {
                setData['applyBir'] = setData['applyBir'].replace(/\//g, '');
                this.allData['applyBir'] = this._formateService.checkField(setData, 'applyBir');
            } else if (setData['applyBir'].indexOf('-') > 0) {
                setData['applyBir'] = setData['applyBir'].replace(/-/g, '');
                this.allData['applyBir'] = this._formateService.checkField(setData, 'applyBir');
            } else {
                this.allData['applyBir'] = this._formateService.checkField(setData, 'applyBir');
            }
        }
        this.allData['custId'] = this._formateService.checkField(setData, 'id_no'); //客戶統一編號
        this.allData['kycold'] = this._formateService.checkField(setData, 'kycold'); //年齡
        this.allData['kycetch'] = this._formateService.checkField(setData, 'kycEtch'); //票據帳戶使用狀況
        this.allData['kycetchno'] = this._formateService.checkField(setData, 'kycEtchNo'); //票據帳戶使用狀況-退票未註銷張數
        this.allData['kycbankel'] = this._formateService.checkField(setData, 'kycBankel'); //銀行貸款狀況
        this.allData['kyccard'] = this._formateService.checkField(setData, 'kycCard'); //信用卡使用狀況
        this.allData['mYear'] = this._formateService.checkField(setData, 'm_year'); //最近財務收支年度
        this.allData['applyNt'] = this._formateService.checkField(setData, 'apply_nt'); //年收入-本人
        this.allData['totalNt'] = this._formateService.checkField(setData, 'total_nt'); //年收入-合計(家庭)
        this.allData['expense'] = this._formateService.checkField(setData, 'expense'); //年支出(家庭)
        this.allData['kycpaymo'] = this._formateService.checkField(setData, 'kycPayMo'); //銀行貸款每月應繳金額
        this.allData['kycelamt'] = this._formateService.checkField(setData, 'kycElamt'); //貸款餘額 
        this.allData['kycelmo'] = this._formateService.checkField(setData, 'kycElmo'); //原貸款總金額
        this.allData['repName'] = this._formateService.checkField(setData, 'name'); //中文姓名

        //職業資料需重組requet，代碼+1位空白+中文說明 ex:061100 軍官、軍人
        //行業別
        if (setData.hasOwnProperty('applyTrade') && setData && setData['applyTrade'] != '') {
            this._logger.log("setData.applyTrade:", setData.applyTrade);
            this.allData['applyTrade'] = setData['applyTrade']['CN01'] + ' ' + setData['applyTrade']['CNAME1'];
            this.selected_job['applyTrade'] = setData['applyTrade'];
            this.selected_job['applyTrade_Node'] = setData['applyTrade']['CN01']; //帶入申請書預設
            this.selected_job['applyTrade_Name'] = setData['applyTrade']['CNAME1']; //帶入申請書預設
            this._logger.log("kyc stage, selected_job:", this.selected_job);
        } else {
            this.allData['applyTrade'] = '';
            this.selected_job['applyTrade'] = {};
            this.selected_job['applyTrade_Node'] = '';
            this.selected_job['applyTrade_Name'] = '';
        }
        //職業細項
        if (setData.hasOwnProperty('metier') && setData && setData['metier'] != '') {
            this._logger.log("setData.metier:", setData.metier);
            this.allData['metier'] = setData['metier']['CN01'] + ' ' + setData['metier']['CNAME1'];
            this.selected_job['metier'] = setData['metier'];
            this.selected_job['metier_Node'] = setData['metier']['CN01']; //帶入申請書預設
            this.selected_job['metier_Name'] = setData['metier']['CNAME1']; //帶入申請書預設
            this._logger.log("kyc stage, selected_job:", this.selected_job);
        } else {
            this.allData['metier'] = '';
            this.selected_job['metier'] = {};
            this.selected_job['metier_Node'] = '';
            this.selected_job['metier_Name'] = '';
        }
        //職業分項
        if (setData.hasOwnProperty('metier_sub') && setData && setData['metier_sub'] != '') {
            this.allData['metier_sub'] = setData['metier_sub']['CN01'] + ' ' + setData['metier_sub']['CNAME1'];
            this.selected_job['metier_sub'] = setData['metier_sub'];
            this.selected_job['metier_sub_Node'] = setData['metier_sub']['CN01']; //帶入申請書預設
            this.selected_job['metier_sub_Name'] = setData['metier_sub']['CNAME1']; //帶入申請書預設
            this._logger.log("kyc stage, selected_job:", this.selected_job);
        } else {
            this.allData['metier_sub'] = '';
            this.selected_job['metier_sub'] = {};
            this.selected_job['metier_sub_Node'] = '';
            this.selected_job['metier_sub_Name'] = '';
        }

        let output = {
            data: this.allData,
            status: false,
            msg: 'error'
        };
        output.status = true;
        output.msg = 'success';
        this.stageStaus['kyc'] = true; //kyc階段儲存完畢
        this._logger.log("stage kyc, allData:", this.allData);
        return Promise.resolve(output);
    }

    //申請書暫存
    public saveApplyData(setData, type, resver): Promise<any> {
        this._logger.log("apply, setData:", this._formateService.transClone(setData));
        this.checkAllData();
        this.allData['refundWay'] = this._formateService.checkField(setData, 'refundWay'); //償還方式
        this.allData['graveYymm'] = this._formateService.checkField(setData, 'graveYymm'); //本金寬限期
        this.allData['maritalStatus'] = this._formateService.checkField(setData, 'maritalStatus'); //婚姻狀況
        this.allData['applyBir'] = this._formateService.checkField(setData, 'applyBir'); //出生年月日
        this.allData['id_no'] = this._formateService.checkField(setData, 'id_no'); //身分證
        this.allData['repName'] = this._formateService.checkField(setData, 'name'); //中文姓名 

        let loan_usage = this._formateService.checkField(setData, 'loanUsage'); //資金用途
        this._logger.log("loan_usage:", loan_usage);
        //非預填，當是房貸時要做強制轉換(資金用途)，中台同步處理，「借款用途」需聯動「資金用途」
        if (resver == 'N') {
            if (type == 'mortgage') {
                //房貸增貸，因為前端要將 借款、資金用途,勾搭在一起(預設)，因此這裡在轉為正確要送入中台之值
                if (loan_usage == '05') {
                    this._logger.log("loan_usage 05 turn 03");
                    this.allData['loanUsage'] = '03'; //理財投資用途05 => 理財週轉金03 (將綁定值強制轉換為正確值)
                } else if (loan_usage == '04') {
                    this._logger.log("loan_usage 04 turn 06");
                    this.allData['loanUsage'] = '06'; //家庭生活支出04 => 家計消費06 (將綁定值強制轉換為正確值)
                } else {
                    this.allData['loanUsage'] = loan_usage;
                }
                //信貸無強制綁定
            } else {
                this.allData['loanUsage'] = loan_usage;
            }
            //預填單，資金用途存資金，借款用途存借款(中台不做處理)，「借款用途」不聯動「資金用途」
        } else {
            //這裡因為不聯動，因此借款用途的值不做改變(暫存)
            this.allData['loanUsage'] = loan_usage;
            //因預填單未選擇日期套件，因此這裡需要將'-'刪除，ex:1993-05-11 => 19930511
            if (setData['applyBir'].indexOf('/') > 0) {
                setData['applyBir'] = setData['applyBir'].replace(/\//g, '');
                this.allData['applyBir'] = this._formateService.checkField(setData, 'applyBir');
            } else if (setData['applyBir'].indexOf('-') > 0) {
                setData['applyBir'] = setData['applyBir'].replace(/-/g, '');
                this.allData['applyBir'] = this._formateService.checkField(setData, 'applyBir');
            } else {
                this.allData['applyBir'] = this._formateService.checkField(setData, 'applyBir');
            }
        }

        this.allData['supportChildren'] = this._formateService.checkField(setData, 'supportChildren'); //受撫養未成年子女數
        this.allData['levelOfEducation'] = this._formateService.checkField(setData, 'levelOfEducation'); //教育程度
        this.allData['applyHouseAddr'] = this._formateService.checkField(setData, 'applyHouseAddr'); //戶籍地址，郵遞區號+縣市+鄉鎮市區
        this.allData['applyAddr'] = this._formateService.checkField(setData, 'applyAddr'); //通訊地址註記 01:同戶籍地址 99:其他
        this.allData['applyLiveAddr'] = this._formateService.checkField(setData, 'applyLiveAddr'); //通訊地址，郵遞區號+縣市+鄉鎮市區
        this.allData['applyServeUnit'] = this._formateService.checkField(setData, 'applyServeUnit'); //公司名稱
        this.allData['applyBussitem'] = this._formateService.checkField(setData, 'applyBussitem'); //營業項目
        this.allData['companyId'] = this._formateService.checkField(setData, 'companyId'); //公司統編
        this.allData['applyWorker'] = this._formateService.checkField(setData, 'applyWorker'); //員工人數
        this.allData['applyTelFirm'] = this._formateService.checkField(setData, 'applyTelFirm'); //公司電話
        this.allData['applyTelExt'] = this._formateService.checkField(setData, 'applyTelExt'); //公司電話分機
        this.allData['applyDept'] = this._formateService.checkField(setData, 'applyDept'); //所屬部門
        this.allData['applyFirmAddr'] = this._formateService.checkField(setData, 'applyFirmAddr'); //公司地址，郵遞區號+縣市+鄉鎮市區
        this.allData['applyPost'] = this._formateService.checkField(setData, 'applyPost'); //擔任職務
        this.allData['applyServeYymm'] = this._formateService.checkField(setData, 'applyServeYymm'); //服務年資
        //2019/12/06 服務年資(月)，不補0
        this.allData['applyServeMm'] = this._formateService.checkField(setData, 'applyServeMm');
        this.allData['serverdur'] = this._formateService.checkField(setData, 'serverdur'); //現職服務年資
        //2019/12/06 現職服務年資(月)，不補0
        this.allData['serverdurMm'] = this._formateService.checkField(setData, 'serverdurMm');
        this.allData['applyTelSun'] = this._formateService.checkField(setData, 'applyTelSun'); //聯絡電話（日）
        this.allData['applyTelNight'] = this._formateService.checkField(setData, 'applyTelNight'); //聯絡電話（夜）
        this.allData['applyTelWalk'] = this._formateService.checkField(setData, 'applyTelWalk'); //聯絡電話（行動）
        this.allData['applyTelFax'] = this._formateService.checkField(setData, 'applyTelFax'); //傳真電話
        this.allData['eMail'] = this._formateService.checkField(setData, 'eMail'); //電子信箱
        this.allData['houseStatus'] = this._formateService.checkField(setData, 'houseStatus'); //住宅狀況
        this.allData['homeownership2'] = this._formateService.checkField(setData, 'homeownership2'); //住宅狀況-設質情形
        this.allData['houseDurYymm'] = this._formateService.checkField(setData, 'houseDurYymm'); //已居住期間
        this.allData['mYear'] = this._formateService.checkField(setData, 'mYear'); //最近財務收支年度
        this.allData['applyNt'] = this._formateService.checkField(setData, 'applyNt'); //年收入-本人
        this.allData['spouseNt'] = this._formateService.checkField(setData, 'spouseNt'); //年收入-配偶
        this.allData['totalNt'] = this._formateService.checkField(setData, 'totalNt'); //年收入-合計(家庭)
        this.allData['expense'] = this._formateService.checkField(setData, 'expense'); //家庭年支出
        this.allData['sex'] = this._formateService.checkField(setData, 'sex'); //性別
        this.allData['giveAmt'] = this._formateService.checkField(setData, 'giveAmt'); //預計申請金額
        //職業資料需重組requet，代碼+1位空白+中文說明 ex:061100 軍官、軍人
        //行業別
        if (setData.hasOwnProperty('applyTrade') && setData && setData['applyTrade'] != '') {
            this.allData['applyTrade'] = setData['applyTrade']['CN01'] + ' ' + setData['applyTrade']['CNAME1'];
            this.selected_job['applyTrade'] = setData['applyTrade'];
            this.selected_job['applyTrade_Node'] = setData['applyTrade']['CN01']; //帶入申請書預設
            this.selected_job['applyTrade_Name'] = setData['applyTrade']['CNAME1']; //帶入申請書預設
        } else {
            this.allData['applyTrade'] = '';
            this.selected_job['applyTrade'] = {};
            this.selected_job['applyTrade_Node'] = '';
            this.selected_job['applyTrade_Name'] = '';
        }
        //職業細項
        if (setData.hasOwnProperty('metier') && setData && setData['metier'] != '') {
            this.allData['metier'] = setData['metier']['CN01'] + ' ' + setData['metier']['CNAME1'];
            this.selected_job['metier'] = setData['metier'];
            this.selected_job['metier_Node'] = setData['metier']['CN01']; //帶入申請書預設
            this.selected_job['metier_Name'] = setData['metier']['CNAME1']; //帶入申請書預設
        } else {
            this.allData['metier'] = '';
            this.selected_job['metier'] = {};
            this.selected_job['metier_Node'] = '';
            this.selected_job['metier_Name'] = '';
        }
        //職業分項
        if (setData.hasOwnProperty('metier_sub') && setData && setData['metier_sub'] != '') {
            this.allData['metier_sub'] = setData['metier_sub']['CN01'] + ' ' + setData['metier_sub']['CNAME1'];
            this.selected_job['metier_sub'] = setData['metier_sub'];
            this.selected_job['metier_sub_Node'] = setData['metier_sub']['CN01']; //帶入申請書預設
            this.selected_job['metier_sub_Name'] = setData['metier_sub']['CNAME1']; //帶入申請書預設
        } else {
            this.allData['metier_sub'] = '';
            this.selected_job['metier_sub'] = {};
            this.selected_job['metier_sub_Node'] = '';
            this.selected_job['metier_sub_Name'] = '';
        }
        this.allData['giveDurYymm'] = this._formateService.checkField(setData, 'giveDurYymm'); //申請期限

        let output = {
            data: this.allData,
            status: false,
            msg: 'error'
        };
        output.status = true;
        output.msg = 'success';
        this.stageStaus['apply'] = true; //申請書階段儲存完畢
        this._logger.log("stage apply, allData:", this.allData);
        return Promise.resolve(output);
    }

    // //同一關係人暫存
    public saveRelationData(setData): Promise<any> {
        this.checkAllData();
        //關係註記1(血親) 
        this.allData['relationKind1'] = this._formateService.checkField(setData, 'relationKind1');
        //關係註記1(企業) 
        this.allData['relationKind2'] = this._formateService.checkField(setData, 'relationKind2');
        //關係註記1(配偶負責人) 
        this.allData['relationKind3'] = this._formateService.checkField(setData, 'relationKind3');
        let output = {
            data: this.allData,
            status: false,
            msg: 'error'
        };
        output.status = true;
        output.msg = 'success';
        this.stageStaus['relation'] = true; //關係人階段儲存完畢
        this._logger.log("stage relation, allData:", this.allData);
        return Promise.resolve(output);
    }

    //formate req資料，例:金額*10000
    //resver: 是否為預填單，'Y' 預填單， 'N' 非預填
    formateReqData(setData) {
        let formateData = this._formateService.transClone(setData);
        this._logger.log("formateReqData(), setData:", this._formateService.transClone(setData));
        this._logger.log("formateReqData(), formateData:", this._formateService.transClone(formateData));
        //申請期限
        //使用者有可能輸入 1位數，自動轉換 ex:3年 => 03年 + 00(月份) => 0300
        if (formateData['giveDurYymm'].length < 2) {
            formateData['giveDurYymm'] = '0' + formateData['giveDurYymm'] + '00';
        } else {
            formateData['giveDurYymm'] = formateData['giveDurYymm'] + '00';
        }
        //申請金額
        if (formateData['giveAmt'] != '' && typeof formateData['giveAmt'] != 'undefined') {
            formateData['giveAmt'] = (parseInt(formateData['giveAmt']) * 10000).toString();
        } else {
            formateData['giveAmt'] = '';
        }
        //年收入-本人
        if (formateData['applyNt'] != '' && typeof formateData['applyNt'] != 'undefined') {
            formateData['applyNt'] = (parseInt(formateData['applyNt']) * 10000).toString();
        } else {
            formateData['applyNt'] = '';
        }
        //年收入-配偶
        if (formateData['spouseNt'] != '' && typeof formateData['spouseNt'] != 'undefined') {
            formateData['spouseNt'] = (parseInt(formateData['spouseNt']) * 10000).toString();
        } else {
            formateData['spouseNt'] = '';
        }
        //年收入-合計(家庭)
        if (formateData['totalNt'] != '' && typeof formateData['totalNt'] != 'undefined') {
            formateData['totalNt'] = (parseInt(formateData['totalNt']) * 10000).toString();
        } else {
            formateData['totalNt'] = '';
        }
        //年支出(家庭)
        if (formateData['expense'] != '' && typeof formateData['expense'] != 'undefined') {
            formateData['expense'] = (parseInt(formateData['expense']) * 10000).toString();
        } else {
            formateData['expense'] = '';
        }
        //銀行貸款每月應繳金額
        if (formateData['kycpaymo'] != '' && typeof formateData['kycpaymo'] != 'undefined') {
            if (formateData['kycpaymo'].indexOf(".") > 0) {
                formateData['kycpaymo'] = (parseFloat(formateData['kycpaymo']) * 10000).toString();
            } else {
                formateData['kycpaymo'] = (parseInt(formateData['kycpaymo']) * 10000).toString();
            }
        } else {
            formateData['kycpaymo'] = '';
        }
        //貸款餘額
        if (formateData['kycelamt'] != '' && typeof formateData['kycelamt'] != 'undefined') {
            formateData['kycelamt'] = (parseInt(formateData['kycelamt']) * 10000).toString();
        } else {
            formateData['kycelamt'] = '';
        }
        //原貸款總金額
        if (formateData['kycelmo'] != '' && typeof formateData['kycelmo'] != 'undefined') {
            formateData['kycelmo'] = (parseInt(formateData['kycelmo']) * 10000).toString();
        } else {
            formateData['kycelmo'] = '';
        }

        //已居住期間，需轉換 ex: 03年 => 0300(年 + 月份)
        if (formateData['houseDurYymm'].length < 2) {
            formateData['houseDurYymm'] = '0' + formateData['houseDurYymm'] + '00';
        } else {
            formateData['houseDurYymm'] = formateData['houseDurYymm'] + '00';
        }
        //以下欄位有可能輸入 ex:01、001(需處理)
        //張數
        this._logger.log("setData['kycetchno']:", this._formateService.transClone(formateData['kycetchno']));
        if (formateData['kycetchno'] != '' && typeof formateData['kycetchno'] != 'undefined') {
            let kycEtchNo = parseInt(formateData['kycetchno']);
            formateData['kycetchno'] = kycEtchNo.toString();
        } else {
            formateData['kycetchno'] = '';
        }
        //扶養子女數
        this._logger.log("setData['supportChildren']:", this._formateService.transClone(formateData['supportChildren']));
        if (formateData['supportChildren'] != '' && typeof formateData['supportChildren'] != 'undefined') {
            let supportChildren = parseInt(formateData['supportChildren']);
            formateData['supportChildren'] = supportChildren.toString();
        } else {
            formateData['supportChildren'] = '';
        }
        //員工人數
        this._logger.log("setData['applyWorker']:", this._formateService.transClone(formateData['applyWorker']));
        if (formateData['applyWorker'] != '' && typeof formateData['applyWorker'] != 'undefined') {
            let applyWorker = parseInt(formateData['applyWorker']);
            formateData['applyWorker'] = applyWorker.toString();
        } else {
            formateData['applyWorker'] = '';
        }

        //預填單
        // if (resver == 'Y') {
        //     this._logger.log("into resver == 'Y'");
        //     let applyBir = this.formateBirthDay(setData['applyBir']);
        //     setData['applyBir'] = applyBir;
        // }
        this._logger.log("formateData, allData:", this._formateService.transClone(this.allData));
        return formateData;
    }

    //直接取得目前暫存資料
    public getAllData() {
        this._logger.log("getAllData, allData:", this.allData);
        return this.allData;
    }

    /**
 * 月、日要補零
 * @param year
 */
    paddingLeft(str): string {
        let str1 = str.toString();
        if (str1.length >= 2)
            return str1;
        else
            return str1 = "0" + str1;
    }

    formateBirthDay(date) {
        let formateDate = date.replace('/', "");
        this._logger.log("formateDate:", formateDate);
        return formateDate;
    }
}
