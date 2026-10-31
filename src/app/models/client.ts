/** A registered client (customer) account. */
export class Client {
    public constructor(
        public id?: number,
        public name?: string,
        /** Personal identity number: exactly 9 digits. Separate from `id`, the database key. */
        public clientID?: string,
        public birthday?: string,
        /** Only sent to the backend (sign-up, add, update); it stores a hash and never returns it. */
        public password?: string,
        public phoneNumber?: string,
        public email?: string,
        /** Money the client has available for renting cars. */
        public balance?: number
    ) {}
}