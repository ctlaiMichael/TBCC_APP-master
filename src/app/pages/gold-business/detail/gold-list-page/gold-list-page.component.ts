import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { TuitionResultPageComponent } from '@pages/taxes/tuition/tuition-result-page.component';
import { GoldDetailService } from '@pages/gold-business/shared/service/gold-detail.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { FormateService } from '@shared/formate/formate.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Alert } from 'selenium-webdriver';
import { logger } from '@shared/util/log-util';
//import { DepositInquiryDetailService } from '@pages/deposit/shared/service/deposit-inquiry-detail.service';

@Component({
  selector: 'app-gold-list-page',
  templateUrl: './gold-list-page.component.html',
  styleUrls: ['./gold-list-page.component.css']
})
export class GoldListPageComponent implements OnInit {
  infodata;
  goldlistoverview: {
    acctNo: string,
    usefulBalance: string,
    lastTransDay: string,
    openBranchId: string,
    openBranchIdName: string
  }
  styleObject;
  styleFlag;
  showSearchBox = true; // 顯示查詢box
  isclick = {//是否被click[交易明細 帳戶彙總]
    toggledetail: true,
    toggleoverview: false
  }

  isdataclick = {//是否被click[前一日 當日 一週 一月 自訂]
    daybefore: true,
    today: false,
    week: false,
    month: false,
    custom: false,
  }
  isserachclick = false;//自訂收尋顯示選擇之日期區間
  datashow = false;//明細查詢資料
  // today = new Date();//自訂收尋初始設定
  // startDay = this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDay();
  // endDay = this.today.getFullYear() + '-' + (this.today.getMonth() + 1) + '-' + this.today.getDay();
  obj = {//FB000706發電文用
    account: '',
    startDate: '20190307',
    endDate: '20190505',
    paginator: { pageSize: '150', pageNumber: '0', sortColName: 'account', sortDirection: 'ASC' }
  }
  currentTime = '--'  //電文回傳時間
  duringdate = '1D';//查詢區間
  goldincomeCount = 0;//明細存入計數
  goldincomeTotal = 0;//明細存入加總
  goldexpensesCount = 0;//明細支出計數
  goldexpensesTotal = 0;//明細存入加總
  resdatas = [{//明細查詢
    transDate: '--',
    withdraw: '--',
    deposit: '--',
    balance: '--',
    digest: '--',
    branchID: '--',
    branchName: '--',
    remarks: '--',
    checkNo: '--',
    transTime: '--',
    seqNo: '--'
  }]

  resOverview = {//帳戶總攬
    realBal: "--",
    usefulBal: "--",
    todayCheckBal: "--",
    tomCheckBal: "--",
    freezeBal: "--",
    distrainBal: "--",
    afterRunBal: "--",
    afterRunPay: "--",
    saveBookBal: "--",
    managementBranch: "--",
    realBalUS: "--",
    usefulBalUS: "--",
    saveBookBalUS: "--",
    managementBranchName: "--"
  }
  searchBoxRule;
  searchInfoData: [// 輸入查詢之起始日期及終止日期，新臺幣活期性存款可查詢本月及前兩個月內資料。
    string
  ];
  constructor(
    private navgator: NavgatorService,
    private golddetail: GoldDetailService,
    private handleerror: HandleErrorService,
    private _formateService: FormateService
  ) { }

  ngOnInit() {
    this.infodata = this.navgator.getParams();
    this.goldlistoverview = this.infodata;
    this.obj.account = this.infodata.acctNo;
    this.obj.startDate = this.golddetail.setDateCheck(this.duringdate).startDate;
    this.obj.endDate = this.golddetail.setDateCheck(this.duringdate).startDate;
    this.getGoldListData(this.obj);
    this.searchBoxRule = this.golddetail.getDateSet('custom');

  }

