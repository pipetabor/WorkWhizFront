export interface JobActiveDto{
    id: number;
    name: string;
    description: string;
    postedDate: Date;
    expirationDate: Date;
    bidCount: number;
    status: string;  // e.g., "Open", "Closed"
    lowestBid: number;
}