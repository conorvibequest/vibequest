import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  apiUrl = environment.oAuthConfig.issuer;

  constructor(public http: HttpClient) { }

  getMapEvents(userId: string) {
    return this.http.get(this.apiUrl + `/event/map-events/${userId}`);
  }

  checkIsNewNotification(userId: string) {
    return this.http.get(this.apiUrl + `/user-friends/is-new-notifications/${userId}`);
  }

  getDefaultLocationSettings() {
    return this.http.get(this.apiUrl + `/event/default-location`);
  }

}
