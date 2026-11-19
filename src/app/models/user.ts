/** Sign-in credentials. */
export interface User {
    nickname: string;
    password: string;
    /** "ADMIN" or "CLIENT". */
    type: string;
    }