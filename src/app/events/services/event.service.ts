import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  apiUrl = environment.oAuthConfig.issuer;

  constructor(public http: HttpClient) { }

  createNewEvent(event) {
    return this.http.post(this.apiUrl + `/event`, event);
  }

  getMyEvents(userId) {
    return this.http.get(this.apiUrl + `/event/my-events/${userId}`);
  }

  getUpcomingEvents(userId) {
    return this.http.get(this.apiUrl + `/event/upcoming-events/${userId}`);
  }

  getPastEvents(userId) {
    return this.http.get(this.apiUrl + `/event/past-events/${userId}`);
  }

  getEventDetails(id: string, userId: string) {
    return this.http.get(this.apiUrl + `/event/event-details/${id}/${userId}`);
  }

  getEventDetailsById(id: string) {
    return this.http.get(this.apiUrl + `/event/${id}`);
  }

  UpdateEvent(event,id) {
    return this.http.post(this.apiUrl + `/event/update-event`, event);
  }

  InsertEventAttendee(userId,eventId) {
    return this.http.post(this.apiUrl + `/event/event-attendees/${userId}/${eventId}`,'');
  }

  getEventInviteFriendList(eventId: string, userId: string) {
    return this.http.get(this.apiUrl + `/user-friends/invite-friends-list/${userId}/${eventId}`);
  }

  inviteFriendsToEvent(userId: string,eventId: string,selectedUsers: any[]) {
    return this.http.post(this.apiUrl + `/event/invite-friend-event/${userId}/${eventId}`, selectedUsers);
  }

  deleteEventMedia(id: string) {
    return this.http.delete(this.apiUrl + `/event/event-media/${id}`);
  }
}
