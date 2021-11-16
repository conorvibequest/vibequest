import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateUserDto, UserAuthenticationTokenDto } from '../account/models/userDto';
import { EventService } from '../events/services/event.service';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import { ToastHelper } from '../shared/toast-helper';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.page.html',
  styleUrls: ['./invite-friends.page.scss'],
})
export class InviteFriendsPage implements OnInit {

  eventId: string;
  userData: UserAuthenticationTokenDto = new UserAuthenticationTokenDto();
  users: CreateUserDto[] = [];
  selectedUsers: any[] = [];
  isLoading = true;

  constructor(public storageService: StorageHelper,
  public eventService: EventService,
  public toast: ToastHelper,
  public router: Router,) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    if (history.state && history.state.eventId) {
      this.eventId = history.state.eventId;
    }
    this.getUserDetails();

    setTimeout(() => {
      this.getEventInviteFriendsList();
    }, 500);
  }

  getUserDetails() {
    this.storageService.get(StorageKeys.user).then((data: UserAuthenticationTokenDto) => {
      if (data) {
        this.userData = data;
      }
    })
  }

  getEventInviteFriendsList()
  {
    this.eventService.getEventInviteFriendList(this.eventId,this.userData.id).subscribe((data: CreateUserDto[]) =>{
      if(data)
      {
        this.users = data;
      }
      this.isLoading = false;  
    })
  }

  checked(user: CreateUserDto) {
    if (user.checked === true) {
      this.selectedUsers.push(user.id);
    } else if (user.checked === false) {
      this.selectedUsers.splice(this.selectedUsers.indexOf(user.id), 1);
    }
  }

  inviteFriends()
  {
    this.eventService.inviteFriendsToEvent(this.userData.id,this.eventId,this.selectedUsers).subscribe(()=>{
      this.toast.presentToast("Invitation sent successfully");
      this.router.navigate(['event-details'], {state:{ eventId:this.eventId }})
    });
  }

}
