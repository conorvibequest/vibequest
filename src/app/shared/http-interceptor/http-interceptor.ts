import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { LoginService } from '../../account/services/login.service'
import { catchError, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { StorageHelper } from '../storage-helper';
import { StorageKeys } from '../config/constants';
import { ToastHelper } from '../toast-helper';
import { LoadingController } from '@ionic/angular';

@Injectable({
    providedIn: 'root',
})
export class HttpIntercepterProvider implements HttpInterceptor {
    constructor(
        private storageHelperService: StorageHelper,
        public toast: ToastHelper,
        public router: Router,
        public loading: LoadingController) { }

    intercept(request: HttpRequest<any>, next: HttpHandler) {

        return from(this.storageHelperService.get(StorageKeys.user)).pipe(
            mergeMap((token) => {
                // ... modify the request here ...
                if (token) {
                    return next
                        .handle(
                            request.clone({
                                setHeaders: this.getAdditionalHeaders(token.accessToken),
                            }),
                        )
                        .pipe(
                            catchError((error: HttpErrorResponse) => {
                                if (error.status === 401 || error.status == 200) {
                                    this.storageHelperService.clear();
                                    this.router.navigate(['/login']);
                                    if (this.loading) {
                                        this.loading.dismiss();
                                    }
                                }
                                else {
                                    //this.toast.presentToast(error.message || error.error);
                                }
                                return throwError(error);
                            }));
                }

                return next
                    .handle(
                        request.clone({
                            setHeaders: this.getAdditionalHeaders(token),
                        }),
                    )
                    .pipe(
                        catchError((error: HttpErrorResponse) => {
                            if (error.status === 401 || error.status == 200) {
                                this.storageHelperService.clear();
                                this.router.navigate(['/login']);
                                if (this.loading) {
                                    this.loading.dismiss();
                                }
                            }
                            else {
                                //this.toast.presentToast(error.message || error.error);
                            }
                            return throwError(error);
                        }));
            }));
    }

    getAdditionalHeaders(token: string) {
        let headers = {};
        headers["access-control-allow-origin"] = "*";
        if (token)
            headers['Authorization'] = 'Bearer ' + token;
        return headers;
    }
}
