import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  apiUrl = environment.oAuthConfig.issuer;

  constructor(
    public http: HttpClient
  ) {

  }

  getUserProfile(email: string) {
    return this.http.get(this.apiUrl + `/account/user-profile/${email}`)
  }

  updateUserName(userId: string, name: string) {
    return this.http.put(this.apiUrl + `/account/update-profile/${userId}/${name}`,'')
  }

}
