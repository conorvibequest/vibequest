import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddFriendsService {
  
  apiUrl = environment.oAuthConfig.issuer;

  constructor(public http: HttpClient) {     
  }

  addFriendsList(userId:string, email:string){
    return this.http.get(this.apiUrl + `/user-friends/search-friends/${email}/${userId}`)
  }

  sendFriendRequest(userId:string, friendUserId:string){
    return this.http.post(this.apiUrl + `/user-friends/send-friend-request/${userId}/${friendUserId}`,'')
  }

  cancelFriendRequest(userFriendsId:string){
    return this.http.post(this.apiUrl + `/user-friends/cancel-friend-request/${userFriendsId}`,'')
  }

  inviteFriend(userId:string,email: string){
    return this.http.post(this.apiUrl + `/user-friends/invite-friend/${userId}/${email}`,'')
  }

}
