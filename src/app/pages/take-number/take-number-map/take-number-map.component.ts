import { Component, NgZone, OnInit } from '@angular/core';
import { branchDetail } from '@pages/location/location-search-page/locationobject';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { CurrentPositionService } from '@lib/plugins/currentposition.service';
import { NavgatorService } from '@core/navgator/navgator.service';
import { ConfirmService } from '@shared/popup/confirm/confirm.service';
import { GoogleMapService } from '@lib/plugins/googlemap.service';
import { AlertService } from '@shared/popup/alert/alert.service';
import { HandleErrorService } from '@core/handle-error/handle-error.service';
import { InAppBrowserService } from '@lib/plugins/in-app-browser/in-app-browser.service';
import { StartAppService } from '@lib/plugins/start-app/start-app.service';

@Component({
  selector: 'app-take-number-map',
  templateUrl: './take-number-map.component.html',
  styleUrls: ['./take-number-map.component.css']
})
export class TakeNumberMapComponent implements OnInit {
  infodata = this.navgator.getParams();     // 由上一頁點擊後取得之詳細資料
  showinfo = true;                          // 是否顯示資訊
  showTakeNumber = true;                    // 是否顯示取號按鈕
  lat: number = this.infodata[1].lat;       // 現在位置經緯度
  lon: number = this.infodata[1].lon;       // 現在位置經緯度

  private changeLat: number = this.infodata[1].lat; // 地圖中心位置經緯度
  private changeLng: number = this.infodata[1].lon; // 地圖中心位置經緯度
  zoomValue = 15;
  iconUrl = './assets/images/tcbb_pin.png';
  googlemap = new Map();
  scearchnear = true;
  serviceAddresss: branchDetail[] = [ // 該分行資訊
    {
      active: false,
      branchId: 1,
      branchName: '網際威信',
      branchAddr: '台中市南屯區',
      postalCode: '',
      telephone: '0412345678',
      lon: 120.68325525257,
      lat: 24.150
    }
  ];
  serviceAddressShow: branchDetail[] = [ // show在頁面上方
    {
      active: false,
      branchId: 0,
      branchName: '',
      branchAddr: '',
      postalCode: '',
      telephone: '',
      lon: 0,
      lat: 0
    }
  ];
  endLatitude;
  endLongitude;
  daddr = 'daddr=121,75';
  uriString;

  fields = {
    'lat': document.getElementById('lat'),
    'lng': document.getElementById('lng')
  };

  isBusinessDate = this.infodata[3];  // 是否為營業日
  getPrePageSet = '';                 // 取得前頁資訊

  previous; // 開關提示視窗
  div;
  map;
  constructor(
    private zone: NgZone,
    private headerCtrl: HeaderCtrlService,
    private currentPostion: CurrentPositionService,
    private navgator: NavgatorService,
    private confirm: ConfirmService,
    private googlemap2: GoogleMapService,
    private alert: AlertService,
    private handleerror: HandleErrorService,
    private inAppBrowser: InAppBrowserService,
    private startAppservice: StartAppService
  ) {
    const getPrePageSet = this.navgator.getPrePageSet();
    this.headerCtrl.setLeftBtnClick(() => {
      if (getPrePageSet['path'] == 'take-number-map' || getPrePageSet['path'] == 'take-number') {
        this.navgator.push('take-number', ['take-number-back', this.infodata[4]]);
      } else {
        this.navgator.pop();
      }
    });
  }

