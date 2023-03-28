import { Student } from "Student";
import { Event } from "Event";

export const eventsData: Event[] = [
  new Event(0, "Anat Phys", "B"),
  new Event(1, "Boomilever", "B"),
  new Event(2, "Chem Lab", "B"),
];

export const studentsData: Student[] = [
  new Student(0, "Helen", [5, 4, 1]),
  new Student(1, "Ruby", [1, 2, 1]),
  new Student(2, "Nancy", [1, 3, 1]),
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
