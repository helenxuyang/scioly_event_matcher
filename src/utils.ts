export const ratingColors = ["seagreen", "olivedrab", "goldenrod", "darkorange", "darkred"];

export const getRatingColor = (rating: number) => {
    return ratingColors[rating - 1];
}