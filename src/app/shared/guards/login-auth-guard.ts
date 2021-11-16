import { Injectable } from "@angular/core";
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    UrlTree,
    Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { StorageHelper } from "../storage-helper";

@Injectable({
    providedIn: "root",
})
export class LoginAuthGuard implements CanActivate {
    constructor(private storageService: StorageHelper, private router: Router) { }
    canActivate(): Promise<boolean> {
        return this.storageService.get("userData").then(async (token) => {
            if (token != null) {
                this.router.navigate(['/app']);
                return false;
            }
            else {
                return true;
            }
        });
    }
}