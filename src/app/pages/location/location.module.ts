import { NgModule } from '@angular/core';
import { LocationRoutingModule } from './location-routing.module';
import { SharedModule } from '@shared/shared.module';
import { LocationSearchPageComponent } from './location-search-page/location-search-page.component';
import { MapModule } from '@shared/layout/map/map.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MapComponent } from '@shared/layout/map/map.component';
import { LocationService } from './shared/location.service';
import { FB000301ApiService } from '@api/fb/fb000301/fb000301-api.service';
import { FB000302ApiService } from '@api/fb/fb000302/fb000302-api.service';
import { LocationMapshowPageComponent } from './location-mapshow-page/location-mapshow-page.component';
import { AgmCoreModule } from '@agm/core';
import { environment } from '@environments/environment';
import { GoogleMapService } from '@lib/plugins/googlemap.service';


// import { FB000301SimulateService } from '@api-simulation/api/fb/fb000301/fb000301-simulate.service';
// import { FB000302SimulateService } from '@api-simulation/api/fb/fb000302/fb000302-simulate.service';
const Components = [
  LocationSearchPageComponent,
  //MapComponent
];
// ---------------- Pages Start ---------------- //



// ---------------- API Start ---------------- //


// ---------------- Service Start ---------------- //


@NgModule({
  imports: [
    SharedModule,
    MapModule,
    //FormsModule,
    LocationRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_MAP_API_KEY,
      language: 'zh-TW'
    })
  ],
  providers: [
    // ---------------- Service Start ---------------- //
    LocationService,
    GoogleMapService,
    FB000301ApiService,
    FB000302ApiService

  ],
  declarations: [
    // ---------------- Pages Start ---------------- //
    ...Components,
    LocationMapshowPageComponent
  ]
})
export class LocationModule { }
