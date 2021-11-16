import { InterestDto } from "src/app/interest/models/interestDto";

export class userProfileDto {
    name: string;
    email: string;
    userId: string;
    profilePhoto: string;
    categories:InterestDto[];
}