import { AssignmentType, Division } from "types";

export const ratingColors = ["darkgreen", "olivedrab", "goldenrod", "darkorange", "darkred"];

export const getRatingColor = (rating: number) => {
  return ratingColors[rating - 1];
}

export const isQC = (assignmentType: AssignmentType) => {
  return assignmentType.includes('qc');
}

export const getDivision = (assignmentType: AssignmentType) => {
  return assignmentType.charAt(2) as Division;
}