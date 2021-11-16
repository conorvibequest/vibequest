import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { UserAuthenticationTokenDto } from '../account/models/userDto';
import { EventDetailsDto } from '../events/models/eventDto';
import { EventService } from '../events/services/event.service';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import * as leaflet from 'leaflet';
import { ToastHelper } from 'src/app/shared/toast-helper';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {
  scrollValueY: number;
  scrollValueX: number;
  backBtnAddClass = false;
  titleShow = false;
  eventId: string;
  userData: UserAuthenticationTokenDto = new UserAuthenticationTokenDto();
  loading: any;
  isLoading = false;
  eventDetails: EventDetailsDto = new EventDetailsDto();
  map: leaflet.Map;
  marker: leaflet.Marker;
  latitude: string;
  longitude: string;
  address: string;
  eventType: string;
  slideOpts = {
    slidesPerView: 1,
    initialSlide: 1,
    speed: 400,
    spaceBetween: 0,
  };

  greenIcon = leaflet.icon({
    iconUrl: '../../assets/icon/map-pin.png',
    iconSize: [30, 30]

  });

  constructor(public storageService: StorageHelper,
    public eventService: EventService,
    public loadingController: LoadingController,
    public router: Router,
    public toast: ToastHelper) { }

  ionViewDidEnter() {
  }

  async ngOnInit() {
    if (history.state && history.state.eventId) {
      this.eventId = history.state.eventId;
    }

    if (history.state && history.state.eventType) {
      this.eventType = history.state.eventType;
    }
    this.getUserDetails();
    this.loading = await this.loadingController.create({
      message: '',
      spinner:'dots'
    });
    //this.loading.present();
    this.isLoading=true;
    setTimeout(() => {
      this.getEventDetails();
    }, 1000);
  }

  getUserDetails() {
    this.storageService.get(StorageKeys.user).then((data: UserAuthenticationTokenDto) => {
      if (data) {
        this.userData = data;
      }
    })
  }

  async getEventDetails() {
    this.eventService.getEventDetails(this.eventId, this.userData.id).subscribe((data: EventDetailsDto) => {
      if (data) {
        this.eventDetails = data;
        setTimeout(() => {
          this.setMarkertWithAnimation(this.eventDetails.events.latitude, this.eventDetails.events.longitude);
        }, 1000);
        //this.loading.dismiss();
        this.isLoading=false;
      }
    })
  }

  onScroll(event) {
    this.scrollValueY = event.detail.currentY;
    this.scrollValueX = event.detail.currentX;

    var getStickyPossition = <HTMLElement>document.getElementsByClassName('getStickyPossition')[0]
    var getStickyPossitionTop = getStickyPossition.offsetTop;
    var getSetClass = getStickyPossitionTop - 85;

    if (this.scrollValueY >= getSetClass) {
      this.backBtnAddClass = true;
    } else {
      this.backBtnAddClass = false;
    }

    var titleClassHide = getStickyPossitionTop - 40;
    if (this.scrollValueY >= titleClassHide) {
      this.titleShow = true;
    } else {
      this.titleShow = false;
    }
  }

  onClickAttendees() {
    this.router.navigate(['/event-attending-friends-list'], { state: { attendees: this.eventDetails.attendees, eventId: this.eventId } });
  }

  async setMarkertWithAnimation(lat, lng) {
    if (!this.map) {
      this.map = leaflet.map("map", { zoomControl: false,attributionControl:false }).setView([17.385, 78.4867], 11);
      leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '',
      }).addTo(this.map);
      if (this.marker != undefined) {
        console.log('marker was already there so removing it...')
        console.log('before remove', this.marker)
        this.marker.remove();
      }
      this.marker = leaflet.marker([lat, lng], { icon: this.greenIcon }).on('click', () => {
      });
      this.map.addLayer(this.marker);
      console.log('after remove', this.marker)
      this.map.setView({ lat, lng }, this.map.getZoom(), {
        "animate": true,
        "pan": {
          "duration": 2
        },
      })
    }
  }

  onClickEdit(id) {
    this.router.navigate(['/new-event'],{ state: { isEdit: true, id: id }});
  }

  insertEventAttendee()
  {
    if(this.userData.id && this.eventId)
    {
      this.eventService.InsertEventAttendee(this.userData.id,this.eventId).subscribe(() => {
        //this.toast.presentToast("Please enter valid OTP!");
        this.eventDetails.attendeesCount = this.eventDetails.attendeesCount + 1;
        this.eventDetails.isInviteShow = true;
      });
    }
  }
}
