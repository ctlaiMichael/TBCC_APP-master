import { Component, OnInit, NgZone } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { UrlHandlingStrategy } from '@angular/router';
import { LocationService } from '../shared/location.service';
import { serviceAddress } from '../location-search-page/locationobject';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { StartAppService } from '@lib/plugins/start-app/start-app.service';
import { InAppBrowserService } from '@lib/plugins/in-app-browser/in-app-browser.service';
import { GoogleMapService } from '@lib/plugins/googlemap.service';
import { CurrentPositionService } from '@lib/plugins/currentposition.service';
@Component({
  selector: 'app-location-mapshow-page',
  templateUrl: './location-mapshow-page.component.html',
  styleUrls: ['./location-mapshow-page.component.css']
})
export class LocationMapshowPageComponent implements OnInit {
  infodata = this.navgator.getParams();//由上一頁點擊後取得之詳細資料
  showinfo = true;//
  //title: string = 'Angular4 AGM Demo';
  lat: number = this.infodata[1].lat;//現在位置經緯度
  lon: number = this.infodata[1].lon;//現在位置經緯度

  bankdata = {
    name: this.infodata.name,
    address: this.infodata.address,
    tel: this.infodata.tel
  };
  private changeLat: number = this.infodata[1].lat;//地圖中心位置經緯度
  private changeLng: number = this.infodata[1].lon;//地圖中心位置經緯度
  zoomValue: number = 15;
  iconUrl: string = './assets/images/tcbpins.png';
  googlemap = new Map();
  scearchnear = true;
  serviceAddresss: serviceAddress[] = [
    {
      id: 1,
      name: "網際威信",
      address: "台中市南屯區",
      tel: "0412345678",
      lon: 120.68325279999999,
      lat: 24.1504536
    }
  ];
  serviceAddressShow: serviceAddress[] = [//show在頁面上方 
    {
      id: 0,
      name: '',
      address: '',
      tel: '',
      lon: 0,
      lat: 0
    }
  ];
  endLatitude;
  endLongitude;
  daddr = "daddr=121,75";
  uriString;

  fields = {
    "lat": document.getElementById("lat"),
    "lng": document.getElementById("lng")
  };

