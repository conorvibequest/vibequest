import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer/ngx";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CameraHelper {

    private currentlyUploaded = new BehaviorSubject<any>([]);
    recentlyUploaded = this.currentlyUploaded.asObservable();

    newUploads(message) {
        this.currentlyUploaded.next(message)
    }

    constructor(private camera: Camera,
        private transfer: FileTransfer) { }

    async pickImage(sourceType, height: number, width: number) {
        const options: CameraOptions = {
            quality: 80,
            sourceType: sourceType,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetHeight: height,
            targetWidth: width
        }

        return await this.camera.getPicture(options);
    }

    async uploadFile(token, imageData, imageName, api) {
        let options: FileUploadOptions = {
            fileKey: 'ionicfile',
            fileName: imageName,
            chunkedMode: true,
            mimeType: "image/jpg",
            headers: {
                'Authorization': 'Bearer ' + token.accessToken,
                'access-control-allow-origin': "*"
            }
        }

        const fileTransferObj: FileTransferObject = this.transfer.create();
        return await fileTransferObj.upload(imageData, environment.oAuthConfig.issuer + api, options);
    }
}