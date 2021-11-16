import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { LoadingController, isPlatform, Platform, AlertController, ModalController, IonRouterOutlet } from '@ionic/angular';
import { UserAuthenticationTokenDto } from '../account/models/userDto';
import { EventDto } from '../events/models/eventDto';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import { MapEventsDto } from './models/mapEventsDto';
import { HomeService } from './services/home.service';
import * as Leaflet from 'leaflet';
import { Router } from '@angular/router';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { LocationModalPage } from '../location-modal/location-modal.page';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  sliderOptions = {
    slidesPerView: "auto",
    speed: 400,
    freeMode: true,
    freeModeSticky: true,
  }

  userId: string;
  userName: string;
  mapEvents: MapEventsDto = new MapEventsDto();
  loading: any;
  events: EventDto[] = [];
  map: any;
  allEvents: EventDto[] = [];
  mapMarkers: any[] = [];
  currentLatitude: string;
  currentLongitude: string;
  isNewNotification = false;
  isShowPopup: boolean = false;
  isShowLocationPopup: boolean = false;
  addressComponent: string = '';
  isDataLoading: boolean = true;
  modal: any;
  searchedPlace: any;
  isFromCurrentLocation: boolean = false;
  isLoading = true;
  defaultLatitude: string;
  defaultLongitude: string;

  constructor(
    private router: Router,
    public storageService: StorageHelper,
    public homeService: HomeService,
    public loadingController: LoadingController,
    private elementRef: ElementRef,
    public diagnostic: Diagnostic,
    public geoLocation: Geolocation,
    public platform: Platform,
    public alertController: AlertController,
    public ref: ChangeDetectorRef,
    private locationAccuracy: LocationAccuracy,
    public modalController: ModalController,
    public routerOutlet: IonRouterOutlet,
    public http: HttpClient) {

    this.platform.pause.subscribe(async () => {
      if (this.router.url == "/app/home") {
        if (this.modal) {
          this.modal.dismiss();
          this.ref.detectChanges();
        }
        // if (this.map) {
        //   this.map.remove();
        //   this.ref.detectChanges();
        // }
        //this.addressComponent = '';
        //this.isDataLoading = true;
        //this.mapEvents = new MapEventsDto();
        this.ref.detectChanges();
      }
    })

    this.platform.resume.subscribe(async () => {
      if (this.router.url == "/app/home") {
        var permission = await this.storageService.get(StorageKeys.locationPermissionAsked);
        if (permission) {
          this.ionViewDidEnter();
        }
      }
    })
  }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    // this.diagnostic.requestLocationAuthorization().then(async () => {
    this.getUserDetails();
    var permission = await this.storageService.get(StorageKeys.locationPermissionAsked);
    if (permission) {
      this.diagnostic.getLocationAuthorizationStatus().then(async (result) => {
        if (result == "not_determined") {
          if (isPlatform("ios")) {
            this.diagnostic.requestLocationAuthorization("always").then(async (res) => {
              await this.initMapData(res);
            })
          }
          else {
            this.diagnostic.requestLocationAuthorization().then(async (res) => {
              await this.initMapData(res);
            })
          }
        }
        else {
          await this.initMapData(result);
        }
      })
    }
    else {
      this.storageService.set(StorageKeys.locationPermissionAsked, true);
      if (isPlatform("ios")) {
        this.diagnostic.requestLocationAuthorization("always").then(async (res) => {
          if (res == "authorized_when_in_use") {
            await this.initMapData(res);
          }
          else {
            await this.initMapData(res);
          }
        })
      }
      else {
        this.diagnostic.requestLocationAuthorization().then(async (res) => {
          if (res == "authorized_when_in_use") {
            await this.initMapData(res);
          }
          else {
            await this.initMapData(res);
          }
        })
      }
    }
  }

  async initMapData(res) {
    this.diagnostic.isLocationEnabled().then(async (isLocationEnabled) => {
      if (isLocationEnabled) {
        if (res.toString().toLowerCase() == "authorized_when_in_use" || res.toString().toLowerCase() == "granted" || res.toString().toLowerCase() == "authorized") {
          this.isShowPopup = false;
          this.ref.detectChanges();
          await this.loadMap();
        }
        else {
          if (isPlatform("ios")) {
            this.diagnostic.requestLocationAuthorization("always").then(async () => { });
          }
          else {
            if (res.toString().toLowerCase() == "not_requested") {
              this.diagnostic.requestLocationAuthorization().then(async () => { });
            }
          }

          // if (this.loading) {
          //   this.loading.dismiss();
          // }
          this.isLoading = false;
          if (res.toString().toLowerCase() != "not_requested") {
            if (this.isFromCurrentLocation) {
              this.isShowPopup = true;
              this.ref.detectChanges();
            }
            else {
              this.loadDefaultMap();
            }
          }

        }
      }
      else {
        if (this.isFromCurrentLocation) {
          this.isShowLocationPopup = true;
          this.ref.detectChanges();
        }
        else {
          this.loadDefaultMap();
        }
      }
    })
  }

  async loadDefaultMap() {

    this.getDefaultLocation();

    if (this.map) {
      this.map.remove();
      this.ref.detectChanges();
    }
    // if(this.loading){
    //   this.loading.dismiss();
    //   this.ref.detectChanges();
    // }
    // this.loading = await this.loadingController.create({
    //   message: '',
    //   spinner: 'dots'
    // });

    // this.loading.present();
    this.isLoading = true;
    setTimeout(() => {
      this.map = Leaflet.map('mapId', { zoomControl: false, attributionControl: false }).setView([this.defaultLatitude, this.defaultLongitude], 11);
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
      }).addTo(this.map);
      let lat = this.defaultLatitude;
      let lon = this.defaultLongitude;
      this.http.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`).subscribe((data: any) => {
        console.log(data, "Data");
        let city = data.address.city ? data.address.city : data.address.state
        this.addressComponent = city + ", " + data.address.country;
        this.getMapEvents();
        this.checkIsNewNotification();
        this.ref.detectChanges();
      })
    }, 1500);

    //document.getElementById('allTag').setAttribute("class", "categoryBox tag selected");
  }

  onClickEnableLocation() {
    this.isShowLocationPopup = false;
    this.ref.detectChanges();
    if (isPlatform("ios")) {
      this.diagnostic.switchToSettings();
    }
    else {
      this.diagnostic.switchToLocationSettings();
    }
  }

  async loadMap() {
    if (this.map) {
      this.map.remove();
      this.ref.detectChanges();
    }
    // if(this.loading){
    //   this.loading.dismiss();
    //   this.ref.detectChanges();
    // }
    // this.loading = await this.loadingController.create({
    //   message: '',
    //   spinner:'dots'
    // });

    // this.loading.present();
    this.isLoading = true;

    this.map = Leaflet.map('mapId', { zoomControl: false, attributionControl: false }).setView([39.809860, -98.555183], 13);
    this.geoLocation.getCurrentPosition({ enableHighAccuracy: true }).then((res) => {
      this.map = this.map.setView([res.coords.latitude, res.coords.longitude], 12, {
        "animate": true,
        "pan": {
          "duration": 2
        },
      });

      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''
      }).addTo(this.map);

      let markerIcon = Leaflet.icon({ iconUrl: '../../assets/markericons/current-location.png' });
      Leaflet.marker([res.coords.latitude, res.coords.longitude], { icon: markerIcon }).addTo(this.map);
      // var markers = new Leaflet.FeatureGroup();

      // this.map.addLayer(markerIcon);
      // var m = Leaflet.marker([res.coords.latitude, res.coords.longitude]);
      // m.addTo(markers).bindPopup("You are here").openPopup();

      this.http.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${res.coords.latitude}&lon=${res.coords.longitude}&addressdetails=1`).subscribe((data: any) => {
        console.log(data, "Data");
        let city = data.address.city ? data.address.city : data.address.state
        this.addressComponent = city + ", " + data.address.country;
        this.getMapEvents();
        this.checkIsNewNotification();
        this.ref.detectChanges();
      })
    })
  }

  ionViewDidLeave() {
    // if (this.map) {
    //   this.map.remove();
    // }
  }

  getUserDetails() {
    this.storageService.get(StorageKeys.user).then((data: UserAuthenticationTokenDto) => {
      if (data) {
        this.userId = data.id;
        this.userName = data.firstName + ' ' + data.lastName;
      }
    })
  }

  getDefaultLocation() {
    this.homeService.getDefaultLocationSettings().subscribe((data: any) => {
      this.defaultLatitude = data.latitude;
      this.defaultLongitude = data.longitude;
      console.log('Data', data);
    })
  }

  checkIsNewNotification() {
    this.homeService.checkIsNewNotification(this.userId).subscribe((data: boolean) => {
      this.isNewNotification = data;
      this.ref.detectChanges();
    })
  }

  getMapEvents(isFromAllClick = false) {
    if(!isFromAllClick)
    {
      this.isDataLoading = true;
    }
      this.homeService.getMapEvents(this.userId).subscribe((data: MapEventsDto) => {
        if (data) {
          this.mapEvents = data;
          this.events = data.eventsDto;
          this.allEvents = data.eventsDto;
          this.renderMarker();
          this.ref.detectChanges();
        }
        // if (this.loading) {
        //   this.loading.dismiss();
        // }
        this.isLoading = false;
        this.isDataLoading = false;
        this.ref.detectChanges();
        setTimeout(() => {
          document.getElementById('allTag').setAttribute("class", "categoryBox tag selected");
        }, 100);
      })
    
    
  }

  renderMarker() {
    if (this.mapMarkers.length > 0) {
      for (var j = 0; j < this.mapMarkers.length; j++) {
        this.map.removeLayer(this.mapMarkers[j]);
      }
    }

    if (this.events.length > 0) {
      for (let i = 0; i < this.events.length; i++) {
        var markerIcon = null;
        if (this.events[i].categoryName == "Beach") {
          markerIcon = Leaflet.icon({ iconUrl: '../../assets/markericons/beach.png', iconSize: [78, 93] });
        }
        else if (this.events[i].categoryName == "Cooking") {
          markerIcon = Leaflet.icon({ iconUrl: '../../assets/markericons/cooking.png', iconSize: [78, 93] });
        }
        else if (this.events[i].categoryName == "Dancing") {
          markerIcon = Leaflet.icon({ iconUrl: '../../assets/markericons/dancing.png', iconSize: [78, 93] });
        }
        else if (this.events[i].categoryName == "Games") {
          markerIcon = Leaflet.icon({ iconUrl: '../../assets/markericons/games.png', iconSize: [78, 93] });
        }
        else if (this.events[i].categoryName == "Painting") {
          markerIcon = Leaflet.icon({ iconUrl: '../../assets/markericons/painting.png', iconSize: [78, 93] });
        }
        else if (this.events[i].categoryName == "Party") {
          markerIcon = Leaflet.icon({ iconUrl: '../../assets/markericons/party.png', iconSize: [78, 93] });
        }
        else if (this.events[i].categoryName == "Reading") {
          markerIcon = Leaflet.icon({ iconUrl: '../../assets/markericons/reading.png', iconSize: [78, 93] });
        }
        else if (this.events[i].categoryName == "Singing") {
          markerIcon = Leaflet.icon({ iconUrl: '../../assets/markericons/singing.png', iconSize: [78, 93] });
        }
        else if (this.events[i].categoryName == "Sports") {
          markerIcon = Leaflet.icon({ iconUrl: '../../assets/markericons/sports.png', iconSize: [78, 93] });
        }
        let self = this;
        let marker = Leaflet.marker([this.events[i].latitude, this.events[i].longitude], { icon: markerIcon }).
          on('click', (e) => { marker.unbindPopup().bindPopup("<div class='eventmapDetails'><div class='eventImgDiv'><img src='" + this.events[i].mediaFileName + "'></img></div><div class='eventDetails'><strong>" + this.events[i].name + "</strong><a class='view-button'>View Details</a></div></div>", { closeOnClick: false, autoClose: true }).openPopup(); }).addTo(this.map).on("popupopen", () => {

            setTimeout(() => {
              self.elementRef.nativeElement.querySelector(".view-button").addEventListener('click', (e) => {
                this.onClickPopup(this.events[i].id);
              });
            }, 500);

          }).addTo(this.map);

        this.mapMarkers.push(marker);
      }
    }
  }

  onClickPopup(eventId) {
    this.router.navigate(['/event-details'], { state: { eventId: eventId } });
  }

  onClickTag(id) {
    for (let i = 0; i < this.mapEvents.categoriesDto.length; i++) {
      if (this.mapEvents.categoriesDto[i].id == id) {
        document.getElementById(id).setAttribute("class", "categoryBox tag selected");
        document.getElementById('allTag').setAttribute("class", "categoryBox tag");
      }
      else {
        document.getElementById(this.mapEvents.categoriesDto[i].id).setAttribute("class", "categoryBox tag");
      }
    }
    var filterData = this.allEvents.filter(x => x.categoryId == id);
    this.events = filterData;
    this.renderMarker();
  }

  onClickAllTag() {
    document.getElementById('allTag').setAttribute("class", "categoryBox tag selected");
    for (let i = 0; i < this.mapEvents.categoriesDto.length; i++) {
      document.getElementById(this.mapEvents.categoriesDto[i].id).setAttribute("class", "categoryBox tag");
    }
    this.getMapEvents(true);
  }

  onClickGrantPermission() {
    this.isShowPopup = false;
    this.diagnostic.switchToSettings().then(() => { });
  }

  async openLocationModal() {
    this.modal = await this.modalController.create({
      component: LocationModalPage,
      cssClass: 'locationPopup',
      swipeToClose: true,
      backdropDismiss: true,
      showBackdrop: true,
      mode: 'ios',
      //presentingElement: this.routerOutlet.nativeEl
    });

    this.modal.onDidDismiss()
      .then(async (data) => {
        console.log(data);
        if (!data.data) {
          return;
        }
        else if (data.data.searchedLocation) {
          // this.loading = await this.loadingController.create({
          //   message: '',
          //   spinner:'dots'
          // });

          // this.loading.present();
          this.isLoading = true;
          //this.addressComponent = '';
          //this.isDataLoading = true;
          // this.mapEvents = new MapEventsDto();
          this.ref.detectChanges();
          if (this.map) {
            this.map.remove();
            this.ref.detectChanges();
          }
          this.searchedPlace = data.data.searchedLocation;
          this.http.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.searchedPlace.raw.lat}&lon=${this.searchedPlace.raw.lon}&addressdetails=1`).subscribe((data: any) => {
            console.log(data, "PlaceData");
            let city = data.address.city ? data.address.city : data.address.state
            this.addressComponent = city + ", " + data.address.country;
            this.setMarkertWithAnimation(this.searchedPlace.raw.lat, this.searchedPlace.raw.lon)
            setTimeout(() => {
              this.getMapEvents();
              this.checkIsNewNotification();
            }, 500);
            // this.loading.dismiss();
            this.isLoading = false;
            this.ref.detectChanges();
          })
        }
        else if (data.data.isFromCurrentLocation) {
          this.isFromCurrentLocation = data.data.isFromCurrentLocation;
          //this.addressComponent = '';
          //this.isDataLoading = true;
          // this.mapEvents = new MapEventsDto();
          this.ref.detectChanges();
          // if (this.map) {
          //   this.map.remove();
          //   this.ref.detectChanges();
          // }
          this.ionViewDidEnter();
        }
      });

    return await this.modal.present();
  }

  async setMarkertWithAnimation(lat, lng) {
    this.map = Leaflet.map('mapId', { zoomControl: false, attributionControl: false }).setView([39.809860, -98.555183], 13);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(this.map);
    this.map = this.map.setView({ lat, lng }, this.map.getZoom(), {
      "animate": true,
      "pan": {
        "duration": 2
      },
    });
    this.ref.detectChanges();
  }
}

