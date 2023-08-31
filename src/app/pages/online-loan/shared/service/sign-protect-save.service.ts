/**
 * 房貸增貸用
 */
import { Injectable, OnInit } from "@angular/core";
import { Logger } from '@core/system/logger/logger.service';

@Injectable()

export class SignProtectSaveService {

    // 個人基本資料儲存
    custInfo: any = {
        bdoutDate: '',
        bdoutTime: '',
        bdoutId: '',
        id_no: '',
        id_no_error_check: '',
        business_no: '',
        bus_no_error_check: '',
        birth_date: '',
        profession_code: '',
        province: '',
        phone_o: '',
        phone_o_ext: '',
        phone_h: '',
        phone_m: '',
        nationnality: '',
        customer_nature: '',
        person_mark: '',
        address_mark: '',
        agree_mark: '', //共同行銷註記
        code_home: '',
        home_addr: '',
        code_notice: '',
        notice_addr: '',
        code_company: '',
        address_company: '',
        email_no: '',
        account_no: '',
        transfer_type: '',
        name: '',
        pererson_name: '',
        account: '',
        account_name: '',
        cixrds: '',
        cixrde: '',
        ciremp: '',
        cirds: '',
        cirus: '',
        cirns: '',
        pbrbw: '',
        cixinflg: '',
        cix33flg: '',
        gdpr: '',
        cirpro: '',
        cixslov: '',
        ciixsper: '',
        cixspmk: '',
        cixp3cid: '',
        name_long: '',
        account_name_long: '',
        memo: ''
    }


    // 申請進度儲存
    applyProgressData: any = {
        date: '',        // 案件建立日期
        txKind: '', // 申請種類
        ebkCaseNo: '', // 案件編號
        branch_id: '', // 受理分行代號
        branch_nam: '', // 受理分行中文名稱
        give_amt: '', // 申請金額
        give_dur_yymm: '', // 貸款期間
        account: '', // 撥入帳號
        verNo: '', // -----------
        caseStatus: '', // 案件狀態註記
        metier_sub: '', // 職業別位階/分項 
        apply_serve_mm: '', // 服務年資_月數
        serverdur_mm: '', // 現職服務年資_月數
        apply_serve_id: '', // 任職公司統編
        guar_flag: '', // 徵提保證人
        suggest_loan_kind: '',   // 初審_授信種類
        suggest_amt: '', // 初審_額度
        suggest_give_dur: '', // 初審_最長貸款期間
        suggest_pd_grdcode: '', // 初審_評等等級
        suggest_rmk_mno: '', // 初審_評等參考訊息
        suggest_status: '', // 初審_狀態
        suggest_result: '', // 初審_結果
        suggest_comptime: '', // 初審_執行完成時間
        apraprde: '', // 核准日期
        apramt: '', // 擬核金額
        aprlimit: '', // 限制清償期間
        aprfee: '', // 開辦費
        aprJcIcFee: '', // 聯徵查詢費
        aprrefund_yymm2: '' // 攤還方式
    };



    constructor(
        private _logger: Logger
    ) { }

    // 重置申請進度
    resetApplyData() {
        this.applyProgressData = {};
    }


    // 申請進度資料暫存
    setJApplyData(saveDate: any) {
        if (typeof saveDate == 'object') {
            this.applyProgressData.date = saveDate.date; //案件建立日期
            this.applyProgressData.txKind = saveDate.txKind; //申請種類
            this.applyProgressData.ebkCaseNo = saveDate.ebkCaseNo; //案件編號
            this.applyProgressData.branch_id = saveDate.branch_id; //受理分行代號
            this.applyProgressData.branch_nam = saveDate.branch_nam; //受理分行中文名稱
            this.applyProgressData.give_amt = saveDate.give_amt; //申請金額
            this.applyProgressData.give_dur_yymm = saveDate.give_dur_yymm; //貸款期間
            this.applyProgressData.account = saveDate.account; //撥入帳號
            this.applyProgressData.verNo = saveDate.verNo; //-----------
            this.applyProgressData.caseStatus = saveDate.caseStatus; //案件狀態註記
            this.applyProgressData.metier_sub = saveDate.metier_sub; //職業別位階/分項 
            this.applyProgressData.apply_serve_mm = saveDate.apply_serve_mm; //服務年資_月數 
            this.applyProgressData.serverdur_mm = saveDate.serverdur_mm; //現職服務年資_月數 
            this.applyProgressData.apply_serve_id = saveDate.apply_serve_id; //任職公司統編 
            this.applyProgressData.guar_flag = saveDate.guar_flag; //徵提保證人 
            this.applyProgressData.suggest_loan_kind = saveDate.suggest_loan_kind; //初審_授信種類 
            this.applyProgressData.suggest_amt = saveDate.suggest_amt; //初審_額度 
            this.applyProgressData.suggest_give_dur = saveDate.suggest_give_dur; //初審_最長貸款期間 
            this.applyProgressData.suggest_pd_grdcode = saveDate.suggest_pd_grdcode; //初審_評等等級 
            this.applyProgressData.suggest_rmk_mno = saveDate.suggest_rmk_mno; //初審_評等參考訊息 
            this.applyProgressData.suggest_status = saveDate.suggest_status; //初審_狀態 
            this.applyProgressData.suggest_result = saveDate.suggest_result; //初審_結果 
            this.applyProgressData.suggest_comptime = saveDate.suggest_comptime; //初審_執行完成時間 
            this.applyProgressData.apraprde = saveDate.apraprde; //核准日期 
            this.applyProgressData.apramt = saveDate.apramt; //擬核金額 
            this.applyProgressData.aprlimit = saveDate.aprlimit; //限制清償期間 
            this.applyProgressData.aprfee = saveDate.aprfee; //開辦費 
            this.applyProgressData.aprJcIcFee = saveDate.aprJcIcFee; //聯徵查詢費 
            this.applyProgressData.aprrefund_yymm2 = saveDate.aprrefund_yymm2; //攤還方式 
            this._logger.log("set applyProgressData:", this.applyProgressData);
        }

    }

    // 取申請進度
    getApplyData() {
        this._logger.log("get applyProgressData:", this.applyProgressData);
        return this.applyProgressData;
    }

}