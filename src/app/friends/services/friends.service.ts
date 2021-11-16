import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  apiUrl = environment.oAuthConfig.issuer;

  constructor(public http: HttpClient) {     

  }

  getFriends(userId:string){
    return this.http.get(this.apiUrl + `/user-friends/${userId}`)
  }
  
  unfriendsCall(userId:string, friendUserId:string){
    return this.http.post(this.apiUrl + `/user-friends/unfriend-user/${userId}/${friendUserId}`,'')
  }

  acceptFriendRequest(userFriendsId:string){
    return this.http.post(this.apiUrl + `/user-friends/accept-friend-request/${userFriendsId}`,'')
  }

  declineFriendRequest(userFriendsId:string){
    return this.http.post(this.apiUrl + `/user-friends/decline-friend-request/${userFriendsId}`,'')
  }
  
}