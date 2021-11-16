import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonInput, LoadingController, NavController } from '@ionic/angular';
import { CreateUserDto } from '../models/userDto';
import { LoginService } from '../services/login.service';
import { StorageHelper } from 'src/app/shared/storage-helper';
import { ToastHelper } from 'src/app/shared/toast-helper';
import { Router } from '@angular/router';
import { StorageKeys } from 'src/app/shared/config/constants';
import { KeyboardHelper } from 'src/app/shared/keyboard-helper'

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  signupForm: FormGroup;
  matching_passwords_group: FormGroup;
  isChecked: boolean = true;
  showPassword = false;
  isSubmitted: boolean = false;
  @ViewChild('password') password: IonInput;

  validation_messages = {
    'fullname': [
      { type: 'required', message: 'Full Name is required.' }
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor(public loadingController: LoadingController,
    public loginService: LoginService,
    public storageService: StorageHelper,
    public toast: ToastHelper,
    public router: Router,
    public navCtrl:NavController,
    public keyBoardHelper: KeyboardHelper) {
    this.buildForm();
  }

  buildForm() {

    this.signupForm = new FormGroup({
      'fullname': new FormControl('', Validators.compose([
        Validators.required,
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  async doSignup() {
    this.isSubmitted = true;

    if (!this.signupForm.valid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: ''
    });
    await loading.present();

    let request = {
      fullName: this.signupForm.value.fullname,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      isActive: true
    } as CreateUserDto;
    this.loginService.registerUser(request).subscribe((data) => {
      this.storageService.set(StorageKeys.user, data).then((data) => {
        if (data) {
          loading.dismiss();
          this.navCtrl.navigateRoot('/interest');
        }
      });
    }, error => {
      loading.dismiss();
      this.toast.presentToast(error.error.message);
    });
    loading.dismiss();
  }

  ngOnInit() {
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
