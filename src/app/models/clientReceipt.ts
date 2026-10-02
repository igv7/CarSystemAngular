/** Receipt for one car rental: a snapshot of the client and car at the time of renting. */
export class ClientReceipt {
    public constructor(
        public receiptId?: number,
        public clientId?: number,
        public clientName?: string,
        public clientPhoneNumber?: string,
        public clientEmail?: string,
        public clientBalance?: number,
        /** Date of the rental, as text; the date filter matches against it. */
        public receiptDate?: string,
        public carId?: number,
        public carNumber?: string,
        public carColor?: string,
        public carType?: string,
        public carPrice?: number
    ) {}
}