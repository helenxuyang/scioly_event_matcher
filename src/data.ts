import { Student } from "Student";
import { Event } from "Event";

const fakeEvents = ["Anat Phys", "Bio Process Lab", 
"Boomilever", "Chem Lab", "Codebusters", "Crime Busters", 
"Disease Detectives", "Experimental Design", "Forensics",
"Ornithology", "Herpetology", "Rocks and Minerals"];

export const eventsData: Event[] = fakeEvents.map((name, idx) => new Event(idx, name, "B"));

const fakeRatings1 = [];
const fakeRatings2 = [];
const fakeRatings3 = [];

for (let i = 0; i < eventsData.length; i++) {
  fakeRatings1.push(i % 2 === 0 ? 2 : 1);
  fakeRatings2.push(i === 0 ? 5 : 1);
  fakeRatings3.push(i < eventsData.length / 3 ? 1 : (i > eventsData.length / 3 ? 3 : 2));
}
export const studentsData: Student[] = [
  new Student(0, "Helen", fakeRatings1),
  new Student(1, "Ruby", fakeRatings2),
  new Student(2, "Nancy", fakeRatings3),
];

export const sortStudentsByPickiness = () => {
  const studentsCopy = [...studentsData];
  return studentsCopy.sort((a, b) => a.getPickiness() - b.getPickiness());
};

export const sortEventsByPopularity = () => {
  const eventsCopy = [...eventsData];
  return eventsCopy.sort(
    (a, b) => a.getPopularity(studentsData) - b.getPopularity(studentsData)
  );
};

export const sortEventsByReversePopularity = () => {
  let sortedByPop = sortEventsByPopularity();
  sortedByPop.reverse();
  return sortedByPop;
}