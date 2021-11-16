import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

@Injectable({
    providedIn: 'root'
})

export class StorageHelper {
    constructor(public storage:Storage) {
        this.storage.create();
    }

    public async set(settingName, value) {
        return await this.storage.set(`${settingName}`, value).then((result) => {
            return result;
        });
    }
    public async get(settingName) {
        return await this.storage.get(`${settingName}`).then((result) => {
            return result;
        });
    }
    public async remove(settingName) {
        return await this.storage.remove(`${settingName}`);
    }

    public clear(){
        this.storage.clear().then(() => {
            console.log('Storage cleared');
        });
    }
}