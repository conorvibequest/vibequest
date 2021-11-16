import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { UserAuthenticationTokenDto } from '../account/models/userDto';
import { StorageKeys } from '../shared/config/constants';
import { StorageHelper } from '../shared/storage-helper';
import { friendsDto } from './models/friendsDto';
import { FriendsService } from './services/friends.service';


@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  
  friendsList: friendsDto[];

  //unfriend:unfriendsCall

  email:string;
  userId: string;
  isLoading = true;


  constructor(
    public friendServices: FriendsService,
    public toastController: ToastController,
    public storageService: StorageHelper,
    public alertController: AlertController,
    public router: Router
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    setTimeout(() => {      
      this.getFriends();
    }, 500);

    this.storageService.get(StorageKeys.user).then((data) => {
      if (data) {
        this.userId = data.id;
      }
    });
  }

  getFriends(){
    this.friendServices.getFriends(this.userId).subscribe((data:friendsDto[]) => {
      this.friendsList = [];
      if(data){
        this.friendsList = data;
      }
      this.isLoading = false;
    })
  }

  async presentAlertConfirm(friendUserId:string,name: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Are you sure you want to unfriend '+name,
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

 unFriendsCall(friendUserId:string){
   
    this.friendServices.unfriendsCall(this.userId,friendUserId).subscribe(()=>{
      this.getFriends();
    }); 
  }
}
