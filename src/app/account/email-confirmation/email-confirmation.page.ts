import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastHelper } from 'src/app/shared/toast-helper';
import { VerifySecurityTokenDto } from '../models/userDto';
import { LoginService } from '../services/login.service';


@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.page.html',
  styleUrls: ['./email-confirmation.page.scss'],
})
export class EmailConfirmationPage implements OnInit {

  otp: string;
  email: string;
  otpForm: FormGroup;
  isSubmitted: boolean = false;

  validation_messages = {
    'securityToken': [
      { type: 'required', message: 'OTP is required.' },
      { type: 'maxlength', message: 'Max length should be 6.' }
    ]
  };


  constructor(public router: Router,
    public loginService: LoginService,
    public toast: ToastHelper,
    public loading: LoadingController) {
      if (history.state && history.state.email) {
        this.email = history.state.email;
        console.log(this.email, "Email")
      }
  
      this.otpForm = new FormGroup({
        'securityToken': new FormControl('', Validators.compose([
          Validators.required,
          Validators.maxLength(6)
        ]))
      });
     }

  ngOnInit() {
  }

  // async onClickSubmit() {
  //   this.isSubmitted = true;
  //   if (!this.otpForm.valid) {
  //     return;
  //   }

  //   let request = {
  //     email: this.email,
  //     securityToken: this.otpForm.value.securityToken
  //   } as VerifySecurityTokenDto

  //   const loading = await this.loading.create({
  //     message: ''
  //   });

  //   loading.present();

  //   this.loginService.verifyOtp(request).subscribe((data) => {
  //     if (data == true) {
  //       this.isSubmitted = false;
  //       loading.dismiss();
  //       this.router.navigate(['/reset-password'], { state: { email: this.email } });
  //     }
  //     else {
  //       this.toast.presentToast("Please enter valid OTP!");
  //       this.otpForm.reset();
  //       loading.dismiss();
  //     }
  //   }, error => { this.toast.presentToast(error.error.errors.SecurityToken[0]) })
  // }

  async onClickResend() {
    const loading = await this.loading.create({
      message: '',
      spinner:'dots'
    });

    loading.present();
    this.loginService.getForgotPasswordEmail(this.email).subscribe((data) => {
      if (data == true) {
        loading.dismiss();
        this.toast.presentToast('Please check your mailbox!');
      }
      else {
        loading.dismiss();
        this.toast.presentToast("Please enter email registered with VibeQuest!");
      }
    }, error => { this.toast.presentToast(error.error.message) })
  }

  async onOtpChange(otp) {
    this.otp = otp;
    if (otp.length == 4) {
      this.isSubmitted = true;

      let request = {
        email: this.email,
        securityToken: this.otp
      } as VerifySecurityTokenDto

      const loading = await this.loading.create({
        message: '',
        spinner:'dots'
      });
  
      loading.present();
  
      this.loginService.verifyOtp(request).subscribe((data) => {
        if (data == true) {
          this.isSubmitted = false;
          loading.dismiss();
          this.router.navigate(['/reset-password'], { state: { email: this.email } });
        }
        else {
          this.toast.presentToast("Please enter valid OTP!");
          this.otpForm.reset();
          loading.dismiss();
        }
      }, error => {  })
    }
  }
}
