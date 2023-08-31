import { Component, OnInit } from '@angular/core';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { serviceMethod, serviceLocation, serviceAddress, servicePhone } from './locationobject';
import { NavgatorService } from '@core/navgator/navgator.service';
import { LocationService } from '@pages/location/shared/location.service';
import { MapComponent } from '@shared/layout/map/map.component';
import { MapModule } from '@shared/layout/map/map.module';
import { SystemParameterService } from '@core/system/system-parameter/system-parameter.service';
import { Tels } from '@conf/tel';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { CurrentPositionService } from '@lib/plugins/currentposition.service';
import { JsonpInterceptor } from '@angular/common/http';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { IfObservable } from 'rxjs/observable/IfObservable';
@Component({
  selector: 'app-location-search-page',
  templateUrl: './location-search-page.component.html',
  styleUrls: ['./location-search-page.component.css']
})
export class LocationSearchPageComponent implements OnInit {
  infodata = this.navgator.getParams();//由上一頁點擊後取得之詳細資料
  showlocation = true; //是否顯示服務區域
  showsearch = false;   //是否顯示收尋欄位
  showresult = false;   //是否顯示收尋結果
  show09result = false;   //是否顯示服務電話
  InfoData: any;
  data: any;
  currentdata: any; //目前位置
  scearch = '';//收尋欄位
  serviceMethodFirstOption = 1;//服務初始設定值
  serviceMethodFirstOption2 = 0;
  serviceAddressslenght = 1;
  obj = {
    nodeType: '01',
    area: '',
    lon: '',
    lat: '',
    searchScope: '15000',//收尋距離
    searchText: '',//收尋文字
    paginator: { pageSize: '150', pageNumber: '1', sortColName: 'strtTime', sortDirection: 'DESC' }
  };
  currentGpsPostion = {
    //服務據點下拉是選單之服務區域
    name: '',
    address: '',
    tel: '',
    lon: '',
    lat: ''
  }
  constructor(
    private headerCtrl: HeaderCtrlService,
    private currentPostion: CurrentPositionService,
    private navgator: NavgatorService,
    private location: LocationService,
    private systemparameter: SystemParameterService,
    private confirm: ConfirmService,
    private alert: AlertService,
    private handleerror: HandleErrorService
  ) {
    this.headerCtrl.setHeaderStyle('normal');
    // this.headerCtrl.setLeftBtnClick(() => {
    //   this.backToHome();
    // });
  }
  serviceMethods: serviceMethod[] = [
    { id: 0, id_number: '', name: '請選擇' },
    { id: 1, id_number: '01', name: '營業單位' },
    { id: 2, id_number: '02', name: 'ATM服務據點' },
    { id: 3, id_number: '03', name: '自動存款機據點' },
    { id: 4, id_number: '04', name: '外幣提款機' },
    { id: 5, id_number: '05', name: '保管箱據點' },
    { id: 6, id_number: '06', name: '外匯指定分行' },
    { id: 7, id_number: '07', name: '人民幣買賣分行' },
    /**
     * 配合自108年7月18日起本行西門、台中分行營業時間恢復至下午3時30分止
     * 108年7月18日起移除延時服務單位.本案直接刪除
     */
    // { id: 8, id_number: '08', name: '延時服務單位' },
    { id: 8, id_number: '09', name: '客戶服務專線' },
  ];
  serviceLocations: serviceLocation[] = [
    { id: 0, countycode: '', name: '請選擇' },
    { id: 1, countycode: '', name: '目前位置查詢' },
  ];
  serviceAddresss: serviceAddress[] = [
  ];
  serviceAddresss2: serviceAddress[] = [
  ];
  servicePhones: servicePhone[] = [
    { id: 0, name: '合作金庫服務專線', tel: this.systemparameter.get('custServiceTel') },
    // {id: 1, name: Tels.softwave.name, tel:Tels.softwave.tel},
  ];
  //this.obj= 
  ngOnInit() {
    if (JSON.stringify(this.infodata) != "{}") {
      this.serviceMethodFirstOption = this.infodata[0];//服務初始設定值
      this.obj.nodeType = this.serviceMethods[this.infodata[0]].id_number;
      this.serviceLocations = this.infodata[3];
      this.showresult = true;   //是否顯示收尋結果
      this.serviceAddresss = this.infodata[2];
      this.serviceAddresss2 = this.infodata[2];

      this.currentGpsPostion = this.infodata[4];

      if (this.serviceMethodFirstOption == 4 || this.serviceMethodFirstOption == 8) {
        this.showlocation = false; //是否顯示服務區域
      } else {
        if (this.infodata[1] == 1) {
          this.serviceMethodFirstOption2 = 0;
          this.showresult = false;   //是否顯示收尋結果
        } else {
          this.showsearch = true;
          this.serviceMethodFirstOption2 = this.infodata[1];
          this.obj.area = this.serviceLocations[this.infodata[1]].countycode;
        }

      }
      this.navgator.deleteParams();
      this.infodata = [];
    } else {
      this.location.getLocationPointSearch().then(//地區據點列表
        (res) => {
          for (let i = 2; i < res.details['detail'].length + 2; i++) {
            if (this.serviceLocations.length <= res.details['detail'].length + 1) {
              this.serviceLocations.push(res.details['detail'][i - 2]);
            }
            this.serviceLocations[i].id = i;
            this.serviceLocations[i].countycode = res.details['detail'][i - 2].countycode;
            this.serviceLocations[i].name = res.details['detail'][i - 2].county;
          }
          this.obj.searchScope = "15000";
          this.obj.searchText = "";
          this.obj.paginator.pageNumber = "1";
          this.obj.paginator.pageSize = "150";
          this.obj.paginator.sortColName = "strtTime";
          this.obj.paginator.sortDirection = "DESC";
          this.obj.area = "";
          this.obj.nodeType = "01";
          this.currentPostion.getCurrentPosition().then(//預設目前位置之值
            (res) => {
              this.obj.lon = res.longitude;
              this.obj.lat = res.latitude;
              this.currentGpsPostion.lon = this.obj.lon;
              this.currentGpsPostion.lat = this.obj.lat;
              this.currentGpsPostion.name = '';
              this.currentGpsPostion.address = '';
              this.currentGpsPostion.tel = '';
            }
            // , (error) => {
            //   this.alert.show('GPS目前無法進行定位!');
            //   alert(JSON.stringify(error));
            // }
          );
        }
      );
    }


  }
  selectedId_Method: number;
  selectedId_location: number;
  //顯示服務區域下拉示選單 並取得服務據點查詢電文
  onChange_Method(element: HTMLSelectElement) {
    this.serviceMethodFirstOption2 = 0;
    this.scearch = '';
    this.serviceAddresss = [];
    this.serviceAddresss2 = [];
    this.showlocation = false;
    this.obj.searchScope = "15000";
    this.obj.searchText = "";
    this.obj.paginator.pageNumber = "1";
    this.obj.paginator.pageSize = "150";
    this.obj.paginator.sortColName = "strtTime";
    this.obj.paginator.sortDirection = "DESC";
    this.obj.area = "";
    this.obj.nodeType = this.serviceMethods[element.value].id_number;

    //頁面顯示判斷功能
    this.selectedId_Method = +element.value;
    if (this.selectedId_Method != 4 && this.selectedId_Method != 8 /*&& this.selectedId_Method != 9*/) {
      this.showlocation = true;
      this.showsearch = false;
      this.show09result = false;

    }
    else if (this.selectedId_Method == 8) {
      this.showlocation = false;
      this.showsearch = false;
      this.show09result = true;
    }
    else {
      this.showlocation = false;
      this.showsearch = false;
      this.showresult = true;
      this.show09result = false;
      this.obj.lon = '';
      this.obj.lat = '';
      this.inquire();
    }
  }
  //顯示收尋欄位
  onChange_location(element: HTMLSelectElement) {
    if (element.value == '0') {
      this.serviceAddresss = [];
      this.showsearch = false;
    }
    else {
      this.obj.lon = this.currentGpsPostion.lon;
      this.obj.lat = this.currentGpsPostion.lat;
      this.serviceAddresss = [];
      this.scearch = '';
      if (element.value == '1') {
        this.showsearch = false;
        this.serviceMethodFirstOption2 = 0;
        if (!this.obj.lon) {
          this.alert.show('POPUP.LOCATION.NO_POSTION', { title: 'POPUP.LOCATION.NO_HIGH_ACCURACY_TITLE' }).then(
            (res) => {
              this.serviceMethodFirstOption2 = 0;
            },
            (error) => {
              this.serviceMethodFirstOption2 = 0;
            });

          this.serviceMethodFirstOption2 = 0;
        } else {
          this.obj.area = '';
          //this.navgator.setParams([serviceMethodFirstOption ,serviceMethodFirstOption,this.serviceAddresss2,this.serviceLocations]);
          this.navgator.setParams([Number(this.obj.nodeType), Number(this.obj.area) + 1, [], this.serviceLocations, this.currentGpsPostion]);
          this.navgator.push('mapshowkey', [false, this.obj]);
        }
      } else {
        this.showsearch = true;
        this.obj.area = this.serviceLocations[element.value].countycode;
        this.inquire();

        // this.selectedId_location = +element.value;
        // if (this.selectedId_location == 1) {
        //   //直接到目前位置查詢google_map
        //   this.showsearch = false;
        //   // this.showresult = false;
        // }

        // else if (this.selectedId_location == 0) {
        //   //進行收尋
        //   this.showsearch = true;
        //   // this.showresult = false;
        // }
        // else {
        //   //進行收尋
        //   this.showsearch = true;
        //   // this.showresult = true;
        // }

      }
    }
  }
  callservicePhone(myselect) {//alert撥打電話
    this.confirm.show('POPUP.TELPHONE.TEL_NOTICE', {
      title: 'POPUP.TELPHONE.TEL_TITEL',
      contentParam: {
        telName: this.servicePhones[myselect].name,
        telnumber: this.servicePhones[myselect].tel
      }
    }).then(
      (res) => {
        window.open('tel:' + this.servicePhones[myselect].tel);
      },
      (error) => { });

  }

