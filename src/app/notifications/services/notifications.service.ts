import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  apiUrl = environment.oAuthConfig.issuer;

  constructor(public http: HttpClient) { }

  getAllNotifications(userId: string) {
    return this.http.get(this.apiUrl + `/user-friends/notifications-list/${userId}`);
  }

}
