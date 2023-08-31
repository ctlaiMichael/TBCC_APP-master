import { Injectable } from '@angular/core';

interface Position { latitude: number; longitude: number; }

@Injectable()
export class MapService {

  constructor() { }

  /**
   * 谷歌地圖計算兩個座標點的距離
   * @param lng1 經度1
   * @param lat1 緯度1
   * @param lng2 經度2
   * @param lat2 緯度2
   * @return 距離（千米）
   */
  getDistance(position1: Position, position2: Position): number {
    const EARTH_RADIUS = 6378.137; // 地球半徑
    const radLat1 = this.rad(position1.latitude);
    const radLat2 = this.rad(position2.latitude);
    const a = radLat1 - radLat2;
    const b = this.rad(position1.longitude) - this.rad(position2.longitude);
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2)
      + Math.cos(radLat1) * Math.cos(radLat2)
      * Math.pow(Math.sin(b / 2), 2)));
    s = s * EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  }

  /**
   * 將用角度表示的角轉換為近似相等的用弧度表示的角 java Math.toRadians
   */
  rad(position: number) {
    return position * Math.PI / 180.0;
  }

}
