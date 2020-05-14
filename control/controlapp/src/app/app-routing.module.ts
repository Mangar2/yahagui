import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceDetailsComponent } from './device-details/device-details.component';
import { DeviceListComponent } from './device-list/device-list.component';


const routes: Routes = [
    { path: 'devicedetails/:topicFilter', component: DeviceDetailsComponent },
    { path: '', component: DeviceListComponent },
    { path: ':topicFilter', component: DeviceListComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
