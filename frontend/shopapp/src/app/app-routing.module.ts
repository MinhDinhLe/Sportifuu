import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from '../app/interface/signin/signin.component';
import { SignupComponent } from '../app/interface/signup/signup.component';
import { DetailsComponent } from './interface/details/details.component';
import { HomeComponent } from './interface/home/home.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeAdminComponent } from './interface-admin/home-admin/home-admin.component';
import { EditUserComponent } from './interface/edit-user/edit-user.component';
import { SingerAdminComponent } from './interface-admin/singer-admin/singer-admin.component';
import { SongAdminComponent } from './interface-admin/song-admin/song-admin.component';
import { FooterComponent } from './interface/footer/footer.component';
import { DetailsTrackComponent } from './interface/details-track/details-track.component';
const routes: Routes = [
  { path: 'signin', component: SigninComponent },

  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  {path: 'details/:name', component: DetailsComponent, canActivate: [AuthGuard]},
  {path: 'detailsTrack/:title', component: DetailsTrackComponent, canActivate: [AuthGuard]},
  { path: 'homeAdmin', component: HomeAdminComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'editUser', component: EditUserComponent, canActivate: [AuthGuard] },
  { path: 'getSinger', component: SingerAdminComponent, canActivate: [AuthGuard] },
  { path: 'getSong', component: SongAdminComponent, canActivate: [AuthGuard] },
  
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
