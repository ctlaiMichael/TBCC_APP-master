import { Injectable } from '@angular/core';
import { CordovaService } from '@base/cordova/cordova.service';
import { environment } from 'environments/environment';
declare var plugin: any;

@Injectable()
export class GoogleMapService extends CordovaService {

    public getMap(div, deviceInfo): Promise<any> {
        return plugin.google.maps.Map.getMap(div, deviceInfo);
    }
    public MarkerClick(): Promise<any> {
        return plugin.google.maps.event.MARKER_CLICK;
    }
    public CameraMoveEnd(): Promise<any> {
        return plugin.google.maps.event.CAMERA_MOVE_END;
    }

}