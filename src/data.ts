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

export const sortStudentsByPickiness = (students: Student[]) => {
  const studentsCopy = [...students];
  return studentsCopy.sort((a, b) => a.getPickiness() - b.getPickiness());
};

export const sortEventsByPopularity = (
  events: Event[],
  students: Student[]
) => {
  const eventsCopy = [...events];
  return eventsCopy.sort(
    (a, b) => a.getPopularity(students) - b.getPopularity(students)
  );
};

export const getPopularityRank = (
  event: Event,
  events: Event[],
  students: Student[]
) => {
  const pop = event.getPopularity(students)
  const popularities = events.map((e) => e.getPopularity(students));
  const popularitiesSorted = [...new Set(popularities)].sort((a, b) => a - b);
  console.log(popularitiesSorted);
  for (let i = 0; i < popularitiesSorted.length; i++) {
    if (pop === popularitiesSorted[i]) {
      return i+1;
    }
  }
  return -1;
};