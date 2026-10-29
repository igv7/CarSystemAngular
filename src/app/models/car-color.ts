/** Car colors the backend accepts. */
export enum CarColor {
    WHITE = "WHITE",
    GREEN = "GREEN",
    BLUE = "BLUE",
    YELLOW = "YELLOW",
    RED = "RED",
    BLACK = "BLACK",
    GREY = "GREY"
}

/** Every color, for dropdowns. */
export const CAR_COLORS: CarColor[] = Object.values(CarColor);
