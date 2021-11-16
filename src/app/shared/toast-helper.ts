import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
    providedIn: 'root'
})

export class ToastHelper {
    constructor(public toast: ToastController) { }

    async presentToast(message: string, duration: number = 5000) {
        const toast = await this.toast.create({
            message: message,
            duration: duration
        });
        toast.present();
    }
}