  toggledataswitch(name) {//查詢區間按鈕(前一日 當日 一週 一月 自訂)
    if (name != this.duringdate) {
      this.isserachclick = false;//初始化自訂收尋
      this.datashow = false;
      // this.datashow = false;//初始化自訂收尋
      // this.showSearchBox = true;//初始化自訂收尋
      this.isdataclick.daybefore = false;
      this.isdataclick.today = false;
      this.isdataclick.week = false;
      this.isdataclick.month = false;
      this.isdataclick.custom = false;
      if (name == 'daybefore') {
        this.duringdate = '1D';
        this.isdataclick.daybefore = true;
      } else if (name == 'today') {
        this.duringdate = 'today';
        this.isdataclick.today = true;
      } else if (name == 'week') {
        this.duringdate = '7D';
        this.isdataclick.week = true;
      } else if (name == 'month') {
        this.duringdate = '1M';
        this.isdataclick.month = true;
      } else {
        this.duringdate = 'custom';
        this.showSearchBox = true;
        this.isdataclick.custom = true;
        this.golddetail.setDateCheck(this.duringdate);
        this.searchBoxRule = this.golddetail.getDateSet('custom');
        this.searchInfoData = [// 輸入查詢之起始日期及終止日期，新臺幣活期性存款可查詢本月及前兩個月內資料。
          '輸入查詢之起始日期及終止日期，黃金存摺帳戶可查詢本月及前五個月內資料'
        ];
      }
      if (this.duringdate != 'custom') {
        const setDateCheck = this.golddetail.setDateCheck(this.duringdate);
        if (this.duringdate === '1D') { // 前一日
          this.obj.startDate = setDateCheck.startDate;
          this.obj.endDate = setDateCheck.startDate;
        } else if (this.duringdate === 'today') { // 本日
          this.obj.startDate = setDateCheck.endDate;
          this.obj.endDate = setDateCheck.endDate;
        } else {
          this.obj.startDate = setDateCheck.startDate;
          this.obj.endDate = setDateCheck.endDate;
        }
        this.getGoldListData(this.obj);
      }

    }

  }

  changeStyle(index): void {// 動態控制樣式是否展開
    this.styleFlag[index] = !this.styleFlag[index];
    if (this.styleFlag[index]) {
      this.styleObject[index] = {
        'overflow': 'hidden',
        'display': 'block'
      }
    } else {
      this.styleObject[index] = {}
    }
  }

  toggleswitch(name) {//查詢選項(交易明細 帳戶彙總)
    if (name == 'detail') {
      this.isclick.toggledetail = true;
      this.isclick.toggleoverview = false;
    } else {
      this.isclick.toggledetail = false;
      this.isclick.toggleoverview = true;
      //this.initdatasearch();//恢復至初始設定
      //帳戶總攬
      this.getGoldListOverview(this.goldlistoverview.acctNo);
    }

  }

  /**
      * 查詢返回事件
      * @param e
      */
  customserach(e) {//自訂收尋日期
    if (this.isserachclick == false) {
      this.obj.startDate = e.data.startDate;
      this.obj.endDate = e.data.endDate;
      this.getGoldListData(this.obj);

      this.showSearchBox = false;
      this.isserachclick = true;
    }
    else {
      this.datashow = false;
      this.showSearchBox = true;
      this.isserachclick = false;
    }
  }
  initdatasearch() {//初始化
    this.isserachclick = false;//初始化自訂收尋
    this.isdataclick.daybefore = true;//初始化日期收尋
    this.isdataclick.today = false;
    this.isdataclick.week = false;
    this.isdataclick.month = false;
    this.isdataclick.custom = false;
  }




  getGoldListData(obj) {//明細電文fb000706
    //alert(JSON.stringify(obj));
    this.golddetail.getGoldListData(obj).then(
      (res) => {
        this.currentTime = res[0];
        this.analysisData(res[1]);
        //res;
      }
    ).catch(getGoldError => {
      logger.error(`getGoldError = ${JSON.stringify(getGoldError)}`);
      this.handleerror.handleError(getGoldError);
    });
  }


  analysisData(data) {//明細分析
    this.datashow = true;
    if (!!data) {
      this.goldincomeCount = 0;
      this.goldincomeTotal = 0;
      this.goldexpensesCount = 0;
      this.goldexpensesTotal = 0;
      this.styleFlag = Array(data.length).fill(false);
      this.styleObject = Array(data.length).fill({});
      this.resdatas = data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].withdraw != 0) {//總計
          this.goldexpensesCount = this.goldexpensesCount + 1;
          this.goldexpensesTotal = this.goldexpensesTotal + Number(data[i].withdraw);
        }
        if (data[i].deposit != 0) {//總計
          this.goldincomeCount = this.goldincomeCount + 1;
          this.goldincomeTotal = this.goldincomeTotal + Number(data[i].deposit);
        }
      }
    } else {
      this.resdatas = null;
      this.goldincomeCount = 0;
      this.goldincomeTotal = 0;
      this.goldexpensesCount = 0;
      this.goldexpensesTotal = 0;
    }
  }

  getGoldListOverview(obj) {//帳戶總攬電文
    this.golddetail.getGoldListOverview(obj).then(
      (res) => {
        this.currentTime = res[0];
        this.resOverview = res[1];
      },
      (error) => {
        logger.debug('serviceLocations info error');
        this.handleerror.handleError(error);
      }
    );
  }

}
