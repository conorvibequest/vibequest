export class EventDto {
    name: string;
    description: string;
    location: string;
    latitude: string;
    longitude: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    userId: string;
    categoryId: string;
    categoryName?: string;
    userName?: string;
    id?: string;
    profilePicture?: string;
    daysAgo?: number;
    mediaFileName?: string;
    eventType:string;
}

export class eventMedia {
    eventId: string;
    id: string;
    fileName: string;
}

export class EventDetailsDto {
    attendees: EventAttendeesDto[];
    attendeesCount: number;
    eventMedia: eventMedia[];
    events: EventDto;
    friendsCount: number;
    isInviteShow: boolean;
}

export class EventAttendeesDto {
    id: string;
    email: string;
    name: string;
    profilePicture: string;
}