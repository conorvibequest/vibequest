import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { NavController, isPlatform, AlertController } from '@ionic/angular';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.page.html',
  styleUrls: ['./permission.page.scss'],
})
export class PermissionPage implements OnInit {

  isCameraAuthorized: boolean = false;
  isGalleryAuthorized: boolean = false;
  isLocationAuthorized: boolean = false;
  isShowPopup: boolean = false;

  constructor(public storageService: StorageHelper,
    public navCtrl: NavController,
    public diagnostic: Diagnostic,
    public photoLibrary: PhotoLibrary,
    public alertController: AlertController,
    private locationAccuracy: LocationAccuracy,
    public ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.storageService.get(StorageKeys.cameraPermissionAsked).then((res) => {
      if (res != null) {
        this.isCameraAuthorized = true;
      }
    })
    this.storageService.get(StorageKeys.imagePickerPermissionAsked).then((res) => {
      if (res != null) {
        this.isGalleryAuthorized = true;
      }
    })
    this.storageService.get(StorageKeys.locationPermissionAsked).then((res) => {
      if (res != null) {
        this.isLocationAuthorized = true;
      }
    })
  }

  onClickCameraAccess() {
    this.isCameraAuthorized = true;
    this.storageService.set(StorageKeys.cameraPermissionAsked, true);
    if (isPlatform("android")) {
      this.diagnostic.requestCameraAuthorization(false).then((status) => { });
    }
    else {
      this.diagnostic.requestCameraAuthorization().then((status) => { });
    }
  }

  onClickGalleryAccess() {
    this.isGalleryAuthorized = true;
    this.storageService.set(StorageKeys.imagePickerPermissionAsked, true);
    this.photoLibrary.requestAuthorization().then(() => {
    }, (reason) => {
      console.log(reason);
    }).catch(() => {
    });
  }

  async onClickLocationAccess() {
    this.isLocationAuthorized = true;
    this.storageService.set(StorageKeys.locationPermissionAsked, true);
      this.diagnostic.isLocationEnabled().then(async (isLocationEnabled) => {
        if (isLocationEnabled) {
          if (isPlatform("ios")) {
          this.diagnostic.requestLocationAuthorization("always").then(async () => { })
          }
          else{
            this.diagnostic.requestLocationAuthorization().then(async () => { })
          }
        }
        else {
          if(isPlatform("ios"))
          {
            this.locationAccuracy.canRequest().then((canRequest: boolean) => {

              if(canRequest) {
                // the accuracy option will be ignored by iOS
                this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                  () => console.log('Request successful'),
                  error => console.log('Error requesting location permissions', error)
                );
              }
            
            });
          }
          else {
            this.isShowPopup = true;
            this.ref.detectChanges();
          }
          
        }
      })
    
  }

  onClickContinue() {
    this.storageService.set(StorageKeys.isPermissionsAsked, true);
    this.navCtrl.navigateRoot('/landing')
  }

  onClickGrantPermission()
  {
    this.isShowPopup = false;
    this.ref.detectChanges();
    this.diagnostic.switchToLocationSettings();
  }

  cancel()
  {
    this.isShowPopup = false;
    this.ref.detectChanges();
  }
}
