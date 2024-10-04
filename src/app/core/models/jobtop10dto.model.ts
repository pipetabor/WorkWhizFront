import { PosterNameDto } from "./posternamedto.model";

export interface JobTop10Dto{
    id: number;
    name: string;
    description: string;
    postedDate: Date;
    expirationDate: Date;
    bidCount: number;
    status: string;  // e.g., "Open", "Closed"
    poster?: PosterNameDto;  // Optional field
}