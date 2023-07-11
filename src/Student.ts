import { SciolyEvent } from "SciolyEvent";

export class Student {
  id: number;
  name: string;
  prefs: Map<number, number>;

  constructor(id: number, name: string, prefs: Map<number, number>) {
    this.id = id;
    this.name = name;
    this.prefs = prefs;
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

  static getIdealStudent(students: Student[], event: SciolyEvent) {
    const highRatingStudents = students
      .filter(student => student.prefs.get(event.id)! <= 2)
      .sort((a, b) => b.getPickiness() - a.getPickiness());
    if (highRatingStudents.length > 0) {
      return highRatingStudents[0];
    }
    return undefined;
  }
}