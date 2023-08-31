import { Component, OnInit } from '@angular/core';
import { NavgatorService } from '@core/navgator/navgator.service';
import { Logger } from '@core/system/logger/logger.service';
import { HeaderCtrlService } from '@core/layout/header/header-ctrl.service';
import { QrcodeService } from '@lib/plugins/qrcode.service';
@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.css']
})
export class ScanComponent implements OnInit {

  barcodeObj = {
    barCodeOne: '',
    barCodeTwo: '',
    barCodeThird: ''
  };

  constructor(
    private _logger: Logger,
    private scan: QrcodeService,
    private navgator: NavgatorService,
    private headerCtrl: HeaderCtrlService
  ) { }
  ngOnInit() {
    this.navgator.displayScanBoxSubject.subscribe((display: boolean) => {
      if (!!display) {
        this.init()
          .then(res => this.compile(res))
          .catch(err => this._logger.error('component', err));

      } else {
        this.scan.closeCamera().then(status => {
          this.restartScroll();
          delete sessionStorage.scanCameraOn;
        })
      }
    });
  }

  init(): Promise<any> {
    sessionStorage.scanCameraOn = true; // 給header component 判斷android實體返回
    // clear
    this.barcodeObj = {
      barCodeOne: '',
      barCodeTwo: '',
      barCodeThird: ''
    };
    this.draw();
    this.resetBarcodeImg();
    // 關閉捲動
    const sections = document.getElementsByTagName('section');
    for (let i = 0; i < sections.length; i++) {
      sections[i].style.overflowY = 'hidden';
    }

    return this.scan.openCamera();
  }

  scanCom() {
    this.scan.scan().then(
      res => {
        this.compile(res);
      },
      error => {
        this._logger.error('component', error);
      }
    );
  }

  compile(res: string) {
    if (res.length == 9) {
      this.barcodeObj.barCodeOne = res;
      const Img_1: any = document.getElementById('barcodeImg1');
      Img_1.src = 'assets/images/barcode_active.png';
    } else if (res.length == 16) {
      this.barcodeObj.barCodeTwo = res;
      const Img_2: any = document.getElementById('barcodeImg2');
      Img_2.src = 'assets/images/barcode_active.png';
    } else if (res.length == 15) {
      this.barcodeObj.barCodeThird = res;
      const Img_3: any = document.getElementById('barcodeImg3');
      Img_3.src = 'assets/images/barcode_active.png';
    }
    if (this.barcodeObj.barCodeOne !== '' && this.barcodeObj.barCodeTwo !== '' && this.barcodeObj.barCodeThird !== '') {
      // this._logger.error('finish', this.barcodeObj);
      this.navgator.scanObj.next(this.barcodeObj);
      this.navgator.displayScanBox(false);

    } else {
      // this._logger.error('barcodeObj', this.barcodeObj);
      this.scanCom();
    }
  }

  closeBarcode() {
    this.navgator.displayScanBox(false);
  }

  draw() {
    const c: any = document.getElementById('scanArea');
    const outerBox: any = document.getElementById('scanBox');
    let canvasW = outerBox.clientWidth;
    let canvasH = outerBox.clientHeight;
    c.width = canvasW;
    c.height = canvasH;
    let shrinkTimes = 0.7;
    let sideLength = Math.round(canvasW * shrinkTimes);
    if (sideLength > canvasH) {
      sideLength = canvasH;
    }

    let startPostionX = Math.round((canvasW - sideLength) / 2);
    let top = 0.3 * canvasH;


    let ctx = c.getContext('2d');
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, startPostionX, c.height);
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(sideLength + startPostionX, 0, c.width + startPostionX, c.height);

    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(startPostionX, 0, sideLength, top);
    ctx.fillStyle = "#000000";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(startPostionX, top + sideLength, sideLength, c.height);
    // 對齊線
    ctx.strokeStyle = '#2FEB8F';
    ctx.lineWidth = 3;
    ctx.globalAlpha = 1;
    ctx.moveTo(startPostionX, top + sideLength * 0.5);
    ctx.lineTo(startPostionX + sideLength, top + sideLength * 0.5);
    ctx.stroke();
  }

  /**
   * 重設捲動
   */
  restartScroll() {
    const sections = document.getElementsByTagName('section');
    for (let i = 0; i < sections.length; i++) {
      sections[i].style.overflowY = 'auto';
    }
  }

  /**
   * 重設條碼圖案
   */
  resetBarcodeImg() {
    const Img_1: any = document.getElementById('barcodeImg1');
    Img_1.src = 'assets/images/barcode1.png';
    const Img_2: any = document.getElementById('barcodeImg2');
    Img_2.src = 'assets/images/barcode2.png';
    const Img_3: any = document.getElementById('barcodeImg3');
    Img_3.src = 'assets/images/barcode3.png';
  }
}
