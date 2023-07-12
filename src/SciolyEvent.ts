import { Student } from "Student";
import { Division } from "types";

export class SciolyEvent {
  id: number;
  name: string;
  division: string;

  constructor(id: number, name: string, division: string) {
    this.id = id;
    this.name = name;
    this.division = division;
  }

  getPopularity(students: Student[]) {
    let rankingSum = 0;
    for (const student of students) {
      rankingSum += student.prefs.get(this.id) ?? 5;
    }
    return rankingSum;
  }

  getRatingFreqs(students: Student[], upTo = 5) {
    const freqs = new Map<number, number>();
    for (let i = 1; i <= upTo; i++) {
      freqs.set(i, 0);
    }
    for (const student of students) {
      const rating = student.prefs.get(this.id);
      if (rating && rating <= upTo) {
        freqs.set(rating, (freqs.get(rating) ?? 0) + 1);
      }
    }
    return freqs;
  }

  static getCopy(events: SciolyEvent[]) {
    const copy = [];
    for (const event of events) {
      copy.push(new SciolyEvent(event.id, event.name, event.division));
    }
    return copy;
  }

  static getSortedEventsByPopularity(events: SciolyEvent[], students: Student[]) {
    const sortedEvents = [];
    for (const event of events) {
      sortedEvents.push(new SciolyEvent(event.id, event.name, event.division));
    }
    sortedEvents.sort((a, b) => {
      const aPop = a.getPopularity(students);
      const bPop = b.getPopularity(students);
      return bPop - aPop;
    });
    return sortedEvents;
  }

  static getSortedEventsByDifficulty(events: SciolyEvent[], students: Student[]) {
    const sortedEvents = [];
    for (const event of events) {
      sortedEvents.push(new SciolyEvent(event.id, event.name, event.division));
    }
    sortedEvents.sort((a, b) => {
      const aFreqs = [...a.getRatingFreqs(students).values()];
      const bFreqs = [...b.getRatingFreqs(students).values()];
      for (let i = 0; i < 5; i++) {
        if (aFreqs[i] !== bFreqs[i]) {
          return aFreqs[i] - bFreqs[i];
        }
        else {
          continue;
        }
      }
      return 0;
    });
    return sortedEvents;
  }

  static getEventsByDivision(events: SciolyEvent[], division: Division) {
    if (division === 'both') {
      return events;
    }
    return events.filter(e => e.division.includes(division));
  }

  static getEventByID(events: SciolyEvent[], id: number) {
    return events.filter(event => event.id === id)[0];
  }
}