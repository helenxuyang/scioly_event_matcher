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
      esC: undefined,
      esB: undefined,
      qcC: undefined,
      qcB: undefined
    }
  }

  getPickiness(events: SciolyEvent[]) {
    const eids = events.map(event => event.id);
    return [...this.prefs.keys()]
      .filter(eid => eids.includes(eid))
      .map(eid => this.prefs.get(eid)!)
      .reduce((prev, curr) => { return prev + curr }, 0);
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

  static getStudentByName(students: Student[], name: string) {
    return students.filter(student => student.name === name)[0];
  }

  getPreferenceList(events: SciolyEvent[], students: Student[]) {
    const sortedEvents = events
      .sort((event1, event2) => {
        const event1Rating = this.prefs.get(event1.id);
        const event2Rating = this.prefs.get(event2.id);
        if (event1Rating === event2Rating) {
          return event1.getPopularity(students) - event2.getPopularity(students);
        }
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
        esC: student.assignments.esC,
        esB: student.assignments.esB,
        qcC: student.assignments.qcC,
        qcB: student.assignments.qcB,
      };
      const newStudent = new Student(student.id, student.name, newPrefs);
      newStudent.setAssignments(newAssignments);
      copy.push(newStudent);
    }
    return copy;
  }
}