import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CreateUserDto, UserAuthenticationTokenDto, UserDto } from "../models/userDto";
import { StorageHelper } from "src/app/shared/storage-helper";
import { map } from 'rxjs/operators';
import { StorageKeys } from "src/app/shared/config/constants";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  apiUrl = environment.oAuthConfig.issuer;

  constructor(public http: HttpClient, public storageService: StorageHelper) {
  }

  registerUser(registerUser: CreateUserDto) {
    return this.http.request('POST', this.apiUrl + '/account', { body: registerUser });
  }

  login(user: UserDto) {
    return this.http.request('POST', this.apiUrl + `/account/login`, { body: user }).pipe(
      map((response: UserAuthenticationTokenDto) => {
        const user = response;
        if (user) {
          this.storageService.set(StorageKeys.user, user);
        }
      })
    );;
  }

  getForgotPasswordEmail(email: string) {
    return this.http.get(this.apiUrl + `/account/forgot-password/${email}`);
  }

  verifyOtp(request) {
    return this.http.post(this.apiUrl + `/account/verify-otp`, request);
  }

  resetPassword(request) {
    return this.http.put(this.apiUrl + `/account/reset-password`, request);
  }
}