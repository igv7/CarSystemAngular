/** Receipt for one car rental: a snapshot of the client and car at the time of renting. */
export class ClientReceipt {
    public constructor(
        public receiptId?: number,
        public clientId?: number,
        /** The client's nickname; on receipts from before nicknames existed, their old login name. */
        public clientNickname?: string,
        /** Empty on receipts from before first and last names existed. */
        public clientFirstName?: string,
        public clientLastName?: string,
        /** The client's ClientID (9-digit personal identity number); `clientId` is the database id. */
        public clientIdentityNumber?: string,
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