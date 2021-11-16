import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController, isPlatform, AlertController } from '@ionic/angular';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { UserAuthenticationTokenDto } from '../account/models/userDto';
import { EventDetailsDto, EventDto } from '../events/models/eventDto';
import { EventService } from '../events/services/event.service';
import { InterestService } from '../interest/services/interest.service';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import { ToastHelper } from 'src/app/shared/toast-helper';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { CameraHelper } from '../shared/camera-helper';
import { PhotoLibrary } from '@ionic-native/photo-library/ngx';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { KeyboardHelper } from 'src/app/shared/keyboard-helper'

@Component({
  selector: 'app-new-event',
  templateUrl: './new-event.page.html',
  styleUrls: ['./new-event.page.scss'],
})
export class NewEventPage implements OnInit {

  categories: any[] = [];
  isSelected: boolean = false;
  userData: UserAuthenticationTokenDto = new UserAuthenticationTokenDto();
  searchKey: string = '';
  places = [];
  latitude: string;
  longitude: string;
  isAddressPicked: boolean = false;
  isCategoryChoosen: boolean = false;
  name: string;
  description: string;
  location: string;
  eventDate: string = "2021-11-23"
  eventStartTime: string = "21:30";
  eventEndTime: string = "23:00";
  categoryId: string;
  eventId: string;
  isEdit: boolean = false;
  type: string = 'Public';
  popupMsg: string = '';
  isShowCameraPopup: boolean = false;
  isShowGalleryPopup: boolean = false;
  base64ImagesData: string;
  imageData: any[] = [];
  processedImage: number = 0;
  originalImageData: any[] = [];
  editImageData: any[] = [];
  slideOpts = {
    slidesPerView: "auto",
    speed: 400,
    freeMode: true,
    freeModeSticky: true,
  };

  constructor(public router: Router,
    public interestService: InterestService,
    public actionSheetController: ActionSheetController,
    public storageService: StorageHelper,
    public eventService: EventService,
    public loading: LoadingController,
    public toast: ToastHelper,
    public camera: Camera,
    public imagePicker: ImagePicker,
    public diagnostic: Diagnostic,
    public cameraHelper: CameraHelper,
    public loadingController: LoadingController,
    public photoLibrary: PhotoLibrary,
    private file: File,
    public alertController: AlertController,
    public DomSanitizer:DomSanitizer,
    public ref: ChangeDetectorRef,
    public keyBoardHelper: KeyboardHelper) {
  }

  ngOnInit() {
    if (history.state && history.state.isEdit && history.state.id) {
      this.eventId = history.state.id;
      this.isEdit = true;
    }
    this.getAllCategories();
    this.getUserDetails();
    this.SetEventType('Public');
  }

  ionViewDidEnter() {
   
    if (this.isEdit) {
      this.getEditDetails();
    }
    else{
      let currentDate = new Date();
      let mon = currentDate.getMonth()+1;
      let month = mon.toString();
      if(mon<10)
      {
         month = "0"+mon;
      }
      this.eventDate = currentDate.getFullYear()+"-"+month+"-"+currentDate.getDate()+"T00:00:00";
      this.ref.detectChanges();
    }
  }

  async getEditDetails() {
    const loading = await this.loading.create({
      message: '',
      spinner:'dots'
    });

    loading.present();
    this.eventService.getEventDetailsById(this.eventId).subscribe((data: EventDetailsDto) => {
      console.log('Data',data);
      this.name = data.events.name;
      this.description = data.events.description;
      this.searchKey = data.events.location;
      this.location = data.events.location;
      this.latitude = data.events.latitude;
      this.longitude = data.events.longitude;
      this.isAddressPicked = true;
      this.eventDate = data.events.date;
      this.eventStartTime = data.events.startTime;
      this.eventEndTime = data.events.endTime;
      this.type = data.events.eventType;
      this.editImageData = data.eventMedia;
      this.SetEventType(data.events.eventType);
     
      setTimeout(() => {
        let categoryName = this.categories.filter(x => x.id == data.events.categoryId);
        this.onClickCategory(data.events.categoryId, categoryName[0].name);
      }, 1000);
      loading.dismiss();
    })
  }

