import { HttpClient } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterestService {

  apiUrl = environment.oAuthConfig.issuer;

  constructor(public http: HttpClient) { }

  getInterests() {
    return this.http.get(this.apiUrl + `/interest`);
  }

  insertInterests(userId: string, interests) {
    return this.http.request('POST', this.apiUrl + `/interest/user-interest/${userId}`, { body: interests })
  }

  updateUserInterest(userId: string, interests) {
    return this.http.put(this.apiUrl + `/interest/update-user-interest/${userId}`, interests);
  }
}
