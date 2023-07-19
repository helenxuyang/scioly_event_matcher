import { SciolyEvent } from "SciolyEvent";
import { AssignmentType, Division, StudentAssignments } from "types";

export class Student {
  id: number;
  name: string;
  prefs: Map<number, number>;
  assignments: StudentAssignments

  constructor(id: number, name: string, prefs: Map<number, number>) {
    this.id = id;
    this.name = name;
    this.prefs = prefs;
    this.assignments = {
      eventC: undefined,
      eventB: undefined,
      qualityC: undefined,
      qualityB: undefined
    }
  }

  getPickiness() {
    return [...this.prefs.values()].reduce((prev, curr) => { return prev + curr }, 0);
  }

  getEventsWithRating(rating: number, events: SciolyEvent[]) {
    let eventNames = [];
    for (const event of events) {
      if (this.prefs.get(event.id) === rating) {
        eventNames.push(event.name);
      }
    }
    return eventNames;
  }

  setAssignments = (assignments: StudentAssignments) => {
    this.assignments = assignments;
  }

  static getStudentByID(students: Student[], id: number) {
    return students.filter(student => student.id === id)[0];
  }
  getPreferenceList(events: SciolyEvent[], division: Division) {
    const sortedEvents = events.filter(event => event.division === division)
      .sort((event1, event2) => {
        return (this.prefs.get(event1.id)!) - (this.prefs.get(event2.id)!)
      });
    const eventIDs = sortedEvents.map(event => event.id);
    return eventIDs;
  }

  static getCopy(students: Student[]) {
    const copy = [];
    for (const student of students) {
      const newPrefs = new Map<number, number>();
      for (const key of student.prefs.keys()) {
        newPrefs.set(key, student.prefs.get(key)!);
      }
      const newAssignments: StudentAssignments = {
        eventC: student.assignments.eventC,
        eventB: student.assignments.eventB,
        qualityC: student.assignments.qualityC,
        qualityB: student.assignments.qualityB,
      };
      const newStudent = new Student(student.id, student.name, newPrefs);
      newStudent.setAssignments(newAssignments);
      copy.push(newStudent);
    }
    return copy;
  }

  // TODO generalize for assignment type

}