  getUserDetails() {
    this.storageService.get(StorageKeys.user).then((data) => {
      this.userData = data;
    })
  }

  getAllCategories() {
    this.interestService.getInterests().subscribe((data: any) => {
      this.categories = data;
    })
  }

  onClickCategory(id, name) {
    this.isCategoryChoosen = true;
    this.categoryId = id;
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id == id) {
        document.getElementById('category_' + id).className = "chooseCategoryBox selected " + name.toLowerCase();
        document.getElementById(this.categories[i].name).setAttribute("src", this.categories[i].whiteIconPath)
      }
      else {
        document.getElementById('category_' + this.categories[i].id).className = "chooseCategoryBox";
        document.getElementById(this.categories[i].name).setAttribute("src", this.categories[i].iconPath)
      }
    }
  }

  onChangeStartTime(startTime) {
    this.eventStartTime = startTime.detail.value;
  }

  onChangeDate(date) {
    var newDate = date.detail.value.split("T");
    if (newDate != null && newDate.length > 0) {
      let selectedDate = newDate[0] + "T00:00:00"
      this.eventDate = selectedDate;
    }
  }

  onChangeEndTime(endTime) {
    this.eventEndTime = endTime.detail.value;
  }

  async search() {
    if (!this.isAddressPicked) {
      if (this.searchKey == '') {
        this.places = [];
      } else {
        const provider = new OpenStreetMapProvider({ params: { viewbox: '-91.513079,36.970298,-87.494756,42.508481', bounded: 1 } });
        const results = await provider.search({ query: this.searchKey });
        this.places = results;
      }
    }
  }

  onClickPickAddress(lat, lng, displayName) {
    this.isAddressPicked = true;
    this.places = [];
    this.searchKey = displayName;
    this.location = displayName;
    this.latitude = lat;
    this.longitude = lng;
  }

  async onClear() {
    this.searchKey = '';
    this.isAddressPicked = false;
  }

  async onClickCreate() {
    let request: EventDto = {
      name: this.name,
      description: this.description,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude,
      date: this.eventDate,
      startTime: this.eventStartTime,
      endTime: this.eventEndTime,
      status: 'Active',
      userId: this.userData.id,
      categoryId: this.categoryId,
      eventType: this.type
    }
    const loading = await this.loading.create({
      message: '',
      spinner:'dots'
    });
    loading.present();
    if (this.isEdit) {
      request.id = this.eventId;
      this.eventService.UpdateEvent(request, this.eventId).subscribe(async(data) => {
        if (data) {
          await this.uploadImages(this.eventId);
          loading.dismiss();
          this.toast.presentToast('Event has been edited successfully');
          this.router.navigate(['/app/events']);
        }
      })
    }
    else {
      this.eventService.createNewEvent(request).subscribe(async(data: EventDto) => {
        if (data) {
          await this.uploadImages(data.id);
          loading.dismiss();
          this.router.navigate(['/event-success']);
        }
      })
    }

  }
  SetEventType(eventType) {
    this.type = eventType;
    if (this.type == "Public") {
      document.getElementById('eventPublic').setAttribute('class', 'typeBtn activeBtn');
      document.getElementById('eventPrivate').setAttribute('class', 'typeBtn');
    }
    else {
      document.getElementById('eventPrivate').setAttribute('class', 'typeBtn activeBtn');
      document.getElementById('eventPublic').setAttribute('class', 'typeBtn');
    }
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image Source",
      buttons: [{
        icon: 'image-outline',
        text: 'Load from Gallery',
        handler: async () => {
          this.checkGalleryPermissions();
        }
      },
      {
        icon: 'camera-outline',
        text: 'Use Camera',
        handler: () => {
          this.pickImageFromCamera(this.camera.PictureSourceType.CAMERA);
        }
      }
      ]
    });
    await actionSheet.present();
  }

  async checkGalleryPermissions() {
    var permissionAsked = await this.storageService.get(StorageKeys.imagePickerPermissionAsked);
    if (permissionAsked) {
      this.imagePicker.hasReadPermission().then(async (isPermission) => {
        if (isPermission) {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
        else {
          this.isShowGalleryPopup = true;
        }
      });
    }
    else {
      this.storageService.set(StorageKeys.imagePickerPermissionAsked, true);
      this.photoLibrary.requestAuthorization().then(() => {
        this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
      }, (reason) => {
        console.log(reason);
        this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
      }).catch(() => {
        this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
      });
    }
  }

  async pickImage(sourceType) {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 300,
      targetHeight: 400,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
    }

    this.imagePicker.hasReadPermission().then(async (isPermission) => {
      if (isPermission) {
        this.imagePicker.getPictures(options).then(async (results) => {
          if (results.length > 0 && results != "OK") {
            for (var index = 0; index < results.length; index++) {
              this.originalImageData.push(results[index]);
              this.imageData.push((<any>window).Ionic.WebView.convertFileSrc(results[index]));
            }
          }
        });
      }
    })
  }

  async uploadImages(eventId) {
    for (var index = 0; index < this.originalImageData.length; index++) {
      if (this.userData) {
        var ImageName = this.userData.userName.replace(/\s/g, '') + index + ".jpg";
        await this.cameraHelper.uploadFile(this.userData, this.originalImageData[index], ImageName, `/event/upload-event-media/${eventId}/${this.userData.id}`).then(async (data) => {
          if (data) {
            console.log('got response: ', data);
          }
        }, (err) => {
          console.log(err, "Error");
        }).catch((err) => {
          console.log(err, "Error");
        });
      }
    }
  }

  async pickImageFromCamera(sourceType) {
    if (isPlatform('ios') || isPlatform('android')) {
      var permissionAsked = await this.storageService.get(StorageKeys.cameraPermissionAsked);
      if (permissionAsked) {
        this.diagnostic.isCameraAuthorized().then(async (isPermission) => {
          if (isPermission) {
            this.selectCameraImage(sourceType, true);
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
        });
      }
      else {
        this.storageService.set(StorageKeys.cameraPermissionAsked, true);
        this.diagnostic.requestCameraAuthorization().then((status) => {
          if (isPlatform("ios")) {
            if (status != "denied_always") {
              this.diagnostic.isCameraRollAuthorized().then((isPermission) => {
                if (!isPermission) {
                  this.diagnostic.requestCameraRollAuthorization().then((isAllowed) => {
                    this.selectCameraImage(sourceType, true);
                  })
                }
                else {
                  this.selectCameraImage(sourceType, true);
                }
              })
            }
          }
          else {
            this.selectCameraImage(sourceType, true);
          }
        }, (reason) => {
          console.log(reason);
          this.selectCameraImage(sourceType, false);
        }).catch(() => {
          this.selectCameraImage(sourceType, false);
        });
      }
    }
    else {
      this.selectCameraImage(sourceType, true);
    }
  }

  selectCameraImage(sourceType, saveInGallary) {
    this.cameraHelper.pickImage(sourceType, 400, 300).then(async (imageData) => {
      this.originalImageData.push(imageData);
      this.imageData.push((<any>window).Ionic.WebView.convertFileSrc(imageData));
      if (this.userData) {
        
      }
    });
  }

  onClickGrantPermission() {
    this.isShowCameraPopup = false;
    this.isShowGalleryPopup = false;
    this.diagnostic.switchToSettings().then(() => { });
  }

  async onClickDelete(index) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      message: 'Are you sure to delete this image?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'Delete',
          handler: async() => {
            await alert.present();
            this.imageData.splice(index, 1);
            this.originalImageData.splice(index,1);
          }
        }
      ]
    });
    await alert.present();
  }

  async onClickDeleteEditImage(id) {
    const alert = await this.alertController.create({
      // cssClass: 'my-custom-class',
      message: 'Are you sure to delete this image?',
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'secondary',
          handler: () => {
            
          }
        }, {
          text: 'Delete',
          handler: async() => {
            this.eventService.deleteEventMedia(id).subscribe(()=>{
              const indexDelete = this.editImageData.findIndex((i: any) => {
                return (i.id === id);
            });
            if (indexDelete != -1) {
                this.editImageData.splice(indexDelete, 1);
                console.log("Delete Index",indexDelete);
            }
            })
          }
        }
      ]
    });
    await alert.present();
   
  }

  closeKeyboard()
  {
   this.keyBoardHelper.closeKeyboard();
  }

}
