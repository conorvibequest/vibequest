import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSlides, LoadingController, Platform } from '@ionic/angular';
import { UserAuthenticationTokenDto } from '../account/models/userDto';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import { EventService } from './services/event.service';
import { HourPipe } from "../shared/pipe/hour.pipe";
import { EventDto } from './models/eventDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  @ViewChild('slides') slider: IonSlides;
  @ViewChild(IonContent, { static: false }) content: IonContent;
  segment = 0;
  aboutPhaseTitle = ["My events", "Upcoming", "Past"];
  userId: string;
  eventData: EventDto[] = [];
  upcomingEventData: EventDto[] = [];
  pastEventData: EventDto[] = [];
  isEventDataEmpty: boolean = false;
  isUpcomingEventDataEmpty: boolean = false;
  isPastEventDataEmpty: boolean = false;
  loadingController: any;
  showAddButton: boolean = true;
  isEventEmpty: boolean = true;
  isPastEventEmpty: boolean = true;
  isUpcomingEventEmpty: boolean = true;

  constructor(
    private platform: Platform,
    public eventService: EventService,
    public storageService: StorageHelper,
    public loading: LoadingController,
    public router: Router
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.getUserDetails();
    
    setTimeout(() => {
      this.getMyEvents();
      this.getUpcomingEvents();
      this.getPastEvents();
    }, 500);
  }

  getUserDetails() {
    this.storageService.get(StorageKeys.user).then((data: UserAuthenticationTokenDto) => {
      if (data) {
        this.userId = data.id;
      }
    })
  }

  async getMyEvents() {
    this.eventService.getMyEvents(this.userId).subscribe((data: EventDto[]) => {
      if (data) {
        this.eventData = data;
        console.log(this.eventData)
        if (this.eventData.length == 0) {
          this.isEventDataEmpty = true;
          this.isEventEmpty = false;
        }
        else {
          this.isEventDataEmpty = false;
          this.isEventEmpty = false;
        }
      }
    })
  }

  async getUpcomingEvents() {
    this.eventService.getUpcomingEvents(this.userId).subscribe((data: EventDto[]) => {
      if (data) {
        this.upcomingEventData = data;
        if (this.upcomingEventData.length == 0) {
          this.isUpcomingEventDataEmpty = true;
          this.isUpcomingEventEmpty = false;
        }
        else {
          this.isUpcomingEventDataEmpty = false;
          this.isUpcomingEventEmpty = false;
        }
      }
    })
  }


  async getPastEvents() {
    this.eventService.getPastEvents(this.userId).subscribe((data: EventDto[]) => {
      if (data) {
        this.pastEventData = data;
        for (let i = 0; i < this.pastEventData.length; i++) {
          this.pastEventData[i].daysAgo = Math.abs(new Date().getDate() - new Date(this.pastEventData[0].date).getDate());
        }
        if (this.pastEventData.length == 0) {
          this.isPastEventDataEmpty = true;
          this.isPastEventEmpty = false;
        }
        else {
          this.isPastEventDataEmpty = false;
          this.isPastEventEmpty = false;
        }
      }
    })
  }

  tabToggle(index: number) {
    this.slider.slideTo(index);
  }

  async segmentChanged() {
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    if (this.slider != undefined) {
      this.scrollToTop();
      this.segment = await this.slider.getActiveIndex();
      var selectedSegment = document.getElementById("segment_" + this.segment);

      var left = selectedSegment.offsetLeft;
      var width = selectedSegment.offsetWidth / 2;
      var deviceWidth = this.platform.width() / 2;
      var center = left - deviceWidth + width;

      document.getElementById('phaseSegment').scroll({ behavior: 'smooth', left: center });

      if (this.segment == 0) {
        this.showAddButton = true;
      }
      else {
        this.showAddButton = false;
      }
    }
  }

  onClickEvent(eventId, eventType) {
    this.router.navigate(['/event-details'], { state: { eventId: eventId, eventType: eventType } });
  }

  scrollToTop() {
    this.content.scrollToTop(200);
  }

  async doRefresh(event){
    this.getMyEvents();
    this.getUpcomingEvents();
    this.getPastEvents();
    event.target.complete();
  }
}