  ngOnInit() {
    this.div = document.getElementById('map_canvas');
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
    if (JSON.stringify(this.infodata) != '{}') {
      if (this.infodata[0] == true) { // 單一據點
        this.showinfo = true;
        this.serviceAddresss[0].branchAddr = this.infodata[1].branchAddr;
        this.serviceAddresss[0].branchId = this.infodata[1].branchId;
        this.serviceAddresss[0].lat = this.infodata[1].lat;
        this.serviceAddresss[0].lon = this.infodata[1].lon;
        this.serviceAddresss[0].branchName = this.infodata[1].branchName;
        this.serviceAddresss[0].telephone = this.infodata[1].telephone;
        this.serviceAddresss[0].active = this.infodata[1].active;
        this.serviceAddressShow[0].branchAddr = this.infodata[1].branchAddr;
        this.serviceAddressShow[0].branchId = this.infodata[1].branchId;
        this.serviceAddressShow[0].lat = this.infodata[1].lat;
        this.serviceAddressShow[0].lon = this.infodata[1].lon;
        this.serviceAddressShow[0].branchName = this.infodata[1].branchName;
        this.serviceAddressShow[0].telephone = this.infodata[1].telephone;
        this.serviceAddressShow[0].active = this.infodata[1].active;
        const marker = this.map.addMarker({
          'position': { lat: this.infodata[1].lat, lng: this.infodata[1].lon },
          'title': this.infodata[1].branchName,
          'snippet': this.infodata[1].branchAddr + '\n' + this.infodata[1].telephone,
          'icon': {
            'url': this.iconUrl,
            'size': {
              'width': 50,
              'height': 65
            }
          }
        });

      } else { // 周邊據點

      }

      if (this.infodata[2] !== undefined) {
        this.showTakeNumber = this.infodata[2];
      }

    }
    // google地圖
    this.endLatitude = this.serviceAddresss[0].lat;
    this.endLongitude = this.serviceAddresss[0].lon;
    this.daddr = 'destination=' + this.endLatitude + ',' + this.endLongitude;
    this.uriString = 'https://www.google.com/maps/dir/?api=1&' + this.daddr + '&travelmode=walking&dir_action=navigate';

  }

  public markerClick(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
    if (this.previous != undefined) {
      const str = infowindow.toString();
      const number = Number(str.split('-')[1]); // 找服務據點之定位點
      this.serviceAddressShow[0].branchAddr = this.serviceAddresss[number].branchAddr;
      this.serviceAddressShow[0].branchId = this.serviceAddresss[number].branchId;
      this.serviceAddressShow[0].lat = this.serviceAddresss[number].lat;
      this.serviceAddressShow[0].lon = this.serviceAddresss[number].lon;
      this.serviceAddressShow[0].branchName = this.serviceAddresss[number].branchName;
      this.serviceAddressShow[0].telephone = this.serviceAddresss[number].telephone;
      this.serviceAddressShow[0].active = this.serviceAddresss[number].active;
      this.endLatitude = this.serviceAddressShow[0].lat;
      this.endLongitude = this.serviceAddressShow[0].lon;
      this.daddr = 'destination=' + this.endLatitude + ',' + this.endLongitude;
      this.uriString = 'https://www.google.com/maps/dir/?api=1&' + this.daddr + '&travelmode=walking&dir_action=navigate';

    }

  }

  // 地圖中心位置改變重新發電文
  centerChange(event: any) {
    if (event) {
      this.changeLat = event.lat;
      this.changeLng = event.lng;
    }
  }

  // 地圖中心位置改變重新發電文
  idle() {
    if (Math.abs(this.changeLat - this.infodata[1].lat) >= 0.05 || Math.abs(this.changeLng - this.infodata[1].lon) >= 0.005) {
      this.infodata[1].lat = this.changeLat;
      this.infodata[1].lon = this.changeLng;
    }

  }

  // 打電話
  callphone() {
    this.confirm.show('POPUP.TELPHONE.TEL_NOTICE', {
      title: 'POPUP.TELPHONE.TEL_TITEL',
      contentParam: {
        telName: this.serviceAddresss[0].branchName,
        telnumber: this.serviceAddresss[0].telephone
      }
    }).then(
      (res) => {
        window.open('tel:' + this.serviceAddresss[0].telephone);
      },
      (error) => {
      });
  }

  // 點選前往按鈕，呼叫googlemap進行導航
  gogooglemap() {
    this.confirm.show('POPUP.GPS.ALERT_NOTICE', {
      title: 'POPUP.GPS.ALERT_TITLE',
      contentParam: {
        Name: this.serviceAddressShow[0].branchName
      }
    }).then(
      (res) => {
        this.inAppBrowser.open(this.uriString, '_system');
      },
      (error) => {
      });
  }

  // 點選取號按鈕
  onTakeNumberClick() {
    this.navgator.push('take-number-operate', ['take-number-operate', this.serviceAddressShow[0], this.isBusinessDate, this.infodata[4]]);
  }

  // 回上一頁並且帶值
  backToSearch() {
    this.navgator.pop(['back', this.infodata[4]]);
  }

}