  constructor(
    private zone: NgZone,
    private headerCtrl: HeaderCtrlService,
    private currentPostion: CurrentPositionService,
    private navgator: NavgatorService,
    private location: LocationService,
    private confirm: ConfirmService,
    private googlemap2: GoogleMapService,
    private alert: AlertService,
    private handleerror: HandleErrorService,
    private inAppBrowser: InAppBrowserService,
    private startAppservice: StartAppService
  ) {
    this.headerCtrl.setHeaderStyle('normal');
    this.headerCtrl.setLeftBtnClick(() => {
      this.backToSearch();
    });
  }
  div;
  map;
  ngOnInit() {
    this.div = document.getElementById("map_canvas");
    this.map = this.googlemap2.getMap(this.div, {
      'controls': {
        'compass': false,
        'indoorPicker': false,
        'myLocationButton': false,
        'myLocation': true
      },
      'gestures': {
        'scroll': true,
        'tilt': false,
        'rotate': false,
        'zoom': true
      },
      'camera': {
        target: {
          lat: this.lat,
          lng: this.lon
        },
        zoom: 16
      },
      'preferences': {
        'zoom': {
          'minZoom': 8,
          'maxZoom': 19
        },
        'building': false
      }
    });

    if (JSON.stringify(this.infodata) != "{}") {
      if (this.infodata[0] == true) {//單一據點
        this.showinfo = true;
        this.serviceAddresss[0].address = this.infodata[1].addr;
        this.serviceAddresss[0].id = this.infodata[1].id;
        this.serviceAddresss[0].lat = this.infodata[1].lat;
        this.serviceAddresss[0].lon = this.infodata[1].lon;
        this.serviceAddresss[0].name = this.infodata[1].name;
        this.serviceAddresss[0].tel = this.infodata[1].tel;
        this.serviceAddressShow[0].address = this.infodata[1].addr;
        this.serviceAddressShow[0].id = this.infodata[1].id;
        this.serviceAddressShow[0].lat = this.infodata[1].lat;
        this.serviceAddressShow[0].lon = this.infodata[1].lon;
        this.serviceAddressShow[0].name = this.infodata[1].name;
        this.serviceAddressShow[0].tel = this.infodata[1].tel;
        const marker = this.map.addMarker({
          'position': { lat: this.infodata[1].lat, lng: this.infodata[1].lon },
          'title': this.infodata[1].name,
          'snippet': this.infodata[1].addr + '\n' + this.infodata[1].tel,
          'icon': {
            'url': this.iconUrl
          }
        });

      }
      else {//周邊據點
        this.showinfo = false;
        this.inquire();


        const self = this;
        this.map.on(self.googlemap2.CameraMoveEnd(), function (cameraPosition) {

          // Display the current camera position
          // alert(cameraPosition.target.lat);
          // alert(this.infodata[1].lat);
          self.changeLat = Number(cameraPosition.target.lat);
          self.changeLng = Number(cameraPosition.target.lng);
          // alert('abs_lat:' + Math.abs(self.changeLat - self.infodata[1].lat));
          // alert('abs_lon:' + Math.abs(self.changeLng - self.infodata[1].lon));
          if (Math.abs(self.changeLat - self.infodata[1].lat) >= 0.05 || Math.abs(self.changeLng - self.infodata[1].lon) >= 0.005) {
            self.infodata[1].lat = self.changeLat;
            self.infodata[1].lon = self.changeLng;
            self.inquire();
          }
        });


      }
      const self = this;
      var button = document.getElementById("button");
      button.addEventListener("click", function () {
        self.currentPostion.getCurrentPosition().then(//預設目前位置之值
          (res) => {
            self.lon = res.longitude;
            self.lat = res.latitude;
            //移動到現在位置
            self.map.moveCamera({
              target: { lat: self.lat, lng: self.lon },
              zoom: 16
            });
          }
        );
      });

    }
    //google地圖
    this.endLatitude = this.serviceAddresss[0].lat;
    this.endLongitude = this.serviceAddresss[0].lon;
    this.daddr = "destination=" + this.endLatitude + "," + this.endLongitude;
    this.uriString = "https://www.google.com/maps/dir/?api=1&" + this.daddr + "&travelmode=walking&dir_action=navigate";

  }
  // isOpen: boolean = false;//開關
  previous;//開關提示視窗
  public markerClick(infowindow) {
    // alert('infowindow:' + infowindow);

    // alert('this.previous:' + this.previous);
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
    // alert('this.previous:' + this.previous);
    if (this.previous != undefined) {
      // alert('this.previous:' + this.previous);
      // alert('ssss');
      // const latlon = infowindow.getLabel(); //key值經緯度

      // alert('lat&lon::' + latlon);
      const str = infowindow.toString();
      const number = Number(str.split("-")[1]);//找服務據點之定位點
      // const latlon = this.serviceAddresss[number].lon + ',' + this.serviceAddresss[number].lat; //key值經緯度
      // alert('str.split("-")[1]:' + str.split("-")[1]);
      this.serviceAddressShow[0].address = this.serviceAddresss[number].address;
      this.serviceAddressShow[0].id = this.serviceAddresss[number].id;
      this.serviceAddressShow[0].lat = this.serviceAddresss[number].lat;
      this.serviceAddressShow[0].lon = this.serviceAddresss[number].lon;
      this.serviceAddressShow[0].name = this.serviceAddresss[number].name;
      this.serviceAddressShow[0].tel = this.serviceAddresss[number].tel;
      this.endLatitude = this.serviceAddressShow[0].lat;
      this.endLongitude = this.serviceAddressShow[0].lon;
      this.daddr = "destination=" + this.endLatitude + "," + this.endLongitude;
      this.uriString = "https://www.google.com/maps/dir/?api=1&" + this.daddr + "&travelmode=walking&dir_action=navigate";

    }

  }
  // onCameraEvents(cameraPosition) {

  //   // Display the current camera position
  //   // alert(cameraPosition.target.lat);
  //   // alert(this.infodata[1].lat);
  //   self.changeLat = Number(cameraPosition.target.lat);
  //   self.changeLng = Number(cameraPosition.target.lng);
  //   alert('abs_lat:' + Math.abs(self.changeLat - self.infodata[1].lat));
  //   alert('abs_lon:' + Math.abs(self.changeLng - self.infodata[1].lon));
  //   if (Math.abs(self.changeLat - self.infodata[1].lat) >= 0.05 || Math.abs(self.changeLng - self.infodata[1].lon) >= 0.005) {
  //     self.infodata[1].lat = self.changeLat;
  //     self.infodata[1].lon = self.changeLng;
  //     self.inquire();
  //   }
  // }
  centerChange(event: any) {//地圖中心位置改變重新發電文
    if (event) {
      this.changeLat = event.lat;
      this.changeLng = event.lng;
      // this.infodata[1].lat = this.changeLat;
      // this.infodata[1].lon = this.changeLng;
    }
  }
  idle() {//地圖中心位置改變重新發電文
    // alert('abs_lat:' + Math.abs(this.changeLat - this.infodata[1].lat));
    // alert('abs_lon:' + Math.abs(this.changeLng - this.infodata[1].lon));
    if (Math.abs(this.changeLat - this.infodata[1].lat) >= 0.05 || Math.abs(this.changeLng - this.infodata[1].lon) >= 0.005) {
      this.infodata[1].lat = this.changeLat;
      this.infodata[1].lon = this.changeLng;
      this.inquire();
    }

    // if (event) {
    //   this.changeLat = event.lat;
    //   this.changeLng = event.lng;
    //   this.infodata[1].lat = this.changeLat;
    //   this.infodata[1].lon = this.changeLng;
    //   this.inquire();
    // }
  }
  callphone() {//打電話
    this.confirm.show('POPUP.TELPHONE.TEL_NOTICE', {
      title: 'POPUP.TELPHONE.TEL_TITEL',
      contentParam: {
        telName: this.serviceAddresss[0].name,
        telnumber: this.serviceAddresss[0].tel
      }
    }).then(
      (res) => {
        window.open('tel:' + this.serviceAddresss[0].tel);
      },
      (error) => { });
  }
  gogooglemap() {//呼叫googlemap進行導航
    this.confirm.show('POPUP.GPS.ALERT_NOTICE', {
      title: 'POPUP.GPS.ALERT_TITLE',
      contentParam: {
        Name: this.serviceAddressShow[0].name
      }
    }).then(
      (res) => {
        this.inAppBrowser.open(this.uriString, '_system');
        //this.startAppservice.doStartApp(this.uriString);
        //window.location.href = this.uriString;
      },
      (error) => { });
  }

