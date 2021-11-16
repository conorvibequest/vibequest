import { addfriendsDto } from "src/app/add-friends/models/addfriendsDto";

export class NotificationsListDto {
    date: string;
    type: string;
    userFriendsDto: addfriendsDto;
    notifications: NotificationsDto;

}
export class NotificationsDto {
    eventId: string;
    eventName: string;
    fromUserId: string;
    fromUserName: string;
    id: string;
    profilePicture: string;
    status: string;
    toUserId: string;
    type: string;
}