export class AssignmentsMap {
  studentsToEvents: number[][];
  eventsToStudents: number[][];

  constructor(eventsToStudents?: number[][]) {
    this.eventsToStudents = [];
    this.studentsToEvents = [];

    if (eventsToStudents) {
      for (let eid = 0; eid < eventsToStudents.length; eid++) {
        const sids = eventsToStudents[eid];
        for (const sid of sids) {
          if (this.studentsToEvents[sid] === undefined) {
            this.studentsToEvents[sid] = [];
          }
          this.studentsToEvents[sid].push(eid);
        }
      }
    }
  }

  getEvents = (sid: number) => this.studentsToEvents[sid];
  getStudents = (eid: number) => this.eventsToStudents[eid];

  addAssignment = (sid: number, eid: number) => {
    if (this.studentsToEvents[sid] === undefined) {
      this.studentsToEvents[sid] = [];
    }
    if (!this.studentsToEvents[sid].includes(eid)) {
      this.studentsToEvents[sid].push(eid);
    }

    if (this.eventsToStudents[eid] === undefined) {
      this.eventsToStudents[eid] = [];
    }
    if (!this.eventsToStudents[eid].includes(sid)) {
      this.eventsToStudents[eid].push(sid);
    }
  };
}
