import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput, isPlatform, LoadingController, NavController } from '@ionic/angular';
import { StorageHelper } from 'src/app/shared/storage-helper';
import { ToastHelper } from 'src/app/shared/toast-helper';
import { LoginService } from '../services/login.service';
import { KeyboardHelper } from 'src/app/shared/keyboard-helper'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup
  isSubmitted: boolean = false;
  showPassword = false;

  @ViewChild('password') password: IonInput;

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' }
    ]
  };
  constructor(public router: Router,
    public loginService: LoginService,
    public toast: ToastHelper,
    public loading: LoadingController,
    public storage: StorageHelper,
    public navCtrl:NavController,
    private zone:NgZone,
    public keyBoardHelper: KeyboardHelper) {
    this.loginForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    if(isPlatform('ios')){
      this.zone.runOutsideAngular(() => {
        document.getElementById('password').addEventListener('change', (event) => {
          this.loginForm.patchValue({
            password: event.target['value']
          });
        });
        document.getElementById('email').addEventListener('change', (event) => {
          this.loginForm.patchValue({
            email: event.target['value']
          });
        });
      }); 
    }    
  }

  async login() {
    this.isSubmitted = true;

    if (!this.loginForm.valid) {
      return;
    }

    const loading = await this.loading.create({
      message: '',
      spinner:'dots'
    });

    loading.present();
    this.loginService.login(this.loginForm.value).subscribe((data) => {
      // if (data.accessToken && data.refreshToken != null) 
      //this.storage.set("userData", data);
      loading.dismiss();
      this.navCtrl.navigateRoot('/app');
      this.loginForm.reset();
      this.isSubmitted = false;
    }, error => {
      loading.dismiss();
      console.log(error);
      this.toast.presentToast(error.error.message);
    });
  }

  toggleShow() {
    this.showPassword = !this.showPassword;
    this.password.type = this.showPassword ? 'text' : 'password';
  }

  closeKeyboard()
  {
   this.keyBoardHelper.closeKeyboard();
  }

}
