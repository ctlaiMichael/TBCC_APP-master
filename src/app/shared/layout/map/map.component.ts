import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  lat: number = 24.1504536;//預設值地圖經緯度
  lng: number = 120.68325279999999;//預設值地圖經緯度
  zoomValue: number = 15;
  constructor() { }

  ngOnInit() {
  }

}
