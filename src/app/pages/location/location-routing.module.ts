import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationSearchPageComponent } from './location-search-page/location-search-page.component';
import { MapComponent } from '@shared/layout/map/map.component';
import { LocationMapshowPageComponent } from './location-mapshow-page/location-mapshow-page.component';
// ---------------- Pages Start ---------------- //


const routes: Routes = [
  { path: '', redirectTo: 'locationkey', pathMatch: 'full' },{
    path: 'locationkey', // 設定根目錄為這一層
    component: LocationSearchPageComponent
  },{
    path: 'mapshowkey', // 設定根目錄為這一層
    component: LocationMapshowPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationRoutingModule { }
