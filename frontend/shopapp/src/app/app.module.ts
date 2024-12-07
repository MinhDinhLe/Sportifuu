import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './interface/home/home.component';
import { LeftbarComponent } from './interface/leftbar/leftbar.component';
import { HeaderComponent } from './interface/header/header.component';
import { DetailsComponent } from './interface/details/details.component';
import { SignupComponent } from '../app/interface/signup/signup.component';
import { SigninComponent } from './interface/signin/signin.component';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { HtmlParser } from '@angular/compiler';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { HeaderAfterSigninComponent } from './interface/header-after-signin/header-after-signin.component';
import { HomeAdminComponent } from './interface-admin/home-admin/home-admin.component';
import { LeftAdminComponent } from './interface-admin/left-admin/left-admin.component';
import { HttpClientModule } from '@angular/common/http';
import { EditUserComponent } from './interface/edit-user/edit-user.component';
import { SingerAdminComponent } from './interface-admin/singer-admin/singer-admin.component';
import { SongAdminComponent } from './interface-admin/song-admin/song-admin.component';
import { FooterComponent } from './interface/footer/footer.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { NgxFileDropModule } from 'ngx-file-drop'; 
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../enviroments/environment';
import { CommonModule } from '@angular/common';
import { DetailsTrackComponent } from './interface/details-track/details-track.component';

@NgModule({
  declarations: [
    HomeComponent,
    LeftbarComponent,
    HeaderComponent,
    DetailsComponent,
    SignupComponent,
    SigninComponent,
    AppComponent,
    HeaderAfterSigninComponent,
    HomeAdminComponent,
    LeftAdminComponent,
    EditUserComponent,
    SingerAdminComponent,
    SongAdminComponent,
    FooterComponent,
    DetailsTrackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    NgxFileDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      
      useClass:TokenInterceptor,
      multi:true,
    },
    provideClientHydration(),
    provideFirebaseApp(() => initializeApp({"projectId":"sportifu-bbe35","appId":"1:132512637069:web:e1a6cc98e11bd1423f82c4","storageBucket":"sportifu-bbe35.appspot.com","apiKey":"AIzaSyCDQmZ4Aa-YIEpG1PyMWHY09TblSOKOEeE","authDomain":"sportifu-bbe35.firebaseapp.com","messagingSenderId":"132512637069","measurementId":"G-B5WWP49HTX"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
