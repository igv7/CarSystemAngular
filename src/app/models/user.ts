/** Sign-in credentials. */
export interface User {
    userName: string;
    password: string;
    /** "ADMIN" or "CLIENT". */
    type: string;
    }