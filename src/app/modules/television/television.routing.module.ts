import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseholdMembersComponent } from './components/household-members/household-members.component';
import { TvChannelsComponent } from './components/tv-channels/tv-channels.component';
import { TelevisionComponent } from './television.component';
import { DeviceGenresComponent } from '../survey/components/device-genres/device-genres.component';
import { ThankyouComponent } from '../account-setting/components/account-settings/thankyou/thankyou.component';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'household-members', component: HouseholdMembersComponent },
      { path: 'tv-genres/:memberNo', component: DeviceGenresComponent },
      { path: 'tv-channels/:memberNo/:deviceId', component: TvChannelsComponent },
      { path: 'thankyou', component: ThankyouComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login/registerkey' }
    ],
    component: TelevisionComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TelevisionRoutingModule { }
