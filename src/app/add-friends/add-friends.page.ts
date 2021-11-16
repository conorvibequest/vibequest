import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserAuthenticationTokenDto } from '../account/models/userDto';
import { StorageKeys } from '../shared/config/constants';
import { KeyboardHelper } from '../shared/keyboard-helper';
import { StorageHelper } from '../shared/storage-helper';
import { addfriendsDto } from './models/addfriendsDto';
import { AddFriendsService } from './services/add-friends.service';
@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.page.html',
  styleUrls: ['./add-friends.page.scss'],
})
export class AddFriendsPage implements OnInit {

  addUserList: addfriendsDto = null;
  userId: string;

  searchKey: string = '';
  statusText: string = '';
  isUserListEmpty: boolean = false;

  constructor(
    public addFriendsServices: AddFriendsService,
    public storageService: StorageHelper,
    public router: Router,
    public toastController: ToastController,
    public loading: LoadingController,
    public keyBoardHelper: KeyboardHelper

  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.storageService.get(StorageKeys.user).then((data: UserAuthenticationTokenDto) => {
      this.userId = data.id;
    })
    console.log(this.addUserList)
  }


  findFriends(event) {

    // const regex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$");

    // if (!regex.test(this.searchKey)) {
    //   event.preventDefault();
    //   return false;
    // }

    if (event && event.key === "Enter") {
      this.keyBoardHelper.closeKeyboard();
      this.addFriendsServices.addFriendsList(this.userId, this.searchKey).subscribe((data: addfriendsDto) => {
        this.addUserList = data;
        if (this.addUserList == null) {
          this.isUserListEmpty = true;
        }
        else {
          this.isUserListEmpty = false;
        }
        if (this.addUserList.status == "Add") {
          this.statusText = "Add";
        }
        else if (this.addUserList.status == "Invite") {
          this.statusText = "Invite";
        }
        else if (this.addUserList.status == "Cancel") {
          this.statusText = "Cancel request";
        }
      })
    }

  }

  async addFriends(event) {
    const loading = await this.loading.create({
      message: '',
      spinner: 'dots'
    });

    loading.present();
    if (event == 'Add') {
      console.log('add')
      this.addFriendsServices.sendFriendRequest(this.userId, this.addUserList.userId).subscribe((data: addfriendsDto) => {
        this.addUserList.id = data.id;
        this.addUserList.status = "Cancel";
        this.statusText = "Cancel request";
      });
    }
    else if (event == 'Invite') {
      this.addFriendsServices.inviteFriend(this.userId, this.addUserList.email).subscribe();
      this.addUserList.status = "Invitation Sent";
      this.statusText = "Invitation Sent";
    }
    else if (event == 'Cancel') {
      this.addFriendsServices.cancelFriendRequest(this.addUserList.id).subscribe(() => {
        this.addUserList.status = "Add";
        this.statusText = "Add";
      });
    }
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

  onChange() {
    if (this.searchKey == '') {
      this.addUserList = null;
      this.isUserListEmpty = false;
    }
  }
}
