import { EventDto } from "src/app/events/models/eventDto";
import { InterestDto } from "src/app/interest/models/interestDto";

export class MapEventsDto {
    eventsDto: EventDto[];
    categoriesDto: InterestDto[];
}