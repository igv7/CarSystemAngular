/** Car brands the backend accepts; each has its own page and image. Listed alphabetically, as in the dropdowns. */
export enum CarType {
    AUDI = "AUDI",
    BMW = "BMW",
    HONDA = "HONDA",
    MAZDA = "MAZDA",
    MERCEDES = "MERCEDES",
    MITSUBISHI = "MITSUBISHI",
    SUBARU = "SUBARU",
    TOYOTA = "TOYOTA",
    VOLKSWAGEN = "VOLKSWAGEN"
}

/** Every brand, for dropdowns. */
export const CAR_TYPES: CarType[] = Object.values(CarType);