  inquire(obj?) {//查詢功能
    this.location.getLocationPointSearch().then(
      (res) => {
        this.location.getServicePointSearch(this.infodata[1]).then(//服務據點列表
          (res) => {
            if (res == null && this.scearchnear == true) {//只在第一進行取資料時進行檢查
              this.alert.show('POPUP.LOCATION.NO_INFO');
            } else {
              //this.serviceAddresss = [];
              var mindistance = 10;
              var nearnumber = 0;
              for (let i = 0; i < res.length; i++) {
                const lonlatstring = res[i].lon.toString() + ',' + res[i].lat.toString();
                if (this.googlemap.has(lonlatstring) == false) {
                  const k = this.googlemap.size;
                  this.googlemap.set(lonlatstring, res[i]);
                  this.serviceAddresss.push(res[i]);
                  this.serviceAddresss[k].id = i;
                  this.serviceAddresss[k].name = res[i].name;
                  this.serviceAddresss[k].address = res[i].addr;
                  this.serviceAddresss[k].tel = res[i].tel;
                  this.serviceAddresss[k].lon = Number(res[i].lon);
                  this.serviceAddresss[k].lat = Number(res[i].lat);
                  const lonsub = this.lon - Number(res[i].lon);
                  const latsub = this.lat - Number(res[i].lat);

                  const marker = this.map.addMarker({
                    'position': { lat: Number(res[i].lat), lng: Number(res[i].lon) },
                    'title': res[i].name,
                    'snippet': res[i].addr + '\n' + res[i].tel,
                    'icon': {
                      'url': this.iconUrl
                    }, 'count': k
                  });
                  const self = this;
                  // const isclick = false;
                  //const displayMarker = this.serviceAddressShow[0];
                  marker.on(this.googlemap2.MarkerClick(), function () {
                    self.zone.run(() => {
                      const kk = marker.get("count");
                      self.serviceAddressShow[0].id = kk;
                      self.serviceAddressShow[0].lat = Number(marker.getPosition().lat);
                      self.serviceAddressShow[0].lon = Number(marker.getPosition().lng);
                      self.serviceAddressShow[0].name = marker.getTitle().toString();
                      self.serviceAddressShow[0].address = self.serviceAddresss[kk].address;
                      self.serviceAddressShow[0].tel = self.serviceAddresss[kk].tel;
                      self.endLatitude = self.serviceAddressShow[0].lat;
                      self.endLongitude = self.serviceAddressShow[0].lon;
                      self.daddr = "destination=" + self.endLatitude + "," + self.endLongitude;
                      self.uriString = "https://www.google.com/maps/dir/?api=1&" + self.daddr + "&travelmode=walking&dir_action=navigate";

                    });
                  });
                  // this.serviceAddressShow[0] = self.serviceAddressShow[0];

                  //與目前位置直線最近距離
                  if (mindistance >= Math.pow(lonsub, 2) + Math.pow(latsub, 2) && this.scearchnear == true) {
                    mindistance = Math.pow(this.lon - Number(res[i].lon), 2) + Math.pow(this.lat - Number(res[i].lat), 2);
                    //nearnumber = res[i].lon.toString() + ',' + res[i].lat.toString();
                    nearnumber = k;
                  }
                }
              }
            }
            if (this.scearchnear == true) {
              this.serviceAddressShow[0].address = this.serviceAddresss[nearnumber].address;
              this.serviceAddressShow[0].id = this.serviceAddresss[nearnumber].id;
              this.serviceAddressShow[0].lat = this.serviceAddresss[nearnumber].lat;
              this.serviceAddressShow[0].lon = this.serviceAddresss[nearnumber].lon;
              this.serviceAddressShow[0].name = this.serviceAddresss[nearnumber].name;
              this.serviceAddressShow[0].tel = this.serviceAddresss[nearnumber].tel;
              //google地圖
              this.endLatitude = this.serviceAddresss[nearnumber].lat;
              this.endLongitude = this.serviceAddresss[nearnumber].lon;
              this.daddr = "destination=" + this.endLatitude + "," + this.endLongitude;
              this.uriString = "https://www.google.com/maps/dir/?api=1&" + this.daddr + "&travelmode=walking&dir_action=navigate";
            }
            this.scearchnear = false;//只做一次的收尋
          },
          (error) => {
            this.handleerror.handleError(error);
          }
        );
      }
    );
  }
  backToSearch() {//回上一頁並且帶值
    this.navgator.pop();
  }
}
