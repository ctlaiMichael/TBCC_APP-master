import { Component, OnChanges, Input, ElementRef, ViewChild, OnInit } from '@angular/core';
// import { HitrustPipeService } from '@app/share/pipe/hitrustPipe';

declare var CanvasChartClass: any; // 引用外部javascript
@Component({
  selector: 'echart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnChanges {
  private index: any;
  private tempData: any;
  targetId = 'chartRender';
  private baseSetting = {
    type: 'line',
    targetId: 'chartRender',
    title: '',
    subtitle: '',
    legend: [],
    xAxis: { name: '', data: [] },
    y_name: { name: '' },
    yAxis: { name: '' },
    series: []
  };

  demoChart = {};

  @Input() chartData: any;
  @Input() sourceData: any;

  @ViewChild('chartBox', { read: ElementRef }) chartBox: ElementRef; // 主要區塊

  ngOnChanges(changes) {
    // console.warn('chartData', this.chartData);
    if (this.chartData instanceof Object && Object.keys(this.chartData).length > 0) {
      const chart_type = (this.chartData.hasOwnProperty('type')) ? this.chartData['type'] : '';
      // console.log('chartData',this.chartData);
      this.createChart(this.chartData, chart_type);
      // console.log('Chart Size:', this.chartData, this.chartBox.nativeElement.parentNode.clientWidth);
    }
  }
  constructor(
    // private _hitrustPipeService: HitrustPipeService
  ) { }

  // ngOnInit() {
  //   console.error('chartData', this.chartData);
  //   if (this.chartData instanceof Object && Object.keys(this.chartData).length > 0) {
  //     const chart_type =  (this.chartData.hasOwnProperty('type')) ? this.chartData['type'] : '';
  //     this.createChart(this.chartData, chart_type);
  //   }
  // }


  public createChart(setting, type) {
    // console.log('chart 開始 setting' ,setting);
    let type_canvas = type;
    if (setting.hasOwnProperty('page_type')) {
      // 特殊頁面樣式定義
      setting = this.modifySetting(setting.page_type, setting);
    }
    // console.log('特殊頁面樣式定義 over', this._hitrustPipeService.transClone(setting));
    //資料處理 for
    if (this.sourceData instanceof Object && Object.keys(this.sourceData).length > 0) {
      // console.log('sourceData', this.sourceData);
      setting = this.modifyData(setting, this.sourceData);
    }
    // console.log('modifyData over', this._hitrustPipeService.transClone(setting));

    // 第非第一次送進來的資料設定可跟上一次的合併(可少打些參數)
    let extendSetting;
    if (typeof (this.tempData) == 'undefined') {
      extendSetting = Object.assign(this.baseSetting, setting);
      this.tempData = extendSetting;
    } else {
      extendSetting = Object.assign(this.tempData, setting);
      this.tempData = extendSetting;
    }
    let tmp_data;
    tmp_data = extendSetting;
    // this.targetId = tmp_data["targetId"];
    this.chartBox.nativeElement.id = tmp_data["targetId"];

    let targetId = this.chartBox.nativeElement.id = tmp_data["targetId"];
    let target = document.getElementById(targetId);

    // == 自動寬高 == //
    if ((!tmp_data.hasOwnProperty('width') || !tmp_data['width']) && target.offsetWidth) {
      tmp_data['width'] = target.offsetWidth;
    }
    if ((!tmp_data.hasOwnProperty('height') || !tmp_data['height']) && target.offsetHeight) {
      tmp_data['height'] = target.offsetHeight;
    }

    // console.log('tmp_data', this._hitrustPipeService.transClone(setting));
    // console.error("<><><>tmp_data<><><>", tmp_data)
    let set_chart = {
      width: tmp_data['width'],
      height: tmp_data['height'],
      type: type_canvas,
      targetId: tmp_data['targetId'],
      title: tmp_data['title'],
      subtitle: tmp_data['subtitle'],
      legend: tmp_data['legend'],
      xAxis: tmp_data['xAxis'],
      yAxis: { name: '' },
      series: tmp_data['series'],
      grid: tmp_data['grid']
    };
    if (setting.hasOwnProperty('event') && setting.event instanceof Object) {
      set_chart['event'] = setting.event;
    }
    if (setting.hasOwnProperty('color') && setting.color instanceof Array) {
      set_chart['color'] = setting.color;
    }
    if (setting.hasOwnProperty('otherSet') && setting.otherSet instanceof Object) {
      set_chart['otherSet'] = setting.otherSet;
    }
    // console.log('set_chart', this._hitrustPipeService.transClone(set_chart));


    // PAD版大小調整
    if (target.offsetWidth >= 768) {
      switch (type) {
        case 'line':
          set_chart['width'] = target.offsetWidth;
          set_chart['height'] = (target.offsetWidth * 0.9);
          break;
      }
    }

    this.demoChart = new CanvasChartClass(set_chart);
    // console.log('demochart', this.demoChart, set_chart, setting);
  }


  /**
   * 整理資料
   */

  private modifyData(setting, sourceData) {
    let params_set = {
      x:'',
      y1:'',
      y2:'',
      x_formate: 'date'
    };
    let source_data = [];
    if (sourceData.hasOwnProperty('data')) {
      // source_data = this._hitrustPipeService.transClone(sourceData['data']);
      source_data = sourceData['data'];
    }
    if (sourceData.hasOwnProperty('params')) {
      params_set['x'] = (sourceData['params'].hasOwnProperty('x')) ? sourceData['params']['x'] : '';
      params_set['y1'] = (sourceData['params'].hasOwnProperty('y1')) ? sourceData['params']['y1'] : '';
      params_set['y2'] = (sourceData['params'].hasOwnProperty('y2')) ? sourceData['params']['y2'] : '';
      params_set['x_formate'] = (sourceData['params'].hasOwnProperty('x_formate')) ? sourceData['params']['x_formate'] : 'date';
      if (sourceData['params'].hasOwnProperty('order')) {
        params_set['order'] = sourceData['params']['order'];
        // source_data = this._hitrustPipeService.transArraySort(source_data, params_set['order']);
      }
    }

    // if (sourceData.length == 0) { //判斷有無資料
    //   // setting.xAxis.padding[0] = -18;
    //   // setting.xAxis.padding[3] = 6;
    // } else {
    //   sourceData = this._hitrustPipeService.transArraySort(this._hitrustPipeService.transClone(sourceData["DATA"]), ['TX_TIME', 'ASC']);
    // }

    let tempX_axis = [];    // x軸資料
    let tempY_axis1 = [];　 // y軸資料1
    let tempY_axis2 = [];　 // y軸資料2
    // 整理X軸、y軸
    let item: any;

    for (item in source_data) {
      if (!source_data.hasOwnProperty(item) || typeof source_data[item] !== 'object') {
        continue;
      }
      let tempdata = source_data[item];

      // do x
      if (params_set['x'] !=='' && tempdata.hasOwnProperty(params_set['x'])) {
        let tmp_x = tempdata[params_set['x']];
        if (params_set['x_formate'] === 'date') {
          // 日期格式化
          // tmp_x = this._hitrustPipeService.transDate(tmp_x);
        }
        tempX_axis.push(tmp_x);
      }
      if (params_set['y1'] !=='' && tempdata.hasOwnProperty(params_set['y1'])) {
        tempY_axis1.push(tempdata[params_set['y1']]);
      }
      if (params_set['y2'] !=='' && tempdata.hasOwnProperty(params_set['y2'])) {
        tempY_axis2.push(tempdata[params_set['y2']]);
      }
    }
    // console.log('temp_axis123', tempX_axis, tempY_axis1, tempY_axis2);

    // console.log('setting1', this._hitrustPipeService.transClone(setting));
    setting.xAxis.data = tempX_axis;
    setting.series=[];
    setting.series.push({ data: tempY_axis1});
    setting.series.push({ data: tempY_axis2});
    // console.log('setting2', this._hitrustPipeService.transClone(setting));
    return setting;
  }

  /**
   * 調整參數
   * @param page_type
   */
  private modifySetting(page_type, setting) {
    // 寬度設定
    let extendSetting: any;
    let all_width = 0;
    // this._logger.step('Chart', this.selfElm.nativeElement.querySelector('echart').parentNode, this.selfElm.nativeElement.querySelector('echart').parentNode.clientWidth);
    if (typeof this.chartBox.nativeElement !== 'undefined'
      && typeof this.chartBox.nativeElement.parentNode !== 'undefined'
      && typeof this.chartBox.nativeElement.parentNode.clientWidth !== 'undefined'
    ) {
      all_width = this.chartBox.nativeElement.parentNode.clientWidth;
    }
    let legend_width = all_width * (78 / 100);
    if (page_type === 'financial_line') {
      let tmp_set = {
        width: all_width,
        grid: {
          top: '15%'
        },
        otherSet: {
          legend: {
            data: [],
            top: (legend_width * 0.6) * (6 / 100),
            width: legend_width,
            left: all_width * (10 / 100),
          },
        }
      };
      if (setting.hasOwnProperty('legend')) {
        tmp_set['otherSet']['legend']['data'] = setting['legend'];
      }
      if (setting.hasOwnProperty('xAxis') && !setting.xAxis.hasOwnProperty('padding')) {
        setting['xAxis']['padding'] = [-6, 0, 0, 0];
        if (!setting.xAxis.hasOwnProperty('data') || setting.xAxis.data.legend <= 0) {
          setting.xAxis.padding[0] = -18;
          setting.xAxis.padding[3] = 6;
        }
      }


      extendSetting = Object.assign(setting, tmp_set);
      // console.error(setting, tmp_set, extendSetting);
    } else {
      extendSetting = setting;
    }

    return extendSetting;
  }

}

/**
  * [Canvas圖表 ]
  * ver 1.0 , create 2016.08.31 , lastmodify 2016.08.31
  * 製作view與script，請於主要jsp中include
  * 使用的套件 ： echarts , http://echarts.baidu.com/
  * 利用createCanvasChart這個method簡化重複的參數設定，以減少各jsp的重複性設定參數，使用方法可參考下方說明
  * 並請在jsp中產生要放置canvas的div，並指定一個id名稱，於createCanvasChart中設定targetId
  **/
/**
[how to use CanvasChartClass]:
 1. var chartObj= new CanvasChartClass({
  type : 'line',
  targetId : 'demo1',
  //title : '',
  legend : [],
  xAxis : {name: 'DATE' , data : []},
  yAxis : {name: 'RATE '},
  series : [{data : []},{data : []}]
 });
 2. var chartObj= new CanvasChartClass({series2:[]},'set');
  chartObj.setChartData({xLabel:111,series:2222,series2:3333});
  chartObj.createCanvasChart({
      type : 'line',
      targetId : 'demo2',
      //title : '',
      legend : demoChart2.getChartData('legend'),
      xAxis : {name: 'DATE' , data : demoChart2.getChartData('xLabel')},
      yAxis : {name: 'RATE '},
      series : [{data : demoChart2.getChartData('series')},{data : demoChart2.getChartData('series2')}]
     });
[how to use createCanvasChart]:
createCanvasChart({
 targetId : 'YourDivIdName', //div的id名稱
 title : '標題',    //不設定則不顯示
 subtitle : '子標',   //不設定則不顯示
 legend : ['買入','賣出'], //資料類別
 xAxis : {name: 'DATE' , data : ['a','b','c']}, //其他設定直接加上，會用extend合併
 yAxis : {name: 'RATE [美 金(USD)即期]'},    //其他設定直接加上，會用extend合併
 series : [
    {
   data : [3,4,3],
    },
    {
   data : [2,1,2]
    }
 ],
 styleSet : [
  {
   lineStyle : {color: 'red'},
   itemStyle : {color: 'red'}
  },
  {
   lineStyle : {color: 'blue'},
   itemStyle : {color: 'blue'}
  }
 ]
 //==以下是特殊設定==//
 ,grid:{} //改變grid設定
 ,otherSet:{
  markLine : false  //關閉markLine
  ,markPoint : true  //啟動markPoint
 }
});
**/
