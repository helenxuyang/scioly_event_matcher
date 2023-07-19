export const ratingColors = ["darkgreen", "olivedrab", "goldenrod", "darkorange", "darkred"];

export const getRatingColor = (rating: number) => {
  return ratingColors[rating - 1];
}