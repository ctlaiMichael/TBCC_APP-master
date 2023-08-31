/**
 * Header
 */
import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Logger } from '@core/system/logger/logger.service';
import { GoldService } from '@pages/financial/shared/service/gold.service';
// import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
// import { LayoutService, PopupService, ConfigService, SystemService } from '@service/global';
// import { LangTransService } from '@share_pipe/langTransPipe/lang-trans.service';
// import { HtFrameService } from '@service/global/ht_frame.service';
import { ViewChild } from '@angular/core'
// import { HitrustPipeService } from '@app/share/pipe/hitrustPipe';
// import { LangTransService } from '@app/share/pipe/langTransPipe/lang-trans.service';
import { ChartComponent } from '@shared/chart/chart.component';
import { HandleErrorService } from '@core/handle-error/handle-error.service';

@Component({
    selector: 'app-gold-history-page',
    templateUrl: './gold-history-page.component.html',
    styles: [

    ],
    providers: [GoldService]
})
export class GoldHistoryPageComponent implements OnInit {
    @ViewChild(ChartComponent) Chart: ChartComponent;
    @Output() btnflag: EventEmitter<any> = new EventEmitter<any>();
    //期間區間
    daytime_menu = [];
    active_daytime: any = {
    }
    currentTime = '--'  //電文回傳時間
    //收合效果
    showSearchBox = true;//自訂日期功能
    isserachclick = false;//自訂收尋顯示選擇之日期區間
    self_flag = false;
    detail_falg = false;
    chart_flag = true;
    contentflag = true;
    onedayflag = true;
    //是否取得資料
    showData = true;
    // styleObject;

    // styleFlag = false;
    //查詢條件 request
    set_data = {
        queryType: '',
        startDate: '',
        endDate: ''
    }
    //查詢日期
    startDay;
    endDay;
    startDay_notChange;
    endDay_notChange;

    //繪製相關變數
    sourceData = {
        params: {
            x: 'trandDate',
            y1: 'deposit',
            y2: 'balance',
            order: ['TX_TIME', 'ASC']
        },
        data: []
    };
    // 欲繪製資料
    date: any;
    private isDraw = false;
    private chart_setting: any;
    data: any = [];
    chat_data = {
        day: [],
        gold: [
            { buy: '', sell: '' },
        ]
    };
    table_data = [];
    searchBoxRule;
    searchInfoData;
    constructor(
        private _logger: Logger
        , private selfElm: ElementRef
        , private _mainService: GoldService
        , private _handleError: HandleErrorService

    ) { }

    ngOnInit() {
        this.daytime_menu = this._mainService.getDayMenuData();
        this.active_daytime = this.daytime_menu[1];
        this.set_searchData('3M');
        this.set_data.startDate = this._mainService.setDateCheck(this.set_data.queryType).startDate;
        this.set_data.endDate = this._mainService.setDateCheck(this.set_data.queryType).endDate;

        this.searchInfoData = [// 輸入查詢之起始日期及終止日期，新臺幣活期性存款可查詢本月及前兩個月內資料。
            '輸入查詢之起始日期及終止日期，僅可查詢一年內資料。'
        ];
        // this.styleObject = {
        //     'overflow': 'hidden',
        //     'display': 'block'
        // };
    }
    // // 动态控制样式
    // changeStyle(): void {
    //     alert('imhere112233');
    //     this.styleFlag = !this.styleFlag;
    //     if (this.styleFlag) {
    //         this.styleObject = {
    //             'overflow': 'hidden',
    //             'display': 'block'
    //         }
    //     } else {
    //         this.styleObject = {}
    //     }
    // }
    // let mystyle = { 'display: inline'};

    /**
     * 期間切換
     */
    onDayClick(menu) {
        this.active_daytime = menu;

        if (menu.day == '自訂') {
            this.self_flag = true;
            this.chart_flag = false;
            this.contentflag = false;
            this.onedayflag = true;
            this.set_searchData('other');
        } else {
            this.self_flag = false;
            this.detail_falg = false;
            this.contentflag = true;
            this.chart_flag = true;
            if (menu.day == '近一日') {
                this.onedayflag = false;
                this.set_searchData('1D');
            } else {
                this.onedayflag = true;
            }
            if (menu.day == '近3月') {
                this.set_searchData('3M');
            } else if (menu.day == '近6月') {
                this.set_searchData('6M');
            }
        }

        this.btnflag.emit(this.self_flag);
        // this.CreateChart(this._data); 
    }
    /**
     * 歷史牌價-自訂查詢
     */
    onSearch() {
        this.self_flag = false;
        this.detail_falg = true;
        this.chart_flag = !this.chart_flag;
        this.contentflag = true;
        this.btnflag.emit(this.self_flag);

        let search_start = this.startDay.replace(/-/g, '');
        let search_end = this.endDay.replace(/-/g, '');

        //查詢起日不能大於查詢迄日
        if (search_start > search_end) {
            alert('查詢起日不能大於查詢迄日');
            this.showData = false;
            this.self_flag = !this.self_flag;
            this.btnflag.emit(this.self_flag);
            return;

        }

        this.set_data = {
            queryType: 'other',
            startDate: search_start,
            endDate: search_end
        }

        this.getData(this.set_data);

        //給不能更改的內容使用
        this.startDay_notChange = this.startDay;
        this.endDay_notChange = this.endDay;

    }
    /**
    * 點選放大鏡
    */
    onDaySearch() {
        this.self_flag = true;
        this.chart_flag = !this.chart_flag;
    }