  goMap(myselect) {//換頁並把資料帶到下一頁面
    this.serviceMethodFirstOption
    this.navgator.setParams([this.serviceMethodFirstOption, this.serviceMethodFirstOption2, this.serviceAddresss2, this.serviceLocations, this.currentGpsPostion]);
    this.navgator.push('mapshowkey', [true, myselect]);
  }
  iii = 0;//判斷查詢到資料之數量計數
  scearch_data(scearcheord) {
    if (scearcheord == '') {//判斷是否為空
      this.serviceAddresss = this.serviceAddresss2;
    } else {
      this.serviceAddresss = [];
      this.iii = 0;
      for (let i = 0; i < this.serviceAddresss2.length; i++) {
        if (this.serviceAddresss2[i].name.match(scearcheord) != null || this.serviceAddresss2[i].address.match(scearcheord) != null) {
          this.serviceAddresss[this.iii] = this.serviceAddresss2[i];
          this.iii++;

        }
      }
      if (this.iii == 0) {
        this.scearch = '';
        this.serviceAddresss = this.serviceAddresss2;
        this.alert.show('POPUP.LOCATION.NO_INFO');
      }
    }
  }


  inquire(obj?) {//查詢功能
    // if (obj != '') {
    //   this.obj.searchText = obj;
    // } else {
    //   this.obj.searchText = "";
    // }
    this.location.getLocationPointSearch().then(
      (res) => {
        this.location.getServicePointSearch(this.obj).then(//服務據點列表
          (res) => {
            if (res == null) {

              this.serviceAddresss = [];
              this.serviceAddresss2 = [];
              this.alert.show('POPUP.LOCATION.NO_INFO');
              this.serviceMethodFirstOption2 = 0;
            } else {
              this.show09result = false;
              this.showresult = true;
              this.serviceAddresss2 = res;
              this.serviceAddresss = [];
              this.serviceAddressslenght = res.length;
              for (let i = 0; i < this.serviceAddressslenght; i++) {
                if (this.serviceAddresss.length <= this.serviceAddressslenght - 1) {
                  this.serviceAddresss.push(res[i]);
                }
                this.serviceAddresss[i].id = i;
                this.serviceAddresss[i].name = res[i].name;
                this.serviceAddresss[i].address = res[i].addr;
                this.serviceAddresss[i].tel = res[i].tel;
                this.serviceAddresss[i].lon = Number(res[i].lon);
                this.serviceAddresss[i].lat = Number(res[i].lat);
              }

            }
          },
          (error) => {
            this.handleerror.handleError(error);
            this.serviceAddresss = [];
            this.serviceAddresss2 = [];
          }
        );
      }
    );
  }
  // backToHome() {//回首頁
  //   //this.navgator.push;
  // }
}
