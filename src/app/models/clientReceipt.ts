export class ClientReceipt {
    public constructor(
        public receiptId?: number,
        public clientId?: number,
        public clientName?: string,
        public clientPhoneNumber?: string,
        public clientEmail?: string,
        public clientBalance?: number,
        public receiptDate?: string,
        public carId?: number,
        public carNumber?: string,
        public carColor?: string,
        public carType?: string,
        public carPrice?: number
    ) {}
}