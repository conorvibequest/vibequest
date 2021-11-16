import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpIntercepterProvider } from './shared/http-interceptor/http-interceptor';
import { NgOtpInputModule } from  'ng-otp-input';
import { PipeModule } from './shared/pipe/pipe.module';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from "@ionic-native/file/ngx";
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,FormsModule,ReactiveFormsModule,NgOtpInputModule,PipeModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercepterProvider, multi: true }, 
    Storage,
    Diagnostic,
    Geolocation,
    PhotoLibrary,
    Camera,
    FileTransfer,
    File,
    ImagePicker,
    LocationAccuracy,
    StatusBar
    ],
  bootstrap: [AppComponent],
})
export class AppModule { }
