import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthenticationTokenDto } from '../account/models/userDto';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import { userProfileDto } from './models/userProfileDto';
import { ProfileService } from './services/profile.service';
import { ActionSheetController, NavController, ToastController, isPlatform, LoadingController } from '@ionic/angular';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { CameraHelper } from '../shared/camera-helper';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userProfileDetails: userProfileDto = new userProfileDto();
  email: string;
  userId: string;
  isLoading = true;
  popupMsg: string = '';
  isShowCameraPopup: boolean = false;
  isShowGalleryPopup: boolean = false;
  imageURL: string = '../../assets/images/deafult-profile-img.svg';
  tokenData: UserAuthenticationTokenDto = new UserAuthenticationTokenDto();

  constructor(
    public profileService: ProfileService,
    public storageService: StorageHelper,
    public router: Router,
    public toastController: ToastController,
    public navCtrl: NavController,
    public actionSheetController: ActionSheetController,
    public diagnostic: Diagnostic,
    public camera: Camera,
    public cameraHelper: CameraHelper,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getUserDetails();
    setTimeout(() => {
      this.getUserProfile();
    }, 500);
  }

  getUserDetails() {
    this.storageService.get(StorageKeys.user).then((data: UserAuthenticationTokenDto) => {
      if (data != null) {
        this.tokenData = data;
        this.email = data.userName;
        this.userId = data.id;
      }
    });
  }

  getUserProfile() {
    this.profileService.getUserProfile(this.email).subscribe((data: userProfileDto) => {
      this.userProfileDetails = data;
      if (this.userProfileDetails.profilePhoto) {
        this.imageURL = this.userProfileDetails.profilePhoto;
      }
      this.isLoading = false;
    });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Name has been Updated.',
      duration: 1000,
      position: 'bottom',
    });
    toast.present();
  }

  userNameUpdate() {
    this.profileService.updateUserName(this.userId, this.userProfileDetails.name).subscribe((data) => {
      if (data) {
        this.presentToast();
        this.storageService.get(StorageKeys.user).then((data: UserAuthenticationTokenDto) => {
          if (data != null) {
            let userData = data;
            if (this.userProfileDetails.name) {
              var name = this.userProfileDetails.name.split(' ');
              if (name != null && name.length > 0) {
                userData.firstName = name[0];
                userData.lastName = '';
                if (name.length > 1) {
                  userData.lastName = name[1]
                }
              }
            }
            this.storageService.remove(StorageKeys.user);
            this.storageService.set(StorageKeys.user, userData);
          }
        });
      }
    });
  }

  onClickLogout() {
    this.storageService.remove(StorageKeys.user);
    this.storageService.remove(StorageKeys.accessToken);
    this.navCtrl.navigateRoot('/login');
  }

  onClickEditInterest() {
    this.router.navigate(['/edit-interest'], { state: { categories: this.userProfileDetails.categories } })
  }

  async doRefresh(event) {
    this.getUserProfile();
    event.target.complete();
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      cssClass: 'profilePop',
      buttons: [{
        icon: 'image-outline',
        text: 'Load from Gallery',
        handler: async () => {
          if (isPlatform("ios")) {
            this.checkIOSGalleryPermissions();
          }
          else {
            this.checkAndroidGalleryPermissions();
          }
        }
      },
      {
        icon: 'camera-outline',
        text: 'Use Camera',
        handler: async () => {
          var permissionAsked = await this.storageService.get(StorageKeys.cameraPermissionAsked);
          if (permissionAsked) {
            this.diagnostic.isCameraAuthorized().then(async (isPermission) => {
              if (isPermission) {
                this.pickImage(this.camera.PictureSourceType.CAMERA);
              }
              else {
                if (isPlatform("ios")) {
                  this.popupMsg = 'VibeQuest does not have access to your camera. Enabling the access will help you to take the photos within the App.';
                }
                else {
                  this.popupMsg = 'VibeQuest does not have access to your camera and storage. Enabling the access will help you to take the photos within the App.'
                }
                this.isShowCameraPopup = true;
              }
            })
          }
          else {
            this.storageService.set(StorageKeys.cameraPermissionAsked, true);
            if (isPlatform("ios")) {
              this.diagnostic.requestCameraAuthorization().then((status) => {
                if (status != "denied_always") {
                  this.pickImage(this.camera.PictureSourceType.CAMERA);
                }
              })
            }
            else {
              this.pickImage(this.camera.PictureSourceType.CAMERA);
            }
          }
        }
      }
      ]
    });
    await actionSheet.present();
  }

  async checkIOSGalleryPermissions() {
    var permissionAsked = await this.storageService.get(StorageKeys.imagePickerPermissionAsked);
    if (permissionAsked) {
      this.diagnostic.getCameraRollAuthorizationStatus().then(async (isPermission) => {
        if (isPermission != "denied_always") {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
        else {
          this.isShowGalleryPopup = true;
        }
      })
    }
    else {
      this.storageService.set(StorageKeys.imagePickerPermissionAsked, true);
      this.diagnostic.requestCameraRollAuthorization().then(() => {
        this.diagnostic.getCameraRollAuthorizationStatus().then((response) => {
          if (response != "denied_always") {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        })

      })

    }
  }

  async checkAndroidGalleryPermissions() {
    var permissionAsked = await this.storageService.get(StorageKeys.imagePickerPermissionAsked);
    if (permissionAsked) {
      this.diagnostic.isExternalStorageAuthorized().then(async (isPermission) => {
        if (isPermission) {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
        else {
          this.isShowGalleryPopup = true;
        }
      })
    }
    else {
      this.storageService.set(StorageKeys.imagePickerPermissionAsked, true);
      this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
    }
  }

  async cameraOptions(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 500,
      targetHeight: 500,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }
    return await this.camera.getPicture(options);
  }

  async pickImage(sourceType) {
    await this.cameraOptions(sourceType).then(async (imageData) => {
      if (this.tokenData) {
        const loading = await this.loadingController.create({
          message: ''
        });
        await loading.present();
        var s3ImagePath = this.tokenData.userName.replace(/\s/g, '') + ".jpg";

        await this.cameraHelper.uploadFile(this.tokenData, imageData, s3ImagePath, `/account/${this.userId}/upload-profile-image`).then(async (data) => {
          if (data) {
            console.log(data, "UploadedImageData");
            this.imageURL = data.response;
            loading.dismiss();
          }
        }, (err) => {
          console.log(err, "Error");
          loading.dismiss();
        }).catch((err) => {
          console.log(err, "Error");
          loading.dismiss();
        });
      }
    });
  }

  onClickGrantPermission() {
    this.isShowCameraPopup = false;
    this.isShowGalleryPopup = false;
    this.diagnostic.switchToSettings().then(() => { });
  }
}
