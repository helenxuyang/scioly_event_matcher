import { Event } from "Event";

export class Student {
  id: number;
  name: string;
  prefs: number[];

  constructor(id: number, name: string, prefs: number[]) {
    this.id = id;
    this.name = name;
    this.prefs = prefs;
  }

  getPickiness() {
    return this.prefs.reduce((prev, curr) => {return prev + curr}, 0);
  }

  getEventsWithRating(rating: number, events: Event[]) {
    let eventNames = [];
    for (let i = 0; i < this.prefs.length; i++) {
      if (this.prefs[i] === rating) {
        eventNames.push(events[i].name);
      }
    }
    return eventNames;
  }
}