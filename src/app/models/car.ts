/** A car in the rental fleet, as sent and returned by the backend. */
export class Car {
    public constructor(
        public id?: number,
        /** License plate number. */
        public number?: string,
        /** Color name, one of the CarColor values (e.g. "RED"). */
        public color?: string,
        /** Brand, one of the CarType values (e.g. "AUDI"); also picks the image in assets/images/CARS. */
        public type?: string,
        /** How many units of this car exist; the forms only allow 1. */
        public amount?: number,
        /** Rental price. */
        public price?: number,
        /** Image name sent to the backend; the pages show the brand picture from `type` instead. */
        public image?: string
    ) {}
}