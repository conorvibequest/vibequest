import { Component, OnInit } from '@angular/core';
import { EventAttendeesDto } from '../events/models/eventDto';

@Component({
  selector: 'app-event-attending-friends-list',
  templateUrl: './event-attending-friends-list.page.html',
  styleUrls: ['./event-attending-friends-list.page.scss'],
})
export class EventAttendingFriendsListPage implements OnInit {

  attendees: EventAttendeesDto[] = [];
  eventId: any;
  isLoading = true;

  constructor() { }
  

  ngOnInit() {
  }

  ionViewDidEnter() {
    if (history.state && history.state.attendees) {
      this.attendees = history.state.attendees;
    }

    if(history.state && history.state.eventId){
      this.eventId = history.state.eventId;
    }
    this.isLoading = false;
  }

}
