export class InterestDto {
    id: string;
    code: string;
    name: string;
    photo: string;
    thumbnailImagePath: string;
    largeImagePath: string;
    iconPath?:string;
    whiteIconPath?:string;
    checked?: boolean = false;
}