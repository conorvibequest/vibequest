import { Injectable } from "@angular/core";
import {
    CanActivate,
    Router
} from "@angular/router";
import { StorageHelper } from "../storage-helper";
@Injectable({
    providedIn: "root",
})

export class AuthGuard implements CanActivate {
    constructor(private router: Router,
        private storageService: StorageHelper) { }
    canActivate(): Promise<boolean> {
        return this.storageService.get("userData").then(async (token) => {
            if (token != null) {
                return true;
            }
            else {
                this.router.navigate(['/interest']);
                return false;
            }
        });
    }
}