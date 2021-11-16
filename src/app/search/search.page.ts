import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { FriendsService } from '../friends/services/friends.service';
import { StorageKeys } from '../shared/config/constants';
import { KeyboardHelper } from '../shared/keyboard-helper';
import { StorageHelper } from '../shared/storage-helper';
import { ToastHelper } from '../shared/toast-helper';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchTerm: string = '';
  friendList: any[];
  allFriendsList: any[];
  userId: string;
  isFriendListEmpty: boolean = false;

  constructor(public alertController: AlertController,
    public friendServices: FriendsService,
    public storageService: StorageHelper,
    public toast: ToastHelper,
    public router: Router,
    public navCtrl: NavController,
    public keyBoardHelper: KeyboardHelper) { }

  ionViewDidEnter() {
    if (history.state && history.state.friends) {
      this.allFriendsList = history.state.friends;
      this.filterFriends();
      this.storageService.get(StorageKeys.user).then((data) => {
        if (data) {
          this.userId = data.id;
        }
      });
    }
  }

  ngOnInit() {
  }

  filterFriends() {
    if (this.searchTerm.length > 0) {
      this.friendList = this.allFriendsList.filter((x) => {
        return x.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
      });
      if (this.friendList.length == 0) {
        this.isFriendListEmpty = true;
      }
      else {
        this.isFriendListEmpty = false;
      }
    } else if (this.searchTerm.length == 0) {
      this.friendList = [];
      this.isFriendListEmpty = false;
    }
    console.log(this.friendList, 'Friends')
  }


  async presentAlertConfirm(friendUserId: string, name: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to unfriend ' + name,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Unfriend',
          handler: () => {
            this.unFriendsCall(friendUserId);
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }


  unFriendsCall(friendUserId: string) {
    this.friendServices.unfriendsCall(this.userId, friendUserId).subscribe((data) => {
      this.toast.presentToast("Friend Removed");
      this.redirectTo();
    });
  }

  redirectTo() {
    this.router.navigateByUrl('/app/events', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/app/friends']));
  }

  closeKeyboard(event) {
    if (event && event.key === "Enter") {
      this.keyBoardHelper.closeKeyboard();
    }
  }

}
