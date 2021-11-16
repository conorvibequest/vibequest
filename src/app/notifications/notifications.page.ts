import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthenticationTokenDto } from '../account/models/userDto';
import { FriendsService } from '../friends/services/friends.service';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import { NotificationsListDto } from './models/notificationsDto';
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  userId: string;
  isLoading= true;
  notificationsList:NotificationsListDto[];
  constructor(public storageService: StorageHelper,
    public notificationService: NotificationsService,
    public friendsService: FriendsService,
    public router: Router) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.getUserDetails();
    
    setTimeout(() => {
     this.getNotificationsList();
    }, 500);
  }

 getNotificationsList() {
    this.notificationService.getAllNotifications(this.userId).subscribe((data:NotificationsListDto[]) => {
      if (data) {
        this.notificationsList = data;
        console.log(this.notificationsList,'Notification')
      }
      this.isLoading = false;
    })
  }

  getUserDetails() {
    this.storageService.get(StorageKeys.user).then((data: UserAuthenticationTokenDto) => {
      if (data) {
        this.userId = data.id;
      }
    })
  }

  accceptFriendRequest(friendsUserId:string,name: string)
  {
   this.friendsService.acceptFriendRequest(friendsUserId).subscribe((data)=>{
     document.getElementById(friendsUserId).innerHTML = "<h4>"+name+" is now a friend</h4>"; 
   })
  }

  declineFriendRequest(friendsUserId:string,name: string)
  {
   this.friendsService.declineFriendRequest(friendsUserId).subscribe((data)=>{
    document.getElementById(friendsUserId).innerHTML = "<h4>"+name+"</h4><div><small>Friend request removed</small></div>"; 
   })
  }

  
}