    /**
    * 取得日期
    */
    getDay(Interval) {
        this.startDay = this._mainService.setDateCheck(Interval).startDate;
        this.endDay = this._mainService.setDateCheck(Interval).endDate;
        //     let date = new Date();
        //     let year = date.getFullYear();
        //     let year_ = date.getFullYear();
        //     let month = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
        //     //依參數決定是3月,6月,1日
        //     let month_;
        //     if (Interval == '3M') {
        //         if (date.getMonth() - 2 <= 0) {
        //             month_ = ((12 + date.getMonth() - 2) < 10 ? '0' : '') + (12 + date.getMonth() - 2);
        //             year_ = year_ - 1;
        //         } else {
        //             month_ = ((date.getMonth() - 2) < 10 ? '0' : '') + (date.getMonth() - 2);
        //         }
        //     } else if (Interval == '6M') {
        //         if (date.getMonth() - 5 <= 0) {
        //             month_ = ((12 + date.getMonth() - 5) < 10 ? '0' : '') + (12 + date.getMonth() - 5);
        //             year_ = year_ - 1;
        //         } else {
        //             month_ = ((date.getMonth() - 5) < 10 ? '0' : '') + (date.getMonth() - 5);
        //         }
        //     } else if (Interval == '1D') {  //一日 
        //         month_ = month;
        //     } else {//自訂 預設
        //         month_ = (date.getMonth() < 10 ? '0' : '') + (date.getMonth());
        //     }

        //     //ngModel綁定需要
        //     let day = (date.getDate() + 1 < 10 ? '0' : '') + (date.getDate());
        //     if (Interval != 'self') {  //非自訂
        //         this.startDay = (year_ + "-" + month_ + "-" + day).replace(/-/g, '');
        //         this.endDay = (year + "-" + month + "-" + day).replace(/-/g, '');
        //     } else {
        //         this.startDay = (year_ + "-" + month_ + "-" + day);
        //         this.endDay = (year + "-" + month + "-" + day);
        //     }

    }

    /**
     * 要資料_整理重複code
     */
    private set_searchData(Interval) {
        this.isserachclick = false;
        this.getDay(Interval);
        if (Interval == 'other') {//自訂日期
            this.showSearchBox = true;
            this._mainService.setDateCheck(Interval);
            this.searchBoxRule = this._mainService.getDateSet('other');
        }
        else {

            this.set_data = {
                queryType: Interval,
                startDate: this.startDay,
                endDate: this.endDay
            }
            this.getData(this.set_data);
        }
    }

    /**
     * 查歷史牌價
     */
    private getData(set_data): Promise<any> {
        this.showData = true; // 為了先繪製物件
        this.table_data = [];

        return this._mainService.getHistoryData(set_data).then(
            (resObj) => {

                this.currentTime = resObj.resTime;
                this.table_data = resObj.data.details.detail;

                this.showData = true;
                this.CreateChart(resObj.data.details);
            },
            (errorObj) => {
                // alert
                this.showData = false;
                this.CreateChart([]);
                errorObj['type'] = 'message';
                this._handleError.handleError(errorObj);
            }
        );
    }


    /**
     * 繪製走勢圖
     */
    // private type = 'editclick1';
    // ngAfterViewChecked() {

    //     if (typeof this.chart_setting === 'object' && this.isDraw 
    //     // && this.type === 'editclick1' // 這邊要再加列表防呆
    //     ) {
    //         this._logger.step('Chart', this.selfElm.nativeElement.querySelector('echart').parentNode, this.selfElm.nativeElement.querySelector('echart').parentNode.clientWidth);

    //     //     this._logger.step('Financial', 'Chart', this.chart_setting);
    //     //     this.Chart.createChart(this.chart_setting, 'line');
    //         this.isDraw = false;
    //     }

    // }
    private CreateChart(resdata) {
        let line_name_set = []; // 線名稱設定
        // line_name_set.push(this._langTransService.instant('FINANCAL.FIELD_INFO.BUY')); // 買入
        // line_name_set.push(this._langTransService.instant('FINANCAL.FIELD_INFO.SELL')); // 賣出
        line_name_set.push('買入'); // 買入
        line_name_set.push('賣出'); // 賣出
        // 繪製設定
        let setting = {
            type: 'line',
            color: ['#46a3dd', '#ff5809'],
            page_type: 'financial_line', // 金融資訊頁面定義
            legend: line_name_set, // 線名稱設定
            xAxis: {
                name: '',
                data: [],
                label_type: 'date' // X軸類型 =>日期 date ,時間 time 
            },
            yAxis: {
                name: ''
            },
            series: []
        };
        if (resdata.hasOwnProperty('detail') && resdata['detail'] instanceof Array) {
            resdata['detail'].sort((a, b) => {
                return a.trandDate < b.trandDate ? -1 : a.trandDate > b.trandDate ? 1 : 0;
            });
            this.sourceData.data = resdata['detail'];
        }
        this.chart_setting = setting;
    }


    customserach(info) {

        if (this.isserachclick == false) {
            this.contentflag = true;

            this.self_flag = false;

            this.set_data = {
                queryType: 'other',
                startDate: info.data.startDate.split('/')[0] + info.data.startDate.split('/')[1] + info.data.startDate.split('/')[2],
                endDate: info.data.endDate.split('/')[0] + info.data.endDate.split('/')[1] + info.data.endDate.split('/')[2]
            }

            this.getData(this.set_data);
            this.showSearchBox = false;
            this.isserachclick = true;
        }
        else {
            this.self_flag = true;
            //this.datashow = false;
            this.showSearchBox = true;
            this.isserachclick = false;
        }
        this.btnflag.emit(this.self_flag);



    }
}

