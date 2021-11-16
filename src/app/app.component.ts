import { Component } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { StorageKeys } from './shared/config/constants';
import { StorageHelper } from './shared/storage-helper';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform, private storageService: StorageHelper, public navCtrl: NavController,public statusBar:StatusBar) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(async () => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByName('white');
      this.statusBar.styleDefault();
      this.storageService.get(StorageKeys.isAppInstalled).then(value => {
        if (!value) {
          this.storageService.set(StorageKeys.isAppInstalled, true).then();
          this.navCtrl.navigateRoot('/permission');
        }
        else {
          this.storageService.get(StorageKeys.isPermissionsAsked).then(value => {
            if (value) {
              this.navCtrl.navigateRoot('/landing');
            }
            else {
              this.navCtrl.navigateRoot('/permission');
            }
          })
        }
      }, reason => {
        this.storageService.set(StorageKeys.isAppInstalled, true).then();
      }).catch(err => {
        console.log(err);
      });
    })
  }
